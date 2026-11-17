import { useEffect, useMemo, useState } from "react";

import {
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  ShieldCheck,
  Settings,
  Mail,
  MapPin,
  Pencil,
  Share2,
  ExternalLink,
  CheckCircle2,
  Clock3,
  Trophy,
  Bookmark,
  Save,
  X,
  LoaderCircle,
  Info,
  LockKeyhole,
  Bell,
  Target,
} from "lucide-react";

import Card from "../components/ui/Card";
import { api } from "../services/api";

const emptyAccount = {
  name: "",
  email: "",
};

const emptyAcademic = {
  university: "",
  degree: "",
  major: "",
  cgpa: "",
  grad_year: "",
  work_auth: "",
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

function Section({ title, subtitle, icon: Icon, children }) {
  return (
    <Card className="h-full rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
          <Icon size={19} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children}
    </Card>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div className="min-w-0">
      <label className="text-xs font-medium text-gray-500">
        {label}
      </label>

      {editing ? (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={inputClass}
        />
      ) : (
        <p className="mt-2 min-h-5 break-words text-sm font-medium text-gray-800">
          {value !== "" && value !== null && value !== undefined ? (
            value
          ) : (
            <span className="font-normal text-gray-400">
              Not provided
            </span>
          )}
        </p>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, bg }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-gray-500">
          {title}
        </p>

        <div className={`rounded-lg p-2 ${bg}`}>
          <Icon size={18} className={color} />
        </div>
      </div>

      <h3 className="mt-3 text-2xl font-bold text-gray-900">
        {value}
      </h3>

      <p className="mt-1 text-xs text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}

function Unavailable({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
      <Info size={20} className="mx-auto text-gray-400" />

      <p className="mt-2 text-sm font-semibold text-gray-700">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function getResponseData(result, key) {
  return result?.data?.[key] ?? result?.[key] ?? null;
}

function Profile() {
  const [account, setAccount] = useState(emptyAccount);
  const [academic, setAcademic] = useState(emptyAcademic);
  const [applications, setApplications] = useState([]);

  const [initialAccount, setInitialAccount] = useState(emptyAccount);
  const [initialAcademic, setInitialAcademic] = useState(emptyAcademic);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [accountExists, setAccountExists] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState("");

  // LOAD PROFILE DATA
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setLoadError("");

      const results = await Promise.allSettled([
        api.get("/api/users"),
        api.get("/api/profile"),
        api.get("/api/applications"),
      ]);

      if (!active) return;

      const [userResult, profileResult, applicationResult] = results;

      // ACCOUNT INFORMATION
      if (userResult.status === "fulfilled") {
        const user = getResponseData(userResult.value, "user");

        if (user) {
          const userData = {
            name: user.name || "",
            email: user.email || "",
          };

          setAccount(userData);
          setInitialAccount(userData);
          setAccountExists(true);
        }
      }

      // ACADEMIC INFORMATION
      if (profileResult.status === "fulfilled") {
        const profile = getResponseData(
          profileResult.value,
          "profile"
        );

        if (profile) {
          const academicData = {
            university: profile.university || "",
            degree: profile.degree || "",
            major: profile.major || "",
            cgpa: profile.cgpa ?? "",
            grad_year: profile.grad_year ?? "",
            work_auth: profile.work_auth || "",
          };

          setAcademic(academicData);
          setInitialAcademic(academicData);
          setProfileExists(true);
        }
      }

      // APPLICATION INFORMATION
      if (applicationResult.status === "fulfilled") {
        const data = getResponseData(
          applicationResult.value,
          "applications"
        );

        setApplications(Array.isArray(data) ? data : []);
        setApplicationsLoaded(true);
      }

      const profileRequestFailed =
        userResult.status === "rejected" ||
        profileResult.status === "rejected";

      const anyRequestFailed = results.some(
        (result) => result.status === "rejected"
      );

      setProfileLoaded(!profileRequestFailed);

      if (anyRequestFailed) {
        setLoadError(
          "Some information could not be loaded. Your data will appear when the server connection is restored."
        );
      }

      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // UPDATE ACCOUNT FIELDS
  function updateAccount(field, value) {
    setAccount((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // UPDATE ACADEMIC FIELDS
  function updateAcademic(field, value) {
    setAcademic((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // APPLICATION STATISTICS
  const stats = useMemo(() => {
    const activeStatuses = ["applied", "interview"];

    const activeCount = applications.filter((app) =>
      activeStatuses.includes(
        String(app.status || "").toLowerCase()
      )
    ).length;

    const offersCount = applications.filter(
      (app) =>
        String(app.status || "").toLowerCase() === "offer"
    ).length;

    return {
      total: applications.length,
      active: activeCount,
      offers: offersCount,
    };
  }, [applications]);

  // PROFILE COMPLETENESS
  const completeness = useMemo(() => {
    const allFields = [
      account.name,
      account.email,
      ...Object.values(academic),
    ];

    const filled = allFields.filter(
      (value) => String(value ?? "").trim() !== ""
    ).length;

    return Math.round((filled / allFields.length) * 100);
  }, [account, academic]);

  // SAVE PROFILE
  async function handleSave() {
    setSaveError("");
    setSuccess("");

    if (!profileLoaded) {
      setSaveError(
        "Your account and academic information has not loaded completely. Please restore the server connection and try again."
      );
      return;
    }

    if (!account.name.trim()) {
      setSaveError("Please enter your name.");
      return;
    }

    if (!account.email.trim()) {
      setSaveError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
      setSaveError("Please enter a valid email address.");
      return;
    }

    const cgpaValue =
      academic.cgpa === "" ? null : Number(academic.cgpa);

    if (
      cgpaValue !== null &&
      (!Number.isFinite(cgpaValue) ||
        cgpaValue < 0 ||
        cgpaValue > 10)
    ) {
      setSaveError("CGPA must be between 0 and 10.");
      return;
    }

    const yearValue =
      academic.grad_year === ""
        ? null
        : Number(academic.grad_year);

    if (
      yearValue !== null &&
      (!Number.isInteger(yearValue) ||
        yearValue < 1900 ||
        yearValue > 2100)
    ) {
      setSaveError("Please enter a valid graduation year.");
      return;
    }

    if (!accountExists) {
      setSaveError(
        "Account information is unavailable. Please check your login and backend connection."
      );
      return;
    }

    const accountPayload = {
      name: account.name.trim(),
      email: account.email.trim(),
    };

    const academicPayload = {
      university: academic.university.trim(),
      degree: academic.degree.trim(),
      major: academic.major.trim(),
      cgpa: cgpaValue,
      grad_year: yearValue,
      work_auth: academic.work_auth.trim(),
    };

    const academicHasData = Object.values(academic).some(
      (value) => String(value ?? "").trim() !== ""
    );

    setSaving(true);

    let accountSaved = false;

    try {
      // SAVE ACCOUNT INFORMATION FIRST
      await api.patch("/api/users", accountPayload);

      accountSaved = true;

      setAccountExists(true);
      setInitialAccount({ ...account });

      // SAVE ACADEMIC INFORMATION
      if (profileExists) {
        await api.patch("/api/profile", academicPayload);
      } else if (academicHasData) {
        await api.post("/api/profile", academicPayload);
        setProfileExists(true);
      }

      setInitialAcademic({ ...academic });

      setEditing(false);
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      if (accountSaved) {
        setSaveError(
          `Your account information was saved, but your academic information could not be saved. ${err.message || "Please try again."}`
        );
      } else {
        setSaveError(
          err.message || "Unable to save your profile."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // CANCEL EDITING
  function handleCancel() {
    setAccount(initialAccount);
    setAcademic(initialAcademic);

    setEditing(false);
    setSaveError("");
    setSuccess("");
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f8ff]">
        <div className="text-center">
          <LoaderCircle
            size={30}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const displayedName = account.name || "Your Name";

  return (
    <div className="min-h-screen bg-[#f7f8ff] p-4 sm:p-5 lg:p-6">

      {/* PAGE HEADER */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <span>Workspace</span>
            <span>/</span>
            <span className="font-semibold text-indigo-600">
              User Profile
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal, academic and career information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <X size={15} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={15} />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                title="Sharing functionality is not available yet"
                className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400"
              >
                <Share2 size={15} />
                Share
              </button>

              <button
                type="button"
                disabled
                title="Public portfolio is not available yet"
                className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400"
              >
                <ExternalLink size={15} />
                View Public Portfolio
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setSaveError("");
                  setSuccess("");
                }}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* BACKEND WARNING */}
      {loadError && (
        <div
          role="status"
          className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <Info
            size={19}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <p className="font-semibold">
              Profile data temporarily unavailable
            </p>

            <p className="mt-1 text-xs leading-5">
              {loadError}
            </p>
          </div>
        </div>
      )}

      {/* SAVE ERROR */}
      {saveError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {saveError}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {/* PROFILE BANNER */}
      <div className="mb-5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-500 p-5 text-white shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold">
              {account.name ? (
                account.name.charAt(0).toUpperCase()
              ) : (
                <UserRound size={32} />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold sm:text-2xl">
                  {displayedName}
                </h2>

                <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold">
                  Profile
                </span>
              </div>

              <p className="mt-1 text-sm text-indigo-100">
                CareerTrack Member
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-indigo-100">
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={14} />
                  {academic.degree || "Degree not provided"}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  Location not provided
                </span>

                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {account.email || "Email not provided"}
                </span>
              </div>

              {academic.university && (
                <p className="mt-2 text-xs text-indigo-100">
                  {academic.university}
                </p>
              )}
            </div>
          </div>

          {/* COMPLETENESS */}
          <div className="min-w-[190px] rounded-xl border border-white/20 bg-white/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-indigo-100">
                Profile Completeness
              </p>

              <span className="text-lg font-bold">
                {profileLoaded ? `${completeness}%` : "N/A"}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{
                  width: `${profileLoaded ? completeness : 0}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[10px] text-indigo-100">
              Based on available profile fields
            </p>
          </div>
        </div>
      </div>

      {/* APPLICATION STATISTICS */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={applicationsLoaded ? stats.total : "N/A"}
          subtitle="Applications submitted"
          icon={BriefcaseBusiness}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />

        <StatCard
          title="Active Rounds"
          value={applicationsLoaded ? stats.active : "N/A"}
          subtitle="Applied and interview stages"
          icon={Clock3}
          color="text-blue-600"
          bg="bg-blue-50"
        />

        <StatCard
          title="Offers in Hand"
          value={applicationsLoaded ? stats.offers : "N/A"}
          subtitle="Offers received"
          icon={Trophy}
          color="text-green-600"
          bg="bg-green-50"
        />

        <StatCard
          title="Bookmarked Roles"
          value="N/A"
          subtitle="Bookmark data unavailable"
          icon={Bookmark}
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      {/* MAIN TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {/* PERSONAL INFORMATION */}
          <Section
            title="Personal Information"
            subtitle="Your basic account details"
            icon={UserRound}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Full Name"
                value={account.name}
                editing={editing}
                onChange={(value) =>
                  updateAccount("name", value)
                }
              />

              <Field
                label="Email Address"
                value={account.email}
                editing={editing}
                onChange={(value) =>
                  updateAccount("email", value)
                }
                type="email"
              />

              <Field
                label="Phone Number"
                value=""
                editing={false}
              />

              <Field
                label="Location"
                value=""
                editing={false}
              />
            </div>

            <p className="mt-4 border-t border-gray-100 pt-3 text-[10px] text-gray-400">
              Phone number and location are not currently supported by the account API.
            </p>
          </Section>

          {/* ACADEMIC DETAILS */}
          <Section
            title="Academic Details & Education"
            subtitle="Your educational background"
            icon={GraduationCap}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="University"
                value={academic.university}
                editing={editing}
                onChange={(value) =>
                  updateAcademic("university", value)
                }
              />

              <Field
                label="Degree"
                value={academic.degree}
                editing={editing}
                onChange={(value) =>
                  updateAcademic("degree", value)
                }
              />

              <Field
                label="Major / Specialization"
                value={academic.major}
                editing={editing}
                onChange={(value) =>
                  updateAcademic("major", value)
                }
              />

              <Field
                label="CGPA"
                value={academic.cgpa}
                editing={editing}
                onChange={(value) =>
                  updateAcademic("cgpa", value)
                }
              />

              <Field
                label="Graduation Year"
                value={academic.grad_year}
                editing={editing}
                onChange={(value) =>
                  updateAcademic("grad_year", value)
                }
              />

              <Field
                label="Work Authorization"
                value={academic.work_auth}
                editing={editing}
                onChange={(value) =>
                  updateAcademic("work_auth", value)
                }
              />
            </div>
          </Section>

          {/* CAREER MATCH PREFERENCES */}
          <Section
            title="Career Match Preferences"
            subtitle="Preferences used to personalize job matching"
            icon={Target}
          >
            <Unavailable
              title="Preferences not connected"
              description="Preferred job roles, locations, industries and salary expectations will appear here when the preferences API is connected."
            />
          </Section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* ACTIVE MASTER RESUME */}
          <Section
            title="Active Master Resume"
            subtitle="Your resume information and analysis status"
            icon={FileText}
          >
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
                <FileText size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Resume not available
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  No resume information found.
                </p>
              </div>

              <span className="rounded-full bg-gray-200 px-3 py-1 text-[10px] font-medium text-gray-500">
                Unavailable
              </span>
            </div>

            <button
              type="button"
              disabled
              title="Resume upload API is not available yet"
              className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 text-sm font-medium text-gray-400"
            >
              <FileText size={16} />
              Upload Resume
            </button>
          </Section>

          {/* SECURITY & PREFERENCES */}
          <Section
            title="Security & Preferences"
            subtitle="Manage your account settings"
            icon={ShieldCheck}
          >
            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                  <LockKeyhole size={18} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    Account Security
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Password management
                  </p>
                </div>

                <span className="text-[10px] text-gray-400">
                  Unavailable
                </span>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
                  <Bell size={18} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    Notifications
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Email and application alerts
                  </p>
                </div>

                <span className="text-[10px] text-gray-400">
                  Unavailable
                </span>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
                  <Settings size={18} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    Account Preferences
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Additional account configurations
                  </p>
                </div>

                <span className="text-[10px] text-gray-400">
                  Unavailable
                </span>
              </div>
            </div>
          </Section>

          {/* ACCOUNT INFORMATION */}
          <Section
            title="Account Information"
            subtitle="Your CareerTrack account"
            icon={CheckCircle2}
          >
            <div
              className={`flex items-center justify-between gap-3 rounded-lg p-3 ${
                accountExists ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className={
                    accountExists ? "text-green-600" : "text-gray-400"
                  }
                />

                <span
                  className={`text-xs font-medium ${
                    accountExists ? "text-green-800" : "text-gray-600"
                  }`}
                >
                  Account information
                </span>
              </div>

              <span
                className={`text-[10px] font-semibold ${
                  accountExists ? "text-green-700" : "text-gray-500"
                }`}
              >
                {accountExists ? "API connected" : "Unavailable"}
              </span>
            </div>
          </Section>
        </div>
      </div>

      {/* FOOTER */}
      <p className="mt-5 pb-3 text-center text-[10px] text-gray-400">
        CareerTrack Profile · Personal and academic information
      </p>
    </div>
  );
}

export default Profile;
