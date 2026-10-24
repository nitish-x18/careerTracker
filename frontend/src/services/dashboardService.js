
const dashboardData = {
  userName: "Alex",
  sprint: "SPRINT CYCLE: SUMMER 2025 APPLICATIONS",

  stats: [
    {
      id: "total",
      label: "Total Applications",
      value: 28,
      detail: "+4 this month",
      footer: "Target: 40 active",
      progress: 70,
      color: "violet",
    },
    
{
  id: "applied",
  label: "Applied",
  value: 14,
  detail: "50% of active",
  footer: "Awaiting review",
  secondaryDetail: "AVG 4.2d",
  progress: 50,
  color: "cyan",
},

    {
      id: "interviews",
      label: "Interviews",
      value: 5,
      detail: "Active",
      footer: "2 tech · 1 final · 2 screen",
      progress: 70,
      color: "violet",
    },
    {
      id: "offers",
      label: "Offers Received",
      value: 2,
      detail: "Action needed",
      footer: "1 pending decision",
      secondaryFooter: "1 accepted",
      progress: 100,
      color: "cyan",
    },
  ],

  priorityApplications: [
    {
      id: 1,
      initials: "S",
      company: "Stripe",
      match: 94,
      priority: "High Priority",
      role: "Software Engineering Intern",
      location: "Core Infrastructure",
      task: "Next: Technical Screen in 2 days",
      time: "Thu, 2:30 PM PST",
      secondaryAction: "Review Notes",
      action: "Prep Room →",
      actionStyle: "primary",
      taskStyle: "warning",
    },
    {
      id: 2,
      initials: "D",
      company: "Datadog",
      match: 88,
      priority: "Priority Tier 1",
      role: "Frontend Platform Engineer Intern",
      location: "New York, NY",
      task: "Assessment due tomorrow at 11:59 PM",
      time: "CodeSignal 70m",
      secondaryAction: "Check Specs",
      action: "Start Test ↗",
      actionStyle: "primary",
      taskStyle: "danger",
    },
    {
      id: 3,
      initials: "L",
      company: "Linear Orbit",
      match: 96,
      priority: "Top Pick",
      role: "Product Engineer Intern",
      location: "Remote (US/Canada)",
      task: "Submitted take-home project · Awaiting review response",
      time: "",
      secondaryAction: "View Work",
      action: "Timeline ›",
      actionStyle: "text",
      taskStyle: "success",
    },
  ],

  alerts: [
    {
      id: 1,
      company: "Snowflake",
      label: "Keyword deficit",
      description: 'Missing: "Distributed Systems", "gRPC"',
      style: "warning",
    },
    {
      id: 2,
      company: "Uber",
      label: "18h remaining",
      description: "Application form closes at 5:00 PM EST",
      style: "danger",
    },
  ],

  deadlines: [
    {
      id: 1,
      company: "Uber",
      role: "Summer 2025 Backend Intern",
      badge: "URGENT",
      badgeStyle: "urgent",
      date: "Closes in 18 hours",
      action: "Apply Now",
      actionStyle: "primary",
    },
    {
      id: 2,
      company: "Snowflake",
      role: "Systems Engineer Intern",
      badge: "3 DAYS",
      badgeStyle: "normal",
      date: "Deadline: Friday 11:59 PM",
      action: "Resume Check",
      actionStyle: "text",
    },
    {
      id: 3,
      company: "GitHub",
      role: "Campus Fellowship 2025",
      badge: "6 DAYS",
      badgeStyle: "normal",
      date: "Deadline: Next Tuesday",
      action: "Draft Cover",
      actionStyle: "text",
    },
  ],

  pipeline: [
    { id: "drafts", label: "Drafts", value: 3, percentage: 10, color: "slate" },
    { id: "applied", label: "Applied", value: 14, percentage: 50, color: "cyan" },
    { id: "assessment", label: "Assessment", value: 4, percentage: 14, color: "orange" },
    { id: "technical", label: "Technical", value: 3, percentage: 11, color: "violet" },
    { id: "final", label: "Final Round", value: 2, percentage: 7, color: "indigo" },
    { id: "offers", label: "Offers", value: 2, percentage: 7, color: "cyan" },
  ],

  pipelineSummary: {
    description:
      "Live breakdown of all 28 applications across evaluation milestones",
    updated: "Updated 12m ago",
    conversionLabel: "Application to Offer",
    conversionPercentage: 7.1,
    chartPoints: [
      { x: 2, y: 43 },
      { x: 83, y: 36 },
      { x: 165, y: 32 },
      { x: 248, y: 22 },
      { x: 325, y: 20 },
      { x: 418, y: 12 },
    ],
  },

  activity: [
    {
      id: 1,
      icon: "document",
      title: "Applied to Figma for Product Design Engineering Intern",
      detail: "Yesterday at 4:18 PM · Tailored Resume v3.4 attached",
      time: "1d ago",
      status: "",
    },
    {
      id: 2,
      icon: "calendar",
      title: "Scheduled Technical Interview with Microsoft",
      detail: "2 days ago · Interviewer: Senior SDE Cloud Infrastructure",
      time: "2d ago",
      status: "",
    },
    {
      id: 3,
      icon: "offer",
      title: "Received Formal Offer letter from Vercel",
      detail: "4 days ago · Frontend Systems Intern · Deadline: Oct 30",
      time: "",
      status: "Offer active",
    },
  ],

  quickAdd: {
    eyebrow: "1-CLICK QUICK ADD",
    title: "Found a new role?",
    description:
      "Paste any job posting URL to auto-extract company metadata, role description, and ATS keyword targets.",
    placeholder: "https://careers.company.com/job/...",
    buttonLabel: "Parse & Track →",
  },
};

export async function getDashboardData() {
  // Replace this mock implementation with your API request later.
  return dashboardData;
}



