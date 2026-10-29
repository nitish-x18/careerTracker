import { createPortal } from "react-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Download,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  CircleAlert,
  CircleCheck,
  Eye,
  ClipboardCheck,
  TrendingUp,
  Sparkles,
  MoreVertical,
  Video,
  GraduationCap,
  Send,
  ArrowRight,
  X,
} from "lucide-react";
import { applicationsData } from "../features/my-applications/data/applicationsData";


const stageStyles = {
  "Technical Screen": "bg-blue-100 text-indigo-800",
  "Assessment Due": "bg-orange-100 text-orange-950",
  "Applied - In Review": "bg-slate-100 text-slate-700",
  "Technical Round 2": "bg-blue-100 text-indigo-800",
  "Offer Received ($58/hr)": "bg-sky-100 text-sky-900",
  "Draft Application": "bg-slate-100 text-slate-700",
  "Take-home Reviewing": "bg-indigo-100 text-indigo-700",
};

const priorityStyles = {
  "High Priority": "bg-rose-100 text-rose-800",
  Medium: "bg-blue-100 text-slate-800",
  Urgent: "bg-orange-100 text-orange-950",
};

const deadlineStyles = {
  danger: "bg-rose-100 text-red-800",
  warning: "bg-orange-100 text-orange-950",
  scheduled: "bg-blue-100 text-indigo-800",
};



function getDeadlineInfo(deadline) {
  if (!deadline || deadline === "Rolling Admissions") {
    return {
      label: deadline || "No deadline set",
      tone: "scheduled",
    };
  }

  // Handle actual dates stored as YYYY-MM-DD.
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    const [year, month, day] = deadline.split("-").map(Number);
    const dueDate = new Date(year, month - 1, day);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const daysLeft = Math.round(
      (dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysLeft < 0) {
      return { label: "Overdue", tone: "danger" };
    }

    if (daysLeft === 0) {
      return { label: "Due today", tone: "danger" };
    }

    if (daysLeft === 1) {
      return { label: "Due tomorrow", tone: "warning" };
    }

    return {
      label: `Due in ${daysLeft} days`,
      tone: daysLeft <= 3 ? "warning" : "scheduled",
    };
  }

  // Preserve existing descriptive deadlines from the sample data.
  return {
    label: deadline,
    tone: /due|expires|closes|tonight|hours left/i.test(deadline)
      ? "danger"
      : "scheduled",
  };
}

function getCriticalApplications(applications) {
  return applications.filter((app) => {
    const stage = app.stage || "";

    if (
      app.archived ||
      stage === "Rejected" ||
      stage.startsWith("Offer")
    ) {
      return false;
    }

    const deadline = app.deadline || "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      const [year, month, day] = deadline.split("-").map(Number);
      const dueDate = new Date(year, month - 1, day);

      // Ignore invalid calendar dates.
      if (
        dueDate.getFullYear() !== year ||
        dueDate.getMonth() !== month - 1 ||
        dueDate.getDate() !== day
      ) {
        return false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);

      const daysLeft = Math.round(
        (dueDate.getTime() - today.getTime()) /
          (24 * 60 * 60 * 1000)
      );

      return daysLeft <= 2;
    }

    return /due today|due tomorrow|due in \d+ hours|expires in \d+ hours|closes in \d+ hours|tonight/i.test(
      deadline
    );
  });
}


function getStageAction(stage) {
  const currentStage = (stage || "").trim().toLowerCase();

  if (currentStage.includes("draft")) {
    return { action: "Complete", actionIcon: "send" };
  }

  if (currentStage.includes("assessment")) {
    return { action: "Start Test", actionIcon: "check" };
  }

  if (
    currentStage.includes("technical screen") ||
    currentStage.includes("technical round") ||
    currentStage.includes("final round") ||
    currentStage.includes("interview")
  ) {
    return { action: "Prep Interview", actionIcon: "video" };
  }

  if (currentStage.includes("offer")) {
    return { action: "Review Offer", actionIcon: "offer" };
  }

  if (currentStage.includes("rejected")) {
    return { action: "View Details", actionIcon: "eye" };
  }

  if (
    currentStage.includes("applied") ||
    currentStage.includes("review")
  ) {
    return { action: "Track", actionIcon: "eye" };
  }

  return { action: "Track", actionIcon: "eye" };
}



function Metric({ title, value, suffix, icon: Icon, iconStyle }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="mt-1 text-2xl font-bold leading-tight text-slate-900">
          {value}
          {suffix && (
            <span className="ml-1 text-sm font-normal text-slate-500">
              {suffix}
            </span>
          )}
        </p>
      </div>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
        <Icon size={19} />
      </span>
    </div>
  );
}

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function CompanyMark({ initials, color }) {
  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${color}`}>
      {initials}
    </div>
  );
}


function InsightCard({
  title,
  icon: Icon,
  iconColor,
  children,
  buttonText,
  onButtonClick,
}) {
  return (
    <section className="flex h-full min-w-0 flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          {title}
        </h2>
        <Icon size={17} className={iconColor} />
      </div>

      <div className="min-w-0 flex-1">{children}</div>

      <button
        type="button"
        onClick={onButtonClick}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
      >
        {buttonText}
        <ArrowRight size={14} />
      </button>
    </section>
  );
}


export default function MyApplications() {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [sortBy, setSortBy] = useState("Deadline (Soonest)");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedRows, setSelectedRows] = useState([]);
  const [notice, setNotice] = useState("");
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [actionDetails, setActionDetails] = useState(null);
  const actionMenuRef = useRef(null);
  const [workspaceTab, setWorkspaceTab] = useState("overview");
const [workspaceNotes, setWorkspaceNotes] = useState("");
const [workspaceStatus, setWorkspaceStatus] = useState("");
  const [menuPosition, setMenuPosition] = useState({
  top: 0,
  left: 0,
});
  const [showStageOptions, setShowStageOptions] = useState(false);

  const now = new Date();
const todayDate = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("-");

  const [showApplicationForm, setShowApplicationForm] = useState(false);
const [editingApplication, setEditingApplication] = useState(null);

const [formData, setFormData] = useState({
  company: "",
  role: "",
  location: "",
  type: "Internship",
  appliedDate: "",
  deadline: "",
  match: 0,
  priority: "Medium",
  stage: "Applied - In Review",
});

      const [applications, setApplications] = useState(() => {
    try {
      const savedApplications = localStorage.getItem(
        "careerTrackerApplications"
      );

      if (savedApplications !== null) {
        const parsedApplications = JSON.parse(savedApplications);

        if (Array.isArray(parsedApplications)) {
          return parsedApplications;
        }
      }
    } catch (error) {
      console.error("Could not load saved applications:", error);
    }

    return applicationsData;
  });

  
const activeApplications = applications.filter(
  (app) => !app.archived && app.stage !== "Rejected"
);

const submittedApplications = activeApplications.filter(
  (app) => app.appliedDate && app.appliedDate !== "Not submitted"
);

const interviewApplications = activeApplications.filter((app) =>
  /technical screen|technical round|interview/i.test(app.stage)
);

const offerApplications = activeApplications.filter((app) =>
  app.stage.startsWith("Offer")
);

const interviewRate =
  submittedApplications.length > 0
    ? (
        (interviewApplications.length / submittedApplications.length) *
        100
      ).toFixed(1)
    : "0.0";

    const matchedApplications = applications.filter(
  (app) =>
    !app.archived &&
    app.stage !== "Rejected" &&
    typeof app.match === "number" &&
    Number.isFinite(app.match) &&
    app.match >= 0 &&
    app.match <= 100
);

const averageMatch =
  matchedApplications.length > 0
    ? (
        matchedApplications.reduce(
          (total, app) => total + app.match,
          0
        ) / matchedApplications.length
      ).toFixed(1)
    : null;


  useEffect(() => {
    try {
      localStorage.setItem(
        "careerTrackerApplications",
        JSON.stringify(applications)
      );
    } catch (error) {
      console.error("Could not save applications:", error);
      setNotice("Unable to save changes in this browser.");
    }
  }, [applications]);

   const tabs = useMemo(() => {
  const countStage = (stages) =>
    applications.filter((app) => stages.includes(app.stage)).length;

  return [
    ["All", applications.length],
    ["Drafts", countStage(["Draft Application"])],
    ["Applied", countStage(["Applied - In Review"])],
    ["Online Assessment", countStage(["Assessment Due"])],
    [
      "Technical Interview",
      countStage(["Technical Screen", "Technical Round 2"]),
    ],
    ["Final Round", countStage(["Final Round"])],
    [
      "Offers",
      applications.filter((app) => app.stage.startsWith("Offer")).length,
    ],
    [
      "Archived",
      applications.filter((app) => app.archived === true).length,
    ],
  ];
}, [applications]);
useEffect(() => {
  if (openActionMenu === null) return;

  const handleOutsideClick = (event) => {
    const clickedMenuButton = event.target.closest(
      '[aria-label^="More actions for"]'
    );

    const clickedMenu = event.target.closest(
      ".application-action-menu"
    );

    if (!clickedMenuButton && !clickedMenu) {
      setOpenActionMenu(null);
    }
  };

  document.addEventListener("click", handleOutsideClick);

  return () => {
    document.removeEventListener("click", handleOutsideClick);
  };
}, [openActionMenu]);

 const criticalApplications = useMemo(() => {
  return getCriticalApplications(applications).sort((a, b) => {
    const getDeadlineDate = (deadline) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(deadline || "")) {
        const [year, month, day] = deadline.split("-").map(Number);
        return new Date(year, month - 1, day).getTime();
      }

      return Infinity;
    };

    return (
      getDeadlineDate(a.deadline) - getDeadlineDate(b.deadline)
    );
  });
}, [applications]);

  const filteredRows = useMemo(() => {
    let result = applications.filter((app) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        `${app.company} ${app.role} ${app.location} ${app.stage}`
          .toLowerCase()
          .includes(term);

      const matchesType =
        typeFilter === "All Types" || app.type === typeFilter;

     const matchesPriority =
  priorityFilter === "All Priorities" ||
  (priorityFilter === "High Priority" && app.priority === "High") ||
  (priorityFilter === app.priority);

      
const matchesTab =
  selectedTab === "Archived"
    ? app.archived === true
    : !app.archived &&
      (
        selectedTab === "All" ||
        (selectedTab === "Drafts" && app.stage === "Draft Application") ||
        (selectedTab === "Applied" && app.stage === "Applied - In Review") ||
        (selectedTab === "Online Assessment" && app.stage === "Assessment Due") ||
        (selectedTab === "Technical Interview" &&
          ["Technical Screen", "Technical Round 2"].includes(app.stage)) ||
        (selectedTab === "Final Round" && app.stage === "Final Round") ||
        (selectedTab === "Offers" && app.stage.startsWith("Offer"))
      );


      return matchesSearch && matchesType && matchesPriority && matchesTab;
    });

   
if (sortBy === "Company (A–Z)") {
  result = [...result].sort((a, b) =>
    a.company.localeCompare(b.company)
  );
} else if (sortBy === "Match Score (Highest)") {
  result = [...result].sort(
    (a, b) => Number(b.match || 0) - Number(a.match || 0)
  );
} else if (sortBy === "Deadline (Soonest)") {
  result = [...result].sort((a, b) => {
    const getDeadlineDate = (deadline) => {
      if (!deadline || deadline === "Rolling Admissions") {
        return Infinity;
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
        return new Date(`${deadline}T00:00:00`).getTime();
      }

      return Infinity;
    };

    return getDeadlineDate(a.deadline) - getDeadlineDate(b.deadline);
  });
}


    return result;
  }, [search, selectedTab, typeFilter, priorityFilter, sortBy, applications]);

  
  const applicationStats = useMemo(() => {
    const awaitingReview = applications.filter(
      (app) => app.stage === "Applied - In Review"
    ).length;

    const activeRounds = applications.filter((app) =>
      [
        "Technical Screen",
        "Technical Round 2",
        "Assessment Due",
        "Final Round",
        "Take-home Reviewing",
      ].includes(app.stage)
    ).length;

    const offers = applications.filter((app) =>
      app.stage.startsWith("Offer")
    ).length;

    return {
      awaitingReview,
      activeRounds,
      offers,
    };
  }, [applications]);


  const totalApplications = filteredRows.length;

const pageCount = Math.max(
  1,
  Math.ceil(totalApplications / rowsPerPage)
);

const currentPage = Math.min(page, pageCount);
const startIndex = (currentPage - 1) * rowsPerPage;

const visibleRows = filteredRows.slice(
  startIndex,
  startIndex + rowsPerPage
);

  function updateFilter(callback) {
    callback();
    setPage(1);
  }

  function toggleRow(id) {
    setSelectedRows((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  }

  function toggleVisibleRows() {
    const ids = visibleRows.map((row) => row.id);
    const allSelected = ids.length > 0 && ids.every((id) => selectedRows.includes(id));

    setSelectedRows((current) =>
      allSelected
        ? current.filter((id) => !ids.includes(id))
        : [...new Set([...current, ...ids])]
    );
  }

  function exportCSV() {
    const headers = [
      "Company",
      "Role",
      "Type",
      "Applied Date",
      "Deadline",
      "Match Score",
      "Priority",
      "Pipeline Stage",
    ];

    const lines = filteredRows.map((app) =>
      [
        app.company,
        app.role,
        app.type,
        app.appliedDate,
        app.deadline,
        `${app.match}%`,
        app.priority,
        app.stage,
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    );

    const blob = new Blob([[headers.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function updateActionApplication(updates) {
  const currentApp = actionDetails?.app;
  if (!currentApp) return;

  const updatedApp = { ...currentApp, ...updates };

  setApplications((previous) =>
    previous.map((app) =>
      app.id === currentApp.id ? updatedApp : app
    )
  );

  setActionDetails((previous) =>
    previous
      ? { ...previous, app: updatedApp }
      : previous
  );
}

function handleAction(app) {
  const action = (app.action || "").trim().toLowerCase();

  if (action === "complete") {
    handleEditApplication(app);
    setNotice(`Continue completing the application for ${app.company}.`);
    return;
  }

  if (action === "match details") {
    window.location.href = "/resume-match";
    return;
  }

  const actionTabs = {
    track: "overview",
    "start test": "assessment",
    "prep interview": "interview",
    "review offer": "offer",
    "view details": "overview",
    "prep room": "interview",
  };

  const tab = actionTabs[action];

  if (!tab) {
    setNotice(`No action is configured for ${app.company}.`);
    return;
  }

  setWorkspaceTab(tab);
  setWorkspaceNotes("");
  setWorkspaceStatus("");
  setOpenActionMenu(null);

  setActionDetails({
    title: `${app.company} Workspace`,
    message: `Manage your ${app.role || "application"} progress.`,
    app,
  });
}


function updateActionApplication(updates) {
  const currentApp = actionDetails?.app;
  if (!currentApp) return;

  const updatedApp = { ...currentApp, ...updates };

  setApplications((previous) =>
    previous.map((app) =>
      app.id === currentApp.id ? { ...app, ...updates } : app
    )
  );

  setActionDetails((previous) =>
    previous
      ? { ...previous, app: updatedApp }
      : null
  );
}

  
const handleApplicationSubmit = (event) => {
  event.preventDefault();

  const company = formData.company.trim();
  const role = formData.role.trim();

  if (!company || !role) {
    setNotice("Please enter both company and job role.");
    return;
  }

  
if (formData.deadline && formData.deadline < todayDate) {
  setNotice("Deadline cannot be in the past. Please choose today or a future date.");
  return;
}

if (formData.appliedDate && formData.appliedDate > todayDate) {
  setNotice("Application date cannot be in the future.");
  return;
}

  if (editingApplication) {
    
setApplications((previous) =>
  previous.map((app) =>
    app.id === editingApplication.id
      ? {
          ...app,
          ...formData,
          company,
          role,
         match: app.match ?? null,
          appliedDate: formData.appliedDate || "Not submitted",
          deadline: formData.deadline || app.deadline || "Rolling Admissions",
          deadlineTone: getDeadlineInfo(
  formData.deadline || app.deadline
).tone,
priority: formData.priority,
stage: formData.stage,
stageDot: app.stageDot || "bg-slate-500",
...getStageAction(formData.stage),
          archived: app.archived === true,
        }
      : app
  )
);

    setNotice(`${company} application updated successfully.`);
  } else {
    const newApplication = {
      ...formData,
      id: `APP-${Date.now()}`,
      company,
      role,
      match: null,
      initials: company
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      logo: "bg-indigo-100 text-indigo-700",
      appliedDate: formData.appliedDate || "Not submitted",
      appliedAgo: "Just added",
      stageDot: "bg-slate-500",
      deadlineTone: getDeadlineInfo(formData.deadline).tone,
...getStageAction(formData.stage),
      primary: false,
      archived: false,
    };

    setApplications((previous) => [newApplication, ...previous]);
    setNotice(`${company} application added successfully.`);
  }

  setShowStageOptions(false);
  setShowApplicationForm(false);
  setEditingApplication(null);
  setFormData({
    company: "",
    role: "",
    location: "",
    type: "Internship",
    appliedDate: "",
    deadline: "",
    match: 0,
    priority: "Medium",
    stage: "Applied - In Review",
  });

  setSelectedRows([]);
  setPage(1);
};

const closeApplicationForm = () => {
  setShowApplicationForm(false);
  setShowStageOptions(false);
  setEditingApplication(null);
};

const handleEditApplication = (app) => {
  setEditingApplication(app);

  setFormData({
    company: app.company || "",
    role: app.role || "",
    location: app.location || "",
    type: app.type || "Internship",
    appliedDate: /^\d{4}-\d{2}-\d{2}$/.test(app.appliedDate || "")
      ? app.appliedDate
      : "",
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(app.deadline || "")
      ? app.deadline
      : "",
    match: app.match ?? 0,
    priority: app.priority || "Medium",
    stage: app.stage || "Applied - In Review",
  });

  setNotice("");
  setShowApplicationForm(true);
};


const handleArchiveApplication = (app) => {
  setApplications((previous) =>
    previous.map((item) =>
      item.id === app.id ? { ...item, archived: true } : item
    )
  );

  setSelectedRows((previous) => previous.filter((id) => id !== app.id));
  setOpenActionMenu(null);
  setNotice(`${app.company} application archived.`);
};

const handleDeleteApplication = (app) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete the application for ${app.company}?`
  );

  if (!confirmed) return;

  setApplications((previous) =>
    previous.filter((item) => item.id !== app.id)
  );

  setSelectedRows((previous) => previous.filter((id) => id !== app.id));
  setOpenActionMenu(null);
  setNotice(`${app.company} application deleted.`);
};


  return (
    <main className="min-h-full min-w-0 bg-[#f7f8fc] text-slate-800">
      <div className="mx-auto w-full max-w-[1600px] space-y-4 px-4 py-4 sm:px-5 lg:px-6">
        {/* Heading and page actions */}
        <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-indigo-600">My Applications</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                My Applications
              </h1>
              <Pill className="rounded-full bg-indigo-100 text-indigo-700">
                    {applications.length} total applications
              </Pill>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-5 text-slate-500">
              Search, filter, and track all internship and full-time job
              applications across pipeline stages with instant status updates.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBulkMenu((open) => !open)}
                className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ClipboardCheck size={16} />
                Bulk Actions
                <ChevronDown size={14} />
              </button>
              
{showBulkMenu && (
  <div className="absolute right-0 top-11 z-30 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
    <p className="px-2 py-1.5 text-xs text-slate-500">
      {selectedRows.length} selected
    </p>

    <button
      type="button"
      onClick={() => {
        setApplications((previous) =>
          previous.map((app) =>
            selectedRows.includes(app.id) && !app.archived
              ? {
                  ...app,
                  stage: "Applied - In Review",
                  stageDot: "bg-blue-500",
                  ...getStageAction("Applied - In Review"),
                }
              : app
          )
        );
        setSelectedRows([]);
        setShowBulkMenu(false);
        setNotice("Selected applications marked as applied.");
      }}
      className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50"
    >
      Mark as Applied
    </button>

   
<button
  type="button"
  onClick={() => {
    const isArchivedTab = selectedTab === "Archived";

    setApplications((previous) =>
      previous.map((app) =>
        selectedRows.includes(app.id)
          ? { ...app, archived: !isArchivedTab }
          : app
      )
    );

    setSelectedRows([]);
    setShowBulkMenu(false);
    setNotice(
      isArchivedTab
        ? "Selected applications restored."
        : "Selected applications archived."
    );
  }}
  className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50"
>
  {selectedTab === "Archived" ? "Unarchive Selected" : "Archive Selected"}
</button>


<button
  type="button"
  onClick={() => {
    const selectedCount = selectedRows.length;

    if (selectedCount === 0) {
      setNotice("Please select at least one application.");
      setShowBulkMenu(false);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedCount} selected application(s)? This cannot be undone.`
    );

    if (!confirmed) return;

    setApplications((previous) =>
      previous.filter((app) => !selectedRows.includes(app.id))
    );

    setSelectedRows([]);
    setShowBulkMenu(false);
    setPage(1);
    setNotice(`${selectedCount} application(s) deleted.`);
  }}
  className="w-full rounded-md px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50"
>
  Delete Selected
</button>


    <button
      type="button"
      onClick={() => {
        setSelectedRows([]);
        setShowBulkMenu(false);
      }}
      className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50"
    >
      Clear Selection
    </button>
  </div>
)}

            </div>

            <button
              type="button"
              onClick={exportCSV}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
  setEditingApplication(null);
  setFormData({
    company: "",
    role: "",
    location: "",
    type: "Internship",
    appliedDate: "",
    deadline: "",
    match: 0,
    priority: "Medium",
    stage: "Applied - In Review",
  });
  setShowApplicationForm(true);
}}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
            >
              <Plus size={16} />
              Add Application
            </button>
          </div>
        </header>

        {notice && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">
              <X size={16} />
            </button>
          </div>
        )}
        
{actionDetails && (
 
<div
  className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-2 sm:p-4"
  onClick={() => setActionDetails(null)}
>
  <section
    role="dialog"
    aria-modal="true"
    aria-labelledby="action-details-title"
    className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-4 sm:p-5 shadow-xl"
    onClick={(event) => event.stopPropagation()}
  >

      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div>
          <h2
            id="action-details-title"
            className="text-lg font-bold text-slate-900"
          >
            {actionDetails.app.company} Workspace
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {actionDetails.app.role || "Application"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActionDetails(null)}
          aria-label="Close workspace"
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>

      {/* Application summary */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4">
        <div>
          <p className="text-xs text-slate-500">Current stage</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {actionDetails.app.stage || "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Deadline</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {actionDetails.app.deadline || "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Match score</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {typeof actionDetails.app.match === "number"
              ? `${actionDetails.app.match}%`
              : "Not available"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Priority</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {actionDetails.app.priority || "Medium"}
          </p>
        </div>
      </div>

      {/* Workspace tabs */}
      <div className="mt-5 flex shrink-0 flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "overview", label: "Overview" },
          { id: "assessment", label: "Assessment" },
          { id: "interview", label: "Interview Prep" },
          { id: "offer", label: "Offer Review" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setWorkspaceTab(tab.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              workspaceTab === tab.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-4"></div>
      {workspaceTab === "overview" && (
        <div className="mt-5 space-y-4">
          <div>
            <h3 className="font-semibold text-slate-800">
              Application progress
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Review your current stage and update your application when
              your progress changes.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Application stage
            </label>
            <select
              value={actionDetails.app.stage || "Applied - In Review"}
              onChange={(event) =>
                updateActionApplication({ stage: event.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {[
                "Draft Application",
                "Applied - In Review",
                "Assessment Due",
                "Technical Screen",
                "Technical Round 2",
                "Take-home Reviewing",
                "Offer Received",
                "Rejected",
              ].map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setWorkspaceTab("assessment")}
            className="w-full rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
          >
            <span className="font-medium text-slate-800">
              Assessment tracking
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              Record progress and assessment notes.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setWorkspaceTab("interview")}
            className="w-full rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
          >
            <span className="font-medium text-slate-800">
              Interview preparation
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              Keep interview topics and preparation notes.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setWorkspaceTab("offer")}
            className="w-full rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
          >
            <span className="font-medium text-slate-800">
              Offer review
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              Record offer details and your decision.
            </span>
          </button>
        </div>
      )}

      {/* Assessment */}
      {workspaceTab === "assessment" && (
        <div className="mt-5 space-y-3">
          <h3 className="font-semibold text-slate-800">
            Assessment progress
          </h3>

          <label className="block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={actionDetails.app.assessmentStatus || "Not Started"}
            onChange={(event) =>
              updateActionApplication({
                assessmentStatus: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <label className="block text-sm font-medium text-slate-700">
            Assessment notes
          </label>
          <textarea
            value={actionDetails.app.assessmentNotes || ""}
            onChange={(event) =>
              updateActionApplication({
                assessmentNotes: event.target.value,
              })
            }
            rows={4}
            placeholder="Add instructions, topics, or your next steps..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      )}

      {/* Interview preparation */}
      {workspaceTab === "interview" && (
        <div className="mt-5 space-y-3">
          <h3 className="font-semibold text-slate-800">
            Interview preparation
          </h3>

          <label className="block text-sm font-medium text-slate-700">
            Preparation notes
          </label>
          <textarea
            value={actionDetails.app.preparationNotes || ""}
            onChange={(event) =>
              updateActionApplication({
                preparationNotes: event.target.value,
              })
            }
            rows={6}
            placeholder="Add interview questions, technical topics, and questions to ask the interviewer..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />

          <p className="text-xs text-slate-500">
            Your notes are saved with this application.
          </p>
        </div>
      )}

      {/* Offer review */}
      {workspaceTab === "offer" && (
        <div className="mt-5 space-y-3">
          <h3 className="font-semibold text-slate-800">
            Offer review
          </h3>

          <label className="block text-sm font-medium text-slate-700">
            Decision
          </label>
          <select
            value={actionDetails.app.offerDecision || "Undecided"}
            onChange={(event) =>
              updateActionApplication({
                offerDecision: event.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option>Undecided</option>
            <option>Considering</option>
            <option>Accepted</option>
            <option>Declined</option>
          </select>

          <label className="block text-sm font-medium text-slate-700">
            Offer notes
          </label>
          <textarea
            value={actionDetails.app.offerNotes || ""}
            onChange={(event) =>
              updateActionApplication({
                offerNotes: event.target.value,
              })
            }
            rows={5}
            placeholder="Record compensation, benefits, questions, and decision details..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => setActionDetails(null)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>

        <button
          type="button"
          onClick={() => {
            const app = actionDetails.app;
            setActionDetails(null);
            handleEditApplication(app);
          }}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Edit Application
        </button>
      </div>
    </section>
  </div>
)}


        {/* Statistics */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            title="Awaiting Review"
            value={applicationStats.awaitingReview}
            icon={ClipboardCheck}
            iconStyle="bg-indigo-50 text-indigo-600"
          />
          <Metric
            title="Active Rounds"
            value={applicationStats.activeRounds}
            icon={CalendarDays}
            iconStyle="bg-blue-50 text-blue-600"
          />
          <Metric
            title="Offers in Hand"
            value={applicationStats.offers}
            icon={CircleCheck}
            iconStyle="bg-sky-100 text-sky-700"
          />
          <Metric
            title="Avg. Response Time"
            value="4.2"
            suffix="days"
            icon={Clock3}
            iconStyle="bg-slate-100 text-slate-600"
          />
        </div>

        {/* Search and filters */}
        <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(220px,1fr)_170px_170px_210px]">
            <label className="flex h-10 min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-3">
              <Search size={17} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) =>
                  updateFilter(() => setSearch(event.target.value))
                }
                placeholder="Search company, job role, or location..."
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                  <X size={15} className="text-slate-400" />
                </button>
              )}
            </label>

            {[
             
{
  value: typeFilter,
  setter: setTypeFilter,
  options: [
    "All Types",
    "Internship",
    "Full-time",
    "Part-time",
    "Contract",
    "Co-op",
    "Temporary",
  ],
},

              {
                value: priorityFilter,
                setter: setPriorityFilter,
                options: ["All Priorities", "High", "Medium", "Urgent"],
              },
              {
                value: sortBy,
                setter: setSortBy,
                options: [
                  "Deadline (Soonest)",
                  "Company (A–Z)",
                  "Match Score (Highest)",
                ],
              },
            ].map((filter) => (
              <div key={filter.options[0]} className="relative">
                <select
                  value={filter.value}
                  onChange={(event) =>
                    updateFilter(() => filter.setter(event.target.value))
                  }
                  className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-300"
                >
                  {filter.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-slate-500" />
              </div>
            ))}
          </div>

          <div className="mt-4 -mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible">
  <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
            {tabs.map(([tab, count]) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setSelectedTab(tab);
                  setPage(1);
                }}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedTab === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab} <span className={selectedTab === tab ? "text-indigo-100" : "text-slate-400"}>({count})</span>
              </button>
            ))}
          </div>
          </div>
        </section>

        {/* Scrollable table */}
        <section className="rounded-xl border border-slate-200/70 bg-white shadow-sm">
          <div className="applications-table-scroll w-full overflow-x-auto overflow-y-visible">
            <table className="w-full min-w-[1250px] border-collapse text-left">
              <colgroup>
                <col className="w-12" />
                <col className="w-[255px]" />
                <col className="w-[145px]" />
                <col className="w-[150px]" />
                <col className="w-[205px]" />
                <col className="w-[120px]" />
                <col className="w-[155px]" />
                <col className="w-[230px]" />
                <col className="w-[145px]" />
              </colgroup>
              <thead>
                <tr className="h-12 bg-indigo-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4">
                    <input
                      type="checkbox"
                      aria-label="Select visible applications"
                      checked={visibleRows.length > 0 && visibleRows.every((row) => selectedRows.includes(row.id))}
                      onChange={toggleVisibleRows}
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </th>
                  <th className="px-3">Company &amp; Role</th>
                  <th className="px-3">Type</th>
                  <th className="px-3">Applied Date</th>
                  <th className="px-3">Deadline &amp; Urgency</th>
                  <th className="px-3">Match Score</th>
                  <th className="px-3">Priority</th>
                  <th className="px-3">Pipeline Stage</th>
                  <th className="px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((app) => (
                  <tr key={app.id} className="h-[76px] border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
                    <td className="px-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${app.company}`}
                        checked={selectedRows.includes(app.id)}
                        onChange={() => toggleRow(app.id)}
                        className="h-4 w-4 accent-indigo-600"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <CompanyMark initials={app.initials} color={app.logo} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-5 text-slate-900">
                            {app.company}
                            <span className="font-normal text-slate-400"> • {app.location}</span>
                          </p>
                          <p className="max-w-[215px] text-xs leading-4 text-slate-600">
                            {app.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3">
                      <Pill className="bg-blue-50 text-slate-700">{app.type}</Pill>
                    </td>
                    <td className="px-3">
                      {app.appliedDate === "Not submitted" ? (
                        <>
                          <p className="text-sm italic text-slate-500">Not submitted</p>
                          <p className="mt-1 text-xs text-slate-400">{app.appliedAgo}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-slate-800">{app.appliedDate}</p>
                          <p className="mt-1 text-xs text-slate-400">{app.appliedAgo}</p>
                        </>
                      )}
                    </td>
                    
<td className="px-3">
  {(() => {
    const deadlineInfo = getDeadlineInfo(app.deadline);

    return (
      <Pill className={deadlineStyles[deadlineInfo.tone] || "bg-slate-100 text-slate-600"}>
        {deadlineInfo.tone === "scheduled" ? (
          <CalendarDays size={14} />
        ) : deadlineInfo.tone === "warning" ? (
          <Clock3 size={14} />
        ) : (
          <CircleAlert size={14} />
        )}
        {deadlineInfo.label}
      </Pill>
    );
  })()}
</td>

                    <td className="px-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-800">
                         {app.match != null ? `${app.match}%` : "—"}
                        </span>
                        {app.verified && <Sparkles size={16} className="text-indigo-600" />}
                        {app.trophy && <GraduationCap size={16} className="text-indigo-700" />}
                      </div>
                    </td>
                    <td className="px-3">
                      <Pill className={priorityStyles[app.priority] || "bg-slate-100 text-slate-700"}>
                        {app.priority}
                      </Pill>
                    </td>
                    <td className="px-3">
                      <Pill className={stageStyles[app.stage] || "bg-slate-100 text-slate-700"}>
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${app.stageDot || "bg-slate-400"}`} />
                        {app.stage}
                      </Pill>
                    </td>
                    
<td className="px-2">
  <div className="flex items-center justify-end gap-1">
    <button
      type="button"
      onClick={() => handleAction(app)}
      className={`flex h-10 w-[145px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 text-sm font-semibold transition ${
        app.primary
          ? "bg-indigo-600 text-white hover:bg-indigo-700"
          : "bg-blue-100 text-slate-800 hover:bg-blue-200"
      }`}
    >
      {app.actionIcon === "video" ? <Video size={15} /> :
        app.actionIcon === "send" ? <Send size={15} /> :
        app.actionIcon === "offer" ? <GraduationCap size={15} /> :
        app.actionIcon === "eye" ? <Eye size={15} /> :
        <ClipboardCheck size={15} />}
      {app.action}
    </button>

    
<div className="relative shrink-0">
  <button
    type="button"
    aria-label={`More actions for ${app.company}`}
    aria-expanded={openActionMenu === app.id}
   onClick={(event) => {
  const rect = event.currentTarget.getBoundingClientRect();

  setMenuPosition({
    top: rect.bottom + 4,
    left: Math.min(rect.right - 144, window.innerWidth - 152),
  });

  setOpenActionMenu((current) =>
    current === app.id ? null : app.id
  );
}}
    className="flex h-9 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
  >
    <MoreVertical size={17} />
  </button>

  {openActionMenu === app.id &&
  createPortal(
    <div
      style={{
        position: "fixed",
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 9999,
      }}
      className="application-action-menu w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-xl"
    >
      <button
        type="button"
        onClick={() => {
  setOpenActionMenu(null);
  handleEditApplication(app);
}}
        className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
      >
        Edit
      </button>

      
<button
  type="button"
  onClick={() => {
    if (app.archived) {
      setApplications((previous) =>
        previous.map((item) =>
          item.id === app.id ? { ...item, archived: false } : item
        )
      );
      setNotice(`${app.company} application restored.`);
      setOpenActionMenu(null);
    } else {
      handleArchiveApplication(app);
    }
  }}
  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
>
  {app.archived ? "Unarchive" : "Archive"}
</button>


      <button
        type="button"
        onClick={() => handleDeleteApplication(app)}
        className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </div>,
    document.body
  )}
</div>

  </div>
</td>

                  </tr>
                ))}
                {visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-sm text-slate-500">
                      No applications match your current search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span>
  Showing{" "}
  <strong className="font-semibold text-slate-800">
    {filteredRows.length === 0 ? 0 : startIndex + 1}–
    {Math.min(startIndex + rowsPerPage, totalApplications)}
  </strong>{" "}
  of{" "}
  <strong className="font-semibold text-slate-800">
    {totalApplications}
  </strong>{" "}
  applications
</span>
              <label className="flex items-center gap-2">
                Rows per page:
                <select
                  value={rowsPerPage}
                  onChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(1);
                  }}
                  className="h-9 rounded-md border border-slate-200 bg-slate-50 px-2 text-sm"
                >
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </label>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="flex h-9 items-center gap-1 rounded-md bg-slate-100 px-3 text-sm text-slate-600 disabled:opacity-50"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
  <button
    key={number}
    type="button"
    onClick={() => setPage(number)}
    className={`h-9 min-w-9 rounded-md px-3 text-sm ${
      currentPage === number
        ? "bg-indigo-600 font-semibold text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {number}
  </button>
))}
              <button
                type="button"
                disabled={currentPage >= pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                className="flex h-9 items-center gap-1 rounded-md bg-blue-50 px-3 text-sm text-slate-700 disabled:opacity-50"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Bottom insight cards */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
         

<InsightCard
  title="Critical Deadlines"
  icon={CircleAlert}
  iconColor="text-orange-700"
  buttonText="Go to Priority Queue"
  onButtonClick={() => {
  window.location.href = "/priority-queue";
}}
>
  <div className="flex items-center justify-between gap-2">
    <div>
      <h3 className="text-lg font-bold text-slate-900">
        {criticalApplications.length} Actions Required
      </h3>
      <p className="mt-1 text-sm leading-5 text-slate-500">
        Review applications with approaching deadlines.
      </p>
    </div>
  </div>

  <div className="mt-3 space-y-2">
    {criticalApplications.length === 0 ? (
      <div className="rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
        <CircleCheck className="mr-2 inline h-4 w-4" />
        No critical deadlines right now.
      </div>
    ) : (
      criticalApplications.slice(0, 2).map((app) => {
        const deadlineInfo = getDeadlineInfo(app.deadline);

        const badgeClass =
          deadlineInfo.tone === "danger"
            ? "bg-rose-100 text-rose-700"
            : deadlineInfo.tone === "warning"
              ? "bg-orange-100 text-orange-800"
              : "bg-slate-100 text-slate-600";

        return (
          <div
            key={app.id}
            className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-700">
                {app.company}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {app.role}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold ${badgeClass}`}
            >
              {deadlineInfo.label}
            </span>
          </div>
        );
      })
    )}
  </div>

  {criticalApplications.length > 2 && (
    <p className="mt-2 text-xs text-slate-500">
      +{criticalApplications.length - 2} more applications need attention
    </p>
  )}
</InsightCard>



          <InsightCard
            title="ATS Readiness"
            icon={Sparkles}
            iconColor="text-violet-600"
            buttonText="Optimize Resume Match"
            onButtonClick={() => {
  window.location.href = "/resume-match";
}}
          >
            <h3 className="text-lg font-bold text-slate-900">
  {averageMatch !== null
    ? `Average Match: ${averageMatch}%`
    : "No match data available"}
</h3>
            <p className="mt-1 text-sm leading-5 text-slate-500">
  Average match score across your active applications.
</p>
            <div className="mt-4">
              <div className="flex items-center justify-between gap-2 text-xs">
  <span className="text-slate-600">Average Match Score</span>
  <span className="font-semibold text-slate-700">
  {averageMatch !== null ? `${averageMatch}%` : "N/A"}
</span>
</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
  className="h-full rounded-full bg-indigo-600 transition-all duration-300"
  style={{ width: `${averageMatch ?? 0}%` }}
/>
                            </div>
            </div>

          <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
  <div className="flex items-center justify-between">
    <span className="text-xs text-slate-500">
      Applications with match scores
    </span>
    <span className="text-xs font-semibold text-slate-700">
      {matchedApplications.length}
    </span>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-lg bg-violet-50 p-3">
      <p className="text-xs text-violet-600">Highest Match</p>
      <p className="mt-1 text-lg font-bold text-slate-800">
        {matchedApplications.length > 0
          ? `${Math.max(...matchedApplications.map((app) => app.match))}%`
          : "N/A"}
      </p>
    </div>

    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">Above 85%</p>
      <p className="mt-1 text-lg font-bold text-slate-800">
        {matchedApplications.filter((app) => app.match >= 85).length}
      </p>
    </div>
  </div>
</div>
          </InsightCard>

          <InsightCard
            title="Conversion Rate"
            icon={TrendingUp}
            iconColor="text-emerald-600"
            buttonText="View Analytics Timeline"
            onButtonClick={() => {
  window.location.href = "/timeline";
}}
          >
            
<h3 className="text-lg font-bold text-slate-900">
  {interviewRate}% Interview Rate
</h3>

<p className="mt-1 text-sm leading-5 text-slate-500">
  Your interview rate is based on submitted applications that have reached an interview stage.
</p>

<div className="mt-4 grid grid-cols-3 gap-2">
  {[
    [submittedApplications.length, "APPLIED"],
    [interviewApplications.length, "SCREENS"],
    [offerApplications.length, "OFFERS"],
  ].map(([value, label]) => (
    <div
      key={label}
      className="rounded-lg bg-slate-50 px-2 py-3 text-center"
    >
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-[10px] font-semibold tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  ))}
</div>

<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
  <span className="text-xs text-slate-500">
    Active applications
  </span>
  <span className="text-xs font-semibold text-slate-700">
    {activeApplications.length}
  </span>
</div>

</InsightCard>
        </div>

        {/* Add/Edit Application Modal */}
        {showApplicationForm && (
          
<div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-2 sm:p-4 sm:items-center">
  <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 pb-6 sm:p-6 sm:pb-8 shadow-2xl">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {editingApplication ? "Edit Application" : "Add Application"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the details of your job application.
        </p>
      </div>

      <button
        type="button"
        onClick={closeApplicationForm}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Close application form"
      >
        <X size={20} />
      </button>
    </div>

    <form onSubmit={handleApplicationSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Company *
          </label>
          <input
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Google"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Job Role *
          </label>
          <input
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g. Frontend Developer Intern"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Remote"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Job Type
          </label>
          
<select
  value={formData.type}
  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
>
  <option value="Internship">Internship</option>
  <option value="Full-time">Full-time</option>
  <option value="Part-time">Part-time</option>
  <option value="Contract">Contract</option>
  <option value="Co-op">Co-op</option>
  <option value="Temporary">Temporary</option>
</select>

        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Application Date
          </label>
          <input
            type="date"
            max={todayDate}
            value={formData.appliedDate}
            onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Deadline
          </label>
          <input
            type="date"
            min={todayDate}
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div>
  <label className="mb-1 block text-sm font-medium text-slate-700">
    Match Score
  </label>

  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
    {editingApplication
      ? `${editingApplication.match ?? "Not available"}${editingApplication.match != null ? "%" : ""}`
      : "Available after Resume Match"}
  </div>

  <p className="mt-1 text-xs text-slate-500">
    Match scores will come from the Resume Match feature.
  </p>
</div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            <option>Urgent</option>
            <option>High Priority</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

       

<div className="sm:col-span-2">
  <label className="mb-1 block text-sm font-medium text-slate-700">
    Application Stage
  </label>

  <button
    type="button"
    onClick={() => setShowStageOptions((previous) => !previous)}
    className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-left text-sm outline-none focus:border-indigo-500"
    aria-expanded={showStageOptions}
  >
    <span>{formData.stage}</span>
    <ChevronDown
      size={16}
      className={`ml-2 shrink-0 transition-transform ${
        showStageOptions ? "rotate-180" : ""
      }`}
    />
  </button>

  {showStageOptions && (
    <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      {[
        "Draft Application",
        "Applied - In Review",
        "Assessment Due",
        "Take-home Reviewing",
        "Technical Screen",
        "Technical Round 2",
        "Final Round",
        "Offer Received",
        "Rejected",
      ].map((stage) => (
        <button
          key={stage}
          type="button"
          onClick={() => {
            setFormData((previous) => ({ ...previous, stage }));
            setShowStageOptions(false);
          }}
          className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-indigo-50 ${
            formData.stage === stage
              ? "bg-indigo-50 font-semibold text-indigo-700"
              : "text-slate-700"
          }`}
        >
          {stage}
        </button>
      ))}
    </div>
  )}
</div>

      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={closeApplicationForm}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {editingApplication ? "Save Changes" : "Add Application"}
        </button>
      </div>
    </form>
  </div>
</div>
)}
      </div>
    </main>
  );
}
