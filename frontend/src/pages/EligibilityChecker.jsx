
import { useState } from "react";
import {
  ShieldCheck,
  GraduationCap,
  BriefcaseBusiness,
  CheckCircle2,
  AlertTriangle,
  Download,
  SlidersHorizontal,
  Pencil,
  FileText,
  LockKeyhole,
  Lightbulb,
  Search,
  X,
  ArrowUpRight,
  CircleHelp,
  MapPin,
  ChevronDown,
  CalendarDays,
  CircleDashed,
  Filter,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-slate-100 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Icon size={18} />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <Panel className="relative min-w-0 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <div className={`rounded-lg p-2 ${tones[tone]}`}>
          <Icon size={17} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-[11px] leading-4 text-slate-500">{detail}</p>
    </Panel>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
      <div className="rounded-full bg-white p-3 text-slate-400 shadow-sm">
        <Icon size={22} />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>
      {action}
    </div>
  );
}

function EligibilityChecker() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState("");

  // Real backend data will be connected here after the API contract
  // and eligibility endpoint are confirmed.
  // No sample candidates, jobs, companies or eligibility results.

  const hasApplications = false;
  const hasProfile = false;
  const hasEligibilityResult = false;

  const handleExport = () => {
    // Enable CSV export after real eligibility data is connected.
  };

  return (
    <div className="min-h-screen bg-[#f6f7ff] p-4 text-slate-800 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">

        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-indigo-600">
                Eligibility Verification Engine
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Candidate Eligibility & Criteria Checker
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
              Review candidate requirements, academic criteria and application
              eligibility in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled
              onClick={handleExport}
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-400"
            >
              <Download size={15} />
              Export Audit Report
            </button>

            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-300"
            >
              <ShieldCheck size={15} />
              Re-Batch Roles
            </button>

            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              <Pencil size={14} />
              Edit Base Profile
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={ShieldCheck}
            label="Unrestricted Clearance"
            value="—"
            detail="Eligibility results will appear when application data is available."
            tone="blue"
          />
          <MetricCard
            icon={CircleDashed}
            label="Conditional Clearance"
            value="—"
            detail="Applications requiring additional verification."
            tone="amber"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Hard Cutoff Breaches"
            value="—"
            detail="Applications with confirmed cutoff issues."
            tone="rose"
          />
          <MetricCard
            icon={GraduationCap}
            label="GPA Buffer Margin"
            value="—"
            detail="Calculated from your profile and selected job criteria."
            tone="indigo"
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">

          {/* Left column */}
          <div className="min-w-0 space-y-5 xl:col-span-2">

            {/* Target application and criteria */}
            <Panel className="p-4 sm:p-5">
              <SectionTitle
                icon={SlidersHorizontal}
                title="Target Application"
                subtitle="Select an application to inspect its eligibility criteria."
                action={
                  <Link
                    to="/applications"
                    className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-indigo-700"
                  >
                    View Applications
                  </Link>
                }
              />

              <div className="mt-5">
                <label
                  htmlFor="targetApplication"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Select target application
                </label>

                <div className="relative">
                  <select
                    id="targetApplication"
                    value={selectedApplication}
                    onChange={(event) =>
                      setSelectedApplication(event.target.value)
                    }
                    disabled={!hasApplications}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 pr-10 text-xs text-slate-500 outline-none focus:border-indigo-400 disabled:cursor-not-allowed"
                  >
                    <option value="">No applications available</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-5">
                <EmptyState
                  icon={BriefcaseBusiness}
                  title="No application selected"
                  description="Your saved applications will appear here. Select an application to view its company details and eligibility assessment."
                  action={
                    <Link
                      to="/job-search"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Find Jobs
                      <ArrowUpRight size={14} />
                    </Link>
                  }
                />
              </div>

              <div className="mt-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Detailed Criteria Breakdown
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Awaiting eligibility data
                  </span>
                </div>

                <EmptyState
                  icon={CheckCircle2}
                  title="Criteria assessment unavailable"
                  description="CGPA, graduation window, degree, major and other requirements will be displayed after the eligibility API is connected."
                />
              </div>
            </Panel>

            {/* Pipeline matrix */}
            <Panel className="overflow-hidden">
              <div className="p-4 sm:p-5">
                <SectionTitle
                  icon={BriefcaseBusiness}
                  title="Active Pipeline Clearance Matrix"
                  subtitle="Eligibility overview of your active applications."
                  action={
                    <button
                      type="button"
                      disabled
                      className="inline-flex cursor-not-allowed items-center gap-1 text-xs font-semibold text-slate-300"
                    >
                      <Download size={14} />
                      CSV
                    </button>
                  }
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search companies or roles..."
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="relative">
                    <Filter
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs outline-none focus:border-indigo-400 sm:w-36"
                    >
                      <option>All</option>
                      <option>Eligible</option>
                      <option>Conditional</option>
                      <option>Ineligible</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-bold">Company & Role</th>
                      <th className="px-4 py-3 font-bold">Min GPA</th>
                      <th className="px-4 py-3 font-bold">Grad Term</th>
                      <th className="px-4 py-3 font-bold">Work Auth.</th>
                      <th className="px-5 py-3 font-bold">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="px-5 py-2">
                        <EmptyState
                          icon={BriefcaseBusiness}
                          title="No applications to display"
                          description="Your application records and eligibility verdicts will appear in this matrix."
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">
                Application records will be loaded from your account.
              </div>
            </Panel>
          </div>

          {/* Right column */}
          <div className="min-w-0 space-y-5">

            {/* Candidate baseline */}
            <Panel className="p-4 sm:p-5">
              <SectionTitle
                icon={GraduationCap}
                title="Verified Candidate Baseline"
                subtitle="Your current candidate profile"
                action={
                  <Link
                    to="/profile"
                    aria-label="Edit candidate profile"
                    className="rounded-lg border border-slate-200 p-2 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Pencil size={14} />
                  </Link>
                }
              />

              {!hasProfile ? (
                <div className="mt-5">
                  <EmptyState
                    icon={LockKeyhole}
                    title="Profile data unavailable"
                    description="Complete your candidate profile to view your academic details and verification status."
                    action={
                      <Link
                        to="/profile"
                        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        Complete Profile
                      </Link>
                    }
                  />
                </div>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Degree & Major", icon: GraduationCap },
                  { label: "Expected Graduation", icon: CalendarDays },
                  { label: "Cumulative GPA", icon: ShieldCheck },
                  { label: "Work Authorization", icon: LockKeyhole },
                ].map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-lg bg-indigo-50/70 p-3"
                  >
                    <Icon size={15} className="mb-2 text-indigo-500" />
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Not available
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <LockKeyhole size={14} />
                  Verification status unavailable
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Profile and verification information will come from your account data.
                </p>
              </div>
            </Panel>

            {/* Risk detector */}
            <Panel className="p-4 sm:p-5">
              <SectionTitle
                icon={AlertTriangle}
                title="Hard Cutoff Risk Detector"
                subtitle="Potential eligibility issues"
              />

              <div className="mt-5">
                <EmptyState
                  icon={ShieldCheck}
                  title="No risk assessment available"
                  description="Risk warnings will be generated from verified candidate details and actual job requirements."
                />
              </div>
            </Panel>

            {/* Strategy */}
            <Panel className="p-4 sm:p-5">
              <SectionTitle
                icon={Lightbulb}
                title="Eligibility Strategy & Tips"
                subtitle="Candidate guidance"
              />

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Profile information
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Keep your academic and candidate profile information up to date.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                    <CircleHelp size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Verify requirements
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Check the employer's official requirements before relying on an eligibility result.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Keep applications updated
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Maintain accurate application and profile information.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/profile"
                className="mt-5 flex items-center justify-between rounded-lg bg-indigo-50 p-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  Update Candidate Profile
                </span>
                <ArrowUpRight size={15} />
              </Link>
            </Panel>
          </div>
        </div>

        {/* Accuracy notice */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-[11px] leading-5 text-slate-500">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-indigo-600" />
          <p>
            <strong className="text-slate-700">
              Data accuracy notice:
            </strong>{" "}
            Eligibility results will be displayed using candidate profile,
            application and employer criteria data received from the backend.
            No sample candidate records or fabricated eligibility results are used.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EligibilityChecker;
