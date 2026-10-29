
import { useState } from "react";
import { Search, Bell, Plus, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removeAuthToken } from "../../services/auth";
import CareerTrackLogo from "../common/CareerTrackLogo";

function Topbar({ onMenuClick }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/applications?search=${encodeURIComponent(query)}`);
    }
  }

  function handleLogout() {
    removeAuthToken();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-[60px] w-full min-w-0 items-center justify-between gap-2 border-b border-slate-100 bg-white px-3 sm:gap-4 sm:px-5 lg:px-7">
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          <Menu size={19} />
        </button>

        <div className="hidden shrink-0 sm:block">
          <CareerTrackLogo size={30} />
        </div>

        <h2 className="truncate text-sm font-bold text-slate-800">
          Application Pipeline
        </h2>
      </div>

      {/* Search: hidden on mobile to save space */}
      <form
        onSubmit={handleSearch}
        role="search"
        className="mx-auto hidden min-w-0 max-w-[430px] flex-1 md:block"
      >
        <label htmlFor="dashboard-search" className="sr-only">
          Search companies, roles, or application stages
        </label>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 transition focus-within:border-violet-200 focus-within:bg-violet-50/40">
          <Search size={16} className="shrink-0 text-slate-400" />

          <input
            id="dashboard-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search companies, roles, stages..."
            className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </form>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
  type="button"
  aria-label="Notifications unavailable"
  title="Notifications are not available yet"
  disabled
  className="relative flex h-8 w-8 shrink-0 cursor-not-allowed items-center justify-center rounded-lg text-slate-400 sm:h-9 sm:w-9"
>
  <Bell size={17} />
</button>

        <button
          type="button"
          onClick={() => navigate("/applications")}
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-violet-700 px-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-800 sm:h-9 sm:gap-1.5 sm:px-3"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Open user profile"
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-cyan-50 text-xs font-bold text-violet-800 transition hover:ring-2 hover:ring-violet-100 sm:h-9 sm:w-9"
        >
          <span>AK</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:h-9 sm:w-auto sm:gap-2 sm:px-2"
        >
          <LogOut size={17} />
          <span className="hidden text-xs font-medium sm:inline">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;


