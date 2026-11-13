import { useCallback, useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  ArrowDown,
  CalendarDays,
  Clock,
  Flame,
  Gauge,
  Info,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Zap,
  BriefcaseBusiness,
} from "lucide-react";

import Card from "../components/ui/Card";
import { api } from "../services/api";

/* =========================================================
   CONSTANTS
========================================================= */

const CLOSED_STATUSES = ["offer", "rejected", "withdrawn"];

const STATUS_STYLES = {
  red: "border-red-200 bg-red-50 text-red-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-green-200 bg-green-50 text-green-700",
};

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getStatusColor(riskStatus) {
  switch (riskStatus?.toLowerCase()) {
    case "at risk":
      return "red";

    case "needs attention":
      return "orange";

    case "on track":
      return "green";

    case "not applicable":
      return "blue";

    default:
      return "blue";
  }
}

function getNumericValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function formatDeadline(application) {
  const remaining = application.daysRemaining;

  if (
    remaining !== null &&
    remaining !== undefined &&
    remaining !== ""
  ) {
    const days = Number(remaining);

    if (Number.isFinite(days)) {
      if (days < 0) {
        return `${Math.abs(days)} Days Overdue`;
      }

      if (days === 0) {
        return "Due Today";
      }

      return `${days} Days Left`;
    }
  }

  const deadline =
    application.deadline || application.job_deadline;

  if (!deadline) {
    return "No Deadline";
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Deadline Available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDate(application) {
  const deadline =
    application.deadline || application.job_deadline;

  if (!deadline) {
    return "Deadline not specified";
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Deadline not specified";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/*
  Converts backend application data into the format
  required by the Priority Queue UI.

  Backend ranking order is preserved.
  No frontend sorting is performed.
*/

function mapApplication(application, index) {
  const riskStatus =
    application.riskStatus || "Status unavailable";

  return {
    id:
      application.id ??
      application.application_id ??
      null,

    rank: index + 1,

    company:
      application.company_name || "Company not specified",

    role:
      application.job_title || "Role not specified",

    score: getNumericValue(application.priority_score),

    match: getNumericValue(application.match_score),

    status: riskStatus,

    statusColor: getStatusColor(riskStatus),

    deadline: formatDeadline(application),

    deadlineDate: formatDate(application),

    description:
      application.reason ||
      "No additional application details available.",

    applicationStatus:
      application.status || "Unknown",
  };
}

/* =========================================================
   SCORE RING
========================================================= */

function ScoreRing({ score }) {
  const size = 56;
  const radius = 22;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius;

  const numericScore = getNumericValue(score);

  const safeScore =
    numericScore === null
      ? 0
      : Math.min(100, Math.max(0, numericScore));

  const progress =
    circumference * (safeScore / 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={
        numericScore === null
          ? "Priority score unavailable"
          : `Priority score ${safeScore}`
      }
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="4"
      />

      {numericScore !== null && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#4F46E5"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}

      <text
        x={center}
        y={center + 4}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#111827"
      >
        {numericScore === null
          ? "N/A"
          : Math.round(safeScore)}
      </text>
    </svg>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  valueColor = "text-gray-900",
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </p>

          <p className={`mt-3 text-2xl font-bold ${valueColor}`}>
            {value}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${iconColor}`}>
          <Icon size={21} />
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   APPLICATION CARD
========================================================= */

function ApplicationCard({ app }) {
  const statusStyle =
    STATUS_STYLES[app.statusColor] || STATUS_STYLES.blue;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4">

        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <BriefcaseBusiness size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-indigo-100 px-2 text-sm font-extrabold text-indigo-700">
                #{app.rank}
              </span>

              <h3 className="text-base font-bold text-gray-900">
                {app.company}
              </h3>

              <span
                className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusStyle}`}
              >
                {app.status}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-gray-700">
              {app.role}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Target size={14} className="text-indigo-500" />

                {app.match === null
                  ? "Match score unavailable"
                  : `${app.match}% Match`}
              </span>

              <span className="flex items-center gap-1">
                <Clock size={14} />

                {app.deadline}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center">
            <ScoreRing score={app.score} />

            <span className="mt-1 text-[10px] font-medium uppercase text-gray-400">
              Score /100
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-indigo-50/60 p-3">
          <div className="flex items-start gap-2">
            <Info
              size={17}
              className="mt-0.5 shrink-0 text-indigo-600"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                Application Information
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-600">
                {app.description}
              </p>

              <p className="mt-2 text-[11px] font-medium text-gray-500">
                <CalendarDays
                  size={12}
                  className="mr-1 inline-block"
                />

                {app.deadlineDate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-gray-500">
            Application Status:{" "}
            <span className="font-semibold text-gray-700">
              {app.applicationStatus}
            </span>
          </span>

          {app.id !== null && (
            <span className="text-[10px] text-gray-400">
              ID: {app.id}
            </span>
          )}
        </div>

      </div>
    </Card>
  );
}

/* =========================================================
   UNAVAILABLE PANEL
========================================================= */

function UnavailablePanel({
  title,
  description,
  icon: Icon,
}) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <Icon size={19} />
        </div>

        <h2 className="font-bold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700">
          Not available yet
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </Card>
  );
}

/* =========================================================
   MAIN PRIORITY QUEUE PAGE
========================================================= */

function PriorityQueue() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =======================================================
     FETCH APPLICATIONS
  ======================================================= */

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.get("/api/applications");

      const backendApplications =
        result?.data?.applications;

      if (!Array.isArray(backendApplications)) {
        throw new Error(
          "Invalid applications response from server."
        );
      }

      // Preserve backend ranking order.
      const mappedApplications =
        backendApplications.map((application, index) =>
          mapApplication(application, index)
        );

      setApplications(mappedApplications);

    } catch (err) {
      console.error("Priority Queue API Error:", err);

      setError(
        err.message ||
        "Unable to load applications. Please try again."
      );

      setApplications([]);

    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /* =======================================================
     SUMMARY CALCULATIONS
  ======================================================= */

  const activeApplications = applications.filter(
    (app) =>
      !CLOSED_STATUSES.includes(
        app.applicationStatus?.toLowerCase()
      )
  );

  const activeOffers = applications.filter(
    (app) =>
      app.applicationStatus?.toLowerCase() === "offer"
  ).length;

  const urgentApplications = activeApplications.filter(
    (app) =>
      ["at risk", "needs attention"].includes(
        app.status?.toLowerCase()
      )
  ).length;

  const scoredApplications = activeApplications.filter(
    (app) => app.match !== null
  );

  const averageAlignmentScore =
    scoredApplications.length > 0
      ? (
          scoredApplications.reduce(
            (total, app) => total + app.match,
            0
          ) / scoredApplications.length
        ).toFixed(1)
      : "N/A";

  const urgencyLabel =
    urgentApplications > 0
      ? "High Attention"
      : activeApplications.length > 0
        ? "On Track"
        : "N/A";

  /* =======================================================
     SUMMARY CARDS
  ======================================================= */

  const summaryCards = [
    {
      id: "priority",
      title: "Top Priority Items",

      value: error || isLoading
        ? "N/A"
        : `${urgentApplications} Applications`,

      subtitle: error
        ? "Application data unavailable"
        : "Applications requiring attention",

      icon: Flame,
      iconColor: "bg-red-50 text-red-600",
    },

    {
      id: "alignment",
      title: "Average Alignment Score",

      value: error || isLoading
        ? "N/A"
        : averageAlignmentScore === "N/A"
          ? "N/A"
          : `${averageAlignmentScore}% Match`,

      subtitle: "Average match score of active applications",

      icon: Target,
      iconColor: "bg-indigo-50 text-indigo-600",
    },

    {
      id: "urgency",
      title: "Action Urgency Index",

      value: error || isLoading
        ? "N/A"
        : urgencyLabel,

      subtitle: error
        ? "Offer information unavailable"
        : `${activeOffers} Offers in Hand`,

      icon: Gauge,
      iconColor: "bg-orange-50 text-orange-600",

      valueColor:
        urgencyLabel === "High Attention"
          ? "text-red-600"
          : "text-gray-900",
    },
  ];

  /* =======================================================
     PAGE UI
  ======================================================= */

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 text-gray-800">

      {/* PAGE HEADING */}

      <section className="flex flex-col justify-between gap-4 2xl:flex-row 2xl:items-start">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>WORKSPACE</span>
            <span>/</span>

            <span className="font-semibold text-indigo-600">
              PRIORITY QUEUE
            </span>

            <span
              className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
                isLoading
                  ? "bg-yellow-50 text-yellow-700"
                  : error
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isLoading
                    ? "bg-yellow-500"
                    : error
                      ? "bg-red-500"
                      : "bg-green-500"
                }`}
              />

              {isLoading
                ? "CONNECTING"
                : error
                  ? "API UNAVAILABLE"
                  : "API CONNECTED"}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Priority Queue
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Your applications ranked according to their priority,
            deadline proximity, and match score.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchApplications}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={isLoading ? "animate-spin" : ""}
            />

            {isLoading
              ? "Refreshing..."
              : "Refresh Applications"}
          </button>

          <button
            type="button"
            disabled
            title="Criteria settings are not available yet"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-400"
          >
            <SlidersHorizontal size={15} />
            Criteria Settings
          </button>
        </div>
      </section>

      {/* SUMMARY CARDS */}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((summary) => (
          <SummaryCard
            key={summary.id}
            title={summary.title}
            value={summary.value}
            subtitle={summary.subtitle}
            icon={summary.icon}
            iconColor={summary.iconColor}
            valueColor={summary.valueColor}
          />
        ))}
      </section>

      {/* PRIORITY FORMULA */}

      <section className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm">
            <Zap size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Priority Formula
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-700">
              Application ranking is provided by the backend.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              The frontend preserves the ranking order received from the API.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

        {/* APPLICATION QUEUE */}

        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Active Ranked Queue
                </h2>

                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {isLoading
                    ? "Loading..."
                    : error
                      ? "Unavailable"
                      : `${activeApplications.length} Active`}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Applications in the order returned by the backend.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              Sort: Backend Ranking
              <ArrowDown size={13} />
            </div>
          </div>

          {/* LOADING */}

          {isLoading && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <RefreshCw
                size={24}
                className="mx-auto animate-spin text-indigo-600"
              />

              <p className="mt-3 text-sm text-gray-600">
                Loading applications...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!isLoading && error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
            >
              <AlertCircle
                size={28}
                className="mx-auto text-red-600"
              />

              <p className="mt-3 font-semibold text-red-700">
                Unable to load applications
              </p>

              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchApplications}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}

          {!isLoading &&
            !error &&
            activeApplications.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <BriefcaseBusiness
                  size={30}
                  className="mx-auto text-gray-400"
                />

                <h3 className="mt-3 font-semibold text-gray-800">
                  No active applications found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Your active applications will appear here when available.
                </p>
              </div>
            )}

          {/* APPLICATION LIST */}

         {!isLoading &&
  !error &&
  activeApplications.map((app, index) => (
    <ApplicationCard
      key={app.id ?? index}
      app={{
        ...app,
        rank: index + 1,
      }}
    />
  ))}
        </div>

        {/* RIGHT SIDEBAR */}

        <aside className="min-w-0 space-y-5 lg:col-span-1">
          <UnavailablePanel
            title="Priority Boosters"
            description="Priority rules and score adjustments are not currently available through the applications API."
            icon={Zap}
          />

          <UnavailablePanel
            title="Daily Focus"
            description="Daily task information is not currently available through the connected API."
            icon={Target}
          />

          <UnavailablePanel
            title="Queue Velocity"
            description="Application activity and task completion statistics are not currently available."
            icon={TrendingUp}
          />

          <UnavailablePanel
            title="Weekly Momentum"
            description="Weekly application activity data is not currently available."
            icon={Activity}
          />

          <Card>
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={18}
                className="text-indigo-600"
              />

              <h2 className="font-bold text-gray-900">
                Application Insights
              </h2>
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-600">
              Application details and ranking information are displayed
              using the data received from your account.
            </p>
          </Card>
        </aside>
      </section>
    </div>
  );
}

export default PriorityQueue;
