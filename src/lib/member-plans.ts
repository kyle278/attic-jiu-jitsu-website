export type MemberPlan = {
  id: string;
  name: string;
  description: string;
  audience: string;
  price: string;
  checkout?: { enabled: boolean; reason: string | null; terms: string; billing_label: string };
};

// Only project public catalogue fields. Never send arbitrary plan metadata,
// access rules or a guessed checkout link to the member browser.
export function memberPlansFromManifest(payload: unknown, siteId: string): MemberPlan[] {
  if (!payload || typeof payload !== "object") throw new Error("Invalid catalogue");
  const manifest = (payload as { manifest?: unknown }).manifest;
  if (!manifest || typeof manifest !== "object") throw new Error("Invalid catalogue");
  const value = manifest as { site?: { id?: string }; plans?: unknown[] };
  if (value.site?.id !== siteId || !Array.isArray(value.plans))
    throw new Error("Invalid catalogue");
  return value.plans.map((entry) => {
    if (!entry || typeof entry !== "object") throw new Error("Invalid plan");
    const plan = entry as Record<string, unknown>;
    if (typeof plan.id !== "string" || typeof plan.name !== "string")
      throw new Error("Invalid plan");
    const amount = plan.price_minor;
    const currency = typeof plan.currency === "string" ? plan.currency : "EUR";
    const price = typeof plan.price_label === "string" && plan.price_label.trim()
      ? plan.price_label
      : typeof amount === "number" && Number.isSafeInteger(amount) && amount >= 0
        ? new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(amount / 100)
        : "Price to confirm";
    return {
      id: plan.id,
      name: plan.name,
      description: typeof plan.description === "string" ? plan.description : "Contact the academy for this plan’s benefits and terms.",
      audience: typeof plan.audience === "string" && plan.audience.trim() ? plan.audience : "Memberships",
      price,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}
