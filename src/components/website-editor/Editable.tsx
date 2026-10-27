"use client";
import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  useSyncExternalStore,
  type ReactNode,
  type ComponentProps,
  type HTMLAttributes,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useEditor,
  useEditorValue,
  useScopedId,
  RegionScope,
  designStyle,
  responsiveClass,
} from "./EditorProvider";
import { elementId, type ExtraSection } from "@/lib/website-editor/types";

export function EditorText({
  editorId,
  value,
  identity,
  tag = "text",
}: {
  editorId: string;
  value: ReactNode;
  identity?: unknown;
  tag?: string;
}) {
  const primitive = typeof value === "string" || typeof value === "number";
  const id = useScopedId(
      elementId(editorId, identity ?? (primitive ? String(value) : undefined)),
    ),
    v = useEditorValue(id);
  if (!primitive) return <>{value}</>;
  return createElement(
    "ie-text",
    {
      "data-ie-id": id,
      "data-ie-type": "text",
      "data-ie-label": tag.match(/^h[1-6]$/)
        ? "Heading"
        : tag === "strong"
          ? "Emphasis"
          : "Text",
      "data-ie-tag": tag,
      "data-ie-default": JSON.stringify({ text: String(value) }),
      style: {
        display: "contents",
        whiteSpace: v.text?.includes("\n") ? "pre-line" : undefined,
        ...designStyle(v.design),
      },
      className: responsiveClass(v.design),
    },
    v.text ?? value,
  );
}
export function EditorLink({
  editorId,
  identity,
  children,
  href,
  ...props
}: ComponentProps<typeof Link> & { editorId: string; identity?: unknown }) {
  const initial =
      typeof href === "string" ? href : String(href.pathname || "/"),
    id = useScopedId(elementId(editorId, identity ?? initial)),
    v = useEditorValue(id);
  return (
    <Link
      {...props}
      href={v.href ?? href}
      target={v.newTab ? "_blank" : props.target}
      rel={v.newTab ? "noopener noreferrer" : props.rel}
      data-ie-id={id}
      data-ie-type="link"
      data-ie-label="Button / link"
      data-ie-tag="a"
      data-ie-default={JSON.stringify({
        href: initial,
        newTab: props.target === "_blank",
      })}
      style={{ ...props.style, ...designStyle(v.design) }}
      className={[props.className, responsiveClass(v.design)]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Link>
  );
}
export function EditorImage({
  editorId,
  identity,
  ...props
}: ComponentProps<typeof Image> & { editorId: string; identity?: unknown }) {
  const initial =
      typeof props.src === "string"
        ? props.src
        : "src" in props.src
          ? props.src.src
          : props.src.default.src,
    id = useScopedId(elementId(editorId, identity ?? initial)),
    v = useEditorValue(id),
    store = useEditor();
  const src = v.src ?? props.src,
    renderSrc = typeof src === "string" ? store?.media[src] || src : src;
  return (
    <Image
      {...props}
      src={renderSrc}
      alt={v.alt ?? props.alt}
      unoptimized={
        props.unoptimized ||
        !!v.src ||
        (typeof renderSrc === "string" &&
          renderSrc.includes("/api/websites/editor/"))
      }
      data-ie-id={id}
      data-ie-type="image"
      data-ie-label="Image"
      data-ie-tag="img"
      data-ie-default={JSON.stringify({ src: initial, alt: props.alt })}
      style={{
        ...props.style,
        objectPosition: v.focal ?? props.style?.objectPosition,
        ...designStyle(v.design),
      }}
      className={[props.className, responsiveClass(v.design)]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
export function EditorVisual({
  editorId,
  label,
  alt,
  children,
}: {
  editorId: string;
  label: string;
  alt: string;
  children: ReactNode;
}) {
  const id = useScopedId(editorId),
    v = useEditorValue(id),
    store = useEditor();
  return (
    <div
      data-ie-id={id}
      data-ie-type="image"
      data-ie-label={label}
      data-ie-tag="img"
      data-ie-default={JSON.stringify({ alt })}
      style={{ display: "contents" }}
    >
      {v.src ? (
        <Image
          src={store?.media[v.src] || v.src}
          alt={v.alt ?? alt}
          width={720}
          height={660}
          unoptimized
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            objectPosition: v.focal || "center",
            borderRadius: 20,
            ...designStyle(v.design),
          }}
        />
      ) : (
        children
      )}
    </div>
  );
}
export function EditorSection({
  editorId,
  instanceKey,
  scopeId,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  editorId: string;
  instanceKey?: unknown;
  scopeId?: string;
}) {
  const id = useScopedId(elementId(editorId, instanceKey)),
    v = useEditorValue(id);
  const label = props.className?.includes("hero")
    ? "Hero"
    : props.className?.includes("home-services")
      ? "Services"
      : props.className?.includes("workflow")
        ? "How it works"
        : props.className?.includes("home-pricing")
          ? "Pricing"
          : props.className?.includes("home-invitation")
            ? "Contact"
            : props["aria-labelledby"] === "process-heading"
              ? "Our process"
              : undefined;
  return (
    <section
      {...props}
      data-ie-id={id}
      data-ie-type="section"
      data-ie-tag="section"
      data-ie-label={label}
      data-ie-extra={scopeId ? "1" : undefined}
      data-ie-default="{}"
      style={{ ...props.style, ...designStyle(v.design) }}
      className={[props.className, responsiveClass(v.design)]
        .filter(Boolean)
        .join(" ")}
    >
      {scopeId ? (
        <RegionScope.Provider value={scopeId}>{children}</RegionScope.Provider>
      ) : (
        children
      )}
    </section>
  );
}
function Extra({ section }: { section: ExtraSection }) {
  const store = useEditor();
  const image = section.src ? store?.media[section.src] || section.src : "";
  return (
    <section
      data-ie-extra="1"
      data-ie-id={section.id}
      data-ie-type="section"
      data-ie-label={section.heading || "New section"}
      data-ie-default="{}"
      className={[
        "rebuild-section ie-extra",
        responsiveClass(section.design),
      ].join(" ")}
      style={designStyle(section.design)}
    >
      {section.type === "image" && image && (
        <Image
          src={image}
          alt={section.alt || ""}
          width={1200}
          height={650}
          unoptimized
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      {section.type === "faq" ? (
        <details className="rebuild-faq">
          <summary>{section.heading}</summary>
          <p>{section.body}</p>
        </details>
      ) : (
        <>
          <h2>{section.heading}</h2>
          <div className={section.type === "columns" ? "rebuild-grid-two" : ""}>
            <p style={{ whiteSpace: "pre-line" }}>{section.body}</p>
          </div>
        </>
      )}
      {section.buttonLabel && section.href && (
        <Link href={section.href} className="rebuild-button">
          {section.buttonLabel}
        </Link>
      )}
    </section>
  );
}
export function EditorFlow({
  containerId,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { containerId: string }) {
  const store = useEditor();
  const snapshot = useSyncExternalStore(
    (cb) => {
      store?.listeners.add(cb);
      return () => {
        store?.listeners.delete(cb);
      };
    },
    () => store?.snapshot,
    () => store?.snapshot,
  );
  const list = Children.toArray(children);
  const sections = new Map<string, ReactNode>();
  for (const child of list) {
    if (
      isValidElement<{ editorId?: string; instanceKey?: unknown }>(child) &&
      child.props.editorId
    )
      sections.set(
        elementId(child.props.editorId, child.props.instanceKey),
        child,
      );
  }
  const extras = (snapshot?.extras || []).filter(
    (s) => s.container === containerId,
  );
  for (const extra of extras) {
    const source = extra.source ? sections.get(extra.source) : null;
    sections.set(
      extra.id,
      extra.type === "clone" &&
        isValidElement<{
          editorId: string;
          instanceKey?: unknown;
          scopeId?: string;
        }>(source) ? (
        cloneElement(source, {
          key: extra.id,
          editorId: extra.id,
          instanceKey: undefined,
          scopeId: extra.id,
        })
      ) : (
        <Extra key={extra.id} section={extra} />
      ),
    );
  }
  const order = snapshot?.orders[containerId] || [...sections.keys()];
  const ordered = [
    ...order,
    ...[...sections.keys()].filter((id) => !order.includes(id)),
  ].filter((id) => sections.has(id));
  let index = 0;
  const output = list.map((child) =>
    isValidElement<{ editorId?: string }>(child) && child.props.editorId
      ? sections.get(ordered[index++])
      : child,
  );
  while (index < ordered.length) output.push(sections.get(ordered[index++]));
  return (
    <div {...props} data-ie-container={containerId}>
      {output}
    </div>
  );
}
