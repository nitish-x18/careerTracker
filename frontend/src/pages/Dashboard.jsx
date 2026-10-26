
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BriefcaseBusiness,
  CalendarClock,
  Clock3,
  FileText,
  Flame,
  FolderOpen,
  Gauge,
  History,
  Play,
  Send,
  Sparkles,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import { getDashboardData } from "../services/dashboardService";

const iconMap = {
  total: FolderOpen,
  applied: Send,
  interviews: Play,
  offers: Users,
};

const colorMap = {
  violet: "bg-violet-600",
  cyan: "bg-cyan-600",
  slate: "bg-slate-500",
  orange: "bg-orange-600",
  indigo: "bg-indigo-600",
};

const textColorMap = {
  warning: "text-amber-700",
  danger: "text-red-600",
  success: "text-cyan-700",
};

const activityIconMap = {
  document: FileText,
  calendar: CalendarClock,
  offer: BriefcaseBusiness,
};

const cardClass =
  "min-w-0 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4";

function SectionTitle({ icon: Icon, children, action }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <h2 className="flex min-w-0 items-center gap-2 text-base font-bold tracking-tight text-slate-800">
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
            <Icon size={17} />
          </span>
        )}
        {children}
      </h2>

      {action && (
        <button
          type="button"
          className="shrink-0 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          {action}
        </button>
      )}
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = iconMap[stat.id] || BriefcaseBusiness;

  return (
    <article className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-violet-200">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-500">
          {stat.label}
        </h3>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
          <Icon size={19} />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-2xl font-bold leading-none tracking-tight text-slate-900">
          {stat.value}
        </span>

        {stat.detail && (
          <span className="text-sm font-semibold text-cyan-700">
            {stat.detail}
          </span>
        )}
      </div>

      <div className="mt-2 flex min-h-5 flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <span className="text-sm text-slate-500">{stat.footer}</span>

        {stat.secondaryDetail && (
          <span className="text-sm text-slate-500">
            {stat.secondaryDetail}
          </span>
        )}

        {stat.secondaryFooter && (
          <span className="text-sm font-semibold text-violet-700">
            {stat.secondaryFooter}
          </span>
        )}

        {stat.id === "total" && (
          <span className="text-sm font-semibold text-violet-700">
            70% goal
          </span>
        )}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            colorMap[stat.color] || colorMap.violet
          }`}
          style={{
            width: `${Math.min(100, Math.max(0, stat.progress))}%`,
          }}
        />
      </div>
    </article>
  );
}

function PriorityRow({ item, onAction, onSecondaryAction }) {
  return (
    <article className="flex min-w-0 flex-col gap-3 border-b border-slate-100 py-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-sm font-bold text-violet-700">
          {item.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-800">
              {item.company}
            </h3>

            <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-bold text-cyan-800">
              {item.match}% MATCH
            </span>

            {item.priority && (
              <span className="text-sm font-medium text-violet-700">
                {item.priority}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {item.role} · {item.location}
          </p>

          <p
            className={`mt-1 text-sm font-medium leading-relaxed ${
              textColorMap[item.taskStyle] || "text-slate-600"
            }`}
          >
            {item.task}
            {item.time && ` (${item.time})`}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end sm:pl-2">
        <button
  type="button"
  onClick={onSecondaryAction}
  className="text-sm font-semibold text-slate-500 transition hover:text-slate-800"
>
  {item.secondaryAction}
</button>

       <button
  type="button"
  onClick={onAction}
  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
    item.actionStyle === "primary"
      ? "bg-violet-700 text-white hover:bg-violet-800"
      : "bg-violet-50 text-violet-700 hover:bg-violet-100"
  }`}
>
  {item.action}
</button>
      </div>
    </article>
  );
}

function AttentionPanel({ alerts, onOptimize }) {
  return (
    <section className={cardClass}>
      <SectionTitle icon={TriangleAlert}>
        Attention Needed
      </SectionTitle>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-amber-50 px-3 py-2">
        <p className="text-sm text-amber-900">
          Items that may need your attention
        </p>

        <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-bold text-amber-800">
          {alerts.length} ALERTS
        </span>
      </div>

      {alerts.length > 0 ? (
        <div className="mt-2 divide-y divide-slate-100">
          {alerts.map((alert) => (
            <article key={alert.id} className="py-3 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  {alert.company}
                </h3>

                <span
                  className={`text-sm font-semibold ${
                    textColorMap[alert.style] || "text-slate-600"
                  }`}
                >
                  {alert.label}
                </span>
              </div>

              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {alert.description}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-cyan-50 p-3 text-sm text-cyan-800">
          No pending alerts. You're all caught up!
        </p>
      )}

      <button
  type="button"
  onClick={onOptimize}
  className="mt-4 w-full rounded-lg border border-violet-100 bg-violet-50 px-3 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
>
  Run Keyword Optimizer
</button>
    </section>
  );
}

function DeadlinesPanel({ deadlines, onAction }) {
  return (
    <section className={cardClass}>
      <SectionTitle icon={CalendarClock}>
        Upcoming Deadlines
      </SectionTitle>

      <p className="mt-1 text-sm text-slate-500">
        Keep track of your next steps.
      </p>

      {deadlines.length > 0 ? (
        <div className="mt-3 divide-y divide-slate-100">
          {deadlines.map((item) => (
            <article key={item.id} className="py-3 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="min-w-0 text-sm font-bold text-slate-800">
                  {item.company}
                </h3>

                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${
                    item.badgeStyle === "urgent"
                      ? "bg-red-50 text-red-700"
                      : "bg-cyan-50 text-cyan-800"
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">{item.role}</p>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p
                  className={`flex items-center gap-1.5 text-sm ${
                    item.badgeStyle === "urgent"
                      ? "font-semibold text-red-600"
                      : "text-slate-500"
                  }`}
                >
                  <Clock3 size={14} className="shrink-0" />
                  {item.date}
                </p>

                <button
  type="button"
  onClick={() => onAction(item)}
  className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
    item.actionStyle === "primary"
      ? "bg-violet-700 text-white hover:bg-violet-800"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
  }`}
>
  {item.action}
</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No upcoming deadlines to show.
        </p>
      )}
    </section>
  );
}

function PipelineOverview({ stages, summary }) {
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
      bar: "bg-amber-600",
      text: "text-amber-700",
    },
    technical: {
      bar: "bg-indigo-600",
      text: "text-indigo-700",
    },
    final: {
      bar: "bg-violet-700",
      text: "text-violet-700",
    },
    offers: {
      bar: "bg-cyan-500",
      text: "text-cyan-700",
    },
  };

  return (
    <section className={cardClass}>
      <SectionTitle icon={Gauge}>
        Application Pipeline Overview
      </SectionTitle>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">{summary.description}</p>
        <span className="text-xs text-slate-400">{summary.updated}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-6">
        {stages.map((stage) => {
          const colors = stageColorMap[stage.id] || {
            bar: "bg-slate-500",
            text: "text-slate-600",
          };

          return (
            <div key={stage.id} className="min-w-0">
              <p
                className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}
              >
                {stage.label}
              </p>

              <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                <span className="text-xl font-bold text-slate-800">
                  {stage.value}
                </span>
                <span className={`text-sm font-medium ${colors.text}`}>
                  {stage.percentage}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, stage.percentage)
                    )}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-700">
            Stage Pass-Through Rate
          </h3>

          <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
            {summary.conversionLabel}: {summary.conversionPercentage}%
          </span>
        </div>

        <svg
          viewBox="0 0 420 52"
          preserveAspectRatio="none"
          className="mt-3 h-12 w-full"
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
              r={
                index === 0 || index === summary.chartPoints.length - 1
                  ? 3
                  : 2
              }
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
    <section className={cardClass}>
      <SectionTitle icon={History}>Recent Activity Log</SectionTitle>

      {activities.length > 0 ? (
        <div className="mt-3 divide-y divide-slate-100">
          {activities.map((item) => {
            const Icon = activityIconMap[item.icon] || Activity;

            return (
              <article
                key={item.id}
                className="flex items-start gap-3 py-3 last:pb-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-800">
                  <Icon size={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-relaxed text-slate-700">
                    {item.title}
                  </p>

                  <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                    {item.detail}
                  </p>
                </div>

                <span
                  className={`shrink-0 whitespace-nowrap text-xs ${
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
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No recent activity to show.
        </p>
      )}
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
      "URL looks valid, but importing and saving applications is not available yet."
    );
    setIsProcessing(false);
  }

  return (
    <section className="rounded-xl bg-gradient-to-br from-violet-700 to-indigo-800 p-4 text-white shadow-sm">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-100">
        <Sparkles size={16} />
        {content.eyebrow}
      </p>

      <h2 className="mt-3 text-lg font-bold">{content.title}</h2>

      <p className="mt-1.5 text-sm leading-relaxed text-violet-100">
        {content.description}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
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
          className="w-full rounded-lg border border-white/40 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-violet-300"
        />

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-violet-50 disabled:opacity-70"
        >
          {isProcessing ? "Checking..." : content.buttonLabel}
        </button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-lg bg-white/10 p-3 text-sm leading-relaxed ${
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

    const handlePriorityAction = (item) => {
    if (item.action.includes("Timeline")) {
      navigate("/timeline");
    } else if (item.action.includes("Prep Room")) {
      navigate("/priority-queue");
    } else if (item.action.includes("Start Test")) {
      navigate("/eligibility");
    } else {
      navigate("/applications");
    }
  };

  const handleSecondaryAction = () => {
    navigate("/applications");
  };

  const handleDeadlineAction = (item) => {
    if (item.action === "Resume Check") {
      navigate("/resume-match");
    } else {
      navigate("/applications");
    }
  };

  const handleOptimize = () => {
    navigate("/resume-match");
  };

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

    const getUrgency = (item) => {
      const task = `${item.task} ${item.time}`.toLowerCase();

      if (task.includes("overdue")) return 0;
      if (task.includes("today")) return 1;
      if (task.includes("tomorrow")) return 2;
      if (task.includes("in 2 days")) return 3;
      if (task.includes("in 3 days")) return 4;

      return 5;
    };

    return applications.sort((a, b) => getUrgency(a) - getUrgency(b));
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
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        <p>{error}</p>

        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-5" aria-busy="true">
        <div className="h-24 animate-pulse rounded-xl bg-slate-100" />

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border border-slate-100 bg-slate-50"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4 bg-slate-50/40 p-1 text-slate-800 sm:space-y-5">
      <section className="flex min-w-0 flex-col items-start justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-700">
            <span className="h-2 w-2 rounded-full bg-violet-600" />
            {data.sprint}
          </p>

          <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-2xl">
            Welcome back, {data.userName}!
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            You have{" "}
            <span className="font-semibold text-violet-700">
              {data.priorityApplications.length} high-priority applications
            </span>{" "}
            to focus on this week.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/resume-match")}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <Zap size={16} />
            Quick Scan
          </button>

          <button
            type="button"
            onClick={() => navigate("/applications")}
            className="flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800"
          >
            <span className="text-lg leading-none">+</span>
            Add Application
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <section className={cardClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle icon={Flame}>
                Priority Focus Applications
              </SectionTitle>

              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setSortBy("match")}
                  aria-pressed={sortBy === "match"}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    sortBy === "match"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  By Match Score
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy("date")}
                  aria-pressed={sortBy === "date"}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    sortBy === "date"
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  By Due Date
                </button>
              </div>
            </div>

            <div className="mt-2">
              {sortedPriorityApplications.length > 0 ? (
                sortedPriorityApplications.map((item) => (
  <PriorityRow
    key={item.id}
    item={item}
    onAction={() => handlePriorityAction(item)}
    onSecondaryAction={handleSecondaryAction}
  />
))
              ) : (
                <p className="py-6 text-center text-sm text-slate-500">
                  No priority applications to show.
                </p>
              )}
            </div>
          </section>

          <PipelineOverview
            stages={data.pipeline}
            summary={data.pipelineSummary}
          />

          <ActivityLog activities={data.activity} />
        </div>

        <aside className="min-w-0 space-y-5">
          <AttentionPanel
  alerts={data.alerts}
  onOptimize={handleOptimize}
/>

<DeadlinesPanel
  deadlines={data.deadlines}
  onAction={handleDeadlineAction}
/>
          <QuickAddPanel content={data.quickAdd} />
        </aside>
      </div>
    </div>
  );
}
