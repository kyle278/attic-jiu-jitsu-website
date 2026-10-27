import { PORTAL_ORIGIN, PORTAL_SITE_ID } from "./public";
// Forms retain the site's established V1 ingestion and CRM mapping. V2 is analytics only.
// No optional tracker is needed to send an enquiry.
export async function submitPortalEnquiry(form: HTMLFormElement) {
  if (new URLSearchParams(location.search).get("__ingenium_editor") === "1")
    throw Error("Enquiries are disabled in Website editor.");
  const fields: Record<string, string | boolean> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") fields[key] = value;
  });
  form
    .querySelectorAll<HTMLInputElement>('input[type="checkbox"][name]')
    .forEach((input) => {
      fields[input.name] = input.checked;
    });
  if (fields.privacy_consent !== true || fields.accuracy_confirmation !== true)
    throw Error("Please confirm your details and privacy choice.");
  let allowed = false;
  try {
    allowed = localStorage.getItem("attic-analytics-consent-v1") === "accepted";
  } catch {}
  const context = allowed ? window.IngeniumSite?.context() : null;
  if (!allowed)
    for (const key of [
      "utm_Campaign",
      "utm_Source",
      "utm_Medium",
      "utm_Content",
      "utm_Term",
      "CID",
    ])
      delete fields[key];
  const source = location.origin + location.pathname;
  fields["Submission URL"] = source;
  const response = await fetch(`${PORTAL_ORIGIN}/api/websites/forms/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      site_id: PORTAL_SITE_ID,
      form_slug: "contact",
      fields,
      honeypot: fields.website_url || "",
      submission_url: source,
      source_url: source,
      tracking: {
        ...(context?.visitor_id ? { visitor_id: context.visitor_id } : {}),
        ...(context?.session_id ? { session_id: context.session_id } : {}),
        ...(allowed
          ? {
              utm_source: fields.utm_Source,
              utm_medium: fields.utm_Medium,
              utm_campaign: fields.utm_Campaign,
              cid: fields.CID,
            }
          : {}),
      },
    }),
  });
  const receipt = await response.json();
  if (
    !response.ok ||
    receipt.ok !== true ||
    receipt.accepted === false ||
    !receipt.submission_id
  )
    throw Error(
      "We couldn’t send your enquiry. Your answers are still here. Please try again or call the academy.",
    );
  window.IngeniumSite?.track("form_submitted", { form_slug: "contact" });
  return receipt;
}
