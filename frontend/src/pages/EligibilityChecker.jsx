
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  GraduationCap,
  BriefcaseBusiness,
  CheckCircle2,
  AlertTriangle,
  Download,
  SlidersHorizontal,
  Pencil,
  FileText,
  LockKeyhole,
  Lightbulb,
  Search,
  ArrowUpRight,
  CircleHelp,
  ChevronDown,
  CalendarDays,
  CircleDashed,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { eligibilityService } from "../services/eligibilityService";

// Only these application statuses are considered active.
const ACTIVE_STATUSES = ["saved", "applied", "interview"];

// Get a consistent application ID.
const getApplicationId = (application) =>
  String(application.applicationId ?? application.id ?? "");

// Match backend eligibilityCheck.js rules.
function calculateEligibility(student, job) {
  if (!job) {
    return {
      status: "conditionally eligible",
      eligible: false,
      reasons: [],
      unverified: ["Job information is unavailable"],
    };
  }

  if (!student) {
    return {
      status: "conditionally eligible",
      eligible: false,
      reasons: [],
      unverified: ["Candidate profile is missing"],
    };
  }

  const reasons = [];
  const unverified = [];

  // 1. CGPA eligibility
  if (job.min_cgpa != null) {
    const minimumCGPA = Number(job.min_cgpa);

    if (
      !Number.isFinite(minimumCGPA) ||
      minimumCGPA < 0 ||
      minimumCGPA > 10
    ) {
      unverified.push("Job minimum CGPA requirement is invalid");
    } else if (student.cgpa == null || student.cgpa === "") {
      unverified.push("Student CGPA is missing");
    } else {
      const studentCGPA = Number(student.cgpa);

      if (
        !Number.isFinite(studentCGPA) ||
        studentCGPA < 0 ||
        studentCGPA > 10
      ) {
        unverified.push("Student CGPA is invalid");
      } else if (studentCGPA < minimumCGPA) {
        reasons.push("Minimum CGPA requirement not met");
      }
    }
  }

  // 2. Degree eligibility
  if (job.required_degree != null && job.required_degree !== "") {
    if (!student.degree || !String(student.degree).trim()) {
      unverified.push("Student degree is missing");
    } else if (
      String(student.degree).trim().toLowerCase() !==
      String(job.required_degree).trim().toLowerCase()
    ) {
      reasons.push("Required degree does not match");
    }
  }

  // 3. Major / branch eligibility
  if (job.required_major != null && job.required_major !== "") {
    if (!student.major || !String(student.major).trim()) {
      unverified.push("Student branch/major is missing");
    } else if (
      String(student.major).trim().toLowerCase() !==
      String(job.required_major).trim().toLowerCase()
    ) {
      reasons.push("Required branch/major does not match");
    }
  }

  // 4. Graduation year eligibility
  if (job.min_grad_year != null || job.max_grad_year != null) {
    const minYear =
      job.min_grad_year == null ? null : Number(job.min_grad_year);

    const maxYear =
      job.max_grad_year == null ? null : Number(job.max_grad_year);

    if (
      (minYear !== null &&
        (!Number.isInteger(minYear) || minYear < 1990 || minYear > 2100)) ||
      (maxYear !== null &&
        (!Number.isInteger(maxYear) || maxYear < 1990 || maxYear > 2100)) ||
      (minYear !== null && maxYear !== null && minYear > maxYear)
    ) {
      unverified.push("Job graduation year requirements are invalid");
    } else {
      const graduationYear = Number(student.grad_year);

      if (
        student.grad_year == null ||
        student.grad_year === "" ||
        !Number.isInteger(graduationYear)
      ) {
        unverified.push(
          "Student graduation year is missing or invalid"
        );
      } else {
        if (minYear !== null && graduationYear < minYear) {
          reasons.push("Graduation year is earlier than allowed");
        }

        if (maxYear !== null && graduationYear > maxYear) {
          reasons.push("Graduation year is later than allowed");
        }
      }
    }
  }

  let status = "eligible";

  if (reasons.length > 0) {
    status = "ineligible";
  } else if (unverified.length > 0) {
    status = "conditionally eligible";
  }

  return {
    status,
    eligible: status === "eligible",
    reasons,
    unverified,
  };
}

// Reusable panel
function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-slate-100 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

// Section heading
function SectionTitle({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Icon size={18} />
          </div>
        )}

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>

          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

// Summary metric card
function MetricCard({ label, value, detail, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <Panel className="relative min-w-0 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <div className={`rounded-lg p-2 ${tones[tone]}`}>
          <Icon size={17} />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-[11px] leading-4 text-slate-500">
        {detail}
      </p>
    </Panel>
  );
}

// Empty state
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
      <div className="rounded-full bg-white p-3 text-slate-400 shadow-sm">
        <Icon size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>

      {action}
    </div>
  );
}

// Eligibility status badge
function StatusBadge({ status }) {
  const styles = {
    eligible: "bg-emerald-50 text-emerald-700",
    "conditionally eligible": "bg-amber-50 text-amber-700",
    ineligible: "bg-rose-50 text-rose-700",
  };

  const labels = {
    eligible: "Eligible",
    "conditionally eligible": "Conditional",
    ineligible: "Ineligible",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] || "Unknown"}
    </span>
  );
}

// Criteria row helper
function getCriteriaRows(profile, job, result) {
  if (!job) return [];

  const rows = [];

  const addRow = (label, requirement, candidate, reason, unverified) => {
    let status = "pass";

    if (result.reasons.includes(reason)) {
      status = "fail";
    } else if (result.unverified.includes(unverified)) {
      status = "pending";
    }

    rows.push({
      label,
      requirement,
      candidate,
      status,
    });
  };

  if (job.min_cgpa != null) {
    addRow(
      "Minimum CGPA",
      `${job.min_cgpa} / 10`,
      profile?.cgpa ?? "Not provided",
      "Minimum CGPA requirement not met",
      "Student CGPA is missing"
    );

    const cgpaRow = rows[rows.length - 1];

    if (result.unverified.includes("Student CGPA is invalid")) {
      cgpaRow.status = "pending";
    }
  }

  if (job.required_degree) {
    addRow(
      "Required Degree",
      job.required_degree,
      profile?.degree || "Not provided",
      "Required degree does not match",
      "Student degree is missing"
    );
  }

  if (job.required_major) {
    addRow(
      "Required Major",
      job.required_major,
      profile?.major || "Not provided",
      "Required branch/major does not match",
      "Student branch/major is missing"
    );
  }

  if (job.min_grad_year != null || job.max_grad_year != null) {
    const requirement = [
      job.min_grad_year ?? "Any",
      job.max_grad_year ?? "Any",
    ].join(" – ");

    addRow(
      "Graduation Year",
      requirement,
      profile?.grad_year ?? "Not provided",
      "Graduation year is earlier than allowed",
      "Student graduation year is missing or invalid"
    );

    const yearRow = rows[rows.length - 1];

    if (
      result.reasons.includes("Graduation year is later than allowed")
    ) {
      yearRow.status = "fail";
    }

    if (result.unverified.includes("Job graduation year requirements are invalid")) {
      yearRow.status = "pending";
    }
  }

  return rows;
}

function EligibilityChecker() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState("");

  // Backend data
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [profile, setProfile] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all required backend data
  useEffect(() => {
    let isMounted = true;

    const loadEligibilityData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          jobsData,
          applicationsData,
          resumesData,
          profileData,
        ] = await Promise.all([
          eligibilityService.getJobs(),
          eligibilityService.getApplications(),
          eligibilityService.getResumes(),
          eligibilityService.getProfile(),
        ]);

        if (!isMounted) return;

        setJobs(jobsData);
        setApplications(applicationsData);
        setResumes(resumesData);
        setProfile(profileData);

        if (applicationsData.length > 0) {
          setSelectedApplication(getApplicationId(applicationsData[0]));
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load eligibility data."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEligibilityData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Only applications with active statuses
  const activeApplications = applications.filter((application) =>
    ACTIVE_STATUSES.includes(
      String(application.status || "").toLowerCase()
    )
  );

  // Match each application with its actual job and eligibility result
  const eligibilityRows = activeApplications.map((application) => {
    const job = jobs.find(
      (item) => String(item.id) === String(application.job_id)
    );

    const result = calculateEligibility(profile, job);

    return {
      application,
      job,
      result,
    };
  });

  // Selected application
  const selectedRow = eligibilityRows.find(
    (row) =>
      getApplicationId(row.application) === selectedApplication
  );

  const selectedJob = selectedRow?.job || null;
  const selectedResult = selectedRow?.result || null;

  // Summary metrics
  const eligibleCount = eligibilityRows.filter(
    (row) => row.result.status === "eligible"
  ).length;

  const conditionalCount = eligibilityRows.filter(
    (row) => row.result.status === "conditionally eligible"
  ).length;

  const ineligibleCount = eligibilityRows.filter(
    (row) => row.result.status === "ineligible"
  ).length;

  // GPA buffer for selected job
  const gpaBuffer =
    profile?.cgpa != null && selectedJob?.min_cgpa != null
      ? Number(profile.cgpa) - Number(selectedJob.min_cgpa)
      : null;

  // Search and filter table
  const filteredRows = eligibilityRows.filter((row) => {
    const company = row.job?.company_name || "";
    const title = row.job?.title || "";
    const query = search.toLowerCase();

    const matchesSearch =
      company.toLowerCase().includes(query) ||
      title.toLowerCase().includes(query);

    const status = row.result.status;

    const matchesFilter =
      filter === "All" ||
      (filter === "Eligible" && status === "eligible") ||
      (filter === "Conditional" &&
        status === "conditionally eligible") ||
      (filter === "Ineligible" && status === "ineligible");

    return matchesSearch && matchesFilter;
  });

  // CSV export
  const handleExport = () => {
    if (filteredRows.length === 0) return;

    const headers = [
      "Company",
      "Job Title",
      "Application Status",
      "Minimum CGPA",
      "Candidate CGPA",
      "Required Degree",
      "Candidate Degree",
      "Required Major",
      "Candidate Major",
      "Minimum Graduation Year",
      "Maximum Graduation Year",
      "Candidate Graduation Year",
      "Eligibility Status",
      "Reasons",
      "Unverified Information",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvRows = filteredRows.map(({ application, job, result }) => [
      job?.company_name || "Job unavailable",
      job?.title || "",
      application.status || "",
      job?.min_cgpa ?? "",
      profile?.cgpa ?? "",
      job?.required_degree || "",
      profile?.degree || "",
      job?.required_major || "",
      profile?.major || "",
      job?.min_grad_year ?? "",
      job?.max_grad_year ?? "",
      profile?.grad_year ?? "",
      result.status,
      result.reasons.join("; "),
      result.unverified.join("; "),
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...csvRows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "eligibility-audit-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const hasProfile = Boolean(profile);
  const criteriaRows = selectedResult
    ? getCriteriaRows(profile, selectedJob, selectedResult)
    : [];

  return (
    <div className="min-h-screen bg-[#f6f7ff] p-4 text-slate-800 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">

        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-indigo-600">
                Eligibility Verification Engine
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Candidate Eligibility & Criteria Checker
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
              Review candidate requirements, academic criteria and application
              eligibility in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={loading || filteredRows.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Export Audit Report
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:opacity-40"
            >
              <ShieldCheck size={15} />
              Refresh Results
            </button>

            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              <Pencil size={14} />
              Edit Base Profile
            </Link>
          </div>
        </div>

        {/* Loading and error messages */}
        {loading && (
          <Panel className="p-4">
            <p className="text-sm text-indigo-600">
              Loading your jobs, applications, resumes and profile...
            </p>
          </Panel>
        )}

        {!loading && error && (
          <Panel className="border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </Panel>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={ShieldCheck}
            label="Unrestricted Clearance"
            value={eligibleCount}
            detail="Applications meeting all verified requirements."
            tone="blue"
          />

          <MetricCard
            icon={CircleDashed}
            label="Conditional Clearance"
            value={conditionalCount}
            detail="Applications requiring additional verification."
            tone="amber"
          />

          <MetricCard
            icon={AlertTriangle}
            label="Hard Cutoff Breaches"
            value={ineligibleCount}
            detail="Applications with confirmed eligibility issues."
            tone="rose"
          />

          <MetricCard
            icon={GraduationCap}
            label="GPA Buffer Margin"
            value={
              gpaBuffer === null || !Number.isFinite(gpaBuffer)
                ? "—"
                : `${gpaBuffer > 0 ? "+" : ""}${gpaBuffer.toFixed(2)}`
            }
            detail={
              selectedJob?.min_cgpa != null
                ? `Candidate CGPA compared with ${selectedJob.min_cgpa} minimum.`
                : "Select an application with a minimum CGPA requirement."
            }
            tone="indigo"
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">

          {/* Left column */}
          <div className="min-w-0 space-y-5 xl:col-span-2">

            {/* Target application */}
            <Panel className="p-4 sm:p-5">
              <SectionTitle
                icon={SlidersHorizontal}
                title="Target Application"
                subtitle="Select an application to inspect its eligibility criteria."
                action={
                  <Link
                    to="/applications"
                    className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-indigo-700"
                  >
                    View Applications
                  </Link>
                }
              />

              <div className="mt-5">
                <label
                  htmlFor="targetApplication"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Select target application
                </label>

                <div className="relative">
                  <select
                    id="targetApplication"
                    value={selectedApplication}
                    onChange={(event) =>
                      setSelectedApplication(event.target.value)
                    }
                    disabled={activeApplications.length === 0}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 pr-10 text-xs text-slate-700 outline-none focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {activeApplications.length === 0
                        ? "No active applications available"
                        : "Select an application"}
                    </option>

                    {activeApplications.map((application) => {
                      const job = jobs.find(
                        (item) =>
                          String(item.id) === String(application.job_id)
                      );

                      return (
                        <option
                          key={getApplicationId(application)}
                          value={getApplicationId(application)}
                        >
                          {job
                            ? `${job.company_name || "Company"} - ${job.title}`
                            : `Application ${getApplicationId(application)}`}
                        </option>
                      );
                    })}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {!selectedRow && (
                <div className="mt-5">
                  <EmptyState
                    icon={BriefcaseBusiness}
                    title="No application selected"
                    description={
                      activeApplications.length === 0
                        ? "Your saved, applied and interview applications will appear here."
                        : "Select an application above to view its eligibility assessment."
                    }
                    action={
                      <Link
                        to="/job-search"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        Find Jobs
                        <ArrowUpRight size={14} />
                      </Link>
                    }
                  />
                </div>
              )}

              {selectedRow && (
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {selectedJob?.title || "Job details unavailable"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {selectedJob?.company_name || "Company unavailable"}
                      </p>

                      <p className="mt-2 text-[10px] capitalize text-slate-400">
                        Application status:{" "}
                        {selectedRow.application.status || "Not available"}
                      </p>
                    </div>

                    <StatusBadge status={selectedResult.status} />
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Detailed Criteria Breakdown
                  </h3>

                  <span className="text-[10px] text-slate-400">
                    {selectedRow
                      ? "Assessment based on your profile"
                      : "Awaiting application selection"}
                  </span>
                </div>

                {!selectedRow && (
                  <EmptyState
                    icon={CheckCircle2}
                    title="Criteria assessment unavailable"
                    description="Select an application to compare your CGPA, graduation year, degree and major with the job requirements."
                  />
                )}

                {selectedRow && criteriaRows.length === 0 && (
                  <EmptyState
                    icon={CheckCircle2}
                    title="No academic cutoffs specified"
                    description="This job does not specify CGPA, degree, major or graduation year requirements."
                  />
                )}

                {selectedRow && criteriaRows.length > 0 && (
                  <div className="space-y-2">
                    {criteriaRows.map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col justify-between gap-2 rounded-lg border border-slate-100 bg-white p-3 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {item.label}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            Required: {item.requirement}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            Your value: {item.candidate}
                          </p>
                        </div>

                        <span
                          className={`self-start rounded-full px-2.5 py-1 text-[10px] font-bold sm:self-auto ${
                            item.status === "pass"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "fail"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status === "pass"
                            ? "Passed"
                            : item.status === "fail"
                              ? "Failed"
                              : "Unverified"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedResult &&
                  (selectedResult.reasons.length > 0 ||
                    selectedResult.unverified.length > 0) && (
                    <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50/70 p-3">
                      <p className="text-xs font-bold text-slate-700">
                        Assessment details
                      </p>

                      {selectedResult.reasons.map((reason) => (
                        <p
                          key={reason}
                          className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-rose-700"
                        >
                          <AlertTriangle
                            size={14}
                            className="mt-0.5 shrink-0"
                          />
                          {reason}
                        </p>
                      ))}

                      {selectedResult.unverified.map((reason) => (
                        <p
                          key={reason}
                          className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-amber-700"
                        >
                          <CircleHelp
                            size={14}
                            className="mt-0.5 shrink-0"
                          />
                          {reason}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            </Panel>

            {/* Pipeline matrix */}
            <Panel className="overflow-hidden">
              <div className="p-4 sm:p-5">
                <SectionTitle
                  icon={BriefcaseBusiness}
                  title="Active Pipeline Clearance Matrix"
                  subtitle="Eligibility overview of your active applications."
                  action={
                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={filteredRows.length === 0}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                      <Download size={14} />
                      CSV
                    </button>
                  }
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search companies or roles..."
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="relative">
                    <Filter
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs outline-none focus:border-indigo-400 sm:w-36"
                    >
                      <option>All</option>
                      <option>Eligible</option>
                      <option>Conditional</option>
                      <option>Ineligible</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-bold">
                        Company & Role
                      </th>
                      <th className="px-4 py-3 font-bold">Min GPA</th>
                      <th className="px-4 py-3 font-bold">Grad Term</th>
                      <th className="px-4 py-3 font-bold">Work Auth.</th>
                      <th className="px-5 py-3 font-bold">Verdict</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRows.map(({ application, job, result }) => (
                      <tr
                        key={getApplicationId(application)}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-3">
                          <p className="text-xs font-semibold text-slate-700">
                            {job?.company_name || "Company unavailable"}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            {job?.title || "Job unavailable"}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600">
                          {job?.min_cgpa ?? "—"}
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600">
                          {job?.min_grad_year != null ||
                          job?.max_grad_year != null
                            ? `${job.min_grad_year ?? "Any"} – ${job.max_grad_year ?? "Any"}`
                            : "—"}
                        </td>

                        <td className="px-4 py-3 text-xs text-slate-600">
                          {job?.work_auth_req || "—"}
                        </td>

                        <td className="px-5 py-3">
                          <StatusBadge status={result.status} />
                        </td>
                      </tr>
                    ))}

                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-8">
                          <EmptyState
                            icon={BriefcaseBusiness}
                            title={
                              eligibilityRows.length === 0
                                ? "No active applications found"
                                : "No matching applications"
                            }
                            description={
                              eligibilityRows.length === 0
                                ? "Your saved, applied and interview applications will appear here."
                                : "Try changing your search or eligibility filter."
                            }
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">
                {jobs.length} jobs, {resumes.length} resumes and{" "}
                {applications.length} total applications retrieved from
                backend APIs.
              </div>
            </Panel>
          </div>

          {/* Right column */}
          <div className="min-w-0 space-y-5">

            {/* Candidate baseline */}
            <Panel className="p-4 sm:p-5">
              <SectionTitle
                icon={GraduationCap}
                title="Verified Candidate Baseline"
                subtitle="Your current candidate profile"
                action={
                  <Link
                    to="/profile"
                    aria-label="Edit candidate profile"
                    className="rounded-lg border border-slate-200 p-2 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Pencil size={14} />
                  </Link>
                }
              />

              {!loading && !hasProfile && (
                <div className="mt-5">
                  <EmptyState
                    icon={LockKeyhole}
                    title="Profile data unavailable"
                    description="Complete your candidate profile to view your academic details and eligibility status."
                    action={
                      <Link
                        to="/profile"
                        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        Complete Profile
                      </Link>
                    }
                  />
                </div>
              )}

              {hasProfile && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Degree & Major",
                      value: [profile.degree, profile.major]
                        .filter(Boolean)
                        .join(" / "),
                      icon: GraduationCap,
                    },
                    {
                      label: "Expected Graduation",
                      value: profile.grad_year || "Not available",
                      icon: CalendarDays,
                    },
                    {
                      label: "Cumulative GPA",
                      value: profile.cgpa ?? "Not available",
                      icon: ShieldCheck,
                    },
                    {
                      label: "Work Authorization",
                      value: profile.work_auth || "Not available",
                      icon: LockKeyhole,
                    },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-lg bg-indigo-50/70 p-3"
                    >
                      <Icon
                        size={15}
                        className="mb-2 text-indigo-500"
                      />

                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        {label}
                      </p>

                      <p className="mt-1 break-words text-xs font-semibold text-slate-600">
                        {value || "Not available"}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <LockKeyhole size={14} />
                  Profile data status
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  {hasProfile
                    ? "Candidate details loaded from your account."
                    : "Profile and verification information will come from your account data."}
                </p>
              </div>
            </Panel>

            {/* Risk detector */}
            <Panel className="p-4 sm:p-5">
              <SectionTitle
                icon={AlertTriangle}
                title="Hard Cutoff Risk Detector"
                subtitle="Potential eligibility issues"
              />

              <div className="mt-5">
                {!selectedResult && (
                  <EmptyState
                    icon={ShieldCheck}
                    title="No risk assessment available"
                    description="Select an application to view its eligibility warnings."
                  />
                )}

                {selectedResult &&
                  selectedResult.reasons.length === 0 &&
                  selectedResult.unverified.length === 0 && (
                    <div className="rounded-lg bg-emerald-50 p-4">
                      <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={16} />
                        No eligibility risks detected
                      </p>

                      <p className="mt-2 text-[11px] leading-5 text-emerald-600">
                        Your available profile details meet the specified
                        academic requirements for this job.
                      </p>
                    </div>
                  )}

                {selectedResult &&
                  (selectedResult.reasons.length > 0 ||
                    selectedResult.unverified.length > 0) && (
                    <div className="space-y-2">
                      {selectedResult.reasons.map((reason) => (
                        <div
                          key={reason}
                          className="flex gap-2 rounded-lg bg-rose-50 p-3 text-[11px] leading-5 text-rose-700"
                        >
                          <AlertTriangle
                            size={15}
                            className="mt-0.5 shrink-0"
                          />
                          {reason}
                        </div>
                      ))}

                      {selectedResult.unverified.map((reason) => (
                        <div
                          key={reason}
                          className="flex gap-2 rounded-lg bg-amber-50 p-3 text-[11px] leading-5 text-amber-700"
                        >
                          <CircleHelp
                            size={15}
                            className="mt-0.5 shrink-0"
                          />
                          {reason}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </Panel>

            {/* Strategy */}
            <Panel className="p-4 sm:p-5">
              <SectionTitle
                icon={Lightbulb}
                title="Eligibility Strategy & Tips"
                subtitle="Candidate guidance"
              />

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <FileText size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Profile information
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Keep your academic and candidate profile information
                      up to date.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                    <CircleHelp size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Verify requirements
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Check the employer's official requirements before
                      relying on an eligibility result.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <ArrowUpRight size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Keep applications updated
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Maintain accurate application and profile information.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/profile"
                className="mt-5 flex items-center justify-between rounded-lg bg-indigo-50 p-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  Update Candidate Profile
                </span>

                <ArrowUpRight size={15} />
              </Link>
            </Panel>
          </div>
        </div>

        {/* Accuracy notice */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-[11px] leading-5 text-slate-500">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-indigo-600"
          />

          <p>
            <strong className="text-slate-700">
              Data accuracy notice:
            </strong>{" "}
            Jobs, applications, resumes and candidate profile information
            are loaded from existing backend APIs. Eligibility results use
            the same CGPA, degree, major and graduation-year rules as the
            backend eligibility checker. Work authorization is displayed
            separately and is not currently part of the backend eligibility
            calculation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EligibilityChecker;
