"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "@/lib/site-data";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const handleSubmitting = () => {
      setSubmitState("submitting");
      setFeedbackMessage("");
    };

    const handleSuccess = () => {
      form.reset();
      setSubmitState("success");
      setFeedbackMessage("Thanks. Your enquiry has been sent and someone will be in touch soon.");
    };

    const handleError = (event: Event) => {
      const detail = "detail" in event && event.detail && typeof event.detail === "object"
        ? event.detail
        : null;
      const nextMessage = detail && "message" in detail && typeof detail.message === "string"
        ? detail.message
        : "Something went wrong. Please try again or call the academy directly.";

      setSubmitState("error");
      setFeedbackMessage(nextMessage);
    };

    form.addEventListener("ingenium:form-submitting", handleSubmitting);
    form.addEventListener("ingenium:form-success", handleSuccess);
    form.addEventListener("ingenium:form-error", handleError);

    return () => {
      form.removeEventListener("ingenium:form-submitting", handleSubmitting);
      form.removeEventListener("ingenium:form-success", handleSuccess);
      form.removeEventListener("ingenium:form-error", handleError);
    };
  }, []);

  return (
    <form
      ref={formRef}
      id="trial-form"
      className="panel-dark grid gap-5 p-6 sm:p-8"
      data-ingenium-submit="portal"
      data-form-slug="contact"
      data-ingenium-form-label="Contact Form"
    >
      <div className="space-y-3">
        <div>
          <p className="eyebrow">Get In Touch</p>
          <h3 className="font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
            Contact the academy directly.
          </h3>
        </div>
        <p className="text-base leading-7 text-[color:var(--fog)]">
          Fill out the form below and your enquiry will be sent directly to the academy.
        </p>
        <p className="text-sm text-[color:var(--fog)]">Fields marked with * are required.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-[color:var(--fog)]">
          First name*
          <input className="field" name="first_name" autoComplete="given-name" required />
        </label>
        <label className="grid gap-2 text-sm text-[color:var(--fog)]">
          Last name*
          <input className="field" name="last_name" autoComplete="family-name" required />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-[color:var(--fog)]">
          Email*
          <input className="field" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="grid gap-2 text-sm text-[color:var(--fog)]">
          Phone number
          <input className="field" name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-[color:var(--fog)]">
        Message / query
        <textarea
          className="field min-h-36 resize-y"
          name="message"
          placeholder="Tell the academy what you would like help with."
        />
      </label>

      <div className="grid gap-4 rounded-[20px] border border-white/10 bg-[rgba(63,24,32,0.28)] p-5 text-sm text-[color:var(--fog)]">
        <p className="font-semibold text-[color:var(--chalk)]">Privacy and consent</p>
        <p>
          Your information will only be used to reply to this enquiry unless you separately opt in to
          updates.
        </p>

        <label className="flex items-start gap-3">
          <input
            className="mt-1 h-4 w-4 accent-[color:var(--bronze)]"
            name="privacy_consent"
            type="checkbox"
            required
          />
          <span>I consent to Attic Jiu Jitsu using my details to respond to my enquiry.*</span>
        </label>

        <label className="flex items-start gap-3">
          <input
            className="mt-1 h-4 w-4 accent-[color:var(--bronze)]"
            name="accuracy_confirmation"
            type="checkbox"
            required
          />
          <span>
            I confirm the information I have provided is accurate and I am happy to be contacted about
            this enquiry.*
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            className="mt-1 h-4 w-4 accent-[color:var(--bronze)]"
            name="marketing_consent"
            type="checkbox"
            value="yes"
          />
          <span>
            I would also like to receive occasional updates about classes, memberships, and academy news.
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="button-primary w-full sm:w-fit" disabled={submitState === "submitting"}>
          {submitState === "submitting" ? "Sending..." : "Send Enquiry"}
        </button>
        <a href={site.phoneHref} className="button-secondary w-full sm:w-fit">
          Call {site.phone}
        </a>
      </div>

      {feedbackMessage ? (
        <p className={submitState === "success" ? "text-sm text-[color:var(--bronze)]" : "text-sm text-red-300"}>
          {feedbackMessage}
        </p>
      ) : null}
    </form>
  );
}
