import Link from "next/link";
import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { safeUrl, type BlogBlock, type PublicMedia } from "@/lib/blog/contracts";
import { headingAnchor } from "@/lib/blog/routing";

export function inlineText(text: string): ReactNode[] {
  return text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^\s)]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\((.+)\)$/);
    if (link && safeUrl.safeParse(link[2]).success) return <Link key={index} href={link[2]}>{link[1]}</Link>;
    return part;
  });
}

function renderBlock(block: BlogBlock, media: Record<string, PublicMedia>) {
  switch (block.type) {
    case "heading": {
      const Heading = block.level === 3 ? "h3" : block.level === 4 ? "h4" : "h2";
      return <Heading id={headingAnchor(block.id)}>{inlineText(block.text)}</Heading>;
    }
    case "paragraph": return <p style={{ whiteSpace: "pre-wrap" }}>{inlineText(block.text)}</p>;
    case "quote": return <blockquote>{inlineText(block.text)}</blockquote>;
    case "callout": return <aside className="blog-callout">{inlineText(block.text)}</aside>;
    case "list": {
      const items = block.text.split("\n").filter(Boolean).map((line, index) => <li key={index}>{inlineText(line)}</li>);
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "image": {
      const image = block.media_id ? media[block.media_id] : undefined;
      if (!image) throw new Error("Published article image is missing.");
      return <figure><Image src={image.url} width={image.width} height={image.height} alt={block.decorative ? "" : block.alt} loading="lazy" unoptimized />{block.caption ? <figcaption>{inlineText(block.caption)}</figcaption> : null}</figure>;
    }
    case "cta": return <aside className="blog-cta">{block.text ? <p>{inlineText(block.text)}</p> : null}<Link href={block.href} className="button-primary" data-ingenium-event="contact_cta_click" data-ingenium-label={block.label} data-ingenium-location="blog_article">{block.label}</Link></aside>;
    case "divider": return <hr />;
    case "code": return <pre><code>{block.text}</code></pre>;
    case "table": {
      const [head = [], ...rows] = block.text.split("\n").filter(Boolean).map((row) => row.split("|"));
      return <div className="blog-table-scroll" role="region" aria-label={block.caption || "Article table"} tabIndex={0}><table>{block.caption ? <caption>{block.caption}</caption> : null}<thead><tr>{head.map((cell, index) => <th key={index} scope="col">{inlineText(cell)}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{inlineText(cell)}</td>)}</tr>)}</tbody></table></div>;
    }
  }
}

export function BlogBody({ blocks, media }: { blocks: BlogBlock[]; media: Record<string, PublicMedia> }) {
  return <div className="blog-body">{blocks.map((block) => <Fragment key={block.id}>{renderBlock(block, media)}</Fragment>)}</div>;
}
