"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MemberError, request } from "@/lib/member-request";
import { MembershipOptions } from "./membership-options";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";

type Section = "timetable" | "bookings" | "membership" | "account" | "family";
type Class = {
  id: string;
  name: string;
  description: string;
  requires_membership: boolean;
  requires_payment: boolean;
};
type Session = {
  id: string;
  service_id: string;
  starts_at: string;
  ends_at: string;
  location: string;
  capacity: number;
  remaining_spots: number;
  coach: string;
  price_required: boolean;
};
type Booking = {
  id: string;
  session_id: string;
  status: string;
  session_status: string;
  name: string;
  starts_at: string;
  ends_at: string;
  location: string;
  cancel_before: string;
  self_service: boolean;
  participant_id?: string;
  participant_name?: string;
};
type Grant = {
  label: string;
  service_ids: string[];
  weekly_limit: number | null;
  starts_at: string;
  ends_at: string | null;
  status: string;
};
export type MemberData = {
  site_name: string;
  member: { name: string; email: string };
  membership: Grant | null;
  participant_id?: string;
  people?: {
    contact_id: string;
    name: string;
    role: string;
    is_self: boolean;
    household_id: string | null;
    household_name: string | null;
    membership: Grant | null;
  }[];
  booking_window_hours: number;
  classes: Class[];
  sessions: Session[];
  bookings: Booking[];
};
const dateKey = (date: string | Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
const time = (date: string) =>
  new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(date));
const shortDate = (date: string) =>
  new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
const shiftDay = (day: string, amount: number) =>
  new Date(Date.parse(day + "T12:00:00Z") + amount * 86400000)
    .toISOString()
    .slice(0, 10);
const nav: { key: Section; label: string; icon: string }[] = [
  { key: "timetable", label: "Timetable", icon: "calendar" },
  { key: "bookings", label: "My bookings", icon: "check" },
  { key: "membership", label: "Membership", icon: "card" },
  { key: "family", label: "Family", icon: "person" },
  { key: "account", label: "Account", icon: "person" },
];
function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2" />
      </>
    ),
    check: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="m7 12 3 3 7-7" />
      </>
    ),
    card: (
      <>
        <rect x="2" y="5" width="20" height="15" rx="3" />
        <path d="M2 10h20m-15 5h4" />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    arrow: <path d="m9 5 7 7-7 7" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
    logout: (
      <>
        <path d="M10 3H4v18h6m4-15 6 6-6 6m-6-6h12" />
      </>
    ),
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.calendar}
    </svg>
  );
}
function Brand() {
  return (
    <div className="memberBrand">
      <Image
        src="/images/logo.png"
        alt="Attic Jiu Jitsu"
        width={40}
        height={40}
        priority
      />
      <span>
        <strong>Attic Jiu Jitsu</strong>
        <small>Member app</small>
      </span>
    </div>
  );
}
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
const standaloneSnapshot = () =>
  window.matchMedia("(display-mode: standalone)").matches;
const standaloneSubscribe = (notify: () => void) => {
  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
function Install() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null),
    [help, setHelp] = useState(false),
    [installed, setInstalled] = useState(false);
  const standalone = useSyncExternalStore(
    standaloneSubscribe,
    standaloneSnapshot,
    () => false,
  );
  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const done = () => {
      setInstalled(true);
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", done);
    if ("serviceWorker" in navigator)
      void navigator.serviceWorker
        .register("/members/sw.js", { scope: "/members/" })
        .catch(() => {});
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", done);
    };
  }, []);
  if (installed || standalone)
    return <span className="memberMuted">Installed on this device</span>;
  return (
    <>
      <button
        className="memberButton memberQuiet"
        onClick={async () => {
          if (prompt) {
            await prompt.prompt();
            await prompt.userChoice;
            setPrompt(null);
          } else setHelp(!help);
        }}
      >
        <Icon name="download" />
        Add to home screen
      </button>
      {help && (
        <p className="memberInstallHelp">
          On iPhone or iPad, open this link in Safari, tap Share, then Add to
          Home Screen. On Android, use your browser menu and choose Install app
          or Add to Home Screen.
        </p>
      )}
    </>
  );
}
function Modal({
  children,
  title,
  onClose,
  busy,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  busy: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="memberDialog"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="memberDialogHead">
        <h2>{title}</h2>
        <button
          className="memberButton memberQuiet"
          disabled={busy}
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}
type TestSignin = { email: string; challenge: string; expires_at: string };
function Login({
  onSignedIn,
  testSignin,
}: {
  onSignedIn: () => void;
  testSignin: TestSignin | null;
}) {
  const [email, setEmail] = useState(testSignin?.email ?? ""),
    [challenge, setChallenge] = useState(testSignin?.challenge ?? ""),
    [testing, setTesting] = useState(Boolean(testSignin)),
    [code, setCode] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!remaining) return;
    const timer = setTimeout(() => setRemaining(remaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);
  async function send(event?: FormEvent) {
    event?.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await request<{ challenge: string; testing?: boolean }>(
        "request_code",
        {
          email,
        },
      );
      setChallenge(result.challenge);
      setTesting(Boolean(result.testing));
      setRemaining(60);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Code could not be sent.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function verify(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await request("verify_code", { challenge, code });
      setCode("");
      onSignedIn();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="memberLoginPage">
      <header className="memberLoginHeader">
        <Brand />
        <span className="memberBadge">Members only</span>
      </header>
      <main className="memberLoginMain">
        <div className="memberLoginIntro">
          <span className="memberAccentLine" />
          <h1>
            Your training. <br />
            Your space.
          </h1>
          <p>
            Book your next class, keep track of your sessions and see your
            membership — all in one place.
          </p>
          <div className="memberLoginNote">
            <Icon name="calendar" />
            <span>
              Built for the way you train.
              <br />
              <strong>Ready whenever you are.</strong>
            </span>
          </div>
        </div>
        <section className="memberLoginCard" aria-label="Member sign-in">
          <span className="memberEyebrow">Attic members</span>
          <h2>
            {challenge
              ? testing
                ? "Test sign-in"
                : "Check your inbox"
              : "Welcome back"}
          </h2>
          <p className="memberMuted">
            {challenge
              ? testing
                ? "Enter 00000000 for your test sign-in. This shortcut works only in this authorised browser; it expires after two hours. Each code screen expires after 10 minutes."
                : `If ${email} has member access, we’ve sent an eight-digit code. It expires in 10 minutes.`
              : "Use the email address the academy has enabled for your member account."}
          </p>
          {error && (
            <p className="memberError" role="alert">
              {error}
            </p>
          )}
          {challenge ? (
            <form onSubmit={verify}>
              <label>
                Sign-in code
                <input
                  autoFocus
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="memberCode"
                  placeholder="00000000"
                />
              </label>
              <button className="memberButton memberPrimary" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
                <Icon name="arrow" />
              </button>
              <div className="memberLoginActions">
                <button
                  type="button"
                  className="memberLinkButton"
                  disabled={busy || remaining > 0}
                  onClick={() => void send()}
                >
                  {remaining ? `Resend in ${remaining}s` : "Send a new code"}
                </button>
                <button
                  type="button"
                  className="memberLinkButton"
                  disabled={busy}
                  onClick={() => {
                    setChallenge("");
                    setTesting(false);
                    setCode("");
                    setError("");
                  }}
                >
                  Change email
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={send}>
              <label>
                Email address
                <input
                  autoFocus
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <button className="memberButton memberPrimary" disabled={busy}>
                {busy ? "Sending code…" : "Continue with email"}
                <Icon name="arrow" />
              </button>
            </form>
          )}
          <p className="memberLoginSupport">
            Need access? <a href="tel:+353858447393">Contact the academy</a>.
            Your member account is separate from the staff Portal.
          </p>
        </section>
      </main>
      <footer className="memberLoginFooter">
        <span>Attic Jiu Jitsu · Carlow</span>
        <Install />
      </footer>
    </div>
  );
}
export function MemberApp() {
  const pathname = usePathname();
  const section = (pathname.split("/")[2] || "timetable") as Section;
  const loadingMessage: Record<Section, string> = {
    timetable: "Getting your timetable ready",
    bookings: "Getting your bookings ready",
    membership: "Getting your membership ready",
    account: "Getting your account ready",
    family: "Getting your family ready",
  };
  const [data, setData] = useState<MemberData | null>(null),
    [testSignin, setTestSignin] = useState<TestSignin | null>(null),
    [status, setStatus] = useState<
      "checking" | "signedout" | "ready" | "error"
    >("checking"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [offline, setOffline] = useState(false),
    [day, setDay] = useState(""),
    [filter, setFilter] = useState(""),
    [history, setHistory] = useState("upcoming"),
    [participant, setParticipant] = useState(""),
    [allPeople, setAllPeople] = useState(false),
    [dialog, setDialog] = useState<{
      session?: Session;
      booking?: Booking;
    } | null>(null);
  const epoch = useRef(0),
    controller = useRef<AbortController | null>(null),
    pending = useRef<{ signature: string; key: string } | null>(null);
  const load = useCallback(async () => {
    const version = ++epoch.current;
    controller.current?.abort();
    const c = new AbortController();
    controller.current = c;
    try {
      const next = await request<MemberData>("data", {}, undefined, c.signal);
      if (version !== epoch.current) return;
      setData(next);
      setParticipant((value) =>
        next.people?.some((p) => p.contact_id === value)
          ? value
          : (next.participant_id ?? ""),
      );
      setStatus("ready");
      setError("");
      setDay(
        (value) => value || dateKey(next.sessions[0]?.starts_at ?? new Date()),
      );
    } catch (cause) {
      if (c.signal.aborted || version !== epoch.current) return;
      if (cause instanceof MemberError && cause.status === 401) {
        setData(null);
        setDialog(null);
        setStatus("signedout");
      } else {
        setError(
          cause instanceof Error
            ? cause.message
            : "Your member app could not be loaded.",
        );
        setStatus((value) => (value === "ready" ? value : "error"));
      }
    }
  }, []);
  useEffect(() => {
    void load();
    const refresh = () => {
      if (document.visibilityState === "visible") void load();
    };
    const network = () => {
      setOffline(!navigator.onLine);
      if (navigator.onLine) void load();
    };
    setOffline(!navigator.onLine);
    window.addEventListener("focus", refresh);
    window.addEventListener("online", network);
    window.addEventListener("offline", network);
    return () => {
      controller.current?.abort();
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", network);
      window.removeEventListener("offline", network);
    };
  }, [load]);
  async function mutate(action: "book" | "cancel", input: object) {
    if (busy) return;
    setBusy(true);
    setError("");
    const version = epoch.current;
    const signature = JSON.stringify({ action, input });
    if (pending.current?.signature !== signature)
      pending.current = { signature, key: crypto.randomUUID() };
    try {
      await request(action, input, pending.current.key);
      pending.current = null;
      setDialog(null);
      setNotice(
        action === "book"
          ? "You’re booked in. See you on the mats!"
          : "Your booking has been cancelled.",
      );
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
      if (cause instanceof MemberError && cause.status === 401) {
        setData(null);
        setStatus("signedout");
        setDialog(null);
      }
    } finally {
      if (epoch.current >= version) setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await request("logout");
      controller.current?.abort();
      ++epoch.current;
      setData(null);
      setDialog(null);
      setNotice("");
      setTestSignin(null);
      setStatus("signedout");
    } catch {
      setError("Sign-out couldn’t be completed. Reconnect and try again.");
    } finally {
      setBusy(false);
    }
  }
  async function openTestSignin() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const test = await request<TestSignin>("test_signin");
      controller.current?.abort();
      ++epoch.current;
      setTestSignin(test);
      setData(null);
      setDialog(null);
      setNotice("");
      setStatus("signedout");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Test sign-in could not be opened.",
      );
    } finally {
      setBusy(false);
    }
  }
  // Leave invalid URLs to the route's not-found boundary.
  if (
    !nav.some((item) => item.key === section) ||
    pathname.split("/").filter(Boolean).length > 2
  )
    return null;
  if (status === "signedout")
    return (
      <Login
        testSignin={testSignin}
        onSignedIn={() => {
          setTestSignin(null);
          setStatus("checking");
          void load();
        }}
      />
    );
  if (!data)
    return (
      <div className="memberLoading">
        <Brand />
        <h1>
          {status === "error"
            ? "We couldn’t load your member app"
            : loadingMessage[section]}
        </h1>
        {error && <p role="alert">{error}</p>}
        {status === "error" ? (
          <button
            className="memberButton memberPrimary"
            onClick={() => void load()}
          >
            Try again
          </button>
        ) : (
          <p role="status">Checking your secure session…</p>
        )}
      </div>
    );
  const now = Date.now(),
    people = data.people ?? [],
    selectedPerson = people.find((p) => p.contact_id === participant),
    grant = selectedPerson ? selectedPerson.membership : data.membership,
    personName = selectedPerson?.name ?? data.member.name,
    scopedBookings = data.bookings.filter(
      (b) => !b.participant_id || b.participant_id === participant,
    ),
    visibleBookings =
      section === "bookings" && allPeople ? data.bookings : scopedBookings,
    activeBookings = visibleBookings
      .filter(
        (b) =>
          b.status === "confirmed" &&
          b.session_status === "scheduled" &&
          Date.parse(b.starts_at) > now,
      )
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  const membershipActive = Boolean(
    grant &&
    grant.status === "active" &&
    Date.parse(grant.starts_at) <= now &&
    (!grant.ends_at || Date.parse(grant.ends_at) > now),
  );
  const classFor = (session: Session) =>
    data.classes.find((c) => c.id === session.service_id);
  function eligibility(session: Session) {
    const c = classFor(session);
    if (offline) return "Reconnect to book";
    if (activeBookings.some((b) => b.session_id === session.id))
      return "Booked";
    if (Date.parse(session.starts_at) <= now) return "Class has started";
    if (
      Date.parse(session.starts_at) >
      now + data!.booking_window_hours * 3600000
    )
      return `Opens ${shortDate(new Date(Date.parse(session.starts_at) - data!.booking_window_hours * 3600000).toISOString())} at ${time(new Date(Date.parse(session.starts_at) - data!.booking_window_hours * 3600000).toISOString())}`;
    if (!session.remaining_spots) return "Class full";
    if (c?.requires_payment || session.price_required)
      return "Arrange with the team";
    if (
      c?.requires_membership &&
      (!grant ||
        grant.status !== "active" ||
        !grant.service_ids.includes(session.service_id) ||
        Date.parse(grant.starts_at) > Date.parse(session.starts_at) ||
        (grant.ends_at &&
          Date.parse(grant.ends_at) <= Date.parse(session.starts_at)))
    )
      return "Membership access needed";
    return "Book class";
  }
  const weekStart = shiftDay(
    day,
    -((new Date(day + "T12:00:00Z").getUTCDay() + 6) % 7),
  );
  const selected = dialog?.session,
    selectedClass = selected ? classFor(selected) : null,
    cancelling = dialog?.booking;
  const headings: Record<Section, { title: string; copy: string }> = {
    timetable: {
      title: "Find your next class",
      copy: "Make room for the mats. All class times are in Europe/Dublin.",
    },
    bookings: {
      title: "My bookings",
      copy: "Your training plans, ready when you are.",
    },
    membership: {
      title: "Your membership",
      copy: "Manage your current access and explore every membership option.",
    },
    family: {
      title: "Your family",
      copy: "Manage training together. Each person keeps their own places and weekly allowance.",
    },
    account: {
      title: "Your account",
      copy: "Your sign-in details and member app settings.",
    },
  };
  const upcomingCard = (
    <section className="memberPanel">
      <div className="memberPanelHeading">
        <h2>Coming up</h2>
        <span className="memberBadge">{activeBookings.length}</span>
      </div>
      {activeBookings.length ? (
        activeBookings.slice(0, 3).map((b) => (
          <div className="memberMiniBooking" key={`${b.id}:${b.participant_id??"self"}`}>
            <span>
              {shortDate(b.starts_at)} · {time(b.starts_at)}
            </span>
            <strong>{b.name}</strong>
            {b.participant_name && <small>For {b.participant_name}</small>}
            <small>{b.location}</small>
          </div>
        ))
      ) : (
        <p className="memberEmptySmall">
          Your next session starts with a booking. Choose a class from the
          timetable.
        </p>
      )}
      <Link className="memberTextLink" href="/members/bookings">
        View my bookings <Icon name="arrow" />
      </Link>
    </section>
  );
  return (
    <div className="memberShell">
      <aside className="memberSidebar">
        <Brand />
        <span className="memberSidebarLabel">Your training</span>
        <nav aria-label="Member navigation">
          {nav.map((item) => (
            <Link
              key={item.key}
              href={`/members/${item.key}`}
              aria-current={section === item.key ? "page" : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="memberSidebarBottom">
          <Install />
          <p>Powered by Ingenium</p>
        </div>
      </aside>
      <div className="memberMain">
        <header className="memberTopbar">
          <div className="memberMobileBrand">
            <Brand />
          </div>
          <span className="memberWelcome">
            Welcome back, {data.member.name.split(" ")[0]}
          </span>
          <span
            className={`memberBadge ${membershipActive ? "memberGood" : ""}`}
          >
            {membershipActive ? "Membership active" : "Member account"}
          </span>
        </header>
        <main className="memberContent">
          <div className="memberPageHeading">
            <div>
              <span className="memberEyebrow">Attic Jiu Jitsu</span>
              <h1>{headings[section].title}</h1>
              <p>{headings[section].copy}</p>
            </div>
            <button
              className="memberButton memberQuiet"
              onClick={() => void load()}
              disabled={busy || offline}
            >
              Refresh
            </button>
          </div>
          {offline && (
            <p className="memberWarning" role="status">
              You’re offline. Reconnect before making or cancelling a booking.
            </p>
          )}
          {notice && (
            <p className="memberNotice" role="status">
              {notice}
            </p>
          )}
          {error && !dialog && (
            <p className="memberError" role="alert">
              {error}
            </p>
          )}
          {people.length > 1 &&
            ["timetable", "bookings", "membership"].includes(section) && (
              <div className="memberParticipantBar">
                <label className="memberFilter">
                  {section === "bookings" ? "Bookings for" : "Training for"}
                  <select
                    aria-label="Training participant"
                    value={
                      section === "bookings" && allPeople ? "all" : participant
                    }
                    disabled={busy}
                    onChange={(e) => {
                      setDialog(null);
                      setError("");
                      setNotice("");
                      if (e.target.value === "all") {
                        setAllPeople(true);
                      } else {
                        setAllPeople(false);
                        setParticipant(e.target.value);
                      }
                    }}
                  >
                    {section === "bookings" && (
                      <option value="all">Everyone I manage</option>
                    )}
                    {people.map((p) => (
                      <option key={p.contact_id} value={p.contact_id}>
                        {p.name}
                        {p.is_self ? " (you)" : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <p>Each booking reserves one place for the selected person.</p>
              </div>
            )}
          {section === "timetable" && (
            <div className="memberColumns">
              <section>
                <div className="memberScheduleControls">
                  <div className="memberDateControl">
                    <button
                      className="memberButton memberSquare"
                      onClick={() => setDay(shiftDay(day, -7))}
                      aria-label="Previous week"
                    >
                      ‹
                    </button>
                    <label className="memberSrOnly" htmlFor="member-date">
                      Timetable date
                    </label>
                    <input
                      id="member-date"
                      type="date"
                      value={day}
                      onChange={(e) => {
                        if (e.target.value) setDay(e.target.value);
                      }}
                    />
                    <button
                      className="memberButton memberSquare"
                      onClick={() => setDay(shiftDay(day, 7))}
                      aria-label="Next week"
                    >
                      ›
                    </button>
                    <button
                      className="memberLinkButton"
                      onClick={() => setDay(dateKey(new Date()))}
                    >
                      Today
                    </button>
                  </div>
                  <label className="memberFilter">
                    Class
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="">All classes</option>
                      {data.classes.map((c) => (
                        <option value={c.id} key={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="memberDayStrip" aria-label="Choose a day">
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = shiftDay(weekStart, i),
                      date = new Date(d + "T12:00:00Z");
                    return (
                      <button
                        key={d}
                        className={d === day ? "isSelected" : ""}
                        aria-pressed={d === day}
                        onClick={() => setDay(d)}
                      >
                        <span>
                          {new Intl.DateTimeFormat("en-IE", {
                            weekday: "short",
                            timeZone: "Europe/Dublin",
                          }).format(date)}
                        </span>
                        <strong>{date.getUTCDate()}</strong>
                        <small>
                          {data.sessions.filter(
                            (s) => dateKey(s.starts_at) === d,
                          ).length || "–"}
                        </small>
                      </button>
                    );
                  })}
                </div>
                <div className="memberPanel memberClassList">
                  <div className="memberPanelHeading">
                    <h2>{dateLabel(day + "T12:00:00Z")}</h2>
                    <span className="memberMuted">
                      {
                        data.sessions.filter(
                          (s) =>
                            dateKey(s.starts_at) === day &&
                            (!filter || s.service_id === filter),
                        ).length
                      }{" "}
                      {data.sessions.filter(
                        (s) =>
                          dateKey(s.starts_at) === day &&
                          (!filter || s.service_id === filter),
                      ).length === 1
                        ? "session"
                        : "sessions"}
                    </span>
                  </div>
                  {data.sessions
                    .filter(
                      (s) =>
                        dateKey(s.starts_at) === day &&
                        (!filter || s.service_id === filter),
                    )
                    .map((session) => {
                      const label = eligibility(session),
                        bookable = label === "Book class",
                        booked = label === "Booked";
                      return (
                        <article className="memberClassRow" key={session.id}>
                          <div className="memberClassTime">
                            <time dateTime={session.starts_at}>
                              {time(session.starts_at)}
                            </time>
                            <span>{time(session.ends_at)}</span>
                          </div>
                          <div className="memberClassInfo">
                            <h3>{classFor(session)?.name}</h3>
                            <p>
                              {session.coach} ·{" "}
                              {Math.round(
                                (Date.parse(session.ends_at) -
                                  Date.parse(session.starts_at)) /
                                  60000,
                              )}{" "}
                              min
                            </p>
                            <small>{session.location}</small>
                            <span
                              className={`memberSpots ${session.remaining_spots <= 3 ? "memberFew" : ""}`}
                            >
                              {session.remaining_spots} of {session.capacity}{" "}
                              places available
                            </span>
                          </div>
                          <div className="memberClassAction">
                            <button
                              className={`memberButton ${bookable ? "memberPrimary" : booked ? "memberBooked" : "memberQuiet"}`}
                              disabled={!bookable || busy}
                              onClick={() => {
                                setError("");
                                setDialog({ session });
                              }}
                            >
                              {booked
                                ? "✓ Booked"
                                : bookable
                                  ? "Book class"
                                  : label === "Class full"
                                    ? "Full"
                                    : "Unavailable"}
                            </button>
                            {!bookable && !booked && <small>{label}</small>}
                          </div>
                        </article>
                      );
                    })}
                  {!data.sessions.some(
                    (s) =>
                      dateKey(s.starts_at) === day &&
                      (!filter || s.service_id === filter),
                  ) && (
                    <div className="memberEmpty">
                      <Icon name="calendar" />
                      <h3>No classes on this day</h3>
                      <p>
                        Try another day or class filter to find your next
                        session.
                      </p>
                    </div>
                  )}
                </div>
                <p className="memberFootnote">
                  Booking opens {data.booking_window_hours} hours before each
                  class. Your membership must cover the class date.
                </p>
              </section>
              <aside className="memberContext">
                <section className="memberMembershipSummary">
                  <Icon name="card" />
                  <span className="memberEyebrow">Your membership</span>
                  <h2>{grant?.label ?? "Let’s get you set up"}</h2>
                  <p>
                    {grant
                      ? `${grant.weekly_limit ? `${grant.weekly_limit} classes per week` : "Unlimited included classes"}${grant.ends_at ? ` · valid until ${shortDate(grant.ends_at)}` : ""}`
                      : "Contact the academy to connect your membership and class access."}
                  </p>
                  <Link href="/members/membership">
                    View membership <Icon name="arrow" />
                  </Link>
                </section>
                {upcomingCard}
                <div className="memberHelp">
                  <strong>A little help from the team?</strong>
                  <p>
                    For membership changes or a class question, we’re here to
                    help.
                  </p>
                  <a href="tel:+353858447393">085 844 7393</a>
                </div>
              </aside>
            </div>
          )}
          {section === "bookings" && (
            <>
              <div className="memberScheduleControls">
                <p className="memberMuted">
                  {activeBookings.length} upcoming{" "}
                  {activeBookings.length === 1 ? "booking" : "bookings"}
                </p>
                <label className="memberFilter">
                  Show
                  <select
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                  >
                    <option value="upcoming">Upcoming bookings</option>
                    <option value="history">Booking history</option>
                  </select>
                </label>
              </div>
              <div className="memberPanel">
                {visibleBookings
                  .filter((b) =>
                    history === "upcoming"
                      ? b.status === "confirmed" &&
                        b.session_status === "scheduled" &&
                        Date.parse(b.starts_at) > now
                      : !(
                          b.status === "confirmed" &&
                          b.session_status === "scheduled" &&
                          Date.parse(b.starts_at) > now
                        ),
                  )
                  .sort((a, b) =>
                    history === "upcoming"
                      ? a.starts_at.localeCompare(b.starts_at)
                      : b.starts_at.localeCompare(a.starts_at),
                  )
                  .map((b) => (
                    <article className="memberBookingRow" key={`${b.id}:${b.participant_id??"self"}`}>
                      <div className="memberBookingDate">
                        <strong>
                          {new Date(b.starts_at).toLocaleDateString("en-IE", {
                            day: "numeric",
                            timeZone: "Europe/Dublin",
                          })}
                        </strong>
                        <span>
                          {new Date(b.starts_at).toLocaleDateString("en-IE", {
                            month: "short",
                            timeZone: "Europe/Dublin",
                          })}
                        </span>
                      </div>
                      <div className="memberClassInfo">
                        <h2>{b.name}</h2>
                        {b.participant_name && (
                          <p className="memberParticipantName">
                            For {b.participant_name}
                          </p>
                        )}
                        <p>
                          {dateLabel(b.starts_at)} · {time(b.starts_at)}–
                          {time(b.ends_at)}
                        </p>
                        <small>{b.location}</small>
                        <span className="memberBadge">
                          {b.session_status === "cancelled"
                            ? "Class cancelled"
                            : b.status === "cancelled"
                              ? "Cancelled"
                              : "Confirmed"}
                        </span>
                      </div>
                      {history === "upcoming" && (
                        <div className="memberClassAction">
                          {b.self_service &&
                          Date.parse(b.cancel_before) > now ? (
                            <>
                              <button
                                className="memberButton memberQuiet"
                                disabled={busy || offline}
                                onClick={() => {
                                  setError("");
                                  setDialog({ booking: b });
                                }}
                              >
                                Cancel booking
                              </button>
                              <small>
                                Until {shortDate(b.cancel_before)} at{" "}
                                {time(b.cancel_before)}
                              </small>
                            </>
                          ) : (
                            <small>
                              Contact the team to change this booking.
                            </small>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                {!(history === "upcoming"
                  ? activeBookings.length
                  : visibleBookings.length - activeBookings.length) && (
                  <div className="memberEmpty">
                    <Icon name="check" />
                    <h2>
                      {history === "upcoming"
                        ? "Your next class is waiting"
                        : "No booking history yet"}
                    </h2>
                    <p>
                      {history === "upcoming"
                        ? "Find a class that fits your week and book your place."
                        : "Completed and cancelled bookings will appear here."}
                    </p>
                    <Link
                      href="/members/timetable"
                      className="memberButton memberPrimary"
                    >
                      Explore the timetable
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
          {section === "membership" && (
            <>
              <div>
                <section className="memberPanel memberDetails">
                  <span
                    className={`memberBadge ${membershipActive ? "memberGood" : ""}`}
                  >
                    {membershipActive
                      ? "Active"
                      : grant?.status === "paused"
                        ? "Paused"
                        : grant
                          ? "Outside access dates"
                          : "Access not assigned"}
                  </span>
                  <h2>{grant?.label ?? "Connect your membership"}</h2>
                  {grant ? (
                    <>
                      <p className="memberMuted">
                        {grant.weekly_limit
                          ? `${grant.weekly_limit} classes each week`
                          : "Unlimited included classes"}
                        {grant.ends_at
                          ? ` · until ${shortDate(grant.ends_at)}`
                          : ""}
                      </p>
                      <details className="memberAccessDetails">
                        <summary>View your access details</summary>
                        <dl>
                          <div>
                            <dt>Included training</dt>
                            <dd>
                              {grant.weekly_limit
                                ? `${grant.weekly_limit} classes each week`
                                : "Unlimited included classes"}
                            </dd>
                          </div>
                          <div>
                            <dt>Access starts</dt>
                            <dd>{shortDate(grant.starts_at)}</dd>
                          </div>
                          <div>
                            <dt>Access expires</dt>
                            <dd>
                              {grant.ends_at
                                ? shortDate(grant.ends_at)
                                : "No expiry set"}
                            </dd>
                          </div>
                          <div>
                            <dt>Weekly allowance</dt>
                            <dd>Monday–Sunday · Europe/Dublin</dd>
                          </div>
                        </dl>
                        <h3>Your included classes</h3>
                        <ul className="memberIncluded">
                          {data.classes
                            .filter((c) => grant.service_ids.includes(c.id))
                            .map((c) => (
                              <li key={c.id}>
                                <span>✓</span>
                                {c.name}
                              </li>
                            ))}
                        </ul>
                      </details>
                      <p className="memberMuted">
                        Access is checked for the date of each class. Cancelling
                        within the allowed window restores your place in that
                        week’s allowance.
                      </p>
                    </>
                  ) : (
                    <p className="memberMuted">
                      Your sign-in is ready. Contact the academy to assign the
                      right class access to your account.
                    </p>
                  )}
                </section>
              </div>
              <MembershipOptions onAccessChanged={load} />
            </>
          )}
          {section === "family" && (
            <section className="memberPanel memberDetails">
              <h2>
                {people.find((p) => p.household_name)?.household_name ??
                  "Family training"}
              </h2>
              <p className="memberMuted">
                Approved managers can book and cancel for the people shown here.
                Contact the academy to add a child, approve another parent or
                change family membership coverage.
              </p>
              {people.filter((p) => p.household_id || !p.is_self).length ? (
                <div className="memberFamilyList">
                  {people
                    .filter((p) => p.household_id || !p.is_self)
                    .map((p) => (
                      <article
                        className="memberFamilyPerson"
                        key={p.contact_id}
                      >
                        <div className="memberPersonAvatar" aria-hidden="true">
                          {p.name.slice(0, 1)}
                        </div>
                        <div>
                          <h3>
                            {p.name}
                            {p.is_self ? " (you)" : ""}
                          </h3>
                          <p className="memberMuted">
                            {p.role === "child" ? "Child / dependent" : "Adult"}{" "}
                            · {p.household_name}
                          </p>
                          <strong>
                            {p.membership?.label ?? "Class access not assigned"}
                          </strong>
                          <p className="memberMuted">
                            {p.membership
                              ? `${p.membership.status === "paused" ? "Paused · " : ""}${p.membership.weekly_limit ? `${p.membership.weekly_limit} ${p.membership.weekly_limit === 1 ? "class" : "classes"} per week` : "Unlimited included classes"}${p.membership.ends_at ? ` · until ${shortDate(p.membership.ends_at)}` : ""}`
                              : "The academy can confirm the right membership for this person."}
                          </p>
                        </div>
                        <Link
                          className="memberButton memberQuiet"
                          href="/members/timetable"
                          onClick={() => {
                            setParticipant(p.contact_id);
                            setAllPeople(false);
                            setDialog(null);
                            setError("");
                          }}
                        >
                          View classes for {p.name}
                        </Link>
                      </article>
                    ))}
                </div>
              ) : (
                <div className="memberEmpty">
                  <h3>Training is better together</h3>
                  <p>
                    The academy can link children and other approved family
                    members to your sign-in. Each person keeps their own class
                    access and attendance.
                  </p>
                  <a
                    className="memberButton memberQuiet"
                    href="tel:+353858447393"
                  >
                    Contact the academy
                  </a>
                </div>
              )}
            </section>
          )}
          {section === "account" && (
            <div className="memberColumns">
              <section className="memberPanel memberDetails">
                <h2>Your details</h2>
                <dl>
                  <div>
                    <dt>Name</dt>
                    <dd>{data.member.name}</dd>
                  </div>
                  <div>
                    <dt>Sign-in email</dt>
                    <dd>{data.member.email}</dd>
                  </div>
                  <div>
                    <dt>Academy</dt>
                    <dd>Attic Jiu Jitsu · Carlow</dd>
                  </div>
                </dl>
                <p className="memberMuted">
                  Contact the academy to update your details or sign-in email.
                </p>
                <button
                  className="memberButton memberQuiet"
                  disabled={busy}
                  onClick={() => void logout()}
                >
                  <Icon name="logout" />
                  {busy ? "Signing out…" : "Sign out of this device"}
                </button>
              </section>
              <aside className="memberContext">
                <section className="memberPanel memberDetails">
                  <h2>Take Attic with you</h2>
                  <p className="memberMuted">
                    Add the member app to your home screen for a quicker way to
                    book your next class.
                  </p>
                  <Install />
                </section>
                {data.member.email.toLowerCase() ===
                  "kyle@ingeniumconsulting.net" && (
                  <section className="memberPanel memberDetails">
                    <h2>Test sign-in</h2>
                    <p className="memberMuted">
                      Open a test sign-in and enter 00000000. Your current
                      authenticated session authorises this browser for two
                      hours. Signing out normally removes the shortcut.
                    </p>
                    <button
                      className="memberButton memberQuiet"
                      disabled={busy || offline}
                      onClick={() => void openTestSignin()}
                    >
                      Open test sign-in
                    </button>
                  </section>
                )}
                <div className="memberHelp">
                  <strong>Your account stays private</strong>
                  <p>
                    Class and account information is loaded securely when you
                    open the app. Private details are never saved for offline
                    access.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </main>
        <footer className="memberContentFooter">
          Attic Jiu Jitsu · Member app <span>Powered by Ingenium</span>
        </footer>
      </div>
      <nav className="memberMobileNav" aria-label="Mobile member navigation">
        {nav.map((item) => (
          <Link
            key={item.key}
            href={`/members/${item.key}`}
            aria-current={section === item.key ? "page" : undefined}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {dialog && (
        <Modal
          title={selected ? "Book your place" : "Cancel this booking?"}
          busy={busy}
          onClose={() => setDialog(null)}
        >
          {error && (
            <p role="alert" className="memberError">
              {error}
            </p>
          )}
          {selected && (
            <>
              <span className="memberEyebrow">
                {dateLabel(selected.starts_at)}
              </span>
              <h3>{selectedClass?.name}</h3>
              <p>
                {time(selected.starts_at)}–{time(selected.ends_at)} ·{" "}
                {selected.coach}
              </p>
              <p className="memberMuted">{selected.location}</p>
              <div className="memberDialogSummary">
                <span>Attending</span>
                <strong>{personName}</strong>
              </div>
              <div className="memberDialogSummary">
                <span>Class access</span>
                <strong>
                  {selectedClass?.requires_membership
                    ? "Included with your membership"
                    : "No class charge"}
                </strong>
              </div>
              <p className="memberMuted">
                Your place is confirmed when the booking succeeds. You can see
                the cancellation deadline under My bookings.
              </p>
              <button
                className="memberButton memberPrimary"
                disabled={busy || offline}
                onClick={() =>
                  void mutate("book", {
                    session_id: selected.id,
                    ...(participant ? { participant_id: participant } : {}),
                  })
                }
              >
                {busy ? "Booking your place…" : "Confirm booking"}
              </button>
            </>
          )}
          {cancelling && (
            <>
              <h3>{cancelling.name}</h3>
              {cancelling.participant_name && (
                <p>For {cancelling.participant_name}</p>
              )}
              <p>
                {dateLabel(cancelling.starts_at)} · {time(cancelling.starts_at)}
              </p>
              <p className="memberMuted">
                Your place will become available to other members. If your
                membership has a weekly limit, this booking will no longer use
                that week’s allowance.
              </p>
              <div className="memberDialogActions">
                <button
                  className="memberButton memberQuiet"
                  disabled={busy}
                  onClick={() => setDialog(null)}
                >
                  Keep my booking
                </button>
                <button
                  className="memberButton memberPrimary"
                  disabled={busy || offline}
                  onClick={() =>
                    void mutate("cancel", { reservation_id: cancelling.id })
                  }
                >
                  {busy ? "Cancelling…" : "Confirm cancellation"}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
