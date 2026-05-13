#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const portalConnectPath = path.join(repoRoot, "portal-connect.json");
const outputDir = path.join(repoRoot, "src", "generated", "gym");

function normalizeBaseUrl(raw) {
  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\/+$/, "");
}

async function loadPortalConnect() {
  const raw = await readFile(portalConnectPath, "utf8");
  const parsed = JSON.parse(raw);

  return {
    siteId: parsed.siteId,
    baseUrls: [
      normalizeBaseUrl(parsed.localPortalBaseUrl),
      normalizeBaseUrl(parsed.productionPortalBaseUrl),
    ].filter(Boolean),
  };
}

function validateManifest(payload) {
  return !!(
    payload?.ok &&
    payload?.manifest &&
    typeof payload.manifest.contract_version === "string" &&
    Array.isArray(payload.manifest.plans) &&
    Array.isArray(payload.manifest.classes) &&
    Array.isArray(payload.manifest.sessions)
  );
}

function summarizeFailureBody(contentType, bodyText) {
  if (!bodyText) {
    return "No response body returned.";
  }

  if (!contentType.includes("application/json")) {
    return `Unexpected ${contentType || "response"} while looking for the gym sync route.`;
  }

  try {
    const payload = JSON.parse(bodyText);
    return payload?.error || JSON.stringify(payload);
  } catch {
    return bodyText.slice(0, 300);
  }
}

async function fetchManifest(baseUrl, siteId) {
  const syncUrl = `${baseUrl}/api/websites/gym/sync?site_id=${encodeURIComponent(siteId)}`;
  const response = await fetch(syncUrl, {
    headers: {
      accept: "application/json",
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const bodyText = await response.text();

  if (!response.ok) {
    const message = summarizeFailureBody(contentType, bodyText);
    throw new Error(`Portal sync failed at ${baseUrl} (${response.status}): ${message}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error(`Portal sync at ${baseUrl} returned unexpected content type: ${contentType}`);
  }

  const payload = JSON.parse(bodyText);
  if (!validateManifest(payload)) {
    throw new Error(`Portal sync at ${baseUrl} returned an invalid manifest payload.`);
  }

  return {
    baseUrl,
    manifest: payload.manifest,
  };
}

async function main() {
  const { siteId, baseUrls } = await loadPortalConnect();
  if (!siteId || baseUrls.length === 0) {
    throw new Error("portal-connect.json must define a siteId and at least one portal base URL.");
  }

  let syncResult = null;
  let lastError = null;

  for (const baseUrl of baseUrls) {
    try {
      syncResult = await fetchManifest(baseUrl, siteId);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!syncResult) {
    throw lastError ?? new Error("Unable to reach any configured portal base URL.");
  }

  await mkdir(outputDir, { recursive: true });

  const files = {
    "manifest.json": syncResult.manifest,
    "plans.json": syncResult.manifest.plans,
    "classes.json": syncResult.manifest.classes,
    "sessions.json": syncResult.manifest.sessions,
    "config.json": syncResult.manifest.config ?? {},
  };

  for (const [fileName, contents] of Object.entries(files)) {
    await writeFile(
      path.join(outputDir, fileName),
      `${JSON.stringify(contents, null, 2)}\n`,
      "utf8",
    );
  }

  const indexFile = `import manifest from "./manifest.json";
import plans from "./plans.json";
import classes from "./classes.json";
import sessions from "./sessions.json";
import config from "./config.json";

export const gymManifest = manifest;
export const gymPlans = plans;
export const gymClasses = classes;
export const gymSessions = sessions;
export const gymConfig = config;
`;

  await writeFile(path.join(outputDir, "index.ts"), indexFile, "utf8");

  console.log(
    `Synced gym data for ${siteId} from ${syncResult.baseUrl} into ${outputDir}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
