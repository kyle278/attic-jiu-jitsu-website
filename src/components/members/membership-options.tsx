"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MemberPlan } from "@/lib/member-plans";

export function MembershipOptions() {
  const [plans, setPlans] = useState<MemberPlan[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [audience, setAudience] = useState("");
  const [selected, setSelected] = useState<MemberPlan | null>(null);
  const controller = useRef<AbortController | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const load = useCallback(async () => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/members/plans", { cache: "no-store", signal: request.signal });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      if (!request.signal.aborted) setPlans(payload.plans);
    } catch (cause) {
      if (!request.signal.aborted)
        setError(cause instanceof Error ? cause.message : "Memberships could not be loaded. Please try again.");
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
    return () => controller.current?.abort();
  }, [load]);
  useEffect(() => {
    if (!selected) return;
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, [selected]);
  const groups = [...new Set((plans ?? []).map((plan) => plan.audience))];
  const visible = (plans ?? []).filter((plan) => !audience || plan.audience === audience);
  return (
    <section className="memberPlanCatalogue" aria-labelledby="membership-options-heading">
      <div className="memberPlanCatalogueHeading">
        <div>
          <h2 id="membership-options-heading">Explore memberships</h2>
          <p className="memberMuted">Find the right plan for your training, from first classes to family memberships.</p>
        </div>
        <div className="memberPlanCatalogueActions">
        <label className="memberFilter">
          Memberships for
          <select aria-label="Memberships for" value={audience} onChange={(event) => setAudience(event.target.value)}>
            <option value="">Everyone</option>
            {groups.map((group) => <option key={group}>{group}</option>)}
          </select>
        </label>
        <button className="memberButton memberQuiet" onClick={() => void load()} disabled={loading}>Refresh plans</button>
        </div>
      </div>
      <div className="memberPlanPaymentNotice">
        <strong>Online purchasing is being set up</strong>
        <p>You can browse every membership below. To join or change your plan today, <a href="tel:+353858447393">contact the academy</a>.</p>
      </div>
      {loading && <p className="memberMuted" role="status">Getting your membership options ready…</p>}
      {error && <div className="memberError" role="alert"><p>{error}</p><button className="memberButton memberQuiet" onClick={() => void load()} disabled={loading}>Try again</button></div>}
      {!error && plans && <>
        <p className="memberMuted">{visible.length} {visible.length === 1 ? "membership" : "memberships"}{audience ? ` · ${audience}` : " available"}</p>
        <div className="memberPlanGrid">
          {visible.map((plan) => <article className="memberPlanCard" key={plan.id}>
            <span className="memberBadge">{plan.audience}</span>
            <h3>{plan.name}</h3>
            <p className="memberPlanPrice">{plan.price}</p>
            <p className="memberMuted memberPlanBenefits">{plan.description}</p>
            <button className="memberButton memberQuiet" onClick={() => setSelected(plan)} aria-label={`View ${plan.name}`}>View plan <span aria-hidden="true">→</span></button>
          </article>)}
        </div>
        {!plans.length && <div className="memberEmpty"><h3>No memberships available yet</h3><p>The academy will publish its membership options here.</p></div>}
      </>}
      {selected && <dialog ref={dialog} className="memberDialog" aria-labelledby="membership-review-title" onCancel={() => setSelected(null)}>
        <div className="memberDialogHead"><h2 id="membership-review-title">{selected.name}</h2><button className="memberButton memberQuiet" onClick={() => setSelected(null)} aria-label="Close membership details">✕</button></div>
        <span className="memberBadge">{selected.audience}</span>
        <p className="memberPlanPrice">{selected.price}</p>
        <p>{selected.description}</p>
        <div className="memberPlanPaymentNotice">
          <strong>Online purchasing isn’t available yet</strong>
          <p>Contact the academy to arrange this membership and confirm who it covers, its start date and payment terms.</p>
        </div>
        <button className="memberButton memberPrimary" disabled>Purchase membership · coming soon</button>
        <a className="memberButton memberQuiet" href="tel:+353858447393">Contact the academy</a>
        <p className="memberFootnote">Viewing a plan doesn’t change your current membership or make a payment.</p>
      </dialog>}
    </section>
  );
}
