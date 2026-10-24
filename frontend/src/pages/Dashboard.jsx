import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Flame,
  FolderOpen,
  Gauge,
  Play,
  Send,
  Sparkles,
  TriangleAlert,
  Users,
  Zap,
  History,
} from "lucide-react";
import { getDashboardData } from "../services/dashboardService";


const iconMap = {
  total: FolderOpen,
  applied: Send,
  interviews: Play,
  offers: Users,
};

const colorMap = {
  violet: "bg-violet-700",
  cyan: "bg-cyan-600",
  slate: "bg-slate-500",
  orange: "bg-orange-700",
  indigo: "bg-indigo-600",
};

const textColorMap = {
  warning: "text-amber-800",
  danger: "text-red-600",
  success: "text-cyan-800",
};

const activityIconMap = {
  document: FileText,
  calendar: CalendarClock,
  offer: BriefcaseBusiness,
};

function SectionTitle({ icon: Icon, children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-1.5 text-[13px] font-bold tracking-tight text-slate-800">
        {Icon && <Icon size={13} className="text-violet-700" />}
        {children}
      </h2>

      {action && (
        <button className="shrink-0 text-[8px] font-semibold text-violet-700">
          {action}
        </button>
      )}
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = iconMap[stat.id] || BriefcaseBusiness;

  return (
    <article className="min-w-0 px-1.5">
      <div className="flex min-h-4 items-center justify-between gap-1">
        <h3 className="truncate text-[8px] font-semibold uppercase tracking-wide text-slate-500">
          {stat.label}
        </h3>
        <Icon size={11} className="shrink-0 text-slate-400" />
      </div>

      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-[21px] font-bold leading-6 tracking-tight text-slate-800">
          {stat.value}
        </span>
        <span className="truncate text-[7px] font-semibold text-cyan-700">
          {stat.detail}
        </span>
      </div>

      
<div className="mt-1 flex items-center justify-between gap-1">
  <span className="truncate text-[8px] text-slate-500">
    {stat.footer}
  </span>

  {stat.secondaryDetail && (
    <span className="shrink-0 text-[7px] text-slate-500">
      {stat.secondaryDetail}
    </span>
  )}

  {stat.secondaryFooter && (
    <span className="shrink-0 text-[7px] font-semibold text-violet-700">
      {stat.secondaryFooter}
    </span>
  )}

  {stat.id === "total" && (
    <span className="shrink-0 text-[7px] font-semibold text-violet-700">
      70% goal
    </span>
  )}
</div>


      <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full ${colorMap[stat.color] || colorMap.violet}`}
          style={{ width: `${stat.progress}%` }}
        />
      </div>
    </article>
  );
}

function PriorityRow({ item }) {
  return (
    <article className="grid grid-cols-[25px_minmax(0,1fr)] items-center gap-x-2 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[25px_minmax(0,1fr)_auto]">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-50 text-[10px] font-bold text-violet-700">
        {item.initials}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <h3 className="text-[9px] font-bold text-slate-800">
            {item.company}
          </h3>

          <span className="rounded-sm bg-cyan-50 px-1 py-0.5 text-[7px] font-bold text-cyan-800">
            {item.match}% MATCH
          </span>

          <span className="text-[7px] text-violet-700">
            {item.priority}
          </span>
        </div>

        <p className="mt-0.5 text-[8px] leading-tight text-slate-600">
          {item.role} · {item.location}
        </p>

        
<p
  className={`mt-0.5 max-w-full text-[8px] font-semibold leading-[1.15] ${
    textColorMap[item.taskStyle] || "text-slate-600"
  }`}
>
  {item.task}
  {item.time && ` (${item.time})`}
</p>

      </div>

      
<div className="col-start-2 mt-1 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:col-start-auto sm:mt-0">
  <button className="whitespace-nowrap text-[8px] font-semibold text-slate-600">
    {item.secondaryAction}
  </button>

  <button
    className={`whitespace-nowrap rounded-md px-2 py-1 text-[8px] font-semibold ${
      item.actionStyle === "primary"
        ? "bg-violet-700 text-white"
        : "text-violet-700"
    }`}
  >
    {item.action}
  </button>
</div>

    </article>
  );
}

function AttentionPanel({ alerts }) {
  return (
    <section className="border-l-[3px] border-amber-800 py-1 pl-2">
      <div className="mb-2 flex items-center justify-between gap-1">
        <h2 className="flex items-center gap-1 text-[9px] font-bold text-amber-900">
          <TriangleAlert size={11} />
          Attention Needed
        </h2>

        <span className="whitespace-nowrap rounded-sm bg-red-50 px-1 py-0.5 text-[7px] font-bold text-red-700">
          {alerts.length} ALERTS
        </span>
      </div>

      <p className="mb-2 text-[8px] leading-relaxed text-slate-600">
        Applications have missing resume keywords or approaching cutoff windows.
      </p>

      <div className="space-y-2.5">
        {alerts.map((alert) => (
          <div key={alert.id}>
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-[8px] font-bold text-slate-800">
                {alert.company}
              </h3>
              <span
                className={`text-[7px] font-semibold ${
                  textColorMap[alert.style] || "text-slate-600"
                }`}
              >
                {alert.label}
              </span>
            </div>
            <p className="mt-0.5 text-[8px] leading-relaxed text-slate-500">
              {alert.description}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-3 w-full rounded-sm bg-cyan-50/70 py-1.5 text-[8px] font-semibold text-violet-700">
        Run Keyword Optimizer
      </button>
    </section>
  );
}

function DeadlinesPanel({ deadlines }) {
  return (
    <section>
      <div className="mb-3 flex items-start justify-between">
        <h2 className="flex items-center gap-1 text-[12px] font-bold leading-tight text-slate-800">
          <CalendarClock size={12} />
          <span>Upcoming<br />Deadlines</span>
        </h2>

        <span className="text-[7px] leading-tight text-slate-500">
          Sorted<br />soonest
        </span>
      </div>

      <div className="space-y-3">
        {deadlines.map((item) => (
          <article key={item.id}>
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-[8px] font-bold text-slate-800">
                {item.company}
              </h3>

              <span
                className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[7px] font-bold ${
                  item.badgeStyle === "urgent"
                    ? "bg-red-600 text-white"
                    : "bg-cyan-50 text-cyan-800"
                }`}
              >
                {item.badge}
              </span>
            </div>

            <p className="mt-0.5 text-[8px] leading-tight text-slate-600">
              {item.role}
            </p>

            
<div className="mt-1 flex items-start justify-between gap-1">
  <p
    className={`flex min-w-0 items-start gap-1 text-[7px] leading-tight ${
      item.badgeStyle === "urgent"
        ? "font-semibold text-red-600"
        : "text-slate-500"
    }`}
  >
    <Clock3 size={9} className="mt-0.5 shrink-0" />
    <span>{item.date}</span>
  </p>

  <button
    className={`shrink-0 rounded-sm px-1.5 py-1 text-[7px] font-bold leading-tight ${
      item.actionStyle === "primary"
        ? "bg-violet-700 text-white"
        : "text-slate-700"
    }`}
  >
    {item.action}
  </button>
</div>

          </article>
        ))}
      </div>
    </section>
  );
}


function PipelineOverview({ stages, summary }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
    <Gauge size={15} />
  </div>

  <h2 className="text-sm font-bold tracking-tight text-slate-800">
    Application Pipeline Overview
  </h2>
</div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[8px] text-slate-500">
          {summary.description}
        </p>
        <span className="shrink-0 text-[7px] text-slate-400">
          {summary.updated}
        </span>
      </div>

      {/* Pipeline stages */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {stages.map((stage, index) => {
          
const stageColorMap = {
  drafts: {
    bar: "bg-slate-500",
    text: "text-slate-600",
  },
  applied: {
    bar: "bg-cyan-700",
    text: "text-cyan-700",
  },
  assessment: {
    bar: "bg-amber-800",
    text: "text-amber-800",
  },
  technical: {
    bar: "bg-indigo-700",
    text: "text-indigo-700",
  },
  final: {
    bar: "bg-violet-700",
    text: "text-violet-700",
  },
  offers: {
    bar: "bg-cyan-500",
    text: "text-cyan-600",
  },
};

const colors = stageColorMap[stage.id] || {
  bar: "bg-slate-500",
  text: "text-slate-600",
};

          return (
            <div key={stage.id} className="min-w-0">
              <p
  className={`min-h-5 text-[7px] font-bold uppercase leading-tight tracking-wide ${colors.text}`}
>
  {stage.label}
</p>

              <div className="mt-1 flex flex-wrap items-baseline gap-x-1">
                <span className="text-[12px] font-bold text-slate-800">
                  {stage.value}
                </span>
                <span className={`text-[7px] font-medium ${colors.text}`}>
                  {stage.percentage}%
                </span>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
                  style={{
                    width: `${Math.min(100, Math.max(0, stage.percentage))}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion trend */}
      <div className="mt-5 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[9px] font-semibold text-violet-700">
  Stage Pass-Through Rate
</h3>
          <span className="rounded-md bg-violet-50 px-2 py-1 text-[7px] font-semibold text-violet-700">
            {summary.conversionLabel}: {summary.conversionPercentage}%
          </span>
        </div>

        <svg
          viewBox="0 0 420 52"
          preserveAspectRatio="none"
          className="mt-2 h-12 w-full"
          role="img"
          aria-label="Application pipeline pass-through trend"
        >
          <defs>
            <linearGradient
              id="pipelineLineGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          <path
            d={summary.chartPoints
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
              )
              .join(" ")}
            fill="none"
            stroke="url(#pipelineLineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {summary.chartPoints.map((point, index) => (
            <circle
              key={`${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r={index === 0 || index === summary.chartPoints.length - 1 ? 3 : 2}
              fill="white"
              stroke={index % 2 === 0 ? "#7c3aed" : "#06b6d4"}
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
    </section>
  );
}


function ActivityLog({ activities }) {
  return (
    <section>
      <SectionTitle icon={History}>Recent Activity Log</SectionTitle>

      <div className="space-y-3">
        {activities.map((item) => {
          const Icon = activityIconMap[item.icon] || Activity;

          return (
            <article key={item.id} className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                <Icon size={10} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-semibold leading-tight text-slate-700">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[7px] leading-relaxed text-slate-500">
                  {item.detail}
                </p>
              </div>

             
<span
  className={`shrink-0 whitespace-nowrap text-[7px] ${
    item.status
      ? "font-semibold text-cyan-700"
      : "text-slate-400"
  }`}
>
  {item.status || item.time}
</span>

            </article>
          );
        })}
      </div>
    </section>
  );
}


function QuickAddPanel({ content }) {
  const [jobUrl, setJobUrl] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isProcessing, setIsProcessing] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const trimmedUrl = jobUrl.trim();

    if (!trimmedUrl) {
      setMessage("Please enter a job URL.");
      setMessageType("error");
      return;
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      setMessage("Please enter a valid URL.");
      setMessageType("error");
      return;
    }

    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      !parsedUrl.hostname.includes(".")
    ) {
      setMessage("Please enter a valid HTTP or HTTPS URL.");
      setMessageType("error");
      return;
    }

    setIsProcessing(true);
    setMessageType("success");
    setMessage(
      "URL looks valid! Job importing will be available when the backend is connected."
    );
    setIsProcessing(false);
  }

  return (
    <section className="rounded-xl bg-gradient-to-br from-violet-700 to-indigo-800 p-3 text-white shadow-sm">
      <p className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide">
        <Sparkles size={11} />
        {content.eyebrow}
      </p>

      <h2 className="mt-3 text-[12px] font-bold">{content.title}</h2>

      <p className="mt-1 text-[8px] leading-relaxed text-violet-100">
        {content.description}
      </p>

      <form onSubmit={handleSubmit} className="mt-2 space-y-1.5">
        <input
          type="url"
          value={jobUrl}
          onChange={(event) => {
            setJobUrl(event.target.value);
            setMessage("");
          }}
          placeholder={content.placeholder}
          aria-label="Job posting URL"
          aria-invalid={messageType === "error" && Boolean(message)}
          className="w-full rounded-md border border-white/40 bg-white px-2 py-1.5 text-[8px] text-slate-800 outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full rounded-md bg-white py-1.5 text-[8px] font-bold text-violet-800 disabled:opacity-70"
        >
          {isProcessing ? "Checking..." : content.buttonLabel}
        </button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-md bg-white/10 p-2 text-[9px] leading-relaxed ${
              messageType === "error" ? "text-rose-100" : "text-emerald-100"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}


export default function Dashboard() {
  const navigate = useNavigate();

const [sortBy, setSortBy] = useState("match");
const [data, setData] = useState(null);
const [error, setError] = useState("");
const [reloadKey, setReloadKey] = useState(0);

const sortedPriorityApplications = useMemo(() => {
  if (!data?.priorityApplications) return [];

  const applications = [...data.priorityApplications];

  if (sortBy === "match") {
    return applications.sort((a, b) => b.match - a.match);
  }

  return applications.sort((a, b) => {
    const getUrgency = (item) => {
      const task = `${item.task} ${item.time}`.toLowerCase();

      if (task.includes("overdue")) return 0;
      if (task.includes("today")) return 1;
      if (task.includes("tomorrow")) return 2;
      if (task.includes("in 2 days")) return 3;
      if (task.includes("in 3 days")) return 4;

      return 5;
    };

    return getUrgency(a) - getUrgency(b);
  });
}, [data, sortBy]);


  useEffect(() => {
  let active = true;

  setError("");
  setData(null);

  getDashboardData()
    .then((result) => {
      if (active) setData(result);
    })
    .catch(() => {
      if (active) {
        setError("Dashboard data could not be loaded.");
      }
    });

  return () => {
    active = false;
  };
}, [reloadKey]);

  if (error) {
  return (
    <div
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      <p>{error}</p>

      <button
        type="button"
        onClick={() => setReloadKey((key) => key + 1)}
        className="mt-3 rounded-md bg-red-700 px-3 py-1.5 text-xs font-semibold text-white"
      >
        Try Again
      </button>
    </div>
  );
}

  if (!data) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-16 animate-pulse rounded-md bg-slate-100" />
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-md bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 bg-white text-slate-800">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-[7px] font-bold tracking-[0.15em] text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-700" />
            {data.sprint}
          </p>

          <h1 className="text-[20px] font-bold leading-tight tracking-tight text-slate-900">
            Welcome back, {data.userName}!
          </h1>

          <p className="mt-1 text-[9px] text-slate-500">
            You have{" "}
            <span className="font-semibold text-violet-700">
              {data.priorityApplications.length} high-priority applications
            </span>{" "}
            to focus on this week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
  type="button"
  onClick={() => navigate("/resume-match")}
  className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[8px] font-semibold text-violet-700"
>
  <Zap size={11} />
  Quick Scan
</button>

          <button
  type="button"
  onClick={() => navigate("/applications")}
  className="flex items-center gap-1 rounded-md bg-violet-700 px-2.5 py-1.5 text-[8px] font-semibold text-white"
>
  <span className="text-sm leading-none">+</span>
  Add Application
</button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-x-3 gap-y-4 border-b border-slate-100 pb-4 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_172px] xl:grid-cols-[minmax(0,1fr)_190px]">
        <div className="min-w-0 space-y-6">
          <section>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <SectionTitle icon={Flame}>
                Priority Focus Applications
              </SectionTitle>

              <div className="flex gap-3 text-[7px]">
                <button
  type="button"
  onClick={() => setSortBy("match")}
  className={`font-semibold ${
    sortBy === "match" ? "text-violet-700" : "text-slate-500"
  }`}
>
  By Match Score
</button>

<button
  type="button"
  onClick={() => setSortBy("date")}
  className={`font-semibold ${
    sortBy === "date" ? "text-violet-700" : "text-slate-500"
  }`}
>
  By Due Date
</button>
              </div>
            </div>

            {sortedPriorityApplications.map((item) => (
  <PriorityRow key={item.id} item={item} />
))}
          </section>

          <PipelineOverview
            stages={data.pipeline}
            summary={data.pipelineSummary}
          />

          <ActivityLog activities={data.activity} />
        </div>

        <aside className="min-w-0 space-y-6">
          <AttentionPanel alerts={data.alerts} />
          <DeadlinesPanel deadlines={data.deadlines} />
          <QuickAddPanel content={data.quickAdd} />
        </aside>
      </div>
    </div>
  );
}



