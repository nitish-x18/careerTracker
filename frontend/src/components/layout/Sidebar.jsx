
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ListChecks,
  FileSearch,
  GraduationCap,
  Search,
  Clock3,
  UserRound,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Applications", path: "/applications", icon: BriefcaseBusiness },
  { name: "Priority Queue", path: "/priority-queue", icon: ListChecks },
  { name: "Resume Match", path: "/resume-match", icon: FileSearch },
  { name: "Eligibility", path: "/eligibility", icon: GraduationCap },
  { name: "Job Search", path: "/job-intern", icon: Search },
  { name: "Timeline", path: "/timeline", icon: Clock3 },
  { name: "Profile", path: "/profile", icon: UserRound },
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5">
      {/* Brand */}
      <button
        onClick={() => navigate("/profile")}
        className="mb-8 flex items-center gap-3 rounded-xl px-2 text-left"
        title="Open profile"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-extrabold tracking-tight text-white shadow-sm">
          CT
        </span>
        <span>
          <span className="block text-base font-bold tracking-tight text-slate-900">
            CareerTracker
          </span>
          <span className="mt-0.5 block text-[11px] font-medium text-slate-500">
            Your career, organized.
          </span>
        </span>
      </button>

      {/* Navigation */}
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Workspace
      </p>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <ChevronRight size={15} className="text-indigo-500" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
        <div className="mb-2 flex items-center gap-2 text-indigo-700">
          <Sparkles size={16} />
          <span className="text-xs font-bold">Career goals</span>
        </div>
        <p className="text-xs leading-5 text-slate-600">
          Keep your applications and opportunities organized in one place.
        </p>
        <button
          onClick={() => navigate("/profile")}
          className="mt-3 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
        >
          View your profile →
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
