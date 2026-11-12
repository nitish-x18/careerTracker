import {
  FileText,
  Target,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Clock3,
  Sparkles,
  ShieldCheck,
  CircleAlert,
  WandSparkles,
  ClipboardCheck,
  Info,
} from "lucide-react";

/* =========================================================
   SUMMARY CARD
========================================================= */

const summaryCards = [
  {
    title: "OVERALL PORTFOLIO MATCH",
    value: "N/A",
    subtitle: "Awaiting resume analysis",
    icon: Target,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "MATCHED TECHNICAL SKILLS",
    value: "N/A",
    subtitle: "Verified skills unavailable",
    icon: CheckCircle2,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    title: "CRITICAL SKILL GAPS",
    value: "N/A",
    subtitle: "No analysis available",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "ESTIMATED ATS PASS RATE",
    value: "N/A",
    subtitle: "ATS analysis unavailable",
    icon: ClipboardCheck,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

function SummaryCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="max-w-[160px] text-[10px] font-bold leading-5 tracking-wide text-gray-500">
          {item.title}
        </p>

        <div className={`rounded-lg p-2 ${item.bg}`}>
          <Icon size={19} className={item.color} />
        </div>
      </div>

      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {item.value}
      </p>

      <p className="mt-2 text-xs leading-5 text-gray-400">
        {item.subtitle}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && (
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <Icon size={18} />
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-gray-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-[11px] leading-4 text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyMessage({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-4 py-6 text-center">
      <FileText size={22} className="mx-auto text-gray-400" />

      <p className="mt-2 text-xs font-semibold text-gray-700">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-xs text-[11px] leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   UNAVAILABLE FEATURE PANEL
========================================================= */

function UnavailablePanel({ title, description, icon: Icon }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-indigo-600" />

        <h3 className="text-xs font-semibold text-gray-800">
          {title}
        </h3>
      </div>

      <p className="mt-2 text-[11px] leading-5 text-gray-500">
        {description}
      </p>

      <span className="mt-3 inline-block rounded-md bg-gray-200 px-2 py-1 text-[9px] font-semibold text-gray-500">
        NOT AVAILABLE
      </span>
    </div>
  );
}

/* =========================================================
   MAIN RESUME MATCH PAGE
========================================================= */

function ResumeMatch() {
  return (
    <div className="min-h-screen bg-[#f7f8ff] p-4 sm:p-5 lg:p-6">

      {/* PAGE HEADER */}

      <section className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-5">

          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              <span>Workspace</span>
              <span>/</span>

              <span className="text-indigo-600">
                Resume Match & Skill Gap
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Resume Match & Skill Gap Analyzer
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-600 sm:text-sm">
              Evaluate your technical credentials against target job
              descriptions, discover keyword deficiencies, and follow
              structured roadmaps to improve your resume.
            </p>
          </div>

          {/* TOP ACTIONS */}

          <div className="flex min-w-[230px] flex-col items-start gap-2 sm:items-end">

            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              PARSER API NOT CONNECTED
            </span>

            <button
              type="button"
              disabled
              title="Resume upload API is not available yet"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-400 opacity-70"
            >
              <Upload size={14} />
              Upload Resume

              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px]">
                N/A
              </span>
            </button>

            <button
              type="button"
              disabled
              title="Benchmark API is not available yet"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-400 opacity-70"
            >
              <SlidersHorizontal size={14} />
              Benchmark: Unavailable
              <ChevronDown size={13} />
            </button>

            <button
              type="button"
              disabled
              title="Resume Match API is not available yet"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white opacity-50"
            >
              <RefreshCw size={13} />
              Re-analyze ATS Match
            </button>

          </div>
        </div>
      </section>

      {/* API NOTICE */}

      <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
        <Info size={16} className="mt-0.5 shrink-0 text-amber-600" />

        <p className="text-[11px] leading-5 text-amber-800">
          Resume analysis is currently unavailable. Scores, skill gaps
          and ATS results will appear when the Resume Match backend
          functionality is implemented and connected.
        </p>
      </div>

      {/* SUMMARY CARDS */}

      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <SummaryCard key={item.title} item={item} />
        ))}
      </section>

      {/* MAIN DASHBOARD GRID */}

      <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">

        {/* LEFT COLUMN */}

        <div className="space-y-4 xl:col-span-8">

          {/* SKILL GAP MATRIX */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-3">

              <SectionHeader
                title="Skill Gap & Coverage Matrix"
                subtitle="Identify missing skills and improvement areas"
                icon={Target}
              />

              <div className="flex items-center gap-1 rounded-lg bg-indigo-50 p-1">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-md bg-white px-3 py-2 text-[10px] font-bold text-gray-400 shadow-sm"
                >
                  All
                </button>

                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed px-2 py-2 text-[10px] text-gray-400"
                >
                  Role by Role
                </button>

                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed px-2 py-2 text-[10px] text-gray-400"
                >
                  JD Diff
                </button>
              </div>

            </div>

            {/* HIGH PRIORITY */}

            <div className="mt-4">

              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-800">
                    High Urgency Deficits
                  </h3>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-semibold text-red-600">
                  Analysis Pending
                </span>
              </div>

              <EmptyMessage
                title="Critical skill gaps not available"
                description="Missing keywords, critical requirements and their ATS impact will appear here after resume and job description analysis."
              />

            </div>

            {/* MODERATE GAPS */}

            <div className="mt-5">

              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />

                  <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-800">
                    Moderate Gaps & Nice-to-Haves
                  </h3>
                </div>

                <span className="text-[10px] text-gray-400">
                  Awaiting analysis
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  "Technical Skills",
                  "Tools & Technologies",
                  "Other Requirements",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <p className="text-xs font-semibold text-gray-700">
                      {item}
                    </p>

                    <p className="mt-2 text-[10px] text-gray-400">
                      No analysis available
                    </p>
                  </div>
                ))}
              </div>

            </div>

            {/* STRONGEST COMPETENCIES */}

            <div className="mt-5 border-t border-gray-100 pt-4">

              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />

                  <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-800">
                    Strongest Matched Competencies
                  </h3>
                </div>

                <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-600">
                  Awaiting verification
                </span>
              </div>

              <EmptyMessage
                title="No verified competencies available"
                description="Verified technical and professional skills will appear here after resume analysis."
              />

            </div>

          </div>

          {/* BULLET POINT SYNTHESIZER */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex flex-wrap items-start justify-between gap-3">

              <SectionHeader
                title="Interactive Bullet Point Synthesizer"
                subtitle="Improve resume bullet points using relevant skills and keywords"
                icon={WandSparkles}
              />

              <span className="rounded-md bg-indigo-50 px-2 py-1 text-[9px] font-semibold text-indigo-600">
                AI FEATURE
              </span>

            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">

              {/* CURRENT BULLET */}

              <div className="rounded-lg border border-gray-100 bg-[#f7f8ff] p-3">

                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Current Bullet on Resume
                </p>

                <div className="mt-4 flex min-h-[110px] items-center justify-center">
                  <p className="text-center text-xs leading-6 text-gray-400">
                    Your resume bullet points will appear here after
                    resume upload and parsing.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <p className="text-[10px] text-gray-400">
                    Resume content unavailable
                  </p>
                </div>

              </div>

              {/* RECOMMENDED REVISION */}

              <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-3">

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                    Recommended Revision
                  </p>

                  <Sparkles size={15} className="text-indigo-600" />
                </div>

                <div className="mt-4 flex min-h-[110px] items-center justify-center">
                  <p className="text-center text-xs leading-6 text-gray-500">
                    AI-generated resume improvements will appear here
                    after analysis.
                  </p>
                </div>

                <div className="border-t border-indigo-100 pt-2">
                  <p className="text-[10px] text-indigo-500">
                    Keyword improvement: N/A
                  </p>
                </div>

              </div>

            </div>

            <div className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-gray-400">
              <Info size={14} className="mt-0.5 shrink-0" />

              Suggestions will be based on actual resume content
              and verified skills when this feature is connected.
            </div>

            <button
              type="button"
              disabled
              title="Resume analysis API is not available yet"
              className="mt-3 inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-semibold text-white opacity-50"
            >
              <Sparkles size={13} />
              Generate Suggestions
            </button>

          </div>

        </div>

        {/* RIGHT COLUMN */}

        <div className="space-y-4 xl:col-span-4">

          {/* COMPANY ALIGNMENT */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

            <SectionHeader
              title="Company Alignment"
              subtitle="Match analysis for target company postings"
              icon={Building2}
            />

            <div className="mt-4">
              <EmptyMessage
                title="Company alignment unavailable"
                description="Company-wise match scores and missing requirements will appear here when job matching data is available."
              />
            </div>

          </div>

          {/* SKILL SPRINTS */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

            <SectionHeader
              title="14-Day Skill Sprints"
              subtitle="Personalized projects and learning plans"
              icon={Clock3}
            />

            <div className="mt-4">
              <EmptyMessage
                title="Learning plan not generated"
                description="Personalized projects and learning recommendations will be generated after your resume skill gaps are identified."
              />
            </div>

          </div>

          {/* ATS PARSING HEALTH */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between gap-2">

              <SectionHeader
                title="ATS Parsing Health"
                icon={ShieldCheck}
              />

              <span className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600">
                N/A
              </span>

            </div>

            <p className="mt-2 text-[11px] text-gray-500">
              Resume parsing and compatibility checks
            </p>

            <div className="mt-4">
              <EmptyMessage
                title="ATS checks not performed"
                description="Font hierarchy, document structure, contact information and section recognition cannot be checked until a resume is uploaded and parsed."
              />
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2">
              <CircleAlert
                size={14}
                className="mt-0.5 shrink-0 text-amber-500"
              />

              <p className="text-[10px] leading-5 text-amber-700">
                No ATS checks have been completed.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <div className="mt-5 flex items-start gap-2 pb-3 text-[10px] leading-5 text-gray-400">
        <Info size={14} className="mt-0.5 shrink-0" />

        <p>
          Resume match scores, company alignment, skill gaps and ATS
          results require actual resume and job description analysis.
          No sample analysis results are displayed.
        </p>
      </div>

    </div>
  );
}

export default ResumeMatch;