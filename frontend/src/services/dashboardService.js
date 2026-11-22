
import { api } from "./api";

const formatDate = (date) => {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDateInfo = (date) => {
  const target = new Date(date);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const difference = Math.ceil(
    (target - today) / (1000 * 60 * 60 * 24)
  );

  if (difference < 0) {
    return {
      badge: "Overdue",
      badgeStyle: "urgent",
    };
  }

  if (difference === 0) {
    return {
      badge: "Due Today",
      badgeStyle: "urgent",
    };
  }

  if (difference === 1) {
    return {
      badge: "Tomorrow",
      badgeStyle: "urgent",
    };
  }

  return {
    badge: `${difference} Days Left`,
    badgeStyle: "normal",
  };
};

const getEventIcon = (eventType = "") => {
  const type = eventType.toLowerCase();

  if (type.includes("interview") || type.includes("meeting")) {
    return "calendar";
  }

  if (type.includes("offer")) {
    return "offer";
  }

  return "document";
};

export async function getDashboardData() {
  const [userResponse, applicationsResponse, notificationResponse] =
    await Promise.all([
      api.get("/api/users"),
      api.get("/api/applications"),
      api.get("/api/notifications"),
    ]);

  const user = userResponse.data.user;
  const applications =
    applicationsResponse.data.applications || [];
  const notifications =
    notificationResponse.data.notifications || [];

  // Application statistics
  const total = applications.length;

  const applied = applications.filter(
    (app) => app.status === "applied"
  ).length;

  const interviews = applications.filter(
    (app) => app.status === "interview"
  ).length;

  const offers = applications.filter(
    (app) => app.status === "offer"
  ).length;

  // Priority applications
  const activeApplications = applications.filter((app) =>
    ["saved", "applied", "interview"].includes(app.status)
  );

  const priorityApplications = activeApplications.map((app) => ({
    id: app.id,
    initials: (app.company_name || "C").charAt(0).toUpperCase(),
    company: app.company_name || "Company not available",
    match: app.match_score ?? 0,
    priority: app.priority_level || "Medium Priority",
    role: app.job_title || "Job title not available",
    location: "Not available",
    task: app.deadline
      ? `Deadline: ${formatDate(app.deadline)}`
      : "No upcoming task",
    time: "",
    dueOrder: app.deadline
      ? new Date(app.deadline).getTime()
      : Number.MAX_SAFE_INTEGER,
    secondaryAction: "View Application",
    secondaryRoute: "/applications",
    action: "View Details",
    actionStyle: "primary",
    route: "/applications",
    taskStyle: "warning",
  }));

  // Pipeline
  const pipelineStatuses = [
    { id: "saved", label: "Saved", color: "slate" },
    { id: "applied", label: "Applied", color: "cyan" },
    { id: "interview", label: "Interview", color: "violet" },
    { id: "offer", label: "Offers", color: "indigo" },
    { id: "rejected", label: "Rejected", color: "orange" },
  ];

  const pipeline = pipelineStatuses.map((status) => {
    const value = applications.filter(
      (app) => app.status === status.id
    ).length;

    return {
      ...status,
      value,
      percentage: total
        ? Math.round((value / total) * 100)
        : 0,
    };
  });

  // Fetch events for every application
  const eventResponses = await Promise.allSettled(
    applications.map((app) =>
      api.get(`/api/applications/${app.id}/events`)
    )
  );

  const activity = [];

  eventResponses.forEach((result, index) => {
    if (result.status !== "fulfilled") return;

    const app = applications[index];
    const events = result.value.data.events || [];

    events.forEach((event) => {
      activity.push({
        id: event.id,
        title: `${app.company_name || "Application"}: ${event.event_type}`,
        detail:
          event.details || "Application activity recorded.",
        icon: getEventIcon(event.event_type),
        time: event.scheduled_at
          ? formatDate(event.scheduled_at)
          : "Recently",
        status: "",
        sortDate: event.scheduled_at
          ? new Date(event.scheduled_at).getTime()
          : 0,
      });
    });
  });

  activity.sort((a, b) => b.sortDate - a.sortDate);

  // Unread notifications
  const unreadNotifications = notifications.filter(
    (notification) => !Number(notification.is_read)
  );

  const applicationMap = new Map(
    applications.map((app) => [app.id, app])
  );

  const alerts = unreadNotifications.map((notification) => {
    const app = applicationMap.get(notification.application_id);
    const dueDate = notification.due_at
      ? new Date(notification.due_at)
      : null;

    const isOverdue =
      dueDate && dueDate.getTime() < Date.now();

    return {
      id: notification.id,
      company: app?.company_name || "CareerTrack Reminder",
      label: isOverdue ? "Overdue" : "Unread",
      style: isOverdue ? "danger" : "warning",
      description: notification.type
        ? notification.type.replace(/_/g, " ")
        : "You have a pending notification.",
    };
  });

  // Upcoming deadlines from applications
  const deadlines = [];

  applications.forEach((app) => {
    if (!app.deadline) return;

    const dateInfo = getDateInfo(app.deadline);

    deadlines.push({
      id: `application-${app.id}`,
      company: app.company_name || "Company",
      role: app.job_title || "Application deadline",
      date: formatDate(app.deadline),
      ...dateInfo,
      action: "View Application",
      actionStyle: "primary",
      route: "/applications",
      sortDate: new Date(app.deadline).getTime(),
    });
  });

  // Upcoming deadlines from application events
  eventResponses.forEach((result, index) => {
    if (result.status !== "fulfilled") return;

    const app = applications[index];
    const events = result.value.data.events || [];

    events.forEach((event) => {
      if (!event.scheduled_at) return;

      const dateInfo = getDateInfo(event.scheduled_at);

      deadlines.push({
        id: `event-${event.id}`,
        company: app.company_name || "Company",
        role: event.details || event.event_type,
        date: formatDate(event.scheduled_at),
        ...dateInfo,
        action: "View Application",
        actionStyle: "primary",
        route: "/applications",
        sortDate: new Date(event.scheduled_at).getTime(),
      });
    });
  });

  // Upcoming deadlines from notifications
  notifications.forEach((notification) => {
    if (!notification.due_at) return;

    const app = applicationMap.get(notification.application_id);
    const dateInfo = getDateInfo(notification.due_at);

    deadlines.push({
      id: `notification-${notification.id}`,
      company: app?.company_name || "Reminder",
      role: notification.type || "Pending notification",
      date: formatDate(notification.due_at),
      ...dateInfo,
      action: "View Application",
      actionStyle: "secondary",
      route: "/applications",
      sortDate: new Date(notification.due_at).getTime(),
    });
  });

  deadlines.sort((a, b) => a.sortDate - b.sortDate);

  return {
    userName: user.name || "User",
    sprint: "YOUR APPLICATION DASHBOARD",

    stats: [
      {
        id: "total",
        label: "Total Applications",
        value: total,
        detail: "Your applications",
        footer: "All tracked applications",
        goal: "",
        progress: 0,
        color: "violet",
      },
      {
        id: "applied",
        label: "Applied",
        value: applied,
        detail: "Applications submitted",
        footer: "Awaiting response",
        secondaryDetail: "",
        progress: total
          ? Math.round((applied / total) * 100)
          : 0,
        color: "cyan",
      },
      {
        id: "interviews",
        label: "Interviews",
        value: interviews,
        detail: "Interview stage",
        footer: "Active interviews",
        progress: total
          ? Math.round((interviews / total) * 100)
          : 0,
        color: "violet",
      },
      {
        id: "offers",
        label: "Offers Received",
        value: offers,
        detail: "Offer stage",
        footer: "Received offers",
        progress: total
          ? Math.round((offers / total) * 100)
          : 0,
        color: "cyan",
      },
    ],

    priorityApplications,

    alerts,

    deadlines: deadlines.slice(0, 5),

    pipeline,

    pipelineSummary: {
      description: `Live breakdown of your ${total} applications`,
      updated: "Updated just now",
      conversionLabel: "Application to Offer",
      conversionPercentage: total
        ? Number(((offers / total) * 100).toFixed(1))
        : 0,
      chartPoints: [],
    },

    activity: activity.slice(0, 5),

    quickAdd: {
      eyebrow: "1-CLICK QUICK ADD",
      title: "Found a new role?",
      description:
        "Paste any job posting URL to track a new application.",
      placeholder: "https://careers.company.com/job/...",
      buttonLabel: "Parse & Track",
    },
  };
}
