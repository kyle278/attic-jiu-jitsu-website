import { test } from "node:test";
import assert from "node:assert/strict";
import { memberPlansFromManifest } from "../src/lib/member-plans.ts";

const payload = (plans) => ({ manifest: { site: { id: "attic" }, plans } });
test("only exposes public published plan fields and preserves exact displayed terms", () => {
  const plans = memberPlansFromManifest(payload([{
    id: "plan", name: "Beginner", description: "Included gear", audience: "Beginners",
    price_label: "€160 / 2 months", price_minor: 16000, currency: "EUR",
    metadata: { checkout_url: "https://untrusted.invalid" }, access_rules: ["private"],
  }]), "attic");
  assert.deepEqual(plans, [{ id: "plan", name: "Beginner", description: "Included gear", audience: "Beginners", price: "€160 / 2 months" }]);
});
test("rejects a different site or malformed catalogue instead of using stale prices", () => {
  assert.throws(() => memberPlansFromManifest(payload([]), "other"));
  assert.throws(() => memberPlansFromManifest({}, "attic"));
  assert.throws(() => memberPlansFromManifest(payload([null]), "attic"));
});
test("handles empty catalogues and unspecified prices without inventing a billing period", () => {
  assert.deepEqual(memberPlansFromManifest(payload([]), "attic"), []);
  assert.equal(memberPlansFromManifest(payload([{ id: "a", name: "One-off", price_minor: 1200 }]), "attic")[0].price, "€12.00");
  assert.equal(memberPlansFromManifest(payload([{ id: "a", name: "Unknown" }]), "attic")[0].price, "Price to confirm");
});
