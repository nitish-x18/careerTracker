
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ListChecks,
  Search,
  FileSearch,
  ShieldCheck,
  Clock3,
  Settings,
  UserRound,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const workspaceLinks = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Applications", path: "/applications", icon: BriefcaseBusiness },
  { label: "Priority Queue", path: "/priority-queue", icon: ListChecks },
  { label: "Job & Internship Search", path: "/job-search", icon: Search },
  { label: "Resume Match", path: "/resume-match", icon: FileSearch },
  { label: "Eligibility Checker", path: "/eligibility", icon: ShieldCheck },
  { label: "Application Timeline", path: "/timeline", icon: Clock3 },
];

const accountLinks = [
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "User Profile", path: "/profile", icon: UserRound },
];

function Sidebar() {
  const renderLink = ({ label, path, icon: Icon }) => (
    <NavLink
      key={path}
      to={path}
      end={path === "/dashboard"}
      className={({ isActive }) =>
        `flex min-h-[34px] items-center gap-2.5 rounded-md px-2.5 text-[11px] transition-colors ${
          isActive
            ? "bg-cyan-50 font-semibold text-violet-800"
            : "text-slate-600 hover:bg-slate-50 hover:text-violet-700"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={14}
            strokeWidth={isActive ? 2.4 : 1.9}
            className={isActive ? "text-violet-700" : "text-slate-500"}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <aside className="flex min-h-screen w-44 shrink-0 flex-col border-r border-slate-100 bg-white px-3 py-5 sm:w-48 lg:w-40 xl:w-44">
      {/* CareerTracker brand */}
      <NavLink
        to="/dashboard"
        className="mb-7 flex items-center gap-2 px-1.5"
        aria-label="CareerTracker home"
      >
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-violet-700 text-white">
          <Zap size={14} fill="currentColor" />
        </span>
        <span className="text-[12px] font-bold tracking-tight text-slate-900">
          CareerTrack
        </span>
      </NavLink>

      {/* Workspace navigation */}
      <div>
        <p className="mb-2 px-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        <nav aria-label="Workspace" className="space-y-1">
          {workspaceLinks.map(renderLink)}
        </nav>
      </div>

      {/* Account navigation stays at the bottom */}
      <div className="mt-auto pt-8">
        <p className="mb-2 px-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          Account
        </p>
        <nav aria-label="Account" className="space-y-1">
          {accountLinks.map(renderLink)}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
