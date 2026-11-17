export const timelineData = {
  stats: [
    {
      id: "pipelines",
      type: "active-pipelines",
      label: "Active Pipelines",
      detail: "In Flight",
      value: 28,
      footer: "Across 6 hiring stages",
      supportingText: "Across 4 hiring stages",
      supportingNote: "+3 this week",
      supportingTone: "violet",
    },

    {
      id: "milestones",
      type: "milestones",
      label: "Milestones (7 Days)",
      value: 5,
      detail: "Critical",
      footer: "2 calls -+ 3 technical rounds",
      supportingText: "2 QAs, 1 Screen, 1 Tech",
      supportingNote: "Action Req.",
      supportingTone: "rose",
    },

    {
      id: "velocity",
      type: "average-velocity",
      label: "Average Velocity",
      value: 14.2,
      detail: "days",
      footer: "Average stage transition time",
      supportingText: "App to Offer stage",
      supportingNote: "-2.4d vs peers",
      supportingTone: "cyan",
    },

    {
      id: "health",
      type: "timeline-health",
      label: "Timeline Health",
      value: "94%",
      detail: "On schedule",
      footer: "3 milestones require attention",
      supportingText: "1 Stagnant pipeline flag",
      supportingNote: ">14d idle",
      supportingTone: "orange",
    },
  ],

  applicationSummary: {
    total: 28,
    prioritized: 6,
  },

  timeline: {
    views: {
      weeks: [
        {
          id: "week-1",
          label: "Oct W1",
          startDate: "2024-10-01",
          endDate: "2024-10-07",
        },
        {
          id: "week-2",
          label: "Oct W2",
          startDate: "2024-10-08",
          endDate: "2024-10-14",
        },
        {
          id: "week-3",
          label: "Oct W3",
          startDate: "2024-10-15",
          endDate: "2024-10-21",
        },
        {
          id: "week-4",
          label: "Oct W4",
          startDate: "2024-10-22",
          endDate: "2024-10-28",
        },
        {
          id: "week-5",
          label: "Nov Target",
          startDate: "2024-11-01",
          endDate: "2024-11-30",
        },
      ],

      months: [
        {
          id: "august",
          label: "August",
          startDate: "2024-08-01",
          endDate: "2024-08-31",
        },
        {
          id: "september",
          label: "September",
          startDate: "2024-09-01",
          endDate: "2024-09-30",
        },
        {
          id: "october",
          label: "October",
          startDate: "2024-10-01",
          endDate: "2024-10-31",
        },
        {
          id: "november",
          label: "November",
          startDate: "2024-11-01",
          endDate: "2024-11-30",
        },
        {
          id: "december",
          label: "December",
          startDate: "2024-12-01",
          endDate: "2024-12-31",
        },
      ],

      season: [
        {
          id: "fall-2024",
          label: "Fall 2024",
          startDate: "2024-09-01",
          endDate: "2024-11-30",
        },
        {
          id: "winter-2024",
          label: "Winter 2024",
          startDate: "2024-12-01",
          endDate: "2025-02-28",
        },
        {
          id: "spring-2025",
          label: "Spring 2025",
          startDate: "2025-03-01",
          endDate: "2025-05-31",
        },
        {
          id: "summer-2025",
          label: "Summer 2025",
          startDate: "2025-06-01",
          endDate: "2025-08-31",
        },
        {
          id: "fall-2025",
          label: "Fall 2025",
          startDate: "2025-09-01",
          endDate: "2025-11-30",
        },
      ],
    },

    stages: [
      {
        id: "applied",
        label: "Applied",
      },
      {
        id: "screen",
        label: "Screen",
      },
      {
        id: "technical",
        label: "Technical",
      },
      {
        id: "offer",
        label: "Offer",
      },
    ],
  },

  applications: [
    {
      id: 1,
      company: "Datadog",
      initials: "DD",
      role: "Frontend Platform Intern",
      location: "Fall/Summer 2025",
      match: 92,
      priority: "11h Remaining",
      action: "Launch OA Workspace",

      steps: [
        {
          label: "Applied",
          date: "Oct 12",
          timelineDate: "2024-10-12",
          status: "completed",
          type: "application",
          stage: "applied",
        },

        {
          label: "OA: CodeSignal GCA",
          date: "Due Today, 11:59 PM",
          timelineDate: "2024-10-18",
          status: "action",
          detail: "Assessment",
          type: "assessment",
          stage: "screen",
        },

        {
          label: "Tech Screen (Est.)",
          date: "Oct 28",
          timelineDate: "2024-10-28",
          status: "upcoming",
          type: "interview",
          stage: "technical",
        },

        {
          label: "Final Round",
          date: "Nov 08",
          timelineDate: "2024-11-08",
          status: "upcoming",
          type: "interview",
          stage: "technical",
        },
      ],
    },

    {
      id: 2,
      company: "Stripe",
      initials: "///",
      role: "Backend Infrastructure Intern",
      location: "Distributed Systems Track",
      match: 96,
      priority: "Screen Confirmed",
      action: "Join Mock Room & Review Rubric",

      steps: [
        {
          label: "Applied",
          date: "Oct 08",
          timelineDate: "2024-10-08",
          status: "completed",
          type: "application",
          stage: "applied",
        },

        {
          label: "OA Cleared",
          date: "82/850",
          timelineDate: "2024-10-15",
          status: "completed",
          type: "assessment",
          stage: "screen",
        },

        {
          label: "Live Tech Screen",
          date: "Thu Oct 24, 2:30 PM PST",
          timelineDate: "2024-10-24",
          status: "active",
          detail: "Thu Oct 24",
          type: "interview",
          stage: "technical",
        },

        {
          label: "Systems Panel",
          date: "Nov 04",
          timelineDate: "2024-11-04",
          status: "upcoming",
          type: "interview",
          stage: "technical",
        },

        {
          label: "Offer Target",
          date: "Nov 15",
          timelineDate: "2024-11-15",
          status: "upcoming",
          type: "decision",
          stage: "offer",
        },
      ],
    },

    {
      id: 3,
      company: "Vercel",
      initials: "G��",
      role: "Solutions Engineer",
      location: "Next.js Core Team",
      match: 89,
      priority: "Written Offer in Hand",
      deadline: "Oct 25 (36h Ext. Pending)",
      action: "View Extension Request",

      steps: [
        {
          label: "Applied",
          date: "Sep 22",
          timelineDate: "2024-09-22",
          status: "completed",
          type: "application",
          stage: "applied",
        },

        {
          label: "Screener",
          date: "Sep 30",
          timelineDate: "2024-09-30",
          status: "completed",
          type: "interview",
          stage: "screen",
        },

        {
          label: "Tech Panel",
          date: "Oct 09",
          timelineDate: "2024-10-09",
          status: "completed",
          type: "interview",
          stage: "technical",
        },

        {
          label: "Offer Extended",
          date: "Oct 18",
          timelineDate: "2024-10-18",
          status: "completed",
          type: "decision",
          stage: "offer",
        },

        {
          label: "Decision Due",
          date: "Fri Oct 25, 5:00 PM PST",
          timelineDate: "2024-10-25",
          status: "action",
          type: "decision",
          stage: "offer",
        },
      ],
    },

    {
      id: 4,
      company: "Uber",
      initials: "UB",
      role: "Systems & Core Platform Intern",
      location: "San Francisco HQ",
      match: 87,
      priority: "Cutoff Closes Tomorrow 5:00 PM",
      action: "Submit Application Now",

      steps: [
        {
          label: "Draft Saved",
          date: "Oct 14",
          timelineDate: "2024-10-14",
          status: "completed",
          type: "application",
          stage: "applied",
        },

        {
          label: "Portal Closes",
          date: "Tomorrow 5:00 PM",
          timelineDate: "2024-10-19",
          status: "action",
          type: "deadline",
          stage: "applied",
        },

        {
          label: "Wave 1 Screener",
          date: "Oct 31",
          timelineDate: "2024-10-31",
          status: "upcoming",
          type: "interview",
          stage: "screen",
        },

        {
          label: "OA / Tech",
          date: "Nov 12",
          timelineDate: "2024-11-12",
          status: "upcoming",
          type: "assessment",
          stage: "technical",
        },
      ],
    },

    {
      id: 5,
      company: "Snowflake",
      initials: "G��",
      role: "Core Infrastructure & Storage Engineer",
      location: "",
      match: 91,
      priority: "Recruiter Call Mon",
      action: "View Call Notes & Prep",

      steps: [
        {
          label: "Applied",
          date: "Oct 08",
          timelineDate: "2024-10-08",
          status: "completed",
          type: "application",
          stage: "applied",
        },

        {
          label: "Resume Cleared",
          date: "Oct 14",
          timelineDate: "2024-10-14",
          status: "completed",
          type: "screening",
          stage: "screen",
        },

        {
          label: "Recruiter Screen",
          date: "Mon Oct 21, 10:00 AM",
          timelineDate: "2024-10-21",
          status: "active",
          type: "interview",
          stage: "screen",
        },

        {
          label: "OA Window",
          date: "Nov 02",
          timelineDate: "2024-11-02",
          status: "upcoming",
          type: "assessment",
          stage: "technical",
        },
      ],
    },

    {
      id: 6,
      company: "Apple",
      initials: "G��",
      role: "Platform ML Engineer",
      location: "Core OS Neural Engine",
      match: null,
      priority: "Stagnant: 18 Days Inactive",
      action: "Send Polite SLA Nudge",

      steps: [
        {
          label: "Referral Submitted",
          date: "Oct 01",
          timelineDate: "2024-10-01",
          status: "completed",
          type: "application",
          stage: "applied",
        },

        {
          label: "SLA Nudge Window",
          date: "Eligible Today",
          timelineDate: "2024-10-18",
          status: "action",
          type: "follow-up",
          stage: "screen",
        },

        {
          label: "Team Match",
          date: "Pending Nudge",
          timelineDate: "2024-10-20",
          status: "upcoming",
          type: "screening",
          stage: "screen",
        },
      ],
    },
  ],

  agenda: [
    {
      id: 1,
      day: "TODAY",
      date: "18",
      month: "Oct",
      time: "11:59 PM",
      company: "Datadog",
      title: "CodeSignal QA",
      description:
        "70 min timed assessment G�� General Coding Assessment",
      status: "action-needed",
    },

    {
      id: 2,
      day: "SAT",
      date: "19",
      month: "Oct",
      time: "5:00 PM",
      company: "Uber",
      title: "Submission Cutoff",
      description: "Portal application deadline closing",
      status: "deadline",
    },

    {
      id: 3,
      day: "THU",
      date: "24",
      month: "Oct",
      time: "2:30 PM PST",
      company: "Stripe",
      title: "Technical Screen",
      description:
        "45 min live coding G�� Staff Systems Engineer",
      status: "scheduled",
    },

    {
      id: 4,
      day: "FRI",
      date: "25",
      month: "Oct",
      time: "5:00 PM PST",
      company: "Vercel",
      title: "Offer Acceptance",
      description:
        "Offer decision expiration (Extension pending)",
      status: "deadline",
    },

    {
      id: 5,
      day: "WED",
      date: "30",
      month: "Oct",
      time: "10:00 AM PST",
      company: "Snowflake",
      title: "Recruiter Call",
      description:
        "30 min behavioral & team alignment screen",
      status: "scheduled",
    },
  ],

  benchmarks: [
    {
      id: 1,
      label: "Applied → QA Screen",
      yourTime: "3.2d",
      averageTime: "4.8d",
      progress: 38,
    },

    {
      id: 2,
      label: "QA → Technical Screen",
      yourTime: "6.1d",
      averageTime: "8.5d",
      progress: 61,
    },

    {
      id: 3,
      label: "Tech Screen → Final Panel",
      yourTime: "9.4d",
      averageTime: "11.2d",
      progress: 78,
    },

    {
      id: 4,
      label: "Final Round → Decision",
      yourTime: "5.5d",
      averageTime: "7.8d",
      progress: 52,
    },
  ],

  recruitingWaves: [
    {
      id: 1,
      title: "Wave 1: Early Big Tech & FinTech",
      date: "Aug - Oct",
      description:
        "Current peak closing. Final interviews rolling out.",
      status: "closing",
    },

    {
      id: 2,
      title: "Wave 2: Mid-tier & Growth Unicorns",
      date: "Oct - Dec",
      description:
        "Heavy online assessment & technical panel wave.",
      status: "active",
    },

    {
      id: 3,
      title: "Wave 3: Winter & Just-In-Time",
      date: "Jan - Mar",
      description:
        "Startups, late headcount adjustments, and spring co-ops.",
      status: "upcoming",
    },
  ],

  calendarAlerts: {
    calendar: {
      name: "Google Calendar",
      status: "Synced",
      source: "CareerTrack.ics",
      connected: true,
    },

    reminders: {
      label: "SMS Reminders (3h buffer)",
      enabled: true,
    },
  },
};