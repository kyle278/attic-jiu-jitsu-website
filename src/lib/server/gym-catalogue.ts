import { cache } from "react";
import { gymManifest, gymPlans, gymClasses, gymSessions, gymConfig, type GymManifest } from "@/lib/gym-data";
import { portalConnect } from "@/lib/portal-connect";
import { fetchPortalGym } from "./portal-gym-proxy";

export const getGymCatalogue = cache(async (): Promise<GymManifest> => {
  try {
    const { response } = await fetchPortalGym(`/api/websites/gym/sync?site_id=${encodeURIComponent(portalConnect.siteId)}`, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Catalogue unavailable");
    const payload = await response.json();
    const manifest = payload.manifest;
    if (manifest?.site?.id !== portalConnect.siteId || !Array.isArray(manifest.plans) || !Array.isArray(manifest.classes) || !Array.isArray(manifest.sessions)) throw new Error("Invalid catalogue");
    return manifest as GymManifest;
  } catch {
    // A verified public snapshot keeps the catalogue useful during a brief outage.
    // Times are filtered below; old snapshot sessions can never be booked here.
    return { ...gymManifest, plans: gymPlans, classes: gymClasses, sessions: gymSessions, config: gymConfig };
  }
});

export function getTimetable(manifest: GymManifest) {
  const entries = manifest.config.display_options?.timetable;
  if (!Array.isArray(entries)) return [];
  return entries.flatMap((entry: unknown) => {
    if (!entry || typeof entry !== "object") return [];
    const value = entry as Record<string, unknown>;
    if (typeof value.starts_at !== "string" || typeof value.class_slug !== "string" || !Number.isFinite(Date.parse(value.starts_at)) || Date.parse(value.starts_at) <= Date.now()) return [];
    const service = manifest.classes.find(item => item.slug === value.class_slug);
    return service ? [{ starts_at: value.starts_at, service }] : [];
  }).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
}
