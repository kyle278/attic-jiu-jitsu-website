"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  EMPTY,
  type Snapshot,
  type EditorValue,
  type Design,
} from "@/lib/website-editor/types";
import { PORTAL_ORIGIN, PORTAL_SITE_ID } from "@/portal/public";

type Store = {
  snapshot: Snapshot;
  media: Record<string, string>;
  listeners: Set<() => void>;
  port: MessagePort | null;
  editing: boolean;
  pending: Snapshot | null;
  preview: boolean;
};
const Context = createContext<Store | null>(null);
export const RegionScope = createContext("");
export function useScopedId(id: string) {
  const scope = useContext(RegionScope);
  return scope ? scope + "/" + id : id;
}
export function useEditor() {
  return useContext(Context);
}
export function useEditorValue(id: string): EditorValue {
  const store = useContext(Context);
  return (
    useSyncExternalStore(
      (cb) => {
        store?.listeners.add(cb);
        return () => {
          store?.listeners.delete(cb);
        };
      },
      () => store?.snapshot.values[id] || undefined,
      () => store?.snapshot.values[id] || undefined,
    ) || {}
  );
}
export function designStyle(d?: Design): React.CSSProperties {
  return d
    ? {
        color: d.color,
        backgroundColor: d.background,
        fontSize: d.fontSize ? d.fontSize + "px" : undefined,
        fontWeight: d.fontWeight,
        lineHeight: d.lineHeight,
        textAlign: d.align,
        display: d.hidden ? "none" : undefined,
        ...(d.spacing && d.spacing !== "original"
          ? {
              paddingBlock: {
                compact: "24px",
                comfortable: "56px",
                spacious: "88px",
              }[d.spacing],
            }
          : {}),
      }
    : {};
}
export function responsiveClass(d?: Design) {
  return [
    d?.hiddenMobile ? "ie-hide-mobile" : "",
    d?.hiddenTablet ? "ie-hide-tablet" : "",
    d?.hiddenDesktop ? "ie-hide-desktop" : "",
  ].join(" ");
}
export function EditorProvider({
  snapshot,
  children,
  parentOrigins = [PORTAL_ORIGIN],
}: {
  snapshot: Snapshot;
  children: ReactNode;
  parentOrigins?: string[];
}) {
  const ref = useRef<Store>({
    snapshot: snapshot || EMPTY,
    media: {},
    listeners: new Set(),
    port: null,
    editing: false,
    pending: null,
    preview: false,
  });
  useEffect(() => {
    const store = ref.current;
    if (
      new URLSearchParams(location.search).get("__ingenium_editor") !== "1" ||
      window.parent === window
    )
      return;
    const parentOrigin =
      new URLSearchParams(location.search).get("__editor_parent") ||
      PORTAL_ORIGIN;
    if (!parentOrigins.includes(parentOrigin)) return;
    store.preview = true;
    const sessionId = crypto.randomUUID();
    let disposed = false;
    let selected: HTMLElement | null = null;
    let inline: HTMLElement | null = null;
    let mode = "edit";
    let expiry = 0;
    let lastInlineText = "";
    const send = (kind: string, payload: Record<string, unknown> = {}) =>
      store.port?.postMessage({
        protocol: "ingenium-editor-v1",
        sessionId,
        kind,
        ...payload,
      });
    const update = (next: Snapshot, media?: Record<string, string>) => {
      if (store.editing) {
        store.pending = next;
        return;
      }
      store.snapshot = next;
      if (media)
        store.media = Object.fromEntries(
          Object.entries(media).map(([src, preview]) => {
            const url = new URL(preview, location.origin),
              id = url.pathname.match(
                /\/api\/websites\/editor\/public\/v1\/editor_[a-f0-9]{32}\/media\/([-a-f0-9]{36})$/,
              )?.[1];
            return [
              src,
              parentOrigin !== PORTAL_ORIGIN &&
              url.origin === parentOrigin &&
              id
                ? "/api/ingenium/editor/media?id=" +
                  id +
                  "&" +
                  url.searchParams.toString()
                : preview,
            ];
          }),
        );
      store.listeners.forEach((fn) => fn());
    };
    const overlay = document.createElement("div");
    overlay.className = "ie-selection";
    overlay.style.display = "none";
    const tag = document.createElement("span");
    tag.className = "ie-selection-label";
    overlay.append(tag);
    document.body.append(overlay);
    const rectElement = (el: HTMLElement) =>
      el.dataset.ieType === "image" && el.firstElementChild
        ? (el.firstElementChild as HTMLElement)
        : el.dataset.ieType === "text"
          ? (el.closest("h1,h2,h3,h4,p,li,summary,strong") as HTMLElement) ||
            el.parentElement ||
            el
          : el;
    const position = () => {
      if (!selected || mode !== "edit") {
        overlay.style.display = "none";
        return;
      }
      const r = rectElement(selected).getBoundingClientRect();
      Object.assign(overlay.style, {
        display: "block",
        left: r.left + "px",
        top: r.top + "px",
        width: r.width + "px",
        height: r.height + "px",
      });
      send("position", {
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      });
    };
    const registry = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-ie-id]"),
      ).map((el) => {
        let value = {};
        try {
          value = JSON.parse(el.dataset.ieDefault || "{}");
        } catch {}
        return {
          id: el.dataset.ieId!,
          type: el.dataset.ieType!,
          label:
            el.dataset.ieLabel ||
            (
              el.querySelector("h1,h2,h3")?.textContent ||
              el.textContent ||
              "Section"
            )
              .trim()
              .slice(0, 100),
          section:
            el.dataset.ieType === "section"
              ? el.dataset.ieId!
              : (el.closest("[data-ie-type=section]") as HTMLElement)?.dataset
                  .ieId || "",
          tag: el.dataset.ieTag || el.tagName.toLowerCase(),
          defaultValue: value,
          ...(!el.closest("#main-content") ? { global: true } : {}),
        };
      });
      const containers: Record<string, string[]> = {};
      document
        .querySelectorAll<HTMLElement>("[data-ie-container]")
        .forEach((el) => {
          containers[el.dataset.ieContainer!] = Array.from(el.children)
            .filter(
              (c) =>
                c instanceof HTMLElement &&
                c.dataset.ieType === "section" &&
                !c.hasAttribute("data-ie-extra"),
            )
            .map((c) => (c as HTMLElement).dataset.ieId!);
        });
      const seen = new Set<string>();
      return {
        elements: elements.filter((e) => {
          if (seen.has(e.id)) return false;
          seen.add(e.id);
          return true;
        }),
        containers,
      };
    };
    const select = (el: HTMLElement | null) => {
      if (inline && inline !== el) inline.blur();
      selected = el;
      position();
      if (el) {
        tag.textContent =
          el.dataset.ieType === "section"
            ? "Section"
            : el.dataset.ieLabel || "Text";
        const r = rectElement(el).getBoundingClientRect();
        send("select", {
          id: el.dataset.ieId,
          rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        });
      }
    };
    const click = (e: MouseEvent) => {
      if (!store.port || Date.now() > expiry || mode !== "edit") return;
      const el = (e.target as Element).closest<HTMLElement>("[data-ie-id]");
      if (el) {
        if (inline === el) {
          e.stopPropagation();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        select(el);
      }
    };
    const finishInline = () => {
      if (!inline) return;
      const el = inline;
      const text = el.innerText.replace(/\r/g, "");
      if (text !== lastInlineText)
        send("edit", { id: el.dataset.ieId, value: { text } });
      el.contentEditable = "false";
      el.style.display = "contents";
      inline = null;
      store.editing = false;
      if (store.pending) {
        const next = store.pending;
        store.pending = null;
        update(next);
      }
      position();
    };
    const startInline = () => {
      if (!selected || selected.dataset.ieType !== "text" || !store.port)
        return;
      inline = selected;
      store.editing = true;
      lastInlineText = inline.innerText;
      inline.contentEditable = "true";
      inline.style.display = "inline";
      inline.focus();
      const range = document.createRange();
      range.selectNodeContents(inline);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      inline.addEventListener("blur", finishInline, { once: true });
    };
    const dbl = (e: MouseEvent) => {
      if (mode === "edit" && selected?.dataset.ieType === "text") {
        e.preventDefault();
        startInline();
      }
    };
    const input = () => {
      if (inline) {
        lastInlineText = inline.innerText.replace(/\r/g, "");
        send("edit", {
          id: inline.dataset.ieId,
          value: { text: lastInlineText },
        });
      }
    };
    const paste = (e: ClipboardEvent) => {
      if (!inline) return;
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain") || "";
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const r = selection.getRangeAt(0);
        r.deleteContents();
        const n = document.createTextNode(text);
        r.insertNode(n);
        r.setStartAfter(n);
        r.collapse(true);
        selection.removeAllRanges();
        selection.addRange(r);
      }
      input();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finishInline();
        select(null);
        send("deselect");
      }
      if (e.key === "Enter" && !inline && selected?.dataset.ieType === "text") {
        e.preventDefault();
        startInline();
      }
    };
    const blockSubmit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      send("notice", { message: "Forms are disabled in Website editor." });
    };
    const linkClick = (e: MouseEvent) => {
      if (mode !== "preview" || !store.port) return;
      const a = (e.target as Element).closest("a");
      if (a) {
        e.preventDefault();
        const u = new URL(a.href, location.origin);
        if (u.origin === location.origin)
          send("navigate", { path: u.pathname });
        else
          send("notice", {
            message: "External links open on your published website.",
          });
      }
    };
    let observer: MutationObserver | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handshake = async (e: MessageEvent) => {
      if (
        e.origin !== parentOrigin ||
        e.source !== window.parent ||
        e.data?.protocol !== "ingenium-editor-v1" ||
        e.data?.kind !== "init" ||
        e.data?.sessionId !== sessionId ||
        !e.ports[0] ||
        store.port
      )
        return;
      try {
        const r = await fetch("/api/ingenium/editor/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: e.data.token, parent: parentOrigin }),
        });
        if (!r.ok) throw new Error("Preview session could not be verified.");
        const grant = await r.json();
        if (
          disposed ||
          grant.siteId !== PORTAL_SITE_ID ||
          grant.parent !== parentOrigin ||
          grant.origin !== location.origin
        )
          throw new Error("Website session mismatch.");
        expiry = grant.expiresAt;
        store.port = e.ports[0];
        store.port.onmessage = (event) => {
          const v = event.data;
          if (
            v?.protocol !== "ingenium-editor-v1" ||
            v.sessionId !== sessionId ||
            Date.now() > expiry
          )
            return;
          if (v.kind === "apply" && v.snapshot?.schemaVersion === 1) {
            update(v.snapshot, v.media);
            setTimeout(() => send("registry", registry()), 80);
          }
          if (v.kind === "focus") {
            const el = Array.from(
              document.querySelectorAll<HTMLElement>("[data-ie-id]"),
            ).find((n) => n.dataset.ieId === v.id);
            if (el) {
              el.scrollIntoView({ block: "center", behavior: "smooth" });
              select(el);
            }
          }
          if (v.kind === "inline") startInline();
          if (v.kind === "mode") {
            finishInline();
            mode = v.mode;
            position();
          }
          if (v.kind === "registry") send("registry", registry());
          if (v.kind === "dispose") {
            finishInline();
            store.port?.close();
            store.port = null;
            overlay.style.display = "none";
          }
        };
        store.port.start();
        send("authenticated", {
          siteId: PORTAL_SITE_ID,
          path: location.pathname,
          ...registry(),
        });
        observer = new MutationObserver(() => {
          clearTimeout(timer);
          timer = setTimeout(() => send("registry", registry()), 350);
        });
        observer.observe(
          document.getElementById("main-content") || document.body,
          { childList: true, subtree: true },
        );
      } catch (err) {
        window.parent.postMessage(
          {
            protocol: "ingenium-editor-v1",
            sessionId,
            kind: "error",
            message:
              err instanceof Error ? err.message : "Preview connection failed.",
          },
          parentOrigin,
        );
      }
    };
    window.addEventListener("message", handshake);
    document.addEventListener("click", click, true);
    document.addEventListener("click", linkClick, true);
    document.addEventListener("dblclick", dbl, true);
    document.addEventListener("input", input, true);
    document.addEventListener("paste", paste, true);
    document.addEventListener("keydown", key);
    document.addEventListener("submit", blockSubmit, true);
    window.addEventListener("scroll", position, true);
    window.addEventListener("resize", position);
    window.addEventListener("blur", finishInline);
    window.parent.postMessage(
      {
        protocol: "ingenium-editor-v1",
        kind: "hello",
        sessionId,
        siteId: PORTAL_SITE_ID,
        path: location.pathname,
      },
      parentOrigin,
    );
    const expiryTimer = setInterval(() => {
      if (expiry && Date.now() > expiry) {
        finishInline();
        send("expired");
        store.port?.close();
        store.port = null;
        overlay.style.display = "none";
      }
    }, 5000);
    return () => {
      disposed = true;
      clearInterval(expiryTimer);
      clearTimeout(timer);
      observer?.disconnect();
      finishInline();
      overlay.remove();
      window.removeEventListener("message", handshake);
      document.removeEventListener("click", click, true);
      document.removeEventListener("click", linkClick, true);
      document.removeEventListener("dblclick", dbl, true);
      document.removeEventListener("input", input, true);
      document.removeEventListener("paste", paste, true);
      document.removeEventListener("keydown", key);
      document.removeEventListener("submit", blockSubmit, true);
      window.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
      window.removeEventListener("blur", finishInline);
      store.port?.close();
      store.port = null;
    };
  }, [parentOrigins]);
  return <Context.Provider value={ref.current}>{children}</Context.Provider>;
}
