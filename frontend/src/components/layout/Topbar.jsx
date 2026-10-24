
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/applications?search=${encodeURIComponent(query)}`);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-[58px] w-full items-center justify-between gap-4 border-b border-slate-100 bg-white px-4 sm:px-6 lg:px-7">
      {/* Current section */}
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-violet-700 text-white">
          <span className="text-[11px] font-bold">↗</span>
        </span>

        <h2 className="truncate text-[11px] font-bold text-slate-800">
          Application Pipeline
        </h2>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        role="search"
        className="mx-auto hidden min-w-0 max-w-[430px] flex-1 md:block"
      >
        <label htmlFor="dashboard-search" className="sr-only">
          Search companies, roles, or application stages
        </label>

        <div className="flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 transition focus-within:border-violet-200 focus-within:bg-violet-50/40">
          <Search size={15} className="shrink-0 text-slate-400" />

          <input
            id="dashboard-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search companies, roles, stages... (⌘K)"
            className="w-full min-w-0 bg-transparent text-[11px] text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </form>

      {/* Header actions */}
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50 hover:text-violet-700"
        >
          <Bell size={16} />

          <span className="absolute right-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-violet-600 ring-2 ring-white" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/applications/new")}
          className="inline-flex h-[32px] items-center gap-1.5 rounded-lg bg-violet-700 px-3 text-[11px] font-semibold text-white shadow-sm transition hover:bg-violet-800"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Open user profile"
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-cyan-50 text-[11px] font-bold text-violet-800 transition hover:ring-2 hover:ring-violet-100"
        >
          <span>AK</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
