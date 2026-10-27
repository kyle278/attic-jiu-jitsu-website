import "server-only";
import { PORTAL_ORIGIN } from "@/portal/public";
export function editorParentOrigins() {
  return [
    PORTAL_ORIGIN,
    process.env.INGENIUM_EDITOR_STAGING_PORTAL_ORIGIN,
  ].filter((v): v is string => !!v);
}
export function portalHeaders(origin: string): Record<string, string> {
  if (!editorParentOrigins().includes(origin))
    throw new Error("Unknown editor parent");
  const bypass =
    origin !== PORTAL_ORIGIN
      ? process.env.INGENIUM_EDITOR_STAGING_PORTAL_BYPASS
      : undefined;
  return bypass ? { "x-vercel-protection-bypass": bypass } : {};
}
