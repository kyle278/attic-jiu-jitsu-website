"use client";
import {
  EditorImage,
  EditorLink,
  EditorText,
} from "@/components/website-editor/Editable";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { navigation } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => {
    if (menu.current) menu.current.open = false;
  };
  const links = navigation.filter((item) => item.href !== "/");
  return (
    <header className="site-header">
      <div className="site-container header-row">
        <EditorLink
          editorId="r3de2e2ca7d-fs"
          href="/"
          className="brand"
          aria-label="Attic Jiu Jitsu Carlow home"
          onClick={closeMenu}
        >
          <EditorImage
            editorId="r3de2e2ca7d-k2"
            src="/images/logo.png"
            alt=""
            width={52}
            height={52}
          />
          <span className="brand-name">
            <EditorText editorId="r3de2e2ca7d-n9" tag="span" value={"Attic"} />
            <span>
              <EditorText
                editorId="r3de2e2ca7d-nk"
                tag="span"
                value={"Jiu Jitsu · Carlow"}
              />
            </span>
          </span>
        </EditorLink>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              data-ingenium-event="nav_click"
              data-ingenium-label={item.label}
              data-ingenium-location="header"
            >
              <EditorText
                editorId="r3de2e2ca7d-10v"
                tag="Link"
                value={item.label === "About Us" ? "The academy" : item.label}
              />
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/members" className="member-link">
            <EditorText
              editorId="r3de2e2ca7d-16v"
              tag="Link"
              value={"Members "}
            />
          </Link>
          <EditorLink
            editorId="r3de2e2ca7d-17v"
            href="/#trial-form"
            className="button-primary header-start"
            data-ingenium-event="contact_cta_click"
            data-ingenium-label="Start training"
            data-ingenium-location="header"
          >
            <EditorText
              editorId="r3de2e2ca7d-1f2"
              tag="Link"
              value={"Start training"}
            />
            <EditorText editorId="r3de2e2ca7d-1fg" tag="Link" value={" "} />
          </EditorLink>
        </div>
        <details
          ref={menu}
          className="mobile-menu"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeMenu();
              menu.current?.querySelector("summary")?.focus();
            }
          }}
        >
          <summary aria-controls="mobile-navigation">
            <EditorText
              editorId="r3de2e2ca7d-1q0"
              tag="summary"
              value={"Menu "}
            />
            <span className="menu-mark" aria-hidden="true" />
          </summary>
          <nav id="mobile-navigation" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <EditorText
                  editorId="r3de2e2ca7d-21u"
                  tag="Link"
                  value={item.label}
                />
              </Link>
            ))}
            <EditorLink
              editorId="r3de2e2ca7d-23l"
              href="/classes#live-schedule"
              onClick={closeMenu}
            >
              <EditorText
                editorId="r3de2e2ca7d-25k"
                tag="Link"
                value={"View timetable "}
              />
            </EditorLink>
            <EditorLink
              editorId="r3de2e2ca7d-26v"
              href="/#trial-form"
              className="button-primary"
              onClick={closeMenu}
            >
              <EditorText
                editorId="r3de2e2ca7d-2au"
                tag="Link"
                value={"Start training"}
              />
              <EditorText editorId="r3de2e2ca7d-2b8" tag="Link" value={" "} />
            </EditorLink>
          </nav>
        </details>
      </div>
    </header>
  );
}
