// Trusted deployment setup only. The Portal service credential is used in this process
// for its documented setup API and is never written into the website or child tools.
import fs from "node:fs/promises";
import { randomBytes } from "node:crypto";

const portalEnv = process.argv[2];
if (!portalEnv) throw Error("Pass the Portal-side environment file to configure this site's connection.");
const websiteEnvPath = new URL("../.env.local", import.meta.url);
const current = await fs.readFile(websiteEnvPath, "utf8").catch(() => "");
function valueOf(name) {
  const value = current.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim();
  return value?.replace(/^(["'])(.*)\1$/, "$2");
}
const secret = valueOf("INGENIUM_BLOG_SIGNING_SECRET") || randomBytes(32).toString("hex");
process.loadEnvFile(portalEnv);
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw Error("The Portal setup credential is unavailable.");
const origin = "https://portal.ingeniumconsulting.net";
const website = "https://attic-jiu-jitsu-website.vercel.app";
const response = await fetch(`${origin}/api/websites/blog/setup`, {
  method: "POST", headers: { authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    siteId: "8b0e89c9-3090-46b2-b008-4d5c46233647", organisationId: "66f8a0e7-ffaa-4415-8261-e898609bcc74",
    endpoint: `${website}/api/ingenium/blog`, secret,
    initialConfig: { enabled: false, title: "Fitness Over 40 & Jiu-Jitsu Beginner Guides", description: "Practical guides to getting fit over 40 for men and women, finding an alternative to the gym and starting jiu-jitsu. Advice for beginners and parents in Carlow.", base_path: "/blog", timezone: "Europe/Dublin", independent_review: false, title_suffix: "Attic" },
  }), cache: "no-store", redirect: "error", signal: AbortSignal.timeout(20000),
});
if (!response.ok) throw Error(`Portal Blog setup returned ${response.status}. No website credentials were written.`);
const result = await response.json();
if (!result.configured || !/^blog_[a-f0-9]{32}$/.test(result.settings?.public_key) || result.settings.callback_url !== `${website}/api/ingenium/blog`) throw Error("The setup response does not match the registered website.");
const updates = { INGENIUM_BLOG_SITE_KEY: result.settings.public_key, INGENIUM_BLOG_SIGNING_SECRET: secret, INGENIUM_BLOG_ENVIRONMENT: "production" };
let next = current;
for (const [name, value] of Object.entries(updates)) {
  const regex = new RegExp(`^${name}=.*$`, "m");
  if (regex.test(next)) next = next.replace(regex, `${name}=${value}`);
  else next += `${next.endsWith("\n") || !next ? "" : "\n"}${name}=${value}\n`;
}
await fs.writeFile(websiteEnvPath, next);
await fs.mkdir(new URL("../docs/blog/", import.meta.url), { recursive: true });
const receipt = { configuredAt: new Date().toISOString(), siteId: "8b0e89c9-3090-46b2-b008-4d5c46233647", organisationId: "66f8a0e7-ffaa-4415-8261-e898609bcc74", websiteOrigin: website, portalOrigin: origin, adapterVersion: 1, publicKey: result.settings.public_key, endpoint: result.settings.callback_url, generation: result.settings.generation, enabled: result.settings.enabled, secretConfigured: result.settings.has_secret, deliveryVerified: false };
await fs.writeFile(new URL("../docs/blog/connection.json", import.meta.url), JSON.stringify(receipt, null, 2) + "\n");
console.log(JSON.stringify(receipt, null, 2));
