export type Design = {
  color?: string;
  background?: string;
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: number;
  align?: "left" | "center" | "right";
  spacing?: "original" | "compact" | "comfortable" | "spacious";
  hidden?: boolean;
  hiddenMobile?: boolean;
  hiddenTablet?: boolean;
  hiddenDesktop?: boolean;
};
export type EditorValue = {
  text?: string;
  href?: string;
  src?: string;
  alt?: string;
  focal?: string;
  newTab?: boolean;
  design?: Design;
};
export type ExtraSection = {
  id: string;
  container: string;
  type: "text" | "image" | "cta" | "faq" | "columns" | "clone";
  source?: string;
  heading: string;
  body: string;
  buttonLabel?: string;
  href?: string;
  src?: string;
  alt?: string;
  design?: Design;
};
export type Snapshot = {
  schemaVersion: 1;
  registry: string;
  values: Record<string, EditorValue>;
  orders: Record<string, string[]>;
  extras: ExtraSection[];
};
export const EMPTY: Snapshot = {
  schemaVersion: 1,
  registry: "ingenium-v1",
  values: {},
  orders: {},
  extras: [],
};
export function hash(v: unknown) {
  const s = typeof v === "string" ? v : (JSON.stringify(v) ?? "");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}
export function elementId(base: string, identity: unknown) {
  return identity === undefined ? base : base + "-" + hash(identity);
}
