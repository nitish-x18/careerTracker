import React, { useEffect, useMemo, useState } from "react";
import {
  Layers3,
  CalendarDays,
  Zap,
  ShieldCheck,
  Filter,
  Download,
  RefreshCw,
  Search,
  ChevronDown,
  Check,
  Clock3,
  Hourglass,
  UserRound,
  CalendarClock,
  Gauge,
  Waves,
  Bell,
  Play,
  Mail,
  Phone,
  Flag,
  ArrowUpRight,
  Sparkles,
  CircleDot,
  History,
  ListFilter,
  CircleCheck,
  AlertCircle,
} from "lucide-react";
import { getTimelineData } from "../services/timelineService";

/* --------------------------------------------------
   SHARED STYLES
-------------------------------------------------- */

const cardClass =
  "rounded-xl border border-[#e8eaf3] bg-white p-3 shadow-sm";

const statStyles = {
  "active-pipelines": {
    icon: Layers3,
    iconBg: "bg-[#F0E9FF]",
    iconColor: "text-[#7138E8]",
    valueColor: "text-[#17243A]",
    detailColor: "text-[#7138E8]",
  },
  milestones: {
    icon: CalendarDays,
    iconBg: "bg-[#FFF0E5]",
    iconColor: "text-[#E87535]",
    valueColor: "text-[#A34B13]",
    detailColor: "text-[#E87535]",
  },
  "average-velocity": {
    icon: Zap,
    iconBg: "bg-[#E5F3FF]",
    iconColor: "text-[#2787C7]",
    valueColor: "text-[#17243A]",
    detailColor: "text-[#2787C7]",
  },
  "timeline-health": {
    icon: ShieldCheck,
    iconBg: "bg-[#ECEBFF]",
    iconColor: "text-[#6048E8]",
    valueColor: "text-[#5142D9]",
    detailColor: "text-[#5142D9]",
  },
};

const milestoneStyles = {
  completed: {
    circle: "bg-[#12A982]",
    text: "text-[#168567]",
    line: "bg-[#7CC8B5]",
    surface: "bg-[#EAF7F2]",
  },
  action: {
    circle: "bg-[#E76F51]",
    text: "text-[#C4573B]",
    line: "bg-[#E5B19D]",
    surface: "bg-[#FFDBCB]",
  },
  active: {
    circle: "bg-[#5146D8]",
    text: "text-[#5142D9]",
    line: "bg-[#AAA4E2]",
    surface: "bg-[#EEEAFD]",
  },
  upcoming: {
    circle: "bg-[#D5DCE6]",
    text: "text-[#8793A5]",
    line: "bg-[#D8DEE8]",
    surface: "bg-[#F3F5F8]",
  },
};

/*
  Visual behavior is data-driven from optional UI metadata.
  If the backend does not send ui metadata yet, the generic defaults below
  preserve the existing appearance without coupling the page to company names.
*/
const defaultApplicationUI = {
  logoTone: "dark",
  actionTone: "light",
  actionIcon: "arrow",
  priorityTone: "default",
};

const logoToneClasses = {
  violet: "bg-[#6535A8] text-white",
  indigo: "bg-[#635BFF] text-white",
  cyan: "bg-[#29B6D9] text-white",
  dark: "bg-[#111111] text-white",
};

const actionToneClasses = {
  datadog: "bg-[#8B3E0B] text-white",
  purple: "bg-[#5142D9] text-white",
  light: "bg-[#F3F5F8] text-[#334155] border border-[#DDE3EB]",
};

const priorityToneClasses = {
  confirmed: "bg-[#E6F5EF] text-[#16835D]",
  warning: "bg-[#FFF0E8] text-[#C4573B]",
  default: "bg-[#EEF1FF] text-[#5142D9]",
};

const getApplicationUI = (item) => ({
  ...defaultApplicationUI,
  ...(item.ui || {}),
});

const getMilestoneUI = (step) => ({
  ...(step.ui || {}),
});


const getActionIcon = (iconName) => {
  const icons = {
    play: Play,
    list: ListFilter,
    mail: Mail,
    clock: Clock3,
    phone: Phone,
    flag: Flag,
    arrow: ArrowUpRight,
  };

  return icons[iconName] || ArrowUpRight;
};

const getMilestoneStatus = (step) => {
  if (step.status === "completed") return "completed";
  if (step.status === "action" || step.actionNeeded === true) return "action";
  if (step.status === "active") return "active";
  return "upcoming";
};

const getMilestoneIcon = (step, status) => {
  const ui = getMilestoneUI(step);

  if (ui.icon === "calendar") return CalendarDays;
  if (ui.icon === "hourglass") return Hourglass;
  if (ui.icon === "clock") return Clock3;
  if (ui.icon === "user") return UserRound;
  if (ui.icon === "alert") return AlertCircle;
  if (ui.icon === "check") return Check;

  if (status === "completed") return Check;
  if (status === "action") return AlertCircle;
  if (status === "active") return CircleDot;

  return null;
};

const getMilestoneSurface = (step, status) => {
  const ui = getMilestoneUI(step);
  return ui.surface || milestoneStyles[status].surface;
};

const getMilestoneTextClass = (step, status) => {
  const ui = getMilestoneUI(step);
  return ui.text || milestoneStyles[status].text;
};

const getMilestoneCircleClass = (step, status) => {
  const ui = getMilestoneUI(step);
  return ui.circle || milestoneStyles[status].circle;
};

const getMilestoneLineClass = (step, status) => {
  const ui = getMilestoneUI(step);
  return ui.line || milestoneStyles[status].line;
};

const getPeriodIndex = (date, periods) => {
  if (!date || !periods?.length) return -1;

  return periods.findIndex((period) => {
    const start = new Date(`${period.startDate}T00:00:00`);
    const end = new Date(`${period.endDate}T23:59:59`);

    return date >= start && date <= end;
  });
};

const getConnectorWeight = (currentDate, nextDate, periods) => {
  if (!currentDate || !nextDate) return 1;

  const currentPeriod = getPeriodIndex(currentDate, periods);
  const nextPeriod = getPeriodIndex(nextDate, periods);

  if (currentPeriod >= 0 && nextPeriod >= 0) {
    return Math.max(1, nextPeriod - currentPeriod + 1);
  }

  const days = Math.round(
    (nextDate - currentDate) / (1000 * 60 * 60 * 24)
  );

  return Math.max(1, days);
};

/* --------------------------------------------------
   SECTION TITLE
-------------------------------------------------- */

function SectionTitle({ icon: Icon, children, action }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <h2 className="flex min-w-0 items-center gap-2 text-base font-bold text-[#202B45]">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAE7FF] text-[#5145E5]">
          <Icon size={16} />
        </span>
        {children}
      </h2>

      {action}
    </div>
  );
}

/* --------------------------------------------------
   PAGE HEADER
-------------------------------------------------- */

function TimelineHeader({
  onExportSchedule,
  onSyncCalendar,
  syncState,
  showFilters,
  setShowFilters,
  milestoneStatusFilter,
  setMilestoneStatusFilter,
  cohortLabel,
  syncLabel,
}) {
  useEffect(() => {
    if (!showFilters) return;

    const handleClickOutside = () => setShowFilters(false);

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showFilters, setShowFilters]);

  const filterOptions = [
    ["all", "All"],
    ["completed", "Completed"],
    ["active", "Active"],
    ["action", "Action Needed"],
  ];

  return (
    <div className="rounded-xl bg-[#eef2ff] px-5 py-4 sm:px-6 sm:py-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-violet-100 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-700">
          {cohortLabel || "APPLICATION COHORT"}
        </span>

        <span className="text-sm text-slate-400">·</span>

        <span className="flex items-center gap-1.5 text-sm text-slate-500">
          <RefreshCw size={13} />
          {syncLabel || "Sync status unavailable"}
        </span>
      </div>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
            Application Timeline &amp;
            <br />
            Milestone Tracker
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            End-to-end multi-application lifecycle progression, recruiting
            season milestone roadmaps, interview scheduling chronologies,
            and deadline forecasts.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-bold shadow-sm ${
                showFilters
                  ? "border-violet-200 bg-violet-50 text-violet-700"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowFilters((prev) => !prev);
              }}
            >
              <Filter size={14} />
              Filter Milestones
            </button>

            {showFilters && (
              <div
                className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-[#e8eaf3] bg-white p-4 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-slate-800">
                    Filter Milestones
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose a milestone status
                  </p>
                </div>

                <div className="space-y-1.5">
                  {filterOptions.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setMilestoneStatusFilter(value);
                        setShowFilters(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                        milestoneStatusFilter === value
                          ? "bg-violet-100 text-violet-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm"
            onClick={onExportSchedule}
          >
            <Download size={14} />
            Export Schedule
          </button>

          <button
            type="button"
            onClick={onSyncCalendar}
            disabled={syncState === "Syncing..."}
            className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-sm font-bold text-white shadow-sm disabled:cursor-wait disabled:opacity-80"
          >
            <RefreshCw
              size={14}
              className={
                syncState === "Syncing..." ? "animate-spin" : ""
              }
            />

            {syncState === "Syncing..."
              ? "Syncing Calendar"
              : "Sync Calendar"}

            <span
              className={`h-2 w-2 rounded-full ${
                syncState === "Syncing..."
                  ? "bg-amber-300 animate-pulse"
                  : "bg-emerald-400"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   STATISTICS CARDS
-------------------------------------------------- */

function TimelineStats({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((item) => {
        const style =
          statStyles[item.type] || statStyles["active-pipelines"];

        const Icon = style.icon;

        return (
          <div
            key={item.id}
            className="min-w-0 overflow-hidden rounded-xl border border-[#E2E6F0] bg-white shadow-sm"
          >
            <div className="px-3 pb-2 pt-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">
                  {item.label}
                </p>

                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${style.iconBg} ${style.iconColor}`}
                >
                  <Icon size={13} strokeWidth={2.2} />
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                <span
                  className={`text-2xl font-extrabold leading-none tracking-tight ${style.valueColor}`}
                >
                  {item.value}
                </span>

                <span
                  className={`text-xs font-semibold ${style.detailColor}`}
                >
                  {item.detail}
                </span>
              </div>
            </div>

            <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-1.5 gap-y-1 border-t border-[#E2E6F0] bg-[#F0F3FC] px-3 py-1.5">
              <p className="text-xs leading-tight text-[#64748B]">
                {item.supportingText || item.footer}
              </p>

              {item.supportingNote && (
                <span
                  className={`shrink-0 rounded px-1 py-0.5 text-xs font-bold ${
                    item.supportingTone === "rose"
                      ? "bg-[#FFE1DC] text-[#D94841]"
                      : item.supportingTone === "orange"
                        ? "text-[#D94841]"
                        : item.supportingTone === "cyan"
                          ? "text-[#2787C7]"
                          : "text-[#7138E8]"
                  }`}
                >
                  {item.supportingNote}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------
   TIMELINE TOOLBAR
-------------------------------------------------- */

function TimelineToolbar({
  applications = [],
  searchTerm,
  setSearchTerm,
  pipelineFilter,
  setPipelineFilter,
  timelineView,
  setTimelineView,
  timelineMode,
  setTimelineMode,
}) {
  const interviewCount = applications.filter((item) =>
    (item.steps || []).some((step) => step.type === "interview")
  ).length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e8eaf3] bg-white px-3 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          ["gantt", Layers3, "Gantt & Session Roadmap"],
          ["feed", History, "Event Feed"],
          ["matrix", ListFilter, "Stage-Gate Matrix"],
        ].map(([value, Icon, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTimelineMode(value)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold ${
              timelineMode === value
                ? "bg-violet-50 text-violet-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setPipelineFilter("all")}
          className={`rounded-full px-3 py-2 text-sm font-bold ${
            pipelineFilter === "all"
              ? "bg-violet-700 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          All Pipelines ({applications.length})
        </button>

        <button
          type="button"
          onClick={() => setPipelineFilter("interviews")}
          className={`rounded-full px-3 py-2 text-sm font-medium ${
            pipelineFilter === "interviews"
              ? "bg-violet-700 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Interviews &amp; Calls ({interviewCount})
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-md bg-[#f1f4fb] px-3 py-2">
          <Search size={14} className="shrink-0 text-slate-400" />

          <input
            type="text"
            placeholder="Filter company, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-slate-100 p-1">
          {["weeks", "months", "season"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTimelineView(value)}
              className={`rounded px-3 py-1.5 text-sm font-bold capitalize ${
                timelineView === value
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   MILESTONE SWIMLANE
-------------------------------------------------- */

function SwimlaneRow({ item, timelineView, timeline }) {
  const applicationUI = getApplicationUI(item);

  const ActionIcon = getActionIcon(applicationUI.actionIcon);

  const logoStyle =
    logoToneClasses[applicationUI.logoTone] || logoToneClasses.dark;

  const actionStyle =
    actionToneClasses[applicationUI.actionTone] ||
    actionToneClasses.light;

  const priorityStyle =
    priorityToneClasses[applicationUI.priorityTone] ||
    priorityToneClasses.default;

  const periods = timeline?.views?.[timelineView] || [];

  return (
    <article className="border-b border-[#E4E8F0] bg-white px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-bold ${logoStyle}`}
          >
            {item.initials}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-[15px] font-extrabold leading-tight text-[#17243A]">
                {item.company}
              </h3>

              {item.priority && (
                <span
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-bold leading-tight ${priorityStyle}`}
                >
                  {applicationUI.priorityIcon === "phone" && (
                    <Phone size={12} strokeWidth={2.5} />
                  )}

                  {applicationUI.priorityIcon === "flag" && (
                    <Flag size={12} strokeWidth={2.5} />
                  )}

                  {item.priority}
                </span>
              )}

              {item.deadline && (
                <span className="rounded-md bg-[#FFDBCB] px-2 py-1 text-[11px] font-bold leading-tight text-[#8B3E0B]">
                  Deadline: {item.deadline}
                </span>
              )}
            </div>

            <p className="mt-[2px] truncate text-[12px] font-medium leading-tight text-[#64748B]">
              {item.role}
              {item.location ? ` · ${item.location}` : ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`flex max-w-[42%] shrink-0 items-center justify-center gap-1 rounded-md px-4 py-2.5 text-[12px] font-bold leading-tight ${actionStyle}`}
        >
          <ActionIcon size={14} strokeWidth={2.5} />

          <span className="text-center">{item.action}</span>
        </button>
      </div>

      <div className="mt-2 w-full rounded-lg bg-[#F5F7FB] px-3 py-2.5">
        <div className="flex w-full items-start">
          {(item.steps || []).map((step, index) => {
            const currentDate = step.timelineDate
              ? new Date(`${step.timelineDate}T00:00:00`)
              : null;

            const nextStep = item.steps?.[index + 1];

            const nextDate = nextStep?.timelineDate
              ? new Date(`${nextStep.timelineDate}T00:00:00`)
              : null;

            const status = getMilestoneStatus(step);
            const ui = getMilestoneUI(step);

            const Icon = getMilestoneIcon(step, status);

            const connectorWeight = getConnectorWeight(
              currentDate,
              nextDate,
              periods
            );

            const surface = getMilestoneSurface(step, status);
            const textClass = getMilestoneTextClass(step, status);
            const circleClass = getMilestoneCircleClass(step, status);
            const lineClass = getMilestoneLineClass(step, status);

            const isFilled = ui.filled === true;
            const isDarkText = ui.textOnSurface === true;

            return (
              <React.Fragment key={`${item.id}-${index}`}>
                <div className="shrink-0">
                  <div
                    className={`inline-flex items-start gap-1.5 rounded-[6px] px-3 py-2 ${surface}`}
                  >
                    <span
                      className={`mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${circleClass}`}
                    >
                      {Icon ? (
                        status === "upcoming" && !ui.icon ? (
                          <span className="text-[11px] font-bold text-[#8793A5]">
                            {index + 1}
                          </span>
                        ) : (
                          <Icon
                            size={15}
                            strokeWidth={
                              status === "completed" ? 3.5 : 2.5
                            }
                            className={
                              ui.iconColor ||
                              (status === "upcoming"
                                ? "text-[#8793A5]"
                                : "text-white")
                            }
                          />
                        )
                      ) : (
                        <span className="text-[11px] font-bold text-[#8793A5]">
                          {index + 1}
                        </span>
                      )}
                    </span>

                    <div className="max-w-[115px]">
                      <p
                        className={`whitespace-normal break-words text-[12px] font-bold leading-[1.15] ${
                          isDarkText ? "text-white" : textClass
                        }`}
                      >
                        {step.label}
                      </p>

                      {step.detail && (
                        <p
                          className={`mt-1 whitespace-normal break-words text-[11px] font-semibold leading-[1.15] ${
                            isDarkText ? "text-white" : "text-[#7D899C]"
                          }`}
                        >
                          {step.detail}
                        </p>
                      )}

                      {step.date && (
                        <p
                          className={`mt-1 whitespace-normal break-words text-[11px] font-medium leading-[1.15] ${
                            isDarkText ? "text-white" : "text-[#8A95A8]"
                          }`}
                        >
                          {step.date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {index < (item.steps || []).length - 1 && (
                  <div
                    className="flex min-w-[35px] flex-1 items-start justify-center pt-[9px]"
                    style={{ flexGrow: connectorWeight }}
                  >
                    <span
                      className={`mx-2 h-[2px] w-full ${lineClass}`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------
   ACTIVE SWIMLANES
-------------------------------------------------- */

function ActiveSwimlanes({
  applications = [],
  applicationSummary = { total: 0 },
  timelineView,
  timeline,
  activeTimelinePeriod,
}) {
  const periods = timeline?.views?.[timelineView] || [];

  return (
    <section className={`${cardClass} overflow-hidden !p-0`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E8F3] bg-[#EEF1FF] px-3 py-3">
        <SectionTitle icon={Layers3}>
          Active Milestone Swimlanes
        </SectionTitle>

        <span className="rounded-full border border-[#E5E8F3] bg-white px-2 py-1 text-xs font-semibold text-[#64748B]">
          Showing {applications.length} of {applicationSummary.total || 0}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-[#E8ECF5] bg-white px-3 py-2.5">
        <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#16A085]" />
          Confirmed
        </span>

        <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E66A4E]" />
          Action Needed
        </span>

        <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
          Projected
        </span>
      </div>

      <div className="grid grid-cols-[minmax(120px,0.85fr)_minmax(0,2fr)] gap-2 border-b border-[#E5E8F3] bg-[#F5F6FC] px-3 py-2.5">
        <span className="text-xs font-bold uppercase text-[#64748B]">
          Company / Role
        </span>

        <div
          className="grid gap-1.5 text-center"
          style={{
            gridTemplateColumns: `repeat(${Math.max(
              periods.length,
              1
            )}, minmax(0, 1fr))`,
          }}
        >
          {periods.map((period) => (
            <span
              key={period.id}
              className="text-xs font-bold text-[#64748B]"
            >
              {period.label?.replace(/\s*\(Today\)/i, "")}
              {activeTimelinePeriod?.id === period.id
                ? " (Today)"
                : ""}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white py-2">
        {applications.length > 0 ? (
          applications.map((item) => (
            <SwimlaneRow
              key={item.id}
              item={item}
              timelineView={timelineView}
              timeline={timeline}
            />
          ))
        ) : (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F5F8]">
              <Search className="h-5 w-5 text-[#64748B]" />
            </div>

            <p className="text-sm font-semibold text-[#334155]">
              No applications found
            </p>

            <p className="mt-1 text-xs text-[#64748B]">
              Try changing your search or pipeline filter.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E8F3] bg-[#F5F6FC] px-3 py-3">
        <p className="text-[11px] text-[#64748B]">
          Showing {applications.length} prioritized of{" "}
          {applicationSummary.total || 0} applications in flight.
        </p>

        <span className="flex items-center gap-1 text-xs font-bold text-[#5142D9]">
          {applicationSummary.total || 0} pipeline swimlanes available
          <ChevronDown size={13} />
        </span>
      </div>
    </section>
  );
}

/* --------------------------------------------------
   EVENT FEED
-------------------------------------------------- */

function EventFeed({ applications = [] }) {
  const events = applications.flatMap((item) =>
    (item.steps || []).map((step, index) => ({
      id: `${item.id}-${index}`,
      company: item.company,
      role: item.role,
      label: step.label,
      date: step.date,
      status: step.status,
    }))
  );

  return (
    <section className={`${cardClass} overflow-hidden !p-0`}>
      <div className="border-b border-slate-100 bg-[#EEF1FF] px-4 py-3">
        <SectionTitle icon={History}>Event Feed</SectionTitle>
      </div>

      <div className="divide-y divide-slate-100">
        {events.length ? (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  event.status === "completed"
                    ? "bg-emerald-500"
                    : event.status === "action"
                      ? "bg-orange-500"
                      : event.status === "active"
                        ? "bg-violet-600"
                        : "bg-slate-300"
                }`}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">
                  {event.company} · {event.label}
                </p>

                <p className="text-xs text-slate-400">
                  {event.role} · {event.date}
                </p>
              </div>

              <span className="text-xs font-bold capitalize text-slate-500">
                {event.status}
              </span>
            </div>
          ))
        ) : (
          <div className="px-6 py-10 text-center text-sm text-slate-400">
            No events match the current filters.
          </div>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------
   STAGE-GATE MATRIX
-------------------------------------------------- */

function StageGateMatrix({
  applications = [],
  timeline = {},
}) {
  const stages = timeline?.stages || [];

  const getStageStep = (item, stage) =>
    (item.steps || []).find(
      (step) => step.stage === stage.id
    );

  return (
    <section className={`${cardClass} overflow-hidden !p-0`}>
      <div className="border-b border-slate-100 bg-[#EEF1FF] px-4 py-3">
        <SectionTitle icon={ListFilter}>
          Stage-Gate Matrix
        </SectionTitle>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="bg-[#F5F6FC]">
              <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">
                Company
              </th>

              {stages.map((stage) => (
                <th
                  key={stage.id}
                  className="px-4 py-3 text-xs font-bold uppercase text-slate-500"
                >
                  {stage.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {applications.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100"
              >
                <td className="px-4 py-3 text-sm font-bold text-slate-800">
                  {item.company}
                </td>

                {stages.map((stage) => {
                  const step = getStageStep(item, stage);

                  return (
                    <td key={stage.id} className="px-4 py-3">
                      {step ? (
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                            step.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : step.status === "active"
                                ? "bg-violet-50 text-violet-700"
                                : step.status === "action"
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {step.status}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* --------------------------------------------------
   UPCOMING AGENDA
-------------------------------------------------- */

function UpcomingAgenda({ agenda = [] }) {
  const statusStyles = {
    "action-needed": {
      day: "text-[#D97706]",
      time: "text-[#C65A32]",
    },
    deadline: {
      day: "text-[#C94B4B]",
      time: "text-[#C65A32]",
    },
    scheduled: {
      day: "text-[#5142D9]",
      time: "text-[#5142D9]",
    },
  };

  return (
    <section className={`${cardClass} p-2.5`}>
      <div className="flex items-start justify-between gap-2">
        <SectionTitle icon={CalendarClock}>
          Upcoming 7-Day Agenda
        </SectionTitle>

        <span className="shrink-0 rounded-md bg-[#EAE5FF] px-1.5 py-1 text-xs font-bold leading-tight text-[#5142D9]">
          {agenda.length}
          <br />
          due
        </span>
      </div>

      <div className="mt-2 divide-y divide-[#E8ECF3]">
        {agenda.map((item) => {
          const style =
            statusStyles[item.status] ||
            statusStyles.scheduled;

          return (
            <article
              key={item.id}
              className="flex gap-2 py-2 first:pt-1 last:pb-1"
            >
              <div className="w-10 shrink-0 text-center">
                <p className={`text-xs font-extrabold ${style.day}`}>
                  {item.day}
                </p>

                <p className="text-sm font-extrabold leading-tight text-[#17243A]">
                  {item.date}
                </p>

                <p className="text-xs font-medium text-[#94A3B8]">
                  {item.month}
                </p>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 text-sm font-bold leading-tight text-[#17243A]">
                    {item.company} {item.title}
                  </p>

                  <span
                    className={`shrink-0 text-xs font-bold ${style.time}`}
                  >
                    {item.time}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* --------------------------------------------------
   VELOCITY BENCHMARKS
-------------------------------------------------- */

function VelocityBenchmarks({ benchmarks = [] }) {
  const barColors = [
    "bg-[#5142D9]",
    "bg-[#5142D9]",
    "bg-[#168FA3]",
    "bg-[#5142D9]",
  ];

  return (
    <section className={`${cardClass} p-2.5`}>
      <div className="flex items-start justify-between gap-2">
        <SectionTitle icon={Gauge}>
          Velocity Benchmarks
        </SectionTitle>

        <span className="text-xs font-semibold leading-tight text-[#168FA3]">
          cohort
          <br />
          p90
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
        Comparison between your turnaround time and standard tech recruiting
        SLA stages.
      </p>

      <div className="mt-2.5 space-y-2.5">
        {benchmarks.map((item, index) => (
          <div key={item.id}>
            <div className="flex min-w-0 items-start justify-between gap-2">
              <p className="min-w-0 flex-1 text-sm font-medium leading-tight text-[#17243A]">
                {item.label}
              </p>

              <p className="shrink-0 text-right text-xs text-[#94A3B8]">
                <span className="font-bold text-[#168FA3]">
                  You: {item.yourTime}
                </span>{" "}
                <span>(avg {item.averageTime})</span>
              </p>
            </div>

            <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#DDE8FA]">
              <div
                className={`h-full rounded-full ${
                  barColors[index] || "bg-[#5142D9]"
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------
   RECRUITING WAVES
-------------------------------------------------- */

function RecruitingWaves({ waves = [] }) {
  const statusStyles = {
    closing: {
      card: "border-[#E7EDF6] bg-[#F0F6FF]",
      icon: "bg-[#E7F8F1] text-[#168F73]",
      title: "text-[#17243A]",
      badge: "bg-[#E8F0FC] text-[#64748B]",
    },
    active: {
      card: "border-[#DDD9FA] bg-[#F1F0FF]",
      icon: "bg-[#EAE5FF] text-[#5142D9]",
      title: "text-[#5142D9]",
      badge: "bg-[#5142D9] text-white",
    },
    upcoming: {
      card: "border-[#E7EDF6] bg-[#F0F6FF]",
      icon: "bg-[#EEF2F7] text-[#94A3B8]",
      title: "text-[#64748B]",
      badge: "bg-[#E8F0FC] text-[#64748B]",
    },
  };

  return (
    <section className={`${cardClass} p-2.5`}>
      <div className="flex items-start justify-between gap-2">
        <SectionTitle icon={Waves}>
          Recruiting Waves Forecast
        </SectionTitle>

        <span className="text-xs font-medium leading-tight text-[#94A3B8]">
          {waves[0]?.seasonLabel || ""}
        </span>
      </div>

      <div className="mt-2 space-y-2">
        {waves.map((item) => {
          const style =
            statusStyles[item.status] ||
            statusStyles.upcoming;

          return (
            <article
              key={item.id}
              className={`rounded-md border p-2 ${style.card}`}
            >
              <div className="flex min-w-0 items-start gap-2">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${style.icon}`}
                >
                  <Waves size={11} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <h3
                      className={`min-w-0 flex-1 text-sm font-bold leading-tight ${style.title}`}
                    >
                      {item.title}
                    </h3>

                    <span
                      className={`w-[46px] shrink-0 rounded px-1.5 py-1 text-center text-xs font-semibold leading-tight ${style.badge}`}
                    >
                      {item.status === "active" ? (
                        <>
                          Active
                          <br />
                          Now
                        </>
                      ) : (
                        item.date
                      )}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* --------------------------------------------------
   CALENDAR & ALERTS
-------------------------------------------------- */

function CalendarAlerts({ calendarAlerts }) {
  const calendar = calendarAlerts?.calendar || {};
  const reminders = calendarAlerts?.reminders || {};

  return (
    <section className={`${cardClass} p-2.5`}>
      <div className="flex items-center justify-between gap-2">
        <SectionTitle icon={ArrowUpRight}>
          Calendar &amp; Alerts
        </SectionTitle>

        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#159A72]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#159A72]" />
          Live
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-[#E7EDF6] bg-[#F0F6FF] p-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EAE5FF] text-[#5142D9]">
            <CalendarDays size={13} />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-[#17243A]">
              {calendar.name}
            </p>

            <p className="text-xs leading-tight text-[#159A72]">
              {calendar.status}
              {calendar.source ? ` (${calendar.source})` : ""}
            </p>
          </div>
        </div>

        {calendar.connected && (
          <CircleCheck
            size={14}
            className="shrink-0 text-[#159A72]"
          />
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-[#F5F7FB] p-2">
        <div className="flex items-center gap-2">
          <Bell size={13} className="text-[#64748B]" />

          <span className="text-sm font-medium text-[#475569]">
            {reminders.label}
          </span>
        </div>

        <span
          className={`relative h-3.5 w-6 rounded-full ${
            reminders.enabled
              ? "bg-[#5142D9]"
              : "bg-[#CBD5E1]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white ${
              reminders.enabled
                ? "right-0.5"
                : "left-0.5"
            }`}
          />
        </span>
      </div>
    </section>
  );
}

/* --------------------------------------------------
   MAIN TIMELINE PAGE
-------------------------------------------------- */

export default function Timeline() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pipelineFilter, setPipelineFilter] = useState("all");
  const [timelineView, setTimelineView] = useState("weeks");
  const [timelineMode, setTimelineMode] = useState("gantt");
  const [showFilters, setShowFilters] = useState(false);
  const [milestoneStatusFilter, setMilestoneStatusFilter] =
    useState("all");
  const [syncState, setSyncState] = useState("Synced");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadTimeline = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getTimelineData();

        if (mounted) {
          setData(result || {});
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.message || "Unable to load timeline data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTimeline();

    return () => {
      mounted = false;
    };
  }, []);

  const {
    stats = [],
    applicationSummary = {
      total: 0,
      prioritized: 0,
    },
    applications = [],
    agenda = [],
    benchmarks = [],
    recruitingWaves = [],
    calendarAlerts = {},
    timeline = {},
    pageMeta = {},
  } = data || {};

  /*
    The current period is determined by the real frontend date.
    The backend only provides the period start/end dates.
  */
  const activeTimelinePeriod = useMemo(() => {
    const periods = timeline?.views?.[timelineView] || [];
    const today = new Date();

    return (
      periods.find((period) => {
        const start = new Date(
          `${period.startDate}T00:00:00`
        );

        const end = new Date(
          `${period.endDate}T23:59:59`
        );

        return today >= start && today <= end;
      }) || null
    );
  }, [timeline, timelineView]);

  const filteredApplications = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return applications.filter((item) => {
      const matchesSearch =
        !search ||
        String(item.company || "")
          .toLowerCase()
          .includes(search) ||
        String(item.role || "")
          .toLowerCase()
          .includes(search) ||
        String(item.location || "")
          .toLowerCase()
          .includes(search) ||
        (item.steps || []).some(
          (step) =>
            String(step.label || "")
              .toLowerCase()
              .includes(search) ||
            String(step.date || "")
              .toLowerCase()
              .includes(search)
        );

      const matchesPipeline =
        pipelineFilter === "all" ||
        (pipelineFilter === "interviews" &&
          (item.steps || []).some(
            (step) => step.type === "interview"
          ));

      const matchesMilestoneStatus =
        milestoneStatusFilter === "all" ||
        (item.steps || []).some((step) => {
          if (milestoneStatusFilter === "action") {
            return (
              step.status === "action" ||
              step.actionNeeded === true
            );
          }

          return step.status === milestoneStatusFilter;
        });

      return (
        matchesSearch &&
        matchesPipeline &&
        matchesMilestoneStatus
      );
    });
  }, [
    applications,
    searchTerm,
    pipelineFilter,
    milestoneStatusFilter,
  ]);

  const handleExportSchedule = () => {
    const rows = filteredApplications.flatMap((item) =>
      (item.steps || []).map((step) => ({
        company: item.company || "",
        role: item.role || "",
        location: item.location || "",
        milestone: step.label || "",
        date: step.date || "",
        timelineDate: step.timelineDate || "",
      }))
    );

    if (!rows.length) return;

    const headers = Object.keys(rows[0]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map(
            (header) =>
              `"${String(row[header]).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "timeline-schedule.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleSyncCalendar = async () => {
    if (syncState === "Syncing...") return;

    setSyncState("Syncing...");

    try {
      /*
        Backend/calendar integration will be connected here.
        The UI already supports an asynchronous integration.
      */
      setSyncState("Synced");
    } catch (err) {
      setSyncState("Sync failed");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-w-0 bg-[#f7f8fc] p-3 sm:p-4">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-xl border border-[#e8eaf3] bg-white p-8 text-center shadow-sm">
            <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-violet-600" />

            <p className="text-sm font-bold text-[#334155]">
              Loading timeline...
            </p>

            <p className="mt-1 text-xs text-[#64748B]">
              Fetching your application timeline.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-w-0 bg-[#f7f8fc] p-3 sm:p-4">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-3 h-6 w-6 text-red-500" />

            <p className="text-sm font-bold text-[#334155]">
              Unable to load timeline
            </p>

            <p className="mt-1 text-xs text-[#64748B]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-violet-600 px-4 py-2 text-xs font-bold text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 bg-[#f7f8fc] p-3 sm:p-4">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <TimelineHeader
          onExportSchedule={handleExportSchedule}
          onSyncCalendar={handleSyncCalendar}
          syncState={syncState}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          milestoneStatusFilter={milestoneStatusFilter}
          setMilestoneStatusFilter={setMilestoneStatusFilter}
          cohortLabel={pageMeta.cohortLabel}
          syncLabel={pageMeta.syncLabel}
        />

        <TimelineStats stats={stats} />

        <TimelineToolbar
          applications={applications}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          pipelineFilter={pipelineFilter}
          setPipelineFilter={setPipelineFilter}
          timelineView={timelineView}
          setTimelineView={setTimelineView}
          timelineMode={timelineMode}
          setTimelineMode={setTimelineMode}
        />

        <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.95fr)_minmax(270px,0.85fr)]">
          <div className="min-w-0">
            {timelineMode === "gantt" ? (
              <ActiveSwimlanes
                applications={filteredApplications}
                applicationSummary={applicationSummary}
                timelineView={timelineView}
                timeline={timeline}
                activeTimelinePeriod={activeTimelinePeriod}
              />
            ) : timelineMode === "feed" ? (
              <EventFeed
                applications={filteredApplications}
              />
            ) : (
              <StageGateMatrix
                applications={filteredApplications}
                timeline={timeline}
              />
            )}
          </div>

          <aside className="flex min-w-0 flex-col gap-4">
            <UpcomingAgenda agenda={agenda} />
            <VelocityBenchmarks benchmarks={benchmarks} />
            <RecruitingWaves waves={recruitingWaves} />
            <CalendarAlerts
              calendarAlerts={calendarAlerts}
            />
          </aside>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-2">
          <p className="text-sm leading-relaxed text-slate-500">
            <Sparkles
              size={14}
              className="mr-1 inline text-violet-600"
            />
            Pro Tip: You can track milestones and monitor your
            application progress from this timeline.
          </p>

          <span className="text-sm text-slate-400">
            CareerTracker · Timeline
          </span>
        </div>
      </div>
    </div>
  );
}