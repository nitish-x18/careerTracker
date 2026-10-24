import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  PanelsTopLeft,
  Hourglass,
  Search,
  FileSearch,
  BadgeCheck,
  Clock,
  Settings,
  UserRoundCog,
} from "lucide-react";

import CareerTrackLogo from "../common/CareerTrackLogo";

function Sidebar() {
  const workspaceLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
    { name: "My Applications", path: "/applications", icon: PanelsTopLeft },
    { name: "Priority Queue", path: "/priority-queue", icon: Hourglass },
    { name: "Job & Internship Search", path: "/job-search", icon: Search },
    { name: "Resume Match", path: "/resume-match", icon: FileSearch },
    { name: "Eligibility Checker", path: "/eligibility", icon: BadgeCheck },
    { name: "Application Timeline", path: "/timeline", icon: Clock },
  ];

  const accountLinks = [
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "User Profile", path: "/profile", icon: UserRoundCog },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
      isActive
        ? "bg-blue-600 font-medium text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  function renderLinks(links) {
    return links.map(({ name, path, icon: Icon }) => (
      <NavLink key={path} to={path} className={linkClasses}>
        <Icon
          size={16}
          strokeWidth={1.8}
          className="shrink-0"
          aria-hidden="true"
        />
        <span>{name}</span>
      </NavLink>
    ));
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-gray-900 p-5 text-white">
      {/* CareerTrack Branding */}
      <div className="mb-8 flex items-center gap-2.5">
        <CareerTrackLogo size={28} />

        <h1 className="text-xl font-bold tracking-tight">
          CareerTrack
        </h1>
      </div>

      {/* Workspace */}
      <section>
        <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </h2>

        <nav className="space-y-1" aria-label="Workspace navigation">
          {renderLinks(workspaceLinks)}
        </nav>
      </section>

      {/* Account at the Bottom */}
      <section className="mt-auto border-t border-gray-700 pt-5">
        <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Account
        </h2>

        <nav className="space-y-1" aria-label="Account navigation">
          {renderLinks(accountLinks)}
        </nav>
      </section>
    </aside>
  );
}

export default Sidebar;