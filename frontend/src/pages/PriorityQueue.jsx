import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  Gauge,
  Info,
  Plus,
  RefreshCw,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Users,
  Zap,
  FileText,
} from "lucide-react";


import { useState } from "react";


import {
  getAverageAlignmentScore,
  getActiveOffers,
  sortApplicationsByScore,
  getUrgencyLabel,
} from "../features/priority-queue/utils/priorityQueueUtils";


import {
  SiDatadog,
  SiUber,
  SiStripe,
  SiVercel,
  SiSnowflake,
} from "@icons-pack/react-simple-icons";

import { mockApplications }
from "../features/priority-queue/data/mockApplications";

import Card from "../components/ui/Card";

/* =========================================================
   CONFIGURATION
   Keep reusable styling and display settings in one place.
========================================================= */

const statusStyles = {
  red: {
    badge: "border-red-200 bg-red-50 text-red-700",
    text: "text-red-600",
    alert: "border-red-100 bg-red-50/60",
    icon: "text-red-600",
  },
  orange: {
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    text: "text-orange-600",
    alert: "border-orange-100 bg-orange-50/60",
    icon: "text-orange-600",
  },
  blue: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    text: "text-blue-600",
    alert: "border-gray-100 bg-gray-50",
    icon: "text-indigo-600",
  },
  green: {
    badge: "border-green-200 bg-green-50 text-green-700",
    text: "text-green-600",
    alert: "border-gray-100 bg-gray-50",
    icon: "text-indigo-600",
  },
  purple: {
    badge: "border-purple-200 bg-purple-50 text-purple-700",
    text: "text-purple-600",
    alert: "border-gray-100 bg-gray-50",
    icon: "text-indigo-600",
  },
};

const companyConfig = {
  Datadog: {
    icon: SiDatadog,
    background: "bg-white",
    iconColor: "#632CA6",
  },
  Uber: {
    icon: SiUber,
    background: "bg-black",
    iconColor: "#FFFFFF",
  },
  Stripe: {
    icon: SiStripe,
    background: "bg-white",
    iconColor: "#635BFF",
  },
  Vercel: {
    icon: SiVercel,
    background: "bg-white",
    iconColor: "#000000",
  },
  Snowflake: {
    icon: SiSnowflake,
    background: "bg-white",
    iconColor: "#29B5E8",
  },
  Microsoft: {
    background: "bg-white",
    iconColor: "#000000",
  },
};

const scoreRingConfig = {
  size: 56,
  radius: 22,
  background: "#E5E7EB",
  progress: "#4F46E5",
  text: "#111827",
};

const summaryCardConfig = {
  defaultValueColor: "text-gray-900",
  urgencyValueColor: "text-red-600",
};

const cardStyles = {
  interactive:
    "overflow-hidden transition-shadow duration-200 hover:shadow-md",
  booster:
    "flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md transition-shadow hover:shadow-lg",
  buttonPrimary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700",
  buttonSecondary:
    "rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50",
};

/* =========================================================
   APPLICATION DATA
========================================================= */

const applications = sortApplicationsByScore(mockApplications);

const totalApplications = applications.length;

const averageAlignmentScore =
  getAverageAlignmentScore(applications);

const activeOffers = getActiveOffers(applications);

const urgencyLabel = getUrgencyLabel(applications);

/* =========================================================
   PRIORITY BOOSTER DATA
   Every booster owns its icon, text and badge styling.
========================================================= */

const boosters = [
  {
    id: "deadline",
    title: "Deadline < 24 Hours",
    points: "+30 pts",
    icon: Clock,
    color: "text-red-600 bg-red-50",
    textClass: "text-red-600",
    pointsClass: "border-red-200 bg-red-100 text-red-600",
  },
  {
    id: "interview",
    title: "Active Interview Stage",
    points: "+25 pts",
    icon: Users,
    color: "text-indigo-600 bg-indigo-50",
    textClass: "text-indigo-600",
    pointsClass: "border-indigo-200 bg-indigo-100 text-indigo-600",
  },
  {
    id: "resume-match",
    title: "Resume Match > 90%",
    points: "+20 pts",
    icon: Target,
    color: "text-green-600 bg-green-50",
    textClass: "text-green-600",
    pointsClass: "border-green-200 bg-green-100 text-green-600",
  },
  {
    id: "referral",
    title: "Employee Referral",
    points: "+15 pts",
    icon: Users,
    color: "text-purple-600 bg-purple-50",
    textClass: "text-purple-600",
    pointsClass: "border-purple-200 bg-purple-100 text-purple-600",
  },
];

/* =========================================================
   SUMMARY CARD DATA
========================================================= */

const summaryCards = [
  {
    id: "top-priority",
    title: "Top Priority Items",
    value: `${totalApplications} Applications`,
    subtitle: "Requires immediate action in < 48 hours",
    icon: Flame,
    iconColor: "bg-red-50 text-red-600",
    footer: (
      <span>
        <span className="font-semibold text-gray-800">
          Top 10 Pipeline
        </span>
        <span className="mx-2">•</span>
        <span className="font-semibold text-red-600">
          3 Assessments Due
        </span>
      </span>
    ),
  },
  {
    id: "alignment",
    title: "Average Alignment Score",
    value: `${averageAlignmentScore}% Match`,
    subtitle: "Strong alignment with target roles",
    icon: Target,
    iconColor: "bg-indigo-50 text-indigo-600",
    footer: (
      <span className="inline-flex items-center gap-1 font-semibold text-green-600">
        <ArrowUpRight size={14} />
        High match across top opportunities
      </span>
    ),
  },
  {
    id: "urgency",
    title: "Action Urgency Index",
    value: urgencyLabel,
    subtitle: "Deadlines and milestones need review",
    icon: Gauge,
    iconColor: "bg-orange-50 text-red-600",
    valueColor: summaryCardConfig.urgencyValueColor,
    footer: (
      <span>
        <span className="font-semibold text-gray-800">
          {activeOffers} Active {activeOffers === 1 ? "Offer" : "Offers"}
        </span>
        <span className="mx-2">•</span>
        Review today's priorities
      </span>
    ),
  },
];

/* =========================================================
   DAILY FOCUS DATA
========================================================= */

const dailyTasks = [
  {
    id: "datadog-task",
    title: "Complete Datadog CodeSignal",
    time: "Est. 70 mins",
  },
  {
    id: "uber-task",
    title: "Finalize Uber application submit",
    time: "Est. 15 mins",
  },
  {
    id: "stripe-task",
    title: "Review Stripe system design cheat sheet",
    time: "Est. 45 mins",
  },
];

const dailyFocusConfig = {
  pendingCount: dailyTasks.length,
  label: "TODAY",
  description:
    "Key targets prioritized for completion before midnight today.",
  estimatedTime: "2h 10m",
};

/* =========================================================
   WEEKLY MOMENTUM DATA
========================================================= */

const weeklyActivity = [
  { day: "MON", height: "h-8", active: true },
  { day: "TUE", height: "h-12", active: true },
  { day: "WED", height: "h-9", active: true },
  { day: "THU", height: "h-14", active: true },
  { day: "FRI", height: "h-10", active: true },
  { day: "SAT", height: "h-6", active: false },
  { day: "SUN", height: "h-4", active: false },
];

const weeklyMomentumConfig = {
  completedTasks: 14,
  activityLabel: "Weekly activity",
  actionLabel: "View Details",
};

/* =========================================================
   COMPANY LOGOS
========================================================= */

function MicrosoftLogo() {
  const squares = [
    "bg-[#F25022]",
    "bg-[#7FBA00]",
    "bg-[#00A4EF]",
    "bg-[#FFB900]",
  ];

  return (
    <div
      className="grid grid-cols-2 gap-[2px]"
      aria-label="Microsoft logo"
      role="img"
    >
      {squares.map((color, index) => (
        <span
          key={color}
          className={`h-[10px] w-[10px] ${color}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function CompanyLogo({ company, initials, logo }) {
  const config = companyConfig[company];
  const Logo = config?.icon;

  const containerBackground =
    config?.background || "bg-gray-50";

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-100 ${containerBackground}`}
      aria-label={`${company} logo`}
    >
      {company === "Microsoft" ? (
        <MicrosoftLogo />
      ) : Logo ? (
        <Logo size={24} color={config.iconColor} />
      ) : (
        <span
          className={`text-xl font-bold ${
            logo?.split(" ").slice(1).join(" ") ||
            "text-gray-700"
          }`}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD COMPONENT
========================================================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  valueColor = summaryCardConfig.defaultValueColor,
  footer,
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {title}
          </p>

          <p
            className={`mt-3 text-2xl font-bold tracking-tight ${valueColor}`}
          >
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

      {footer && (
        <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
          {footer}
        </div>
      )}
    </Card>
  );
}

/* =========================================================
   SCORE RING COMPONENT
========================================================= */

function ScoreRing({ score }) {
  const { size, radius, background, progress: progressColor, text } =
    scoreRingConfig;

  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (score / 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Score ${score} out of 100`}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={background}
        strokeWidth="4"
      />

      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={progressColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
        transform={`rotate(-90 ${center} ${center})`}
      />

      <text
        x={center}
        y={center + 4}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={text}
      >
        {score}
      </text>
    </svg>
  );
}

/* =========================================================
   APPLICATION CARD COMPONENT
========================================================= */

function ApplicationCard({ app }) {
  const styles =
    statusStyles[app.statusColor] || statusStyles.blue;

  return (
    <Card className={cardStyles.interactive}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <CompanyLogo
            company={app.company}
            initials={app.initials}
            logo={app.logo}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-indigo-100 px-2 text-sm font-extrabold text-indigo-700">
                #{app.rank}
              </span>

              <h3 className="text-base font-bold text-gray-900">
                {app.company}
              </h3>

              <span
                className={`rounded-full border px-2 py-1 text-xs font-semibold ${styles.badge}`}
              >
                {app.status}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-gray-700">
              {app.role}{" "}
              <span className="text-gray-400">•</span>{" "}
              {app.term}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Target size={14} className="text-indigo-500" />
                {app.match}% Match
              </span>

              <span
                className={`flex items-center gap-1 font-bold ${styles.text}`}
              >
                <Clock size={14} />
                {app.deadline}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center">
            <ScoreRing score={app.score} />

            <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Score /100
            </span>
          </div>
        </div>

        <div className={`rounded-lg border p-3 ${styles.alert}`}>
          <div className="flex items-start gap-2">
            {app.statusColor === "red" ? (
              <AlertCircle
                size={17}
                className={`mt-0.5 shrink-0 ${styles.icon}`}
              />
            ) : (
              <Info
                size={17}
                className={`mt-0.5 shrink-0 ${styles.icon}`}
              />
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                {app.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-600">
                {app.description}
              </p>

              <p className="mt-2 text-[11px] font-medium text-gray-500">
                <CalendarDays
                  size={12}
                  className="mr-1 inline-block align-[-2px]"
                />
                {app.deadlineDate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={cardStyles.buttonPrimary}
          >
            {app.action}
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            className={cardStyles.buttonSecondary}
          >
            {app.secondary}
          </button>

          <span className="ml-auto text-[10px] text-gray-400">
            ID: {app.id}
          </span>
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   PRIORITY BOOSTERS COMPONENT
========================================================= */

function PriorityBoosters() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Zap size={19} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Priority Boosters
            </h2>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-600">
              ACTIVE RULES
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Priority booster settings"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
        >
          <Settings2 size={17} />
        </button>
      </div>

      <p className="mt-4 text-sm leading-5 text-gray-500">
        Weights dynamically added based on application lifecycle
        triggers:
      </p>

      <div className="mt-4 space-y-3">
        {boosters.map((booster) => {
          const Icon = booster.icon;

          return (
            <div
              key={booster.id}
              className={cardStyles.booster}
            >
              <div className={`rounded-lg p-2 ${booster.color}`}>
                <Icon size={16} />
              </div>

              <p
                className={`min-w-0 flex-1 text-xs font-semibold ${booster.textClass}`}
              >
                {booster.title}
              </p>

              <span
                className={`shrink-0 rounded-md border px-2 py-1 text-xs font-bold shadow-sm ${booster.pointsClass}`}
              >
                {booster.points}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gray-600">
            Sensitivity: High (Default)
          </span>

          <button
            type="button"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Adjust Model
          </button>
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   DAILY FOCUS COMPONENT
========================================================= */

function DailyFocus() {
  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
          <Target size={19} />
        </div>

        <div>
          <h2 className="font-bold text-gray-900">
            Daily Focus
          </h2>

          <p className="mt-0.5 text-xs text-gray-500">
            Key targets for today
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-orange-100 bg-orange-50/60 p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-800">
            {dailyFocusConfig.pendingCount} Pending
          </p>

          <span className="text-[10px] font-semibold text-orange-700">
            {dailyFocusConfig.label}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {dailyFocusConfig.description}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {dailyTasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-start gap-3"
          >
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-500">
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold leading-5 text-gray-800">
                {task.title}
              </p>

              <p className="mt-1 text-[11px] text-gray-400">
                {task.time}
              </p>
            </div>

            <button
              type="button"
              aria-label={`Mark ${task.title} complete`}
              className="rounded-full p-1 text-gray-400 hover:bg-green-50 hover:text-green-600"
            >
              <CheckCircle2 size={17} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">
            Estimated time
          </p>

          <p className="mt-1 text-sm font-bold text-gray-900">
            {dailyFocusConfig.estimatedTime}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={14} />
          Add Task
        </button>
      </div>
    </Card>
  );
}

/* =========================================================
   QUEUE VELOCITY COMPONENT
========================================================= */

function QueueVelocity() {
  const velocityConfig = {
    change: "+18%",
    period: "this week",
    clearedTasks: 3,
    message: "Improved from yesterday",
  };

  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-green-50 p-2 text-green-600">
          <TrendingUp size={19} />
        </div>

        <div>
          <h2 className="font-bold text-gray-900">
            Queue Velocity
          </h2>

          <p className="mt-0.5 text-xs text-gray-500">
            Application activity overview
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {velocityConfig.change}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {velocityConfig.period}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {velocityConfig.clearedTasks}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Priority Tasks Cleared
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-green-50 px-3 py-2">
        <p className="text-xs font-semibold text-green-700">
          <ArrowUpRight size={14} className="mr-1 inline-block" />
          {velocityConfig.message}
        </p>
      </div>
    </Card>
  );
}

/* =========================================================
   WEEKLY MOMENTUM COMPONENT
========================================================= */

function WeeklyMomentum() {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-bold text-gray-900">
            Weekly Momentum
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {weeklyMomentumConfig.completedTasks} tasks completed
          </p>
        </div>

        <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <Activity size={18} />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {weeklyActivity.map((item) => (
          <div
            key={item.day}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-14 w-full items-end justify-center">
              <div
                className={`w-full rounded-t-md ${
                  item.active ? "bg-indigo-500" : "bg-gray-200"
                } ${item.height}`}
              />
            </div>

            <span className="text-[9px] font-semibold text-gray-400">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-500">
          {weeklyMomentumConfig.activityLabel}
        </span>

        <button
          type="button"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          {weeklyMomentumConfig.actionLabel}
        </button>
      </div>
    </Card>
  );
}

/* =========================================================
   PRO TIP COMPONENT
========================================================= */

function ProTip() {
  const tip = {
    heading: "Pro Tip for Datadog OA:",
    description:
      "CodeSignal scores can depend heavily on speed in Section 2. Complete questions 1 and 2 efficiently while keeping accuracy high to maximize your score.",
    reminder:
      "Prepare early, review the instructions, and reserve time to test your solutions before submitting.",
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-white p-2 text-amber-600 shadow-sm">
          <BriefcaseBusiness size={18} />
        </div>

        <div>
          <h2 className="font-bold text-gray-900">
            Pro Tip
          </h2>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
            YOUR NEXT BEST MOVE
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold leading-5 text-gray-800">
        {tip.heading}
      </p>

      <p className="mt-2 text-xs leading-5 text-gray-700">
        {tip.description}
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-white/70 p-3">
        <ShieldCheck
          size={16}
          className="mt-0.5 shrink-0 text-amber-700"
        />

        <p className="text-[11px] leading-5 text-gray-600">
          {tip.reminder}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PRIORITY QUEUE PAGE
========================================================= */

function PriorityQueue() {

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);


  const activeApplicationCount = applications.length;

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 text-gray-800">
      {/* Page heading */}

      <section className="flex flex-col justify-between gap-4 2xl:flex-row 2xl:items-start">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>WORKSPACE</span>
            <span>/</span>

            <span className="font-semibold text-indigo-600">
              PRIORITY QUEUE
            </span>

            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              REAL-TIME SYNC
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Priority Queue
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Algorithmic application ranking based on deadline proximity,
            skill match score, referral status, and offer probability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Re-run Ranking Algorithm
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <SlidersHorizontal size={15} />
            Criteria Settings
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={15} />
            Quick Add Opportunity
          </button>
        </div>
      </section>

      {/* Summary cards */}

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
            footer={summary.footer}
          />
        ))}
      </section>

      {/* Priority formula */}

      <section className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm">
              <Zap size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Priority Formula
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-700">
                Score = (Deadline × 35%) + (Skill Match × 30%) +
                (Milestone × 20%) + (Velocity × 15%)
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Calculated hourly using CareerTrack ML weights
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 lg:self-center"
          >
            <Info size={15} />
            How it works
          </button>
        </div>
      </section>

      {/* Main layout */}

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Application queue */}

        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Active Ranked Queue
                </h2>

                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {activeApplicationCount} Active
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Your opportunities ranked by algorithmic impact.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Sort:
              </span>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700"
              >
                Algorithmic Impact
                <ArrowDown size={13} />
              </button>
            </div>
          </div>
{isLoading ? (
  <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
    <p className="text-gray-600">Loading applications...</p>
  </div>
) : error ? (
  <div
    role="alert"
    className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"
  >
    <p className="font-medium text-red-700">{error}</p>
  </div>
) : applications.length === 0 ? (
  <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
    <p className="font-medium text-gray-800">No applications found</p>
    <p className="mt-2 text-sm text-gray-500">
      Your applications will appear here when available.
    </p>
  </div>
) : (
  applications.map((app) => (
    <ApplicationCard key={app.id} app={app} />
  ))
)}


          <button
            type="button"
            className="w-full rounded-lg border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            View All Applications
            <ArrowRight size={15} className="ml-2 inline-block" />
          </button>
        </div>

        {/* Supporting panels */}

        <aside className="min-w-0 space-y-5 lg:col-span-1">
          <PriorityBoosters />

          <DailyFocus />

          <QueueVelocity />

          <WeeklyMomentum />

          <ProTip />
        </aside>
      </section>
    </div>
  );
}

export default PriorityQueue;