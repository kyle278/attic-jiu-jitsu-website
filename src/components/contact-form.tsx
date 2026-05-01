"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "@/lib/site-data";

type SubmitState = "idle" | "submitting" | "success" | "error";
type FormStep = 1 | 2;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [step, setStep] = useState<FormStep>(1);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [accuracyConfirmation, setAccuracyConfirmation] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const url = new URL(window.location.href);
    const values: Record<string, string> = {
      utm_Campaign: url.searchParams.get("utm_campaign") ?? "",
      utm_Source: url.searchParams.get("utm_source") ?? "",
      utm_Medium: url.searchParams.get("utm_medium") ?? "",
      utm_Content: url.searchParams.get("utm_content") ?? "",
      utm_Term: url.searchParams.get("utm_term") ?? "",
      CID: url.searchParams.get("cid") ?? "",
      "Submission URL": window.location.href,
    };

    Object.entries(values).forEach(([name, value]) => {
      const input = form.elements.namedItem(name);

      if (input instanceof HTMLInputElement) {
        input.value = value;
      }
    });
  }, []);

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
      setStep(1);
      setPrivacyConsent(false);
      setAccuracyConfirmation(false);
      setMarketingConsent(false);
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

  function goToConsentStep() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const fields = ["first_name", "last_name", "email"] as const;
    const allValid = fields.every((fieldName) => {
      const field = form.elements.namedItem(fieldName);
      return field instanceof HTMLInputElement ? field.reportValidity() : true;
    });

    if (!allValid) {
      return;
    }

    setFeedbackMessage("");
    setStep(2);
  }

  const consentCardClass = (selected: boolean, required = false) =>
    `group grid gap-3 rounded-[20px] border p-5 transition ${
      selected
        ? "border-[color:var(--bronze)] bg-[rgba(196,49,72,0.14)] text-[color:var(--chalk)]"
        : "border-white/10 bg-[rgba(63,24,32,0.22)] text-[color:var(--fog)] hover:border-white/20 hover:bg-[rgba(63,24,32,0.34)]"
    } ${required && !selected && submitState === "error" ? "border-red-300/70" : ""}`;

  return (
    <form
      ref={formRef}
      id="trial-form"
      className="panel-dark grid gap-6 p-6 sm:p-8"
      data-ingenium-submit="portal"
      data-form-slug="contact"
      data-ingenium-form-label="Contact Form"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
          <span className={step === 1 ? "text-[color:var(--bronze)]" : ""}>Step 1 of 2</span>
          <span className="h-px flex-1 bg-white/10" />
          <span className={step === 2 ? "text-[color:var(--bronze)]" : ""}>Step 2 of 2</span>
        </div>
        <div>
          <p className="eyebrow">{step === 1 ? "Get In Touch" : "Almost There"}</p>
          <h3 className="font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
            {step === 1 ? "Contact the academy directly." : "Now the boring but important GDPR stuff!"}
          </h3>
        </div>
        <p className="text-base leading-7 text-[color:var(--fog)]">
          {step === 1
            ? "Tell the academy who you are and what you need help with first. Then you can confirm how they are allowed to use your details."
            : "Choose your consent options below so the academy can respond properly and keep your enquiry compliant."}
        </p>
        <p className="text-sm text-[color:var(--fog)]">Fields marked with * are required.</p>
      </div>

      {step === 1 ? (
        <div className="grid gap-5">
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
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-[20px] border border-white/10 bg-[rgba(63,24,32,0.28)] p-5 text-sm leading-7 text-[color:var(--fog)]">
            Your information will only be used to reply to this enquiry unless you separately opt in to
            updates.
          </div>

          <label className={consentCardClass(privacyConsent, true)}>
            <input
              className="sr-only"
              name="privacy_consent"
              type="checkbox"
              checked={privacyConsent}
              onChange={(event) => setPrivacyConsent(event.target.checked)}
              required
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">
                  Response Consent*
                </p>
                <p className="mt-2 text-sm leading-7">
                  I consent to Attic Jiu Jitsu using my details to respond to my enquiry.
                </p>
              </div>
              <span className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border ${privacyConsent ? "border-[color:var(--bronze)] bg-[color:var(--bronze)] text-white" : "border-white/20 text-transparent"}`}>
                ✓
              </span>
            </div>
          </label>

          <label className={consentCardClass(accuracyConfirmation, true)}>
            <input
              className="sr-only"
              name="accuracy_confirmation"
              type="checkbox"
              checked={accuracyConfirmation}
              onChange={(event) => setAccuracyConfirmation(event.target.checked)}
              required
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">
                  Accuracy Confirmation*
                </p>
                <p className="mt-2 text-sm leading-7">
                  I confirm the information I have provided is accurate and I am happy to be contacted
                  about this enquiry.
                </p>
              </div>
              <span className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border ${accuracyConfirmation ? "border-[color:var(--bronze)] bg-[color:var(--bronze)] text-white" : "border-white/20 text-transparent"}`}>
                ✓
              </span>
            </div>
          </label>

          <label className={consentCardClass(marketingConsent)}>
            <input
              className="sr-only"
              name="marketing_consent"
              type="checkbox"
              value="yes"
              checked={marketingConsent}
              onChange={(event) => setMarketingConsent(event.target.checked)}
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">
                  Optional Updates
                </p>
                <p className="mt-2 text-sm leading-7">
                  I would also like to receive occasional updates about classes, memberships, and academy
                  news.
                </p>
              </div>
              <span className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border ${marketingConsent ? "border-[color:var(--bronze)] bg-[color:var(--bronze)] text-white" : "border-white/20 text-transparent"}`}>
                ✓
              </span>
            </div>
          </label>
        </div>
      )}

      <input type="hidden" name="utm_Campaign" />
      <input type="hidden" name="utm_Source" />
      <input type="hidden" name="utm_Medium" />
      <input type="hidden" name="utm_Content" />
      <input type="hidden" name="utm_Term" />
      <input type="hidden" name="CID" />
      <input type="hidden" name="Submission URL" />

      <div className="flex flex-wrap gap-3">
        {step === 1 ? (
          <>
            <button type="button" className="button-primary w-full sm:w-fit" onClick={goToConsentStep}>
              Continue To Consent
            </button>
            <a href={site.phoneHref} className="button-secondary w-full sm:w-fit">
              Call {site.phone}
            </a>
          </>
        ) : (
          <>
            <button type="button" className="button-secondary w-full sm:w-fit" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="submit" className="button-primary w-full sm:w-fit" disabled={submitState === "submitting"}>
              {submitState === "submitting" ? "Sending..." : "Send Enquiry"}
            </button>
          </>
        )}
      </div>

      {feedbackMessage ? (
        <p className={submitState === "success" ? "text-sm text-[color:var(--bronze)]" : "text-sm text-red-300"}>
          {feedbackMessage}
        </p>
      ) : null}
    </form>
  );
}
