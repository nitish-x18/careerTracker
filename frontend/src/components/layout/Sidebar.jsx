
import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import CareerTrackLogo from "../common/CareerTrackLogo";

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
            aria-hidden="true"
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-44 shrink-0 flex-col border-r border-slate-100 bg-white px-3 py-5 sm:w-48 lg:w-40 xl:w-44">
      {/* Shared CareerTrack branding */}
      <NavLink
        to="/dashboard"
        className="mb-7 flex items-center gap-2 px-1.5"
        aria-label="CareerTrack home"
      >
        <CareerTrackLogo size={28} />
        <span className="text-[12px] font-bold tracking-tight text-slate-900">
          CareerTrack
        </span>
      </NavLink>

      {/* Workspace navigation */}
      <section>
        <p className="mb-2 px-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        <nav aria-label="Workspace navigation" className="space-y-1">
          {workspaceLinks.map(renderLink)}
        </nav>
      </section>

      {/* Account navigation */}
      <section className="mt-auto border-t border-slate-100 pt-5">
        <p className="mb-2 px-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          Account
        </p>
        <nav aria-label="Account navigation" className="space-y-1">
          {accountLinks.map(renderLink)}
        </nav>
      </section>
    </aside>
  );
}

export default Sidebar;
