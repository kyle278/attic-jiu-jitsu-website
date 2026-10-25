"use client";

import { useEffect, useMemo, useState } from "react";

import {
  cancelBooking,
  createBooking,
  fetchMemberSummary,
  requestMemberAccess,
  type MemberSummaryResponse,
  verifyMemberAccess,
} from "@/lib/gym-api-client";
import type { GymSyncClassSession } from "@/lib/gym-data";

type GymMemberPortalProps = {
  bookingPolicy: string;
  emptyScheduleMessage: string;
  membershipCopy: string;
  scheduleHeading: string;
  sessions: GymSyncClassSession[];
  showSchedule: boolean;
};

const STORAGE_KEY = "attic-gym-access-token";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function groupSessionsByDay(sessions: GymSyncClassSession[]) {
  const formatter = new Intl.DateTimeFormat("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const grouped = new Map<string, { label: string; sessions: GymSyncClassSession[] }>();

  for (const session of [...sessions].sort((left, right) => left.starts_at.localeCompare(right.starts_at))) {
    const key = session.starts_at.slice(0, 10);
    const current = grouped.get(key);

    if (current) {
      current.sessions.push(session);
      continue;
    }

    grouped.set(key, {
      label: formatter.format(new Date(session.starts_at)),
      sessions: [session],
    });
  }

  return Array.from(grouped.entries()).map(([dateKey, value]) => ({
    dateKey,
    label: value.label,
    sessions: value.sessions,
  }));
}

export function GymMemberPortal({
  bookingPolicy,
  emptyScheduleMessage,
  membershipCopy,
  scheduleHeading,
  sessions,
  showSchedule,
}: GymMemberPortalProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<MemberSummaryResponse["summary"] | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(STORAGE_KEY);
    if (!storedToken) {
      return;
    }

    setAccessToken(storedToken);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setSummary(null);
      return;
    }

    const token = accessToken;
    let ignore = false;

    async function loadSummary() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchMemberSummary(token);
        if (!ignore) {
          setSummary(response.summary);
        }
      } catch (loadError) {
        if (!ignore) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "Unable to load the member area right now.";
          setError(message);
          if (message.toLowerCase().includes("expired")) {
            window.localStorage.removeItem(STORAGE_KEY);
            setAccessToken(null);
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      ignore = true;
    };
  }, [accessToken]);

  async function refreshSummary() {
    if (!accessToken) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchMemberSummary(accessToken);
      setSummary(response.summary);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Unable to refresh the member area.",
      );
    } finally {
      setLoading(false);
    }
  }

  const groupedSessions = useMemo(() => groupSessionsByDay(sessions), [sessions]);
  const bookedSessionIds = useMemo(
    () =>
      new Set(
        (summary?.bookings ?? [])
          .filter((booking) => booking.status === "booked")
          .map((booking) => booking.gym_class_session_id),
      ),
    [summary],
  );

  async function handleRequestAccess() {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await requestMemberAccess(email);
      setRequestSent(true);
      setPreviewCode(response.preview_code ?? null);
      setNotice(
        response.delivery_mode === "preview"
          ? "Preview access mode is active because the portal email transport is not configured."
          : "Check your email for the member access code.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to request member access right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyAccess() {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await verifyMemberAccess(email, code);
      window.localStorage.setItem(STORAGE_KEY, response.access_token);
      setAccessToken(response.access_token);
      setCode("");
      setPreviewCode(null);
      setNotice("Member access unlocked for this device.");
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Unable to verify member access right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleBookSession(sessionId: string) {
    if (!accessToken) {
      setError("Request member access first, then you can book sessions here.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      await createBooking(accessToken, sessionId);
      const response = await fetchMemberSummary(accessToken);
      setSummary(response.summary);
      setNotice("Booking confirmed.");
    } catch (bookingError) {
      setError(
        bookingError instanceof Error
          ? bookingError.message
          : "Unable to create the booking right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    if (!accessToken) {
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      await cancelBooking(accessToken, bookingId);
      const response = await fetchMemberSummary(accessToken);
      setSummary(response.summary);
      setNotice("Booking cancelled.");
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel the booking right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    window.localStorage.removeItem(STORAGE_KEY);
    setAccessToken(null);
    setSummary(null);
    setNotice("Signed out of the member area on this device.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div id="member-area" className="panel-dark p-6 sm:p-8">
        <p className="eyebrow">Member Area</p>
        <h3 className="mt-3 font-heading text-4xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
          Stay inside the Attic site for access, plans, and bookings.
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--fog)]">
          {membershipCopy}
        </p>

        <div className="mt-6 grid gap-4">
          {!accessToken ? (
            <>
              <div className="rounded-[20px] border border-white/10 bg-[rgba(62,25,34,0.34)] p-5">
                <div className="flex flex-col gap-3">
                  <label className="text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
                    Member Email
                  </label>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="field"
                    placeholder="you@example.com"
                    type="email"
                  />
                  <button
                    type="button"
                    className="button-primary w-full sm:w-fit"
                    onClick={() => void handleRequestAccess()}
                    disabled={loading || !email.trim()}
                  >
                    {loading ? "Sending..." : "Request Member Access"}
                  </button>
                </div>
              </div>

              {requestSent ? (
                <div className="rounded-[20px] border border-white/10 bg-[rgba(19,17,18,0.8)] p-5">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
                      Access Code
                    </label>
                    <input
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      className="field"
                      placeholder="Enter the code from your email"
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      className="button-secondary w-full sm:w-fit"
                      onClick={() => void handleVerifyAccess()}
                      disabled={loading || !code.trim()}
                    >
                      {loading ? "Checking..." : "Unlock Member Area"}
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-[20px] border border-white/10 bg-[rgba(62,25,34,0.34)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
                    Signed In
                  </p>
                  <h4 className="mt-2 font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
                    {summary?.member.first_name || summary?.member.email || "Member"}
                  </h4>
                  <p className="mt-2 text-sm text-[color:var(--fog)]">
                    {summary?.member.email ?? "Loading your member details..."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => void refreshSummary()}
                    disabled={loading}
                  >
                    Refresh
                  </button>
                  <button type="button" className="button-primary" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {notice ? (
            <div className="rounded-[20px] border border-white/10 bg-[rgba(33,59,44,0.46)] p-4 text-sm text-[color:var(--chalk)]">
              {notice}
            </div>
          ) : null}

          {previewCode ? (
            <div className="rounded-[20px] border border-dashed border-[rgba(196,49,72,0.5)] bg-[rgba(83,22,35,0.42)] p-4 text-sm text-[color:var(--chalk)]">
              Preview code: <span className="font-semibold">{previewCode}</span>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[20px] border border-[rgba(196,49,72,0.52)] bg-[rgba(83,22,35,0.42)] p-4 text-sm text-[color:var(--chalk)]">
              {error}
            </div>
          ) : null}

          {summary ? (
            <div className="grid gap-4">
              <div className="rounded-[20px] border border-white/10 bg-[rgba(19,17,18,0.8)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
                  Active Memberships
                </p>
                <div className="mt-4 grid gap-3">
                  {summary.memberships.length === 0 ? (
                    <p className="text-sm text-[color:var(--fog)]">
                      No active membership is linked yet.
                    </p>
                  ) : (
                    summary.memberships.map((membership) => (
                      <div
                        key={membership.id}
                        className="rounded-[18px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-heading text-2xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
                              {membership.plan?.name ?? "Membership"}
                            </div>
                            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
                              {membership.status} · starts {formatDateTime(membership.starts_at)}
                            </div>
                          </div>
                          <div className="text-sm text-[color:var(--fog)]">
                            {membership.remaining_credits == null
                              ? "Unlimited access"
                              : `${membership.remaining_credits} credits left`}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-[rgba(19,17,18,0.8)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
                  Recent Bookings
                </p>
                <div className="mt-4 grid gap-3">
                  {summary.bookings.length === 0 ? (
                    <p className="text-sm text-[color:var(--fog)]">
                      No recent bookings yet.
                    </p>
                  ) : (
                    summary.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-[18px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-heading text-xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
                              {booking.status === "cancelled" ? "Cancelled Session" : "Booked Session"}
                            </div>
                            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
                              {formatDateTime(booking.booked_at)}
                            </div>
                          </div>
                          {booking.status === "booked" ? (
                            <button
                              type="button"
                              className="button-secondary"
                              onClick={() => void handleCancelBooking(booking.id)}
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div id="live-schedule" className="panel-light p-6 sm:p-8">
        <p className="eyebrow">Live Schedule</p>
        <h3 className="mt-3 font-heading text-4xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
          {scheduleHeading}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--fog)]">
          {bookingPolicy}
        </p>

        {!showSchedule ? (
          <div className="mt-6 rounded-[20px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-5 text-[color:var(--fog)]">
            Use the classes page for the live timetable and booking buttons once the portal schedule is synced.
          </div>
        ) : groupedSessions.length === 0 ? (
          <div className="mt-6 rounded-[20px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-5 text-[color:var(--fog)]">
            {emptyScheduleMessage}
          </div>
        ) : (
          <div className="mt-6 grid gap-5">
            {groupedSessions.map((day) => (
              <section key={day.dateKey} className="rounded-[20px] border border-white/10 bg-[rgba(19,17,18,0.8)] p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--fog)]">
                      Upcoming Sessions
                    </p>
                    <h4 className="mt-2 font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
                      {day.label}
                    </h4>
                  </div>
                  <div className="text-sm text-[color:var(--fog)]">
                    {day.sessions.length} published session{day.sessions.length === 1 ? "" : "s"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {day.sessions.map((session) => {
                    const alreadyBooked = bookedSessionIds.has(session.id);

                    return (
                      <article
                        key={session.id}
                        className="rounded-[18px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-2">
                            <div className="font-heading text-2xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
                              {session.class_name}
                            </div>
                            <div className="text-sm uppercase tracking-[0.16em] text-[color:var(--fog)]">
                              {formatDateTime(session.starts_at)} · {session.duration_minutes} min
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--fog)]">
                              {session.category_label ? (
                                <span className="rounded-full border border-white/10 px-3 py-1">
                                  {session.category_label}
                                </span>
                              ) : null}
                              {session.coach_name ? (
                                <span className="rounded-full border border-white/10 px-3 py-1">
                                  Coach {session.coach_name}
                                </span>
                              ) : null}
                              {session.location_name ? (
                                <span className="rounded-full border border-white/10 px-3 py-1">
                                  {session.location_name}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex min-w-[16rem] flex-col items-start gap-3 lg:items-end">
                            <div className="text-sm text-[color:var(--fog)]">
                              {session.remaining_spots > 0
                                ? `${session.remaining_spots} of ${session.capacity} spots left`
                                : "Currently full"}
                            </div>
                            <button
                              type="button"
                              className="button-primary w-full sm:w-fit"
                              onClick={() => void handleBookSession(session.id)}
                              disabled={
                                loading ||
                                !accessToken ||
                                alreadyBooked ||
                                session.remaining_spots <= 0
                              }
                            >
                              {!accessToken
                                ? "Unlock Member Area First"
                                : alreadyBooked
                                  ? "Already Booked"
                                  : session.remaining_spots <= 0
                                    ? "Session Full"
                                    : "Book This Session"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
