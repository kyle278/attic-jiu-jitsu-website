"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/site-data";
import { submitPortalEnquiry } from "@/portal/enquiry";
import {
  attributionFields,
  readAttribution,
} from "@/components/public-attribution";

type Step = 1 | 2 | 3;
type SubmitState = "idle" | "submitting" | "success" | "error";
const interests = [
  {
    id: "beginner",
    title: "New to jiu jitsu",
    detail: "Find your first class",
    label: "Adult beginner",
  },
  {
    id: "training",
    title: "Already training",
    detail: "Gi, no-gi and mixed levels",
    label: "Adult gi or no-gi training",
  },
  {
    id: "youth",
    title: "Kids & teens",
    detail: "Ask as a parent or guardian",
    label: "Kids or teens classes",
  },
  {
    id: "question",
    title: "Something else",
    detail: "Memberships or another question",
    label: "Membership advice or another question",
  },
];
function InterestIcon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    beginner: "M4 5h16v14H4z M8 5v14 M4 10h16 M12 14h4",
    training: "M8 3l4 3 4-3 5 5-3 3-2-2v12H8V9l-2 2-3-3z M8 15h8 M9 6l3 7 3-7",
    youth:
      "M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M2 20v-3c0-3 3-5 6-5s6 2 6 5v3 M16 13c3 0 6 2 6 5v2",
    question: "M4 4h16v13H9l-5 4z M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4 M12 15h.01",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[kind]} />
    </svg>
  );
}

export function ContactForm({ planNames }: { planNames: string[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const receiptRef = useRef<HTMLHeadingElement>(null);
  const stepRef = useRef<Step>(1);
  const submissionLock = useRef(false);
  const query = useSearchParams().toString();
  const [step, setStep] = useState<Step>(1);
  const [interest, setInterest] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [privacy, setPrivacy] = useState(false);
  const [accuracy, setAccuracy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const titleBeforeForm = useRef("");

  function showStep(next: Step) {
    stepRef.current = next;
    setStep(next);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      document.title = `${next === 1 ? "Your training" : next === 2 ? "Your details" : "Your choices"} | Attic Jiu Jitsu`;
    });
  }
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    if (!titleBeforeForm.current) titleBeforeForm.current = document.title;
    const url = new URL(window.location.href);
    function syncAttribution() {
      if (!form) return;
      const stored = readAttribution();
      let allowed = false;
      try {
        allowed =
          localStorage.getItem("attic-analytics-consent-v1") === "accepted";
      } catch {}
      for (const [field, param] of Object.entries(attributionFields)) {
        const input = form.elements.namedItem(field);
        if (input instanceof HTMLInputElement)
          input.value = allowed
            ? (url.searchParams.get(param) ?? stored[field] ?? "")
            : "";
      }
    }
    syncAttribution();
    window.addEventListener("attic:consent-changed", syncAttribution);
    const submissionUrl = form.elements.namedItem("Submission URL");
    if (submissionUrl instanceof HTMLInputElement)
      submissionUrl.value = window.location.href;
    const message = form.elements.namedItem("message");
    const plan = url.searchParams.get("plan");
    if (
      plan &&
      planNames.includes(plan) &&
      message instanceof HTMLTextAreaElement
    ) {
      const prompt = `I’d like to ask about ${plan}.`;
      if (!message.value.includes(prompt))
        message.value = message.value
          ? `${message.value}\n\n${prompt}`
          : prompt;
    }
    const submitting = () => {
      submissionLock.current = true;
      setSubmitState("submitting");
      setFeedback("");
    };
    const error = (event: Event) => {
      const detail: unknown =
        event instanceof CustomEvent ? event.detail : null;
      submissionLock.current = false;
      setSubmitState("error");
      setFeedback(
        detail &&
          typeof detail === "object" &&
          "message" in detail &&
          typeof detail.message === "string"
          ? detail.message
          : "We couldn’t send your enquiry. Your answers are still here. Try again or call the academy.",
      );
    };
    const success = () => {
      const hidden = Array.from(
        form.querySelectorAll<HTMLInputElement>('input[type="hidden"]'),
      ).map((input) => [input, input.value] as const);
      form.reset();
      hidden.forEach(([input, value]) => {
        input.value = value;
      });
      submissionLock.current = false;
      stepRef.current = 1;
      setStep(1);
      setInterest(null);
      setPrivacy(false);
      setAccuracy(false);
      setMarketing(false);
      setFieldErrors({});
      setSubmitState("success");
      setFeedback(
        "Your enquiry has been sent. The academy will email you about the next steps. This does not reserve a class.",
      );
      document.title = titleBeforeForm.current;
      requestAnimationFrame(() => receiptRef.current?.focus());
    };
    form.addEventListener("ingenium:form-submitting", submitting);
    form.addEventListener("ingenium:form-error", error);
    form.addEventListener("ingenium:form-success", success);
    return () => {
      window.removeEventListener("attic:consent-changed", syncAttribution);
      form.removeEventListener("ingenium:form-submitting", submitting);
      form.removeEventListener("ingenium:form-error", error);
      form.removeEventListener("ingenium:form-success", success);
    };
  }, [query, planNames]);

  function chooseInterest(id: string) {
    if (stepRef.current !== 1) return;
    const selected = interests.find((item) => item.id === id)!;
    const message = formRef.current?.elements.namedItem("message");
    if (message instanceof HTMLTextAreaElement) {
      const previous = interests.find((item) => item.id === interest);
      const prefix = previous
        ? `Training interest: ${previous.label}.\n\n`
        : "";
      const remaining =
        prefix && message.value.startsWith(prefix)
          ? message.value.slice(prefix.length)
          : message.value;
      message.value = `Training interest: ${selected.label}.\n\n${remaining}`;
    }
    setInterest(id);
    setFeedback("");
    showStep(2);
  }
  function validateDetails() {
    const form = formRef.current;
    const errors: Record<string, string> = {};
    for (const name of ["first_name", "last_name", "email"]) {
      const input = form?.elements.namedItem(name);
      if (
        input instanceof HTMLInputElement &&
        (!input.value.trim() || !input.checkValidity())
      )
        errors[name] =
          name === "email"
            ? "Enter a valid email address so we can reply."
            : `Enter your ${name === "first_name" ? "first" : "last"} name.`;
    }
    setFieldErrors(errors);
    return errors;
  }
  function continueFromDetails() {
    const errors = validateDetails();
    const name = Object.keys(errors)[0];
    if (name) {
      const input = formRef.current?.elements.namedItem(name);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    setFeedback("");
    showStep(3);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    if (submissionLock.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const stop = () => {
      event.preventDefault();
      event.stopPropagation();
    };
    if (!interest) {
      stop();
      showStep(1);
      return;
    }
    const errors = validateDetails();
    if (Object.keys(errors).length) {
      stop();
      showStep(2);
      requestAnimationFrame(() => {
        const input = formRef.current?.elements.namedItem(
          Object.keys(errors)[0],
        );
        if (input instanceof HTMLInputElement) input.focus();
      });
      return;
    }
    if (step !== 3) {
      stop();
      continueFromDetails();
      return;
    }
    if (!privacy || !accuracy) {
      stop();
      setFeedback(
        "Please acknowledge the privacy policy and confirm your details. Marketing updates are optional.",
      );
      const input = formRef.current?.elements.namedItem(
        !privacy ? "privacy_consent" : "accuracy_confirmation",
      );
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    stop();
    submissionLock.current = true;
    const form = event.currentTarget;
    form.dispatchEvent(new CustomEvent("ingenium:form-submitting"));
    void submitPortalEnquiry(form)
      .then((receipt) => {
        form.dispatchEvent(
          new CustomEvent("ingenium:form-success", { detail: receipt }),
        );
      })
      .catch((error: unknown) => {
        form.dispatchEvent(
          new CustomEvent("ingenium:form-error", {
            detail: {
              message:
                error instanceof Error
                  ? error.message
                  : "Your enquiry could not be sent. Please try again.",
            },
          }),
        );
      });
  }
  const question =
    step === 1
      ? "Where do you want to start?"
      : step === 2
        ? "How can we reach you?"
        : "Your privacy. Your choice.";
  return (
    <form
      ref={formRef}
      id="trial-form"
      className="enquiry-form guided-enquiry"
      noValidate
      onSubmitCapture={submit}
      aria-busy={submitState === "submitting"}
      data-ingenium-submit="attic"
      data-form-slug="contact"
      data-ingenium-form-label="Contact Form"
    >
      <div hidden aria-hidden="true">
        <label>
          Website URL
          <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-receipt" hidden={submitState !== "success"}>
        <p className="section-note">Enquiry received</p>
        <h3 ref={receiptRef} tabIndex={-1}>
          Thanks for getting in touch.
        </h3>
        <p role="status">{submitState === "success" ? feedback : ""}</p>
        <button
          type="button"
          className="button-primary"
          onClick={() => {
            setSubmitState("idle");
            setFeedback("");
            showStep(1);
          }}
        >
          Send another enquiry
        </button>
      </div>
      <div className="form-journey" hidden={submitState === "success"}>
        <div className="form-progress" aria-label={`Step ${step} of 3`}>
          <span className={step === 1 ? "current" : ""}>01 Training</span>
          <span className={step === 2 ? "current" : ""}>02 Details</span>
          <span className={step === 3 ? "current" : ""}>03 Consent</span>
        </div>
        <div className="form-heading">
          <h3 ref={headingRef} tabIndex={-1}>
            {question}
          </h3>
          <p>
            {step === 1
              ? "Choose one to continue. We’ll ask for your email so the team can help with the next step."
              : step === 2
                ? interest === "youth"
                  ? "Use a parent or guardian’s details. We’ll reply by email; no child’s personal details are needed."
                  : "We’ll reply by email to help with your class or membership enquiry."
                : "Read the privacy policy and choose whether you’d like occasional email updates."}
          </p>
        </div>
        <div hidden={step !== 1} className="form-step-content" key="training">
          <div className="interest-grid" aria-label="Training interest">
            {interests.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`interest-card${interest === item.id ? " selected" : ""}`}
                onKeyDown={(event) => {
                  if (event.repeat) event.preventDefault();
                }}
                onClick={(event) => {
                  if (event.detail <= 1) chooseInterest(item.id);
                }}
              >
                <InterestIcon kind={item.id} />
                <span>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </span>
                <span className="choice-indicator" aria-hidden="true"></span>
              </button>
            ))}
          </div>
          {interest ? (
            <button
              type="button"
              className="text-link reuse-interest"
              onClick={() => showStep(2)}
            >
              Continue with my choice
            </button>
          ) : null}
          <p className="form-explanation">
            An enquiry helps us plan your visit. It does not book a class.
          </p>
        </div>
        <div hidden={step !== 2} className="form-step-content" key="details">
          <div
            className="form-fields"
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                event.target instanceof HTMLInputElement &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                continueFromDetails();
              }
            }}
          >
            <div className="form-field-row">
              {(
                [
                  ["first_name", "First name", "given-name"],
                  ["last_name", "Last name", "family-name"],
                ] as const
              ).map(([name, label, complete]) => (
                <div key={name} className="form-field">
                  <label htmlFor={"enquiry-" + name}>{label} *</label>
                  <input
                    id={"enquiry-" + name}
                    className="field"
                    name={name}
                    autoComplete={complete}
                    required
                    aria-invalid={!!fieldErrors[name]}
                    aria-describedby={
                      fieldErrors[name] ? name + "-error" : undefined
                    }
                  />
                  {fieldErrors[name] ? (
                    <span className="field-error" id={name + "-error"}>
                      {fieldErrors[name]}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="form-field">
              <label htmlFor="enquiry-email">Email *</label>
              <input
                id="enquiry-email"
                className="field"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={!!fieldErrors.email}
                aria-describedby={
                  fieldErrors.email ? "email-error" : "email-help"
                }
              />
              {fieldErrors.email ? (
                <span className="field-error" id="email-error">
                  {fieldErrors.email}
                </span>
              ) : (
                <span className="field-help" id="email-help">
                  For the academy’s reply to your enquiry.
                </span>
              )}
            </div>
            <details className="optional-phone">
              <summary>
                Add a phone number <span>Optional</span>
              </summary>
              <label>
                Phone number
                <input
                  className="field"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
                <span className="field-help">
                  Add a number if the team may call about this enquiry.
                </span>
              </label>
            </details>
            <label>
              Anything you’d like us to know?{" "}
              <span className="optional-label">Optional</span>
              <textarea
                className="field"
                name="message"
                rows={3}
                placeholder="Ask about a class, a plan or your first visit."
              />
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="text-link"
              onClick={() => showStep(1)}
            >
              Back
            </button>
            <button
              type="button"
              className="button-primary"
              onClick={continueFromDetails}
            >
              Continue
            </button>
          </div>
        </div>
        <div hidden={step !== 3} className="form-step-content" key="consent">
          <div className="consent-fields">
            <div className={`consent-card${privacy ? " selected" : ""}`}>
              <label>
                <input
                  name="privacy_consent"
                  type="checkbox"
                  checked={privacy}
                  onChange={(event) => setPrivacy(event.target.checked)}
                  required
                />
                <span>
                  <strong>
                    Privacy policy <small>Required</small>
                  </strong>
                  <span>
                    I’ve read the privacy policy and consent to Attic Jiu Jitsu
                    using my details to reply to this enquiry.
                  </span>
                </span>
              </label>
              <Link href="/privacy-policy" target="_blank" rel="noreferrer">
                Read the privacy policy
              </Link>
            </div>
            <div className={`consent-card${marketing ? " selected" : ""}`}>
              <label>
                <input
                  name="marketing_consent"
                  type="checkbox"
                  value="yes"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
                <span>
                  <strong>
                    Academy updates <small>Optional</small>
                  </strong>
                  <span>
                    Email me occasional news about classes, memberships and
                    Attic. I can withdraw at any time.
                  </span>
                </span>
              </label>
            </div>
            <label className="accuracy-choice">
              <input
                name="accuracy_confirmation"
                type="checkbox"
                checked={accuracy}
                onChange={(event) => setAccuracy(event.target.checked)}
                required
              />
              <span>
                I confirm my details are accurate and I’m happy to be contacted
                about this enquiry. *
              </span>
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="text-link"
              onClick={() => showStep(2)}
            >
              Back
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={submitState === "submitting"}
            >
              {submitState === "submitting"
                ? "Sending enquiry…"
                : "Send enquiry"}
            </button>
          </div>
          <p className="form-explanation">
            The academy will confirm any class arrangements with you.
          </p>
        </div>
        {Object.keys(attributionFields).map((name) => (
          <input type="hidden" name={name} key={name} />
        ))}
        <input type="hidden" name="Submission URL" />
        <p
          className={`form-feedback ${submitState}`}
          role="status"
          aria-live="polite"
        >
          {submitState !== "success" ? feedback : ""}
        </p>
      </div>
      <a href={site.phoneHref} className="form-call">
        Prefer to talk? {site.phone}
      </a>
      <noscript>
        <p className="form-explanation">
          The guided form needs JavaScript. Please call or email the academy to
          enquire.
        </p>
      </noscript>
    </form>
  );
}
