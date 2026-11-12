
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  Sparkles,
  Plus,
  Clock3,
  X,
  RefreshCw,
  Building2,
} from "lucide-react";
import { jobService } from "../services/jobService";

const filterOptions = {
  type: ["Full-time", "Internship", "Part-time", "Contract"],
};

function SectionHeading({ icon: Icon, children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-[12px] font-bold text-slate-800">
        <Icon size={14} className="text-violet-700" />
        {children}
      </h2>
      {action}
    </div>
  );
}

function SidebarCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-3 ${className}`}
    >
      {children}
    </section>
  );
}

export default function JobAndIntern() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [jobUrl, setJobUrl] = useState("");
  const [urlMessage, setUrlMessage] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const jobData = await jobService.getAllJobs();

        setJobs(Array.isArray(jobData) ? jobData : []);
      } catch (err) {
        setError(err.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [reloadKey]);

  // Search, filter and sort jobs
  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    return jobs
      .filter((job) => {
        const searchableText = [
          job.title,
          job.company_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const jobLocation = (job.location || "").toLowerCase();
        const type = (job.type || "").toLowerCase();

        return (
          (!normalizedQuery ||
            searchableText.includes(normalizedQuery)) &&
          (!normalizedLocation ||
            jobLocation.includes(normalizedLocation)) &&
          (!jobType || type === jobType.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortBy === "deadline") {
          const dateA = a.deadline
            ? new Date(a.deadline).getTime()
            : Infinity;

          const dateB = b.deadline
            ? new Date(b.deadline).getTime()
            : Infinity;

          return dateA - dateB;
        }

        if (sortBy === "title") {
          return (a.title || "").localeCompare(b.title || "");
        }

        return 0;
      });
  }, [jobs, query, location, jobType, sortBy]);

  function toggleSaved(id) {
    setSavedJobs((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    );
  }

  function handleUrlSubmit(event) {
    event.preventDefault();
    setUrlMessage("");

    try {
      const parsed = new URL(jobUrl.trim());

      if (!["https:", "http:"].includes(parsed.protocol)) {
        throw new Error("Invalid URL");
      }

      setUrlMessage(
        "Valid job URL. Automatic importing is not available yet."
      );
    } catch {
      setUrlMessage("Please enter a valid job posting URL.");
    }
  }

  function resetFilters() {
    setQuery("");
    setLocation("");
    setJobType("");
  }

  function formatDate(date) {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const activeFilterCount = [jobType].filter(Boolean).length;

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 bg-white text-slate-800">
      {/* Page heading */}
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-[8px] font-bold tracking-[0.15em] text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-700" />
            CAREER OPPORTUNITIES
          </p>

          <h1 className="text-[22px] font-bold leading-tight tracking-tight text-slate-900">
            Job & Internship Search
          </h1>

          <p className="mt-1 max-w-xl text-[10px] leading-relaxed text-slate-500">
            Discover opportunities that match your skills and career goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[9px] text-slate-500">
            <Bookmark size={11} />
            {savedJobs.length} saved
          </span>
        </div>
      </section>

      {/* Search panel */}
      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)_auto]">
          <label className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 focus-within:border-violet-500">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Job title or company"
              aria-label="Search job title or company"
              className="w-full min-w-0 bg-transparent text-[10px] outline-none placeholder:text-slate-400"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={12} className="text-slate-400" />
              </button>
            )}
          </label>

          <label className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 focus-within:border-violet-500">
            <MapPin size={15} className="shrink-0 text-slate-400" />
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City or location"
              aria-label="Filter by location"
              className="w-full min-w-0 bg-transparent text-[10px] outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            className="flex items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-violet-800"
          >
            <SlidersHorizontal size={13} />
            Filters

            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] text-violet-800">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3">
            <FilterSelect
              label="Employment type"
              value={jobType}
              options={filterOptions.type}
              onChange={setJobType}
            />

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={resetFilters}
                className="text-[10px] font-semibold text-violet-700 hover:text-violet-900"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[9px] text-slate-400">
            Quick filters:
          </span>

          {["Internship", "Full-time"].map((item) => {
            const isActive = jobType === item;

            return (
              <button
                key={item}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  setJobType((current) =>
                    current === item ? "" : item
                  )
                }
                className={`rounded-full border px-2.5 py-1 text-[9px] transition ${
                  isActive
                    ? "border-violet-300 bg-violet-100 font-semibold text-violet-800"
                    : "border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main content and right sidebar */}
      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_240px]">
        <section className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[13px] font-bold text-slate-800">
                Available opportunities
              </h2>

              <p className="mt-0.5 text-[9px] text-slate-500">
                {loading ? "Loading..." : `${filteredJobs.length} opportunities found`}
              </p>
            </div>

            <label className="flex items-center gap-2 text-[9px] text-slate-500">
              Sort by

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[9px] font-semibold text-slate-700 outline-none focus:border-violet-500"
              >
                <option value="deadline">Deadline</option>
                <option value="title">Job title</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 text-[11px] text-slate-500">
              Loading job opportunities...
            </div>
          ) : error ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-red-200 bg-red-50/50 px-5 py-10 text-center">
              <p className="text-[11px] text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => setReloadKey((current) => current + 1)}
                className="rounded-md bg-violet-700 px-4 py-2 text-[10px] font-semibold text-white hover:bg-violet-800"
              >
                Try again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-5 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <BriefcaseBusiness size={22} />
              </div>

              <h3 className="mt-4 text-[13px] font-bold text-slate-800">
                No job listings found
              </h3>

              <p className="mt-2 max-w-sm text-[10px] leading-relaxed text-slate-500">
                {jobs.length === 0
                  ? "There are currently no job opportunities available."
                  : "Try changing your search or filters to find opportunities."}
              </p>

              {(query || location || activeFilterCount > 0) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-violet-700 hover:bg-violet-50"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                      <Building2 size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[12px] font-bold text-slate-800">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {job.company_name || "Company not specified"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-[9px] text-slate-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {job.location}
                          </span>
                        )}

                        {job.type && (
                          <span className="flex items-center gap-1">
                            <BriefcaseBusiness size={10} />
                            {job.type}
                          </span>
                        )}

                        {job.season && (
                          <span className="flex items-center gap-1">
                            <Clock3 size={10} />
                            {job.season}
                          </span>
                        )}
                      </div>

                      {job.pay && (
                        <p className="mt-2 text-[10px] font-semibold text-slate-700">
                          Pay: {job.pay}
                        </p>
                      )}

                      <p className="mt-1 text-[9px] text-slate-500">
                        Application deadline: {formatDate(job.deadline)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSaved(job.id)}
                      aria-label={
                        savedJobs.includes(job.id)
                          ? "Remove saved job"
                          : "Save job"
                      }
                      className={`rounded-md border p-2 ${
                        savedJobs.includes(job.id)
                          ? "border-violet-200 bg-violet-50 text-violet-700"
                          : "border-slate-200 text-slate-500 hover:text-violet-700"
                      }`}
                    >
                      <Bookmark size={14} />
                    </button>
                  </div>

                  {job.source_url && (
                    <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                      <a
                        href={job.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-md bg-violet-700 px-3 py-2 text-[9px] font-semibold text-white hover:bg-violet-800"
                      >
                        View job <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="min-w-0 space-y-4">
          <SidebarCard>
            <SectionHeading icon={Sparkles}>
              Match Persona
            </SectionHeading>

            <div className="rounded-lg bg-violet-50 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm">
                <Sparkles size={16} />
              </div>

              <p className="mt-2 text-[11px] font-bold text-slate-800">
                Your career profile
              </p>

              <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                Add your skills and career preferences to personalize job
                recommendations.
              </p>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="mt-3 w-full rounded-md bg-violet-700 px-2 py-2 text-[9px] font-semibold text-white hover:bg-violet-800"
              >
                Complete profile
              </button>
            </div>

            <p className="mt-2 text-[8px] leading-relaxed text-slate-400">
              Personalized matching will be available when matching
              functionality is connected.
            </p>
          </SidebarCard>

          <SidebarCard>
            <SectionHeading icon={Plus}>
              Quick Add by URL
            </SectionHeading>

            <p className="mb-3 text-[9px] leading-relaxed text-slate-500">
              Paste a job posting link to check whether it is valid.
            </p>

            <form onSubmit={handleUrlSubmit} className="space-y-2">
              <input
                type="url"
                value={jobUrl}
                onChange={(event) => {
                  setJobUrl(event.target.value);
                  setUrlMessage("");
                }}
                placeholder="https://..."
                aria-label="Job posting URL"
                className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-[9px] outline-none focus:border-violet-500"
              />

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-2 py-2 text-[9px] font-semibold text-violet-700 hover:bg-violet-100"
              >
                <Plus size={12} />
                Check job link
              </button>

              {urlMessage && (
                <p
                  role="status"
                  className="text-[9px] leading-relaxed text-slate-600"
                >
                  {urlMessage}
                </p>
              )}
            </form>
          </SidebarCard>

          <SidebarCard>
            <SectionHeading icon={RefreshCw}>
              Weekly Inflow
            </SectionHeading>

            <div className="flex min-h-24 flex-col items-center justify-center rounded-lg bg-slate-50 px-3 py-4 text-center">
              <BriefcaseBusiness size={19} className="text-slate-300" />

              <p className="mt-2 text-[10px] font-semibold text-slate-700">
                No weekly data yet
              </p>

              <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                Weekly job trends are not available from the current jobs API.
              </p>
            </div>
          </SidebarCard>
        </aside>
      </div>
    </main>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-semibold text-slate-600">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[10px] text-slate-700 outline-none focus:border-violet-500"
      >
        <option value="">All</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
