"use client";

import { FormEvent, useState } from "react";

import { formOptions } from "@/lib/site-data";

function getTracking() {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    cid: params.get("cid"),
    visitor_id: window.IngeniumTracker?.getVisitorId?.() ?? params.get("visitor_id"),
    session_id: window.IngeniumTracker?.getSessionId?.() ?? params.get("session_id"),
    submission_url: window.location.href,
    referrer: document.referrer || null,
  };
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const fields = {
      full_name: String(formData.get("full_name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      interest: String(formData.get("interest") || ""),
      experience_level: String(formData.get("experience_level") || ""),
      message: String(formData.get("message") || ""),
    };

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      window.IngeniumTracker?.track("form_submit", {}, { form_slug: "contact", form_id: "contact" });

      const response = await fetch("/api/portal-form-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formSlug: "contact",
          fields,
          tracking: getTracking(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; ok?: boolean } | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Something went wrong.");
      }

      setStatus("success");
      setMessage("Thanks. Your enquiry has been sent and someone will be in touch soon.");
      form.reset();
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Something went wrong.";
      setStatus("error");
      setMessage(nextMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="trial-form" className="panel-dark grid gap-4 p-6 sm:p-8" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Book A Free Trial</p>
        <h3 className="font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
          Tell us what you want to train.
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-[color:var(--fog)]">
          Full name
          <input className="field" name="full_name" required />
        </label>
        <label className="grid gap-2 text-sm text-[color:var(--fog)]">
          Email
          <input className="field" name="email" type="email" required />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-[color:var(--fog)]">
          Phone
          <input className="field" name="phone" type="tel" />
        </label>
        <label className="grid gap-2 text-sm text-[color:var(--fog)]">
          What are you interested in?
          <select className="field" name="interest" defaultValue={formOptions[0]}>
            {formOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm text-[color:var(--fog)]">
        Experience level
        <select className="field" name="experience_level" defaultValue="Complete beginner">
          <option>Complete beginner</option>
          <option>Some martial arts experience</option>
          <option>Previous BJJ training</option>
          <option>Looking for competition-focused training</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm text-[color:var(--fog)]">
        Message
        <textarea className="field min-h-32 resize-y" name="message" placeholder="Tell us who the enquiry is for and what you would like help with." />
      </label>

      <button type="submit" className="button-primary w-full sm:w-fit" disabled={loading}>
        {loading ? "Sending..." : "Send enquiry"}
      </button>

      {message ? (
        <p className={status === "success" ? "text-sm text-[color:var(--bronze)]" : "text-sm text-[#f0a7b2]"}>{message}</p>
      ) : null}
    </form>
  );
}
