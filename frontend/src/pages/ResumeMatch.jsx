
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Target,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building2,
  Clock3,
  Sparkles,
  ShieldCheck,
  CircleAlert,
  Info,
} from "lucide-react";
import { api } from "../services/api";

function getPayload(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function getSkillName(skill) {
  if (typeof skill === "string") return skill;

  return (
    skill?.skill_name ||
    skill?.name ||
    skill?.skill ||
    skill?.title ||
    "Unknown skill"
  );
}

function getResumeName(resume) {
  return (
    resume?.file_name ||
    resume?.filename ||
    resume?.name ||
    resume?.title ||
    `Resume ${resume.id}`
  );
}

function getJobName(job) {
  return job?.title || job?.job_title || `Job ${job.id}`;
}

function SummaryCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="max-w-[160px] text-xs font-bold leading-5 tracking-wide text-gray-500">
          {item.title}
        </p>

        <div className={`rounded-lg p-2 ${item.bg}`}>
          <Icon size={19} className={item.color} />
        </div>
      </div>

      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {item.value}
      </p>

      <p className="mt-2 text-xs leading-5 text-gray-400">
        {item.subtitle}
      </p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && (
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
          <Icon size={18} />
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>

        {subtitle && (
          <p className="mt-1 text-xs leading-4 text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyMessage({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-4 py-6 text-center">
      <FileText size={22} className="mx-auto text-gray-400" />

      <p className="mt-2 text-sm font-semibold text-gray-700">{title}</p>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function UnavailablePanel({ title, description, icon: Icon }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-indigo-600" />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {description}
      </p>

      <span className="mt-3 inline-block rounded-md bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-500">
        NOT AVAILABLE
      </span>
    </div>
  );
}

function ResumeMatch() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");

  const [matchData, setMatchData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");

  // Fetch resumes and jobs from backend
  useEffect(() => {
    let cancelled = false;

    async function fetchInitialData() {
      try {
        setLoading(true);
        setError("");

        const [resumeResponse, jobResponse] = await Promise.all([
          api.get("/api/resumes"),
          api.get("/api/jobs"),
        ]);

        const resumePayload = getPayload(resumeResponse);
        const jobPayload = getPayload(jobResponse);

        const resumeList = Array.isArray(resumePayload?.resumes)
          ? resumePayload.resumes
          : [];

        const jobList = Array.isArray(jobPayload?.jobs)
          ? jobPayload.jobs
          : [];

        if (cancelled) return;

        setResumes(resumeList);
        setJobs(jobList);

        if (resumeList.length > 0) {
          setSelectedResume(String(resumeList[0].id));
        }

        if (jobList.length > 0) {
          setSelectedJob(String(jobList[0].id));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load resumes and jobs.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch actual resume-job skill matching result
  useEffect(() => {
    if (!selectedResume || !selectedJob) {
      setMatchData(null);
      return;
    }

    let cancelled = false;

    async function fetchMatch() {
      try {
        setMatching(true);
        setMatchError("");
        setMatchData(null);

        const response = await api.get(
          `/api/resumes/${encodeURIComponent(selectedResume)}/match/${encodeURIComponent(selectedJob)}`
        );

        const result = getPayload(response);

        if (!cancelled) {
          setMatchData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setMatchError(err.message || "Unable to analyze this resume.");
        }
      } finally {
        if (!cancelled) setMatching(false);
      }
    }

    fetchMatch();

    return () => {
      cancelled = true;
    };
  }, [selectedResume, selectedJob]);

  const matchedSkills = useMemo(() => {
    return Array.isArray(matchData?.matchedSkills)
      ? matchData.matchedSkills
      : [];
  }, [matchData]);

  const missingSkills = useMemo(() => {
    return Array.isArray(matchData?.missingSkills)
      ? matchData.missingSkills
      : [];
  }, [matchData]);

  const matchedCount =
    matchData?.matchedCount ?? matchedSkills.length;

  const missingCount =
    matchData?.missingCount ?? missingSkills.length;

  const totalRequiredSkills =
    matchData?.totalRequiredSkills ??
    matchedCount + missingCount;

  const matchPercentage =
    typeof matchData?.matchPercentage === "number"
      ? matchData.matchPercentage
      : null;

  const summaryCards = [
    {
      title: "OVERALL RESUME MATCH",
      value:
        matchPercentage !== null
          ? `${matchPercentage}%`
          : "N/A",
      subtitle: matchData
        ? "Based on selected resume and job"
        : "Awaiting analysis",
      icon: Target,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "MATCHED TECHNICAL SKILLS",
      value: matchData ? matchedCount : "N/A",
      subtitle: matchData
        ? "Matching required skills"
        : "Awaiting analysis",
      icon: CheckCircle2,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      title: "MISSING SKILLS",
      value: matchData ? missingCount : "N/A",
      subtitle: matchData
        ? "Skills to improve"
        : "Awaiting analysis",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "ESTIMATED ATS PASS RATE",
      value: "N/A",
      subtitle: "ATS analysis not connected",
      icon: ShieldCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  const selectedJobDetails = jobs.find(
    (job) => String(job.id) === selectedJob
  );

  const selectedResumeDetails = resumes.find(
    (resume) => String(resume.id) === selectedResume
  );

  return (
    <div className="min-h-screen bg-[#f7f8ff] p-4 sm:p-5 lg:p-6">
      {/* PAGE HEADER */}
      <section className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-indigo-600">
                Resume Match & Skill Gap
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Resume Match & Skill Gap Analyzer
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-5 text-gray-600">
              Evaluate your technical credentials against target job
              descriptions, discover skill gaps and improve your resume.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            RESUME MATCH API CONNECTED
          </span>
        </div>
      </section>

      {/* SELECT RESUME AND JOB */}
      <section className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <SectionHeader
          title="Select Resume & Job"
          subtitle="Choose a resume and a job to calculate your actual skill match."
          icon={FileText}
        />

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw size={16} className="animate-spin" />
            Loading your resumes and available jobs...
          </div>
        ) : error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                Select Resume
              </span>

              <select
                value={selectedResume}
                onChange={(event) => setSelectedResume(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-indigo-500"
              >
                <option value="">Choose your resume</option>

                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {getResumeName(resume)}
                  </option>
                ))}
              </select>

              {resumes.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No resumes found in your account.
                </p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                Select Job
              </span>

              <select
                value={selectedJob}
                onChange={(event) => setSelectedJob(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-indigo-500"
              >
                <option value="">Choose a job</option>

                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {getJobName(job)}
                    {job.company_name ? ` - ${job.company_name}` : ""}
                  </option>
                ))}
              </select>

              {jobs.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No jobs found in the database.
                </p>
              )}
            </label>
          </div>
        )}

        {selectedResumeDetails && selectedJobDetails && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="rounded-md bg-indigo-50 px-3 py-2 text-indigo-700">
              Resume: {getResumeName(selectedResumeDetails)}
            </span>

            <span className="rounded-md bg-sky-50 px-3 py-2 text-sky-700">
              Job: {getJobName(selectedJobDetails)}
            </span>
          </div>
        )}
      </section>

      {/* MATCH ERROR */}
      {matchError && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3">
          <CircleAlert size={16} className="mt-0.5 shrink-0 text-red-600" />

          <p className="text-sm leading-5 text-red-700">
            {matchError}
          </p>
        </div>
      )}

      {/* LOADING */}
      {matching && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          <RefreshCw size={16} className="animate-spin" />
          Analyzing resume against selected job...
        </div>
      )}

      {/* SUMMARY CARDS */}
      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <SummaryCard key={item.title} item={item} />
        ))}
      </section>

      {/* MAIN DASHBOARD */}
      <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
        {/* LEFT COLUMN */}
        <div className="space-y-4 xl:col-span-8">
          {/* SKILL GAP MATRIX */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="border-b border-gray-100 pb-3">
              <SectionHeader
                title="Skill Gap & Coverage Matrix"
                subtitle="Identify matching skills and areas that need improvement"
                icon={Target}
              />
            </div>

            {/* MATCHED SKILLS */}
            <div className="mt-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <h3 className="text-sm font-bold text-slate-800">
                    Matched Skills
                  </h3>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {matchData ? `${matchedCount} matched` : "Awaiting analysis"}
                </span>
              </div>

              {matching ? (
                <EmptyMessage
                  title="Analyzing skills"
                  description="Matched skills will appear here when the analysis is complete."
                />
              ) : matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill, index) => (
                    <span
                      key={`${getSkillName(skill)}-${index}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
                    >
                      <CheckCircle2 size={14} />
                      {getSkillName(skill)}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyMessage
                  title="No matched skills to display"
                  description="Select a resume and job to see skills that match the job requirements."
                />
              )}
            </div>

            {/* MISSING SKILLS */}
            <div className="mt-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  <h3 className="text-sm font-bold text-slate-800">
                    Missing Skills
                  </h3>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                  {matchData ? `${missingCount} missing` : "Awaiting analysis"}
                </span>
              </div>

              {matching ? (
                <EmptyMessage
                  title="Analyzing skill gaps"
                  description="Missing skills will appear here when the analysis is complete."
                />
              ) : missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, index) => (
                    <span
                      key={`${getSkillName(skill)}-${index}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                    >
                      <AlertTriangle size={14} />
                      {getSkillName(skill)}
                    </span>
                  ))}
                </div>
              ) : matchData ? (
                <EmptyMessage
                  title="No missing skills"
                  description="The selected resume covers all the required skills returned by this analysis."
                />
              ) : (
                <EmptyMessage
                  title="Skill gaps not available"
                  description="Select a resume and job to identify missing skills."
                />
              )}
            </div>

            {/* MATCH PROGRESS */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Overall Skill Coverage
                </h3>

                <span className="text-sm font-bold text-indigo-600">
                  {matchPercentage !== null
                    ? `${matchPercentage}%`
                    : "N/A"}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, matchPercentage ?? 0))}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {matchData
                  ? `${matchedCount} matched out of ${totalRequiredSkills} required skills`
                  : "Skill coverage will appear after analysis."}
              </p>
            </div>
          </div>

          {/* BULLET POINT SYNTHESIZER */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeader
              title="Interactive Bullet Point Synthesizer"
              subtitle="Improve resume bullet points using relevant skills and keywords"
              icon={Sparkles}
            />

            <div className="mt-4">
              <UnavailablePanel
                title="AI suggestions unavailable"
                description="AI-generated bullet point improvements require a separate resume enhancement API."
                icon={Sparkles}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 xl:col-span-4">
          {/* COMPANY ALIGNMENT */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <SectionHeader
              title="Company Alignment"
              subtitle="Selected job information"
              icon={Building2}
            />

            <div className="mt-4">
              {selectedJobDetails ? (
                <div className="rounded-lg bg-indigo-50 p-3">
                  <p className="text-sm font-semibold text-gray-800">
                    {getJobName(selectedJobDetails)}
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    {selectedJobDetails.company_name ||
                      "Company not specified"}
                  </p>

                  {selectedJobDetails.location && (
                    <p className="mt-2 text-xs text-gray-500">
                      {selectedJobDetails.location}
                    </p>
                  )}
                </div>
              ) : (
                <EmptyMessage
                  title="No job selected"
                  description="Select a job to see its details."
                />
              )}
            </div>
          </div>

          {/* SKILL SPRINTS */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <SectionHeader
              title="14-Day Skill Sprints"
              subtitle="Personalized projects and learning plans"
              icon={Clock3}
            />

            <div className="mt-4">
              <UnavailablePanel
                title="Learning plan not generated"
                description="Personalized learning plans require a separate learning recommendation API."
                icon={Clock3}
              />
            </div>
          </div>

          {/* ATS HEALTH */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <SectionHeader
                title="ATS Parsing Health"
                icon={ShieldCheck}
              />

              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500">
                N/A
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Resume parsing and compatibility checks
            </p>

            <div className="mt-4">
              <UnavailablePanel
                title="ATS checks not performed"
                description="Font hierarchy, document structure and ATS compatibility need a separate parsing API."
                icon={ShieldCheck}
              />
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2">
              <CircleAlert
                size={14}
                className="mt-0.5 shrink-0 text-amber-500"
              />

              <p className="text-xs leading-5 text-amber-700">
                Skill matching does not represent an ATS pass score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="mt-5 flex items-start gap-2 pb-3 text-xs leading-5 text-gray-400">
        <Info size={14} className="mt-0.5 shrink-0" />

        <p>
          Match results are fetched from your backend for the selected
          resume and job. ATS scoring and AI recommendations are not
          included in the current matching API.
        </p>
      </div>
    </div>
  );
}

export default ResumeMatch;
