import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Gauge,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

function Landing() {
  const capabilities = [
    {
      icon: TrendingUp,
      title: "Smart Priority Queue",
      description:
        "Automatically rank applications by urgency and importance using a priority-based scoring matrix tailored to your career goals.",
      label: "Rank algorithm",
      path: "/priority-queue",
    },
    {
      icon: LayoutDashboard,
      title: "Application Tracker",
      description:
        "Track applications seamlessly from Applied to Interview, Offer or Closed with frictionless kanban and high-density list views.",
      label: "Full pipeline",
      path: "/applications",
    },
    {
      icon: Sparkles,
      title: "Resume–Job Skill Matching",
      description:
        "Compare your core technical competencies with job postings in real time to spot missing qualifications and skill gaps.",
      label: "Gap analysis",
      path: "/resume-match",
    },
    {
      icon: CheckCircle2,
      title: "Eligibility Checker",
      description:
        "Instantly filter opportunities against CGPA cutoffs, degree program, department branch, and expected graduation cohort.",
      label: "Criterion validator",
      path: "/eligibility",
    },
    {
      icon: ShieldCheck,
      title: "Risk Detection",
      description:
        "Highlight applications that need immediate intervention due to expiring deadlines, missing documentation, or stagnant follow-ups.",
      label: "Proactive warnings",
      path: "/timeline",
    },
    {
      icon: Clock3,
      title: "Application Timeline",
      description:
        "Maintain an audit log of every email, assessment deadline, interview date, and recruiter response in an interactive ledger.",
      label: "Complete history",
      path: "/timeline",
    },
  ];

  const workflow = [
    {
      number: "01",
      icon: Upload,
      title: "Add opportunities",
      description:
        "Add your internship or job opportunities quickly using browser extensions or swift keyboard-first modal entry.",
      label: "URL auto-parser active",
    },
    {
      number: "02",
      icon: Clock3,
      title: "Track requirements & deadlines",
      description:
        "Track requirements, critical cutoff dates, and application stages automatically categorized without manual upkeep.",
      label: "Syncs with Google Calendar",
    },
    {
      number: "03",
      icon: Trophy,
      title: "Execute on smart priorities",
      description:
        "Follow smart priorities and stay on top of your career goals with clear, zero-clutter execution lists every single morning.",
      label: "Daily velocity summary",
    },
  ];

  const advantages = [
    {
      icon: CheckCircle2,
      title: "Reduce missed deadlines",
      description:
        "Eliminate submission oversights. Time-sensitive tests, video interview links, and resume cutoffs are ranked and surfaced automatically before they lapse.",
      badge: "0 missed deadlines reported",
    },
    {
      icon: FileText,
      title: "Stay organized across portals",
      description:
        "Consolidate Workday, Greenhouse, Lever, and email threads in a cohesive, distraction-free environment.",
      badge: "Multi-portal sync",
    },
    {
      icon: Target,
      title: "Identify suitable opportunities",
      description:
        "Filter out noise instantly. Pinpoint internships and roles that strictly match your specific degree, skill stack, and graduation timeline.",
    },
    {
      icon: TrendingUp,
      title: "Monitor application progress",
      description:
        "Gain immediate visibility into interview conversion ratios and identify stages where follow-ups are needed.",
    },
    {
      icon: Gauge,
      title: "Focus on high-yield opportunities",
      description:
        "Spend energy preparing for interviews with high offer likelihood rather than blindly spraying generic applications.",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen scroll-smooth bg-[#f8f9ff] text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
          {/* LOGO */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-3"
            aria-label="Go to top"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <TrendingUp size={19} strokeWidth={2.5} />
            </div>

            <span className="text-lg font-bold tracking-tight">
              CareerTrack
            </span>
          </button>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-9 text-sm font-medium text-slate-700 md:flex">
            <a href="#features" className="transition hover:text-indigo-600">
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-indigo-600"
            >
              How It Works
            </a>

            <a href="#benefits" className="transition hover:text-indigo-600">
              Benefits
            </a>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden text-sm font-medium text-slate-800 transition hover:text-indigo-600 sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Get Started Free
            </Link>

            <Link
              to="/profile"
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 hover:text-indigo-700 sm:flex"
              aria-label="Open profile"
            >
              CT
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="overflow-hidden bg-gradient-to-br from-white via-[#f8f9ff] to-indigo-50">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:py-24">
          {/* HERO CONTENT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold tracking-wider text-indigo-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              YOUR CAREER, UNDER CONTROL
            </div>

            <h1 className="max-w-[620px] text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 md:text-6xl">
              Stop Tracking Jobs in Spreadsheets.
              <span className="text-indigo-600">
                {" "}
                Start Building Your Career.
              </span>
            </h1>

            <p className="mt-7 max-w-[580px] text-lg leading-7 text-slate-600">
              Organize your internship and job applications, prioritize urgent
              deadlines, evaluate qualification requirements, and monitor
              interview momentum from one centralized workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Get Started Free
                <ArrowRight size={17} />
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:text-indigo-600"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-7 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={16} className="text-indigo-600" />
              Built specifically for students, freshers, and early-career pros.
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-indigo-100/60">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              </div>

              <div className="rounded-md bg-slate-50 px-3 py-1 text-xs text-slate-500">
                careertrack.io/workspace
              </div>

              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-600" />
                Live Sync
              </span>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-2">
              {[
                ["Total", "28"],
                ["Applied", "14"],
                ["Interviews", "5"],
                ["Offers", "2"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`rounded-lg p-3 ${
                    index > 1 ? "bg-indigo-50" : "bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-medium text-slate-500">{label}</p>

                  <p className="mt-1 text-xl font-bold text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* PRIORITY QUEUE */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Smart Priority Queue
                </span>

                <span className="text-xs font-medium text-indigo-600">
                  Top Recommendation
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-indigo-600">
                      S
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Stripe</p>

                      <p className="text-xs text-slate-500">
                        Software Engineer Intern • Full-stack
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
                      Priority 94
                    </span>

                    <p className="mt-1 text-xs font-medium text-red-500">
                      Due in 2 days
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs">
                  <span>Skill Alignment: TypeScript, Go, REST APIs</span>

                  <span className="font-bold text-indigo-600">96% Match</span>
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Upcoming Timeline
                </span>

                <span className="text-xs text-slate-500">This Week</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md bg-indigo-50 px-3 py-2 text-xs">
                  <span className="font-medium">
                    ● Vercel • Technical Round 1
                  </span>

                  <span>Tomorrow, 14:00</span>
                </div>

                <div className="flex items-center justify-between rounded-md bg-indigo-50 px-3 py-2 text-xs">
                  <span className="font-medium">
                    ● Figma • Take-home Submission
                  </span>

                  <span>Fri, 23:59</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THREE HIGHLIGHTS */}
        <div className="border-y border-slate-200/60 bg-indigo-50/50">
          <div className="mx-auto grid max-w-[1240px] gap-4 px-6 py-5 md:grid-cols-3">
            {[
              [
                FileText,
                "All applications in one place",
                "Centralize portals, notes, links, and documents.",
              ],
              [
                Clock3,
                "Never miss an important deadline",
                "Automated alerts for tests, rounds, and cutoffs.",
              ],
              [
                Filter,
                "Know which roles to prioritize",
                "Algorithmic sorting based on urgency & suitability.",
              ],
            ].map(([Icon, title, description]) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-lg bg-white p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="scroll-mt-20 mx-auto max-w-[1240px] px-6 py-24"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
            CORE CAPABILITIES
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Engineered for clarity, built to replace fragmented spreadsheets.
          </h2>

          <p className="mt-5 text-lg leading-7 text-slate-600">
            Every tool you need to streamline the transition from student
            applicant to high-performing candidate.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(
            ({ icon: Icon, title, description, label, path }) => (
              <Link
                key={title}
                to={path}
                className="group rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={19} />
                </div>

                <h3 className="mt-6 text-lg font-bold">{title}</h3>

                <p className="mt-2 min-h-[84px] text-sm leading-6 text-slate-500">
                  {description}
                </p>

                <div className="mt-6 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="font-mono">{label}</span>

                  <ArrowUpRight
                    size={16}
                    className="text-indigo-600 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* WORKFLOW */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-indigo-50/60 px-6 py-24"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
              SIMPLIFIED WORKFLOW
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              Three steps to complete application control
            </h2>

            <p className="mt-4 text-slate-600">
              Engineered for minimal data entry and maximum operational
              visibility.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {workflow.map(
              ({ number, icon: Icon, title, description, label }) => (
                <div
                  key={number}
                  className="rounded-xl border border-slate-200 bg-white p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-indigo-600">
                      {number}
                    </span>

                    <Icon size={21} className="text-slate-500" />
                  </div>

                  <h3 className="mt-7 text-lg font-bold">{title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {description}
                  </p>

                  <div className="mt-7 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-slate-600">
                    <span className="mr-2 text-indigo-600">●</span>
                    {label}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section
        id="benefits"
        className="scroll-mt-20 mx-auto max-w-[1240px] px-6 py-24"
      >
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
            TACTICAL ADVANTAGE
          </p>

          <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900">
            Designed to protect candidate bandwidth and elevate conversion.
          </h2>

          <p className="mt-3 text-slate-600">
            Navigating 50+ hiring pipelines doesn't have to cause burnout.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {advantages.map(({ icon: Icon, title, description, badge }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon size={18} />
                </div>

                {badge && (
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-mono text-slate-500">
                    {badge}
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-lg font-bold">{title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 px-6 py-16 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold tracking-wider text-indigo-600">
              <Sparkles size={13} />
              START TODAY FOR FREE
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
              Your Next Opportunity Starts Here.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Bring your applications, deadlines, and career goals together in a
              single, high-speed workspace.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Get Started Free
              <ArrowRight size={17} />
            </Link>

            <p className="mt-5 text-xs text-slate-500">
              No credit card required • Takes less than 2 minutes to set up
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <button type="button" onClick={scrollToTop} className="text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
                <TrendingUp size={15} />
              </div>

              <span className="font-bold">CareerTrack</span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Your career journey, organized.
            </p>
          </button>

          <nav className="flex flex-wrap gap-6 text-xs font-medium text-slate-500">
            <a href="#features" className="transition hover:text-indigo-600">
              Overview
            </a>

            <Link to="/job-search" className="transition hover:text-indigo-600">
              Explore Jobs
            </Link>

            <Link
              to="/resume-match"
              className="transition hover:text-indigo-600"
            >
              ATS Checker
            </Link>

            <a href="#benefits" className="transition hover:text-indigo-600">
              Privacy
            </a>
          </nav>

          <p className="text-xs text-slate-500">
            © 2025 CareerTrack Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
