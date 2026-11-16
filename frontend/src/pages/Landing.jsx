import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CreditCard,
  FileText,
  Hash,
  History,
  QrCode,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import "./landing.css";

const STATUSES = ["Pending", "For Payment", "Approved", "Released"];
const PURPOSES = ["Local Employment", "Postal ID", "Bank Requirement", "Travel Abroad", "Business Permit"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* Adds data-visible="true" when the element scrolls into view */
function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ "--delay": `${delay}ms` }}
      className={`landing-reveal ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function AnimatedHeadline({ lines }) {
  let wordIndex = 0;
  return (
    <h1 className="font-display text-[3.1rem] font-light leading-[0.98] tracking-[-0.035em] text-[#f6f1e7] sm:text-7xl lg:text-[5.6rem]">
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {line.words.map((word) => {
            const delay = 150 + wordIndex++ * 90;
            return (
              <span key={`${lineIdx}-${word}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span className="landing-word" style={{ animationDelay: `${delay}ms` }}>
                  {line.accent ? <span className="landing-shimmer italic pr-[0.08em]">{word}</span> : word}
                </span>
                &nbsp;
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function Certificate() {
  const tiltRef = useRef(null);
  const [tick, setTick] = useState(prefersReducedMotion() ? STATUSES.length - 1 : 0);
  const step = tick % STATUSES.length;
  const purposeIdx = Math.floor(tick / STATUSES.length) % PURPOSES.length;

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const timer = setInterval(() => setTick((t) => t + 1), 2300);
    return () => clearInterval(timer);
  }, []);

  const handlePointerMove = (event) => {
    if (prefersReducedMotion() || event.pointerType === "touch") return;
    const node = tiltRef.current;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--ry", `${x * 16}deg`);
    node.style.setProperty("--rx", `${-y * 12}deg`);
  };

  const handlePointerLeave = () => {
    const node = tiltRef.current;
    node.style.setProperty("--ry", "-8deg");
    node.style.setProperty("--rx", "4deg");
  };

  const approved = step >= 2;
  const controlNumber = `BRGY-${new Date().getFullYear()}-${String(124 + purposeIdx).padStart(4, "0")}`;

  return (
    <div
      className="relative mx-auto w-full max-w-[460px] py-6"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* glow */}
      <div className="absolute inset-x-6 top-10 bottom-0 rounded-[40px] bg-[radial-gradient(closest-side,rgba(212,175,95,0.45),transparent)] blur-3xl" />

      <div className="landing-float">
        <div ref={tiltRef} className="landing-tilt relative">
          {/* back sheet for depth */}
          <div className="absolute inset-0 translate-x-4 translate-y-5 rotate-[3deg] rounded-[22px] bg-[#e9e0cc]/70 shadow-2xl" />

          <article
            aria-label="Sample barangay clearance"
            className="landing-paper relative overflow-hidden rounded-[22px] p-7 text-[#1b2333] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.75)] ring-1 ring-black/5 pb-16 sm:p-8 sm:pb-16"
          >
            {/* guilloche border */}
            <div className="pointer-events-none absolute inset-3 rounded-[16px] border border-[#b8913f]/40" />
            <div className="pointer-events-none absolute inset-[18px] rounded-[12px] border border-dashed border-[#b8913f]/25" />

            <header className="relative flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-[#b8913f]/70 bg-[#fffaf0] text-[#9a7630]">
                <ScrollText className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#6b6455]">Republic of the Philippines</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6b6455]">Office of the Punong Barangay</p>
                <h3 className="mt-2 font-display text-[1.6rem] leading-none tracking-tight text-[#121a2a]">Barangay Clearance</h3>
              </div>
            </header>

            <div className="relative mt-6 flex items-center justify-between border-y border-[#1b2333]/10 py-3 text-xs">
              <span className="uppercase tracking-[0.24em] text-[#6b6455]">Control No.</span>
              <span className="font-mono text-sm font-semibold tracking-wider">{controlNumber}</span>
            </div>

            <div className="relative mt-5 space-y-3 text-[13px] leading-relaxed">
              <p className="text-[#3c4352]">
                This is to certify that <span className="font-semibold text-[#121a2a]">Juan Dela Cruz</span>, of legal age, is a
                bona fide resident of this barangay with no derogatory record on file.
              </p>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#6b6455]">Purpose</span>
                <span key={purposeIdx} className="landing-fade font-display text-lg italic text-[#121a2a]">
                  {PURPOSES[purposeIdx]}
                </span>
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-[6px] w-full rounded-full bg-[#1b2333]/[0.07]" />
                <div className="h-[6px] w-4/5 rounded-full bg-[#1b2333]/[0.07]" />
              </div>
            </div>

            <footer className="relative mt-7 flex items-end justify-between gap-4">
              <div className="rounded-lg bg-white p-2 shadow-sm ring-1 ring-black/5">
                <QRCodeSVG value={controlNumber} size={64} fgColor="#121a2a" bgColor="#ffffff" level="M" />
              </div>
              <div className="flex-1 text-right">
                <svg
                  data-on={approved}
                  className="landing-signature ml-auto h-12 w-36"
                  viewBox="0 0 160 50"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 36c10-16 18-26 24-22s-8 22-2 22 14-26 22-24-4 20 4 20 10-16 18-16 2 14 10 14 12-10 22-12 18 2 30-6"
                    stroke="#1f3a8a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="ml-auto mt-1 h-px w-40 bg-[#1b2333]/30" />
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.24em] text-[#6b6455]">Punong Barangay</p>
              </div>
            </footer>

            {/* stamp */}
            <div
              data-on={approved}
              aria-hidden="true"
              className="landing-stamp pointer-events-none absolute right-8 top-[44%] rounded-md border-[3px] border-[#b4232a] px-4 py-1.5 font-display text-2xl font-semibold uppercase tracking-[0.18em] text-[#b4232a] mix-blend-multiply"
            >
              Approved
            </div>
          </article>

          {/* floating status chip */}
          <div className="absolute -bottom-7 left-1/2 w-[92%] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0e1626]/90 p-4 shadow-2xl backdrop-blur-xl sm:-left-10 sm:w-auto sm:min-w-[320px] sm:translate-x-0">
            <div className="flex items-center justify-between gap-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#f6f1e7]/50">Live status</p>
              <p className="text-sm font-medium text-[#ecd395]" aria-live="polite">
                {STATUSES[step]}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {STATUSES.map((status, i) => (
                <div key={status} className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#c9a24e] to-[#ecd395] transition-all duration-700 ease-out"
                    style={{ width: i <= step ? "100%" : "0%" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    status: "Pending",
    title: "Apply from anywhere",
    body: "Pick your purpose, confirm your details, and submit. No forms to print, no early-morning lines.",
    icon: FileText,
  },
  {
    status: "For Payment",
    title: "Settle the fee",
    body: "Once staff verify your request, you're notified to pay. Every payment is recorded against your request.",
    icon: CreditCard,
  },
  {
    status: "Approved",
    title: "Signed and numbered",
    body: "Your clearance receives a unique control number and a QR code that anyone can use to verify it.",
    icon: BadgeCheck,
  },
  {
    status: "Released",
    title: "Ready when you are",
    body: "Download your certificate or claim it at the hall. Come in once, only when it's ready.",
    icon: Sparkles,
  },
];

const ROLES = [
  {
    name: "Residents",
    kicker: "For the community",
    title: "Apply in minutes. Watch it move in real time.",
    body: "Submit a request from your phone, see exactly where it stands, and only visit the hall when your clearance is ready to claim.",
    points: ["Six common purposes, one simple form", "Status updates at every stage", "Downloadable, verifiable certificate"],
  },
  {
    name: "Staff",
    kicker: "For the front desk",
    title: "No more typing the same thing twice.",
    body: "Review requests in one queue, record payments, and release documents. Control numbers are generated for you.",
    points: ["Approve, reject, or request payment in one click", "Automatic control numbering", "Every action logged for review"],
  },
  {
    name: "Officials",
    kicker: "For barangay leadership",
    title: "See the whole office at a glance.",
    body: "Track volume, collections, and turnaround in real time, so service and spending stay transparent to the people you serve.",
    points: ["Live clearance and revenue figures", "A complete audit trail", "Role-based access for every account"],
  },
];

export default function Landing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeRole, setActiveRole] = useState(0);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (user) navigate(`/${user.role.toLowerCase()}`);
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/clearances/summary")
      .then((response) => {
        if (!cancelled && response.data?.monthlyProcessed != null) setSummary(response.data);
      })
      .catch((error) => console.warn("Landing page summary fetch failed", error.message || error));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const role = ROLES[activeRole];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f1e7] font-sans text-[#121a2a] antialiased selection:bg-[#ecd395]/60">
      {/* ───────── Navigation ───────── */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 sm:px-6 ${
            scrolled
              ? "border border-white/10 bg-[#0b1220]/75 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 text-[#f6f1e7]">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#d4af5f]/60 text-[#ecd395]">
              <ScrollText className="h-4 w-4" strokeWidth={1.6} />
            </span>
            <span className="font-display text-xl tracking-tight">
              Barangay<span className="italic text-[#ecd395]">Portal</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[#f6f1e7]/70 md:flex">
            <a href="#how" className="transition hover:text-[#f6f1e7]">How it works</a>
            <a href="#roles" className="transition hover:text-[#f6f1e7]">Who it's for</a>
            <a href="#trust" className="transition hover:text-[#f6f1e7]">Trust</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="rounded-full px-4 py-2 text-sm text-[#f6f1e7]/80 transition hover:text-[#f6f1e7]">
              Sign in
            </Link>
            <Link
              to="/register"
              className="hidden rounded-full bg-[#f6f1e7] px-5 py-2 text-sm font-medium text-[#0b1220] transition hover:bg-white sm:inline-flex"
            >
              Apply now
            </Link>
          </div>
        </nav>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="landing-grain relative isolate overflow-hidden bg-[#0b1220] pb-28 pt-36 sm:pt-40 lg:pb-36">
        <div className="landing-gridlines absolute inset-0 -z-10" />
        <div className="absolute -right-40 -top-40 -z-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,95,0.28),transparent)]" />
        <div className="absolute -left-60 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(56,92,180,0.28),transparent)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-8">
          <div>
            <div
              className="landing-fade inline-flex items-center gap-2.5 rounded-full border border-[#d4af5f]/25 bg-[#d4af5f]/[0.07] py-1.5 pl-2.5 pr-4 text-xs text-[#ecd395]"
              style={{ animationDelay: "50ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="landing-ping absolute inline-flex h-full w-full rounded-full bg-[#ecd395]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ecd395]" />
              </span>
              Now accepting online applications
            </div>

            <div className="mt-8">
              <AnimatedHeadline
                lines={[
                  { words: ["Your", "clearance,"] },
                  { words: ["without", "the", "queue."], accent: true },
                ]}
              />
            </div>

            <p
              className="landing-fade mt-8 max-w-xl text-lg leading-8 text-[#f6f1e7]/65"
              style={{ animationDelay: "750ms" }}
            >
              Apply for your barangay clearance from home, follow every step as it happens, and claim it only when
              it's ready: signed, numbered, and verifiable.
            </p>

            <div className="landing-fade mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "900ms" }}>
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#ecd395] to-[#c9a24e] px-7 py-3.5 text-[15px] font-semibold text-[#0b1220] shadow-[0_10px_40px_-10px_rgba(212,175,95,0.7)] transition hover:shadow-[0_14px_50px_-8px_rgba(212,175,95,0.85)]"
              >
                Apply for clearance
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#f6f1e7]/15 px-7 py-3.5 text-[15px] font-medium text-[#f6f1e7] transition hover:border-[#f6f1e7]/35 hover:bg-white/5"
              >
                I already have an account
              </Link>
            </div>

            <dl
              className="landing-fade mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-[#f6f1e7]/10 pt-8"
              style={{ animationDelay: "1050ms" }}
            >
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[#f6f1e7]/45">
                  {summary ? "This month" : "Purposes"}
                </dt>
                <dd className="mt-2 font-display text-3xl text-[#f6f1e7] sm:text-4xl">
                  {summary ? summary.monthlyProcessed.toLocaleString() : "6"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[#f6f1e7]/45">Steps</dt>
                <dd className="mt-2 font-display text-3xl text-[#f6f1e7] sm:text-4xl">4</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[#f6f1e7]/45">Lines</dt>
                <dd className="mt-2 font-display text-3xl italic text-[#ecd395] sm:text-4xl">0</dd>
              </div>
            </dl>
          </div>

          <div className="landing-fade" style={{ animationDelay: "400ms" }}>
            <Certificate />
          </div>
        </div>
      </section>

      {/* ───────── Purposes marquee ───────── */}
      <section aria-label="Supported purposes" className="relative overflow-hidden border-b border-[#121a2a]/10 bg-[#efe7d6] py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#efe7d6] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#efe7d6] to-transparent" />
        <div className="landing-marquee flex w-max items-center gap-10 whitespace-nowrap">
          {[...PURPOSES, "and more", ...PURPOSES, "and more"].map((purpose, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-2xl italic text-[#121a2a]/70 sm:text-3xl">
              {purpose}
              <span className="text-base not-italic text-[#b8913f]">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section id="how" className="scroll-mt-24 py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-[#9a7630]">How it works</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              Four quiet steps, <span className="italic text-[#9a7630]">from request to release.</span>
            </h2>
          </Reveal>

          <Reveal className="relative mt-20">
            <div className="absolute left-0 right-0 top-[27px] hidden h-px bg-[#121a2a]/10 lg:block">
              <div className="landing-progress h-full bg-gradient-to-r from-[#c9a24e] via-[#9a7630] to-[#c9a24e]" />
            </div>

            <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal as="li" key={step.status} delay={i * 140} className="relative">
                    <div className="relative grid h-14 w-14 place-items-center rounded-full border border-[#121a2a]/10 bg-[#fbf8f1] shadow-[0_8px_30px_-12px_rgba(18,26,42,0.35)]">
                      <Icon className="h-5 w-5 text-[#9a7630]" strokeWidth={1.6} />
                    </div>
                    <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.24em] text-[#121a2a]/45">
                      0{i + 1} · {step.status}
                    </p>
                    <h3 className="mt-3 font-display text-2xl tracking-tight">{step.title}</h3>
                    <p className="mt-3 leading-7 text-[#121a2a]/65">{step.body}</p>
                  </Reveal>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ───────── Roles ───────── */}
      <section id="roles" className="landing-grain relative scroll-mt-24 overflow-hidden bg-[#0b1220] py-28 text-[#f6f1e7] sm:py-36">
        <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,95,0.16),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.32em] text-[#ecd395]/80">Who it's for</p>
              <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-[-0.025em] sm:text-6xl">
                One portal. <span className="italic text-[#ecd395]">Everyone at the hall.</span>
              </h2>
            </div>

            <div role="tablist" aria-label="Roles" className="inline-flex self-start rounded-full border border-white/10 bg-white/[0.03] p-1 lg:self-auto">
              {ROLES.map((r, i) => (
                <button
                  key={r.name}
                  role="tab"
                  aria-selected={activeRole === i}
                  aria-controls="role-panel"
                  onClick={() => setActiveRole(i)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 ${
                    activeRole === i ? "bg-[#f6f1e7] text-[#0b1220]" : "text-[#f6f1e7]/60 hover:text-[#f6f1e7]"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div
              id="role-panel"
              role="tabpanel"
              key={role.name}
              className="landing-fade mt-14 grid gap-10 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#f6f1e7]/45">{role.kicker}</p>
                <h3 className="mt-5 font-display text-3xl leading-tight tracking-tight sm:text-[2.6rem]">{role.title}</h3>
                <p className="mt-6 max-w-lg text-lg leading-8 text-[#f6f1e7]/65">{role.body}</p>
              </div>
              <ul className="space-y-4 self-center">
                {role.points.map((point, i) => (
                  <li
                    key={point}
                    className="landing-fade flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#0b1220]/50 p-5"
                    style={{ animationDelay: `${120 + i * 110}ms` }}
                  >
                    <span className="font-display text-xl italic text-[#ecd395]">0{i + 1}</span>
                    <span className="text-[#f6f1e7]/85">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Trust ───────── */}
      <section id="trust" className="scroll-mt-24 py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-[#9a7630]">Built on trust</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-[-0.025em] sm:text-6xl">
              Every document, <span className="italic text-[#9a7630]">accounted for.</span>
            </h2>
          </Reveal>

          <div className="mt-20 grid gap-5 md:grid-cols-6">
            <Reveal className="group relative overflow-hidden rounded-[28px] border border-[#121a2a]/10 bg-[#fbf8f1] p-8 md:col-span-4 sm:p-10">
              <Hash className="h-6 w-6 text-[#9a7630]" strokeWidth={1.6} />
              <h3 className="mt-8 font-display text-3xl tracking-tight">A control number for every clearance</h3>
              <p className="mt-3 max-w-md leading-7 text-[#121a2a]/65">
                Each request is numbered on submission and stays traceable for its whole life, from the first click to the
                day it's released.
              </p>
              <p className="mt-10 font-mono text-[clamp(1.75rem,6vw,4rem)] font-semibold leading-none tracking-tight text-[#121a2a]/[0.07] transition-colors duration-700 group-hover:text-[#9a7630]/25">
                BRGY-{new Date().getFullYear()}-0124
              </p>
            </Reveal>

            <Reveal delay={120} className="rounded-[28px] bg-[#121a2a] p-8 text-[#f6f1e7] md:col-span-2 sm:p-10">
              <QrCode className="h-6 w-6 text-[#ecd395]" strokeWidth={1.6} />
              <h3 className="mt-8 font-display text-3xl tracking-tight">Verifiable by QR</h3>
              <p className="mt-3 leading-7 text-[#f6f1e7]/60">
                Employers, banks, and agencies can confirm a certificate is genuine with a single scan.
              </p>
            </Reveal>

            <Reveal delay={80} className="rounded-[28px] border border-[#121a2a]/10 bg-[#fbf8f1] p-8 md:col-span-3 sm:p-10">
              <History className="h-6 w-6 text-[#9a7630]" strokeWidth={1.6} />
              <h3 className="mt-8 font-display text-3xl tracking-tight">Every action, on the record</h3>
              <p className="mt-3 leading-7 text-[#121a2a]/65">
                Approvals, payments, and releases are written to an audit log, so nothing happens off the books.
              </p>
            </Reveal>

            <Reveal delay={160} className="rounded-[28px] border border-[#121a2a]/10 bg-[#fbf8f1] p-8 md:col-span-3 sm:p-10">
              <ShieldCheck className="h-6 w-6 text-[#9a7630]" strokeWidth={1.6} />
              <h3 className="mt-8 font-display text-3xl tracking-tight">The right access for each role</h3>
              <p className="mt-3 leading-7 text-[#121a2a]/65">
                Residents, staff, and officials each see only what their role requires. Your personal details stay with
                the people who need them.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="px-4 pb-6 sm:px-6">
        <Reveal className="landing-grain relative isolate mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#0b1220] px-6 py-24 text-center sm:px-12 sm:py-32">
          <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,95,0.35),transparent)]" />
          <div className="landing-gridlines absolute inset-0 -z-10" />
          <p className="text-xs uppercase tracking-[0.32em] text-[#ecd395]/80">Ready when you are</p>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[2.6rem] font-light leading-[1.02] tracking-[-0.03em] text-[#f6f1e7] sm:text-7xl">
            Spend the morning <span className="landing-shimmer italic">anywhere but the line.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-[#f6f1e7]/60">
            Create your resident account and send your first request in a few minutes.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-[#f6f1e7] px-8 py-4 text-[15px] font-semibold text-[#0b1220] transition hover:bg-white"
            >
              Create my account
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/login" className="px-6 py-4 text-[15px] text-[#f6f1e7]/70 transition hover:text-[#f6f1e7]">
              Sign in instead
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-[#121a2a]/50 sm:flex-row sm:px-6 lg:px-8">
        <p className="font-display text-lg text-[#121a2a]/80">
          Barangay<span className="italic text-[#9a7630]">Portal</span>
        </p>
        <p>© {new Date().getFullYear()} Office of the Punong Barangay. Serving residents with care.</p>
      </footer>
    </div>
  );
}
