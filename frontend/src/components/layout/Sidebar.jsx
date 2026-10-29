
import { NavLink } from "react-router-dom";
import {
  TrendingUp,
  LayoutDashboard,
  PanelsTopLeft,
  ListTodo,
  Search,
  FileSearch,
  CircleCheck,
  Clock,
  Settings,
  UserRound,
} from "lucide-react";

const workspaceLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Applications", path: "/applications", icon: PanelsTopLeft },
  { name: "Priority Queue", path: "/priority-queue", icon: ListTodo },
  { name: "Job & Internship Search", path: "/job-search", icon: Search },
  { name: "Resume Match", path: "/resume-match", icon: FileSearch },
  { name: "Eligibility Checker", path: "/eligibility", icon: CircleCheck },
  { name: "Application Timeline", path: "/timeline", icon: Clock },
];

const accountLinks = [
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "User Profile", path: "/profile", icon: UserRound },
];

function Sidebar({ onNavigate }) {
  const renderLinks = (links) =>
    links.map(({ name, path, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex min-h-[34px] items-center gap-2 rounded-md px-2.5 py-1.5
          text-xs font-medium transition-colors
          ${
            isActive
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-700 hover:bg-slate-100"
          }`
        }
      >
        <Icon size={15} strokeWidth={1.9} className="shrink-0" />
        <span className="whitespace-nowrap">{name}</span>
      </NavLink>
    ));

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col border-r border-slate-200 bg-white px-2.5">
      {/* Brand */}
      <div className="flex h-[60px] shrink-0 items-center gap-2 px-0.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white">
          <TrendingUp size={17} strokeWidth={2.4} />
        </div>

        <span className="text-sm font-bold tracking-tight text-slate-900">
          CareerTrack
        </span>
      </div>

      {/* Workspace */}
      <div className="mt-2">
        <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Workspace
        </p>

        <nav className="flex flex-col gap-0.5">
          {renderLinks(workspaceLinks)}
        </nav>
      </div>

      {/* Account */}
      <div className="mt-auto pb-4">
        <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Account
        </p>

        <nav className="flex flex-col gap-0.5">
          {renderLinks(accountLinks)}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;

