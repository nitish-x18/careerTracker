
import { api } from "./api";

const getPayload = (response) =>
  response?.data?.data ?? response?.data ?? response;

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getInitials = (company) =>
  String(company || "NA")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

const getStatusLabel = (status) => {
  const labels = {
    saved: "Saved",
    applied: "Application Submitted",
    interview: "Interview",
    offer: "Offer Received",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };

  return labels[status] || "Application";
};

const getApplicationSteps = (application) => {
  const status = String(application.status || "saved").toLowerCase();
  const appliedDate = application.applied_date || null;
  const deadline = application.deadline || application.job_deadline || null;

  const steps = [
    {
      stage: "saved",
      label: "Application Saved",
      detail: "Job added to your applications",
      date: "",
      timelineDate: null,
      status: "completed",
      type: "application",
      ui: { icon: "check" },
    },
  ];

  if (appliedDate || ["applied", "interview", "offer", "rejected", "withdrawn"].includes(status)) {
    steps.push({
      stage: "applied",
      label: "Applied",
      detail: "Application submitted",
      date: formatDate(appliedDate) || "Date not recorded",
      timelineDate: appliedDate,
      status: ["saved"].includes(status) ? "upcoming" : "completed",
      type: "application",
      ui: { icon: "check" },
    });
  }

  if (status === "interview") {
    steps.push({
      stage: "interview",
      label: "Interview",
      detail: "Current application stage",
      date: formatDate(appliedDate),
      timelineDate: appliedDate,
      status: "active",
      type: "interview",
      ui: { icon: "user" },
    });
  } else if (status === "offer") {
    steps.push({
      stage: "offer",
      label: "Offer Received",
      detail: "Application outcome",
      date: formatDate(appliedDate),
      timelineDate: appliedDate,
      status: "completed",
      type: "application",
      ui: { icon: "check" },
    });
  } else if (status === "rejected" || status === "withdrawn") {
    steps.push({
      stage: status,
      label: getStatusLabel(status),
      detail: "Application closed",
      date: formatDate(appliedDate),
      timelineDate: appliedDate,
      status: "completed",
      type: "application",
      ui: { icon: "check" },
    });
  } else if (status === "applied") {
    steps.push({
      stage: "review",
      label: "Under Review",
      detail: "Waiting for employer response",
      date: "",
      timelineDate: null,
      status: "active",
      type: "application",
      ui: { icon: "clock" },
    });
  } else if (status === "saved") {
    steps.push({
      stage: "next",
      label: "Next Step",
      detail: "Update status when you apply",
      date: "",
      timelineDate: null,
      status: "upcoming",
      type: "application",
    });
  }

  if (deadline) {
    steps.push({
      stage: "deadline",
      label: "Job Deadline",
      detail: "Application deadline",
      date: formatDate(deadline),
      timelineDate: deadline,
      status: "upcoming",
      type: "deadline",
      ui: { icon: "calendar" },
    });
  }

  return steps;
};

const getPeriods = (view) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (view === "weeks") {
    const monday = new Date(today);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - ((day + 6) % 7));

    return Array.from({ length: 8 }, (_, index) => {
      const start = new Date(monday);
      start.setDate(start.getDate() + index * 7);

      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      return {
        id: `week-${index}`,
        label: `Week ${index + 1}`,
        startDate: toDateString(start),
        endDate: toDateString(end),
      };
    });
  }

  if (view === "months") {
    return Array.from({ length: 6 }, (_, index) => {
      const start = new Date(today.getFullYear(), today.getMonth() + index, 1);
      const end = new Date(today.getFullYear(), today.getMonth() + index + 1, 0);

      return {
        id: `month-${index}`,
        label: start.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        startDate: toDateString(start),
        endDate: toDateString(end),
      };
    });
  }

  return Array.from({ length: 4 }, (_, index) => {
    const start = new Date(today.getFullYear(), today.getMonth() + index * 3, 1);
    const end = new Date(today.getFullYear(), today.getMonth() + (index + 1) * 3, 0);

    return {
      id: `season-${index}`,
      label: start.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      startDate: toDateString(start),
      endDate: toDateString(end),
    };
  });
};

const mapApplication = (application) => {
  const company = application.company_name || "Company not specified";
  const role = application.job_title || "Position not specified";
  const status = String(application.status || "saved").toLowerCase();
  const deadline = application.deadline || application.job_deadline || null;

  return {
    id: application.id,
    company,
    role,
    location: "",
    initials: getInitials(company),
    priority: application.priority_level
      ? `${application.priority_level.charAt(0).toUpperCase()}${application.priority_level.slice(1)} Priority`
      : "",
    deadline: formatDate(deadline),
    action: getStatusLabel(status),
    status,
    steps: getApplicationSteps(application),
    ui: {
      logoTone: "dark",
      actionTone: "light",
      actionIcon: "arrow",
      priorityTone:
        application.priority_level === "high"
          ? "warning"
          : "default",
    },
  };
};

const buildAgenda = (applications) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return applications
    .map((application) => {
      const deadline = application.deadline || application.job_deadline;

      if (!deadline) return null;

      const date = new Date(`${String(deadline).slice(0, 10)}T00:00:00`);

      if (Number.isNaN(date.getTime()) || date < today || date > nextWeek) {
        return null;
      }

      return {
        id: `${application.id}-deadline`,
        company: application.company_name || "Company",
        title: "· Application deadline",
        description: application.job_title || "Job application",
        day: date.toLocaleDateString("en-IN", { weekday: "short" }),
        date: date.toLocaleDateString("en-IN", { day: "2-digit" }),
        month: date.toLocaleDateString("en-IN", { month: "short" }),
        time: "Deadline",
        status: "deadline",
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const dateA = new Date(`${a.month} ${a.date}`);
      const dateB = new Date(`${b.month} ${b.date}`);
      return dateA - dateB;
    });
};

export const getTimelineData = async () => {
  const response = await api.get("/api/applications");
  const payload = getPayload(response);

  const records =
    payload?.applications ??
    payload?.data?.applications ??
    [];

  if (!Array.isArray(records)) {
    throw new Error("Invalid applications response from server.");
  }

  const applications = records.map(mapApplication);

  const activeStatuses = ["saved", "applied", "interview"];
  const activeCount = records.filter((item) =>
    activeStatuses.includes(String(item.status || "saved").toLowerCase())
  ).length;

  const interviewCount = records.filter(
    (item) => String(item.status || "").toLowerCase() === "interview"
  ).length;

  const deadlineCount = records.filter(
    (item) => item.deadline || item.job_deadline
  ).length;

  const stats = [
    {
      id: "active-pipelines",
      type: "active-pipelines",
      label: "Active Pipelines",
      value: activeCount,
      detail: "in progress",
      supportingText: "Saved, applied and interview stages",
    },
    {
      id: "milestones",
      type: "milestones",
      label: "Applications",
      value: records.length,
      detail: "total",
      supportingText: "Records from your account",
    },
    {
      id: "average-velocity",
      type: "average-velocity",
      label: "Interviews",
      value: interviewCount,
      detail: "scheduled stage",
      supportingText: "Applications currently at interview stage",
    },
    {
      id: "timeline-health",
      type: "timeline-health",
      label: "With Deadlines",
      value: deadlineCount,
      detail: "tracked",
      supportingText: "Applications with a recorded deadline",
    },
  ];

  const stages = [
    { id: "saved", label: "Saved" },
    { id: "applied", label: "Applied" },
    { id: "review", label: "Under Review" },
    { id: "interview", label: "Interview" },
    { id: "offer", label: "Offer" },
    { id: "rejected", label: "Rejected" },
    { id: "withdrawn", label: "Withdrawn" },
    { id: "deadline", label: "Deadline" },
  ];

  return {
    stats,
    applicationSummary: {
      total: records.length,
      prioritized: activeCount,
    },
    applications,
    agenda: buildAgenda(records),
    benchmarks: [],
    recruitingWaves: [],
    calendarAlerts: {
      calendar: {
        name: "Calendar integration",
        status: "Not connected",
        source: "",
        connected: false,
      },
      reminders: {
        label: "Calendar reminders unavailable",
        enabled: false,
      },
    },
    timeline: {
      stages,
      views: {
        weeks: getPeriods("weeks"),
        months: getPeriods("months"),
        season: getPeriods("season"),
      },
    },
    pageMeta: {
      cohortLabel: "MY APPLICATIONS",
      syncLabel: "Connected to applications database",
    },
  };
};
