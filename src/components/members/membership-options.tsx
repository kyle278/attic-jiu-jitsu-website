"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MemberPlan } from "@/lib/member-plans";
import { MemberError, request } from "@/lib/member-request";

type Purchase = {
  id: string;
  plan_id: string;
  name: string;
  status: string;
  paid_until: string | null;
  recurring: boolean;
  can_manage: boolean;
};
type Catalogue = {
  plans: MemberPlan[];
  purchasing_enabled: boolean;
  purchase: Purchase | null;
};
function message(cause: unknown) {
  if (cause instanceof MemberError && cause.status === 401)
    window.location.assign("/members");
  return cause instanceof Error ? cause.message : "Please try again.";
}
function goToStripe(url: string, origin: string) {
  if (new URL(url).origin !== origin)
    throw new Error(
      "The payment service returned an invalid address. Please contact the academy.",
    );
  window.location.assign(url);
}
export function MembershipOptions({
  onAccessChanged,
}: {
  onAccessChanged: () => Promise<void>;
}) {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  const [audience, setAudience] = useState(""),
    [selected, setSelected] = useState<MemberPlan | null>(null);
  const controller = useRef<AbortController | null>(null),
    dialog = useRef<HTMLDialogElement>(null);
  const pending = useRef<{ plan: string; key: string } | null>(null);
  const load = useCallback(async () => {
    controller.current?.abort();
    const c = new AbortController();
    controller.current = c;
    setLoading(true);
    setError("");
    try {
      const next = await request<Catalogue>("plans", {}, undefined, c.signal);
      if (!c.signal.aborted) setCatalogue(next);
    } catch (cause) {
      if (!c.signal.aborted) setError(message(cause));
    } finally {
      if (!c.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
    return () => controller.current?.abort();
  }, [load]);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("purchase");
    if (!id) return;
    const c = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined,
      attempt = 0;
    const cancelled =
      new URLSearchParams(window.location.search).get("checkout") ===
      "cancelled";
    async function check() {
      setNotice(
        cancelled
          ? "Checkout wasn’t completed. You can resume it or cancel the pending checkout below."
          : "Confirming your membership payment…",
      );
      try {
        const { purchase } = await request<{ purchase: Purchase }>(
          "checkout_status",
          { purchase_id: id },
          undefined,
          c.signal,
        );
        if (c.signal.aborted) return;
        if (purchase.status === "pending" && !cancelled && ++attempt < 10) {
          timer = setTimeout(() => void check(), 2000);
          return;
        }
        setNotice(
          purchase.status === "paid"
            ? "Payment confirmed. Your membership details have been refreshed."
            : purchase.status === "pending"
              ? "Your payment is still pending. Refresh to check again; please don’t start another purchase."
              : purchase.status === "review"
                ? "The academy needs to review this payment. Please contact the team."
                : "This checkout has finished. Review your membership options below.",
        );
        if (purchase.status === "paid") await onAccessChanged();
        if (c.signal.aborted) return;
        await load();
        const url = new URL(window.location.href);
        url.searchParams.delete("purchase");
        url.searchParams.delete("checkout");
        window.history.replaceState(null, "", url.pathname + url.search);
      } catch (cause) {
        if (!c.signal.aborted) {
          setError(message(cause));
          setNotice(
            "Payment confirmation is unavailable. Refresh to check your membership before trying another payment.",
          );
        }
      }
    }
    void check();
    return () => {
      c.abort();
      if (timer) clearTimeout(timer);
    };
  }, [load, onAccessChanged]);
  useEffect(() => {
    if (!selected) return;
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, [selected]);
  async function checkout(plan: MemberPlan) {
    if (busy || !plan.checkout?.enabled) return;
    setBusy(true);
    setError("");
    if (pending.current?.plan !== plan.id)
      pending.current = { plan: plan.id, key: crypto.randomUUID() };
    try {
      const result = await request<{ url: string }>(
        "checkout",
        { plan_id: plan.id },
        pending.current.key,
      );
      goToStripe(result.url, "https://checkout.stripe.com");
    } catch (cause) {
      setError(message(cause));
      setBusy(false);
    }
  }
  async function manage(
    action: "billing_portal" | "cancel_checkout" | "checkout_status",
  ) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await request<{ url?: string; purchase?: Purchase }>(
        action,
        catalogue?.purchase ? { purchase_id: catalogue.purchase.id } : {},
      );
      if (action === "billing_portal" && result.url) {
        goToStripe(result.url, "https://billing.stripe.com");
        return;
      }
      if (result.purchase?.status === "paid") {
        setNotice(
          "Payment confirmed. Your membership details have been refreshed.",
        );
        await onAccessChanged();
      } else
        setNotice(
          action === "cancel_checkout"
            ? "Pending checkout closed. Your current access is unchanged."
            : "Membership payment status refreshed.",
        );
      await load();
    } catch (cause) {
      setError(message(cause));
    } finally {
      setBusy(false);
    }
  }
  const plans = catalogue?.plans ?? [],
    purchase = catalogue?.purchase;
  const groups = [...new Set(plans.map((plan) => plan.audience))],
    visible = plans.filter((plan) => !audience || plan.audience === audience);
  return (
    <section
      className="memberPlanCatalogue"
      aria-labelledby="membership-options-heading"
    >
      <div className="memberPlanCatalogueHeading">
        <div>
          <h2 id="membership-options-heading">Explore memberships</h2>
          <p className="memberMuted">
            Find the right plan for your training, from first classes to family
            memberships.
          </p>
        </div>
        <div className="memberPlanCatalogueActions">
          <label className="memberFilter">
            Memberships for
            <select
              aria-label="Memberships for"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              <option value="">Everyone</option>
              {groups.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </select>
          </label>
          <button
            className="memberButton memberQuiet"
            onClick={() => void load()}
            disabled={loading || busy}
          >
            Refresh plans
          </button>
        </div>
      </div>
      {notice && (
        <p className="memberNotice" role="status">
          {notice}
        </p>
      )}
      {!catalogue?.purchasing_enabled && !loading && (
        <div className="memberPlanPaymentNotice">
          <strong>Online purchasing is being set up</strong>
          <p>
            You can browse every membership below. To join or change your plan
            today, <a href="tel:+353858447393">contact the academy</a>.
          </p>
        </div>
      )}
      {purchase && (
        <div className="memberPlanPaymentNotice">
          <strong>
            {purchase.name} ·{" "}
            {purchase.status === "past_due"
              ? "Payment needs attention"
              : purchase.status === "pending"
                ? "Checkout in progress"
                : purchase.status === "review"
                  ? "Payment under review"
                  : "Purchased membership"}
          </strong>
          <p>
            {purchase.paid_until
              ? `Paid access until ${new Date(purchase.paid_until).toLocaleDateString("en-IE", { timeZone: "Europe/Dublin" })}. `
              : ""}
            {purchase.recurring
              ? "Manage payments and cancellation securely with Stripe."
              : "Check the payment status before buying another membership."}
          </p>
          <div className="memberDialogActions">
            <button
              className="memberButton memberQuiet"
              disabled={busy}
              onClick={() => void manage("checkout_status")}
            >
              Check payment status
            </button>
            {purchase.can_manage && (
              <button
                className="memberButton memberPrimary"
                disabled={busy}
                onClick={() => void manage("billing_portal")}
              >
                Manage billing
              </button>
            )}
            {purchase.status === "pending" && (
              <button
                className="memberButton memberQuiet"
                disabled={busy}
                onClick={() => void manage("cancel_checkout")}
              >
                Cancel pending checkout
              </button>
            )}
          </div>
        </div>
      )}
      {loading && (
        <p className="memberMuted" role="status">
          Getting your membership options ready…
        </p>
      )}
      {error && !selected && (
        <div className="memberError" role="alert">
          <p>{error}</p>
          <button
            className="memberButton memberQuiet"
            onClick={() => void load()}
            disabled={loading}
          >
            Try again
          </button>
        </div>
      )}
      {!error && catalogue && (
        <>
          <p className="memberMuted">
            {visible.length}{" "}
            {visible.length === 1 ? "membership" : "memberships"}
            {audience ? ` · ${audience}` : " available"}
          </p>
          <div className="memberPlanGrid">
            {visible.map((plan) => (
              <article className="memberPlanCard" key={plan.id}>
                <span className="memberBadge">{plan.audience}</span>
                <h3>{plan.name}</h3>
                <p className="memberPlanPrice">{plan.price}</p>
                <p className="memberMuted memberPlanBenefits">
                  {plan.description}
                </p>
                <button
                  className="memberButton memberQuiet"
                  disabled={busy}
                  onClick={() => {
                    setError("");
                    setSelected(plan);
                  }}
                  aria-label={`View ${plan.name}`}
                >
                  {plan.checkout?.enabled ? "Choose plan" : "View plan"}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
          {!plans.length && (
            <div className="memberEmpty">
              <h3>No memberships available yet</h3>
              <p>The academy will publish its membership options here.</p>
            </div>
          )}
        </>
      )}
      {selected && (
        <dialog
          ref={dialog}
          className="memberDialog"
          aria-labelledby="membership-review-title"
          onCancel={(e) => {
            if (busy) e.preventDefault();
            else {
              setSelected(null);
              setError("");
            }
          }}
        >
          <div className="memberDialogHead">
            <h2 id="membership-review-title">{selected.name}</h2>
            <button
              className="memberButton memberQuiet"
              disabled={busy}
              onClick={() => {
                setSelected(null);
                setError("");
              }}
              aria-label="Close membership details"
            >
              ✕
            </button>
          </div>
          <span className="memberBadge">{selected.audience}</span>
          <p className="memberPlanPrice">{selected.price}</p>
          <p>{selected.description}</p>
          {error && (
            <p className="memberError" role="alert">
              {error}
            </p>
          )}
          <div className="memberPlanPaymentNotice">
            <strong>
              {selected.checkout?.enabled
                ? selected.checkout.billing_label
                : selected.checkout?.reason ||
                  "Online purchasing isn’t available yet"}
            </strong>
            <p>
              {selected.checkout?.enabled
                ? selected.checkout.terms
                : "Contact the academy to arrange this membership and confirm who it covers, its start date and payment terms."}
            </p>
          </div>
          {selected.checkout?.enabled && (
            <p className="memberMuted">
              This covers your own training. Paid access replaces your current
              assigned access after payment is confirmed. Any recurring charges
              are shown at Stripe Checkout.
            </p>
          )}
          <button
            className="memberButton memberPrimary"
            disabled={busy || !selected.checkout?.enabled}
            onClick={() => void checkout(selected)}
          >
            {busy
              ? "Opening secure checkout…"
              : selected.checkout?.enabled
                ? "Continue to secure checkout"
                : "Purchase membership · coming soon"}
          </button>
          {!selected.checkout?.enabled && (
            <a className="memberButton memberQuiet" href="tel:+353858447393">
              Contact the academy
            </a>
          )}
          <p className="memberFootnote">
            {selected.checkout?.enabled
              ? "Review the full payment details at Stripe before confirming your purchase."
              : "Viewing a plan doesn’t change your current membership or make a payment."}
          </p>
        </dialog>
      )}
    </section>
  );
}
