import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SubmitBody = {
  formSlug?: string;
  formId?: string;
  fields: Record<string, unknown>;
  tracking: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_term?: string | null;
    utm_content?: string | null;
    cid?: string | null;
    visitor_id?: string | null;
    session_id?: string | null;
    submission_url: string;
    referrer?: string | null;
  };
};

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL;
  const key = process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerClient();
    const organisationId = process.env.PORTAL_ORGANISATION_ID;
    const siteId = process.env.PORTAL_SITE_ID;

    if (!supabase || !organisationId || !siteId) {
      return NextResponse.json(
        { error: "Portal form integration is not configured yet." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as SubmitBody;
    const tracking = body.tracking ?? { submission_url: "" };

    let formId = body.formId;

    if (!formId) {
      const slug = body.formSlug ?? process.env.PORTAL_DEFAULT_FORM_SLUG;

      if (!slug) {
        return NextResponse.json({ error: "Missing formId or formSlug." }, { status: 400 });
      }

      const { data: formRow, error: formError } = await supabase
        .from("website_forms")
        .select("id")
        .eq("organisation_id", organisationId)
        .eq("site_id", siteId)
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (formError || !formRow) {
        return NextResponse.json({ error: "Form not found in portal." }, { status: 400 });
      }

      formId = formRow.id;
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || null;
    const userAgent = request.headers.get("user-agent");
    const submissionUrl = tracking.submission_url;

    const data = {
      ...body.fields,
      utm_source: tracking.utm_source ?? null,
      utm_medium: tracking.utm_medium ?? null,
      utm_campaign: tracking.utm_campaign ?? null,
      utm_term: tracking.utm_term ?? null,
      utm_content: tracking.utm_content ?? null,
      cid: tracking.cid ?? null,
      visitor_id: tracking.visitor_id ?? null,
      session_id: tracking.session_id ?? null,
      submission_url: submissionUrl,
    };

    const metadata = {
      submitted_at: new Date().toISOString(),
      referrer: tracking.referrer ?? null,
      landing_url: submissionUrl,
      utm_source: tracking.utm_source ?? null,
      utm_medium: tracking.utm_medium ?? null,
      utm_campaign: tracking.utm_campaign ?? null,
      utm_term: tracking.utm_term ?? null,
      utm_content: tracking.utm_content ?? null,
      cid: tracking.cid ?? null,
      visitor_id: tracking.visitor_id ?? null,
      session_id: tracking.session_id ?? null,
    };

    const { error } = await supabase.from("website_form_submissions").insert({
      organisation_id: organisationId,
      site_id: siteId,
      form_id: formId,
      data,
      source_url: submissionUrl,
      submission_url: submissionUrl,
      utm_source: tracking.utm_source ?? null,
      utm_medium: tracking.utm_medium ?? null,
      utm_campaign: tracking.utm_campaign ?? null,
      utm_term: tracking.utm_term ?? null,
      utm_content: tracking.utm_content ?? null,
      campaign_cid: tracking.cid ?? null,
      tracking_visitor_id: tracking.visitor_id ?? null,
      tracking_session_id: tracking.session_id ?? null,
      metadata,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
