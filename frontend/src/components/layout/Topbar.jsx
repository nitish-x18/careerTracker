import { Search, Bell, Plus } from "lucide-react";
import CareerTrackLogo from "../common/CareerTrackLogo";

function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Application Pipeline */}
      <div className="flex items-center gap-3">
        <CareerTrackLogo size={28} />

        <h2 className="text-base font-semibold text-gray-800">
          Application Pipeline
        </h2>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 md:flex">
          <Search size={16} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search companies, roles, stages..."
            aria-label="Search companies, roles, and stages"
            className="w-64 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />

          <span className="text-xs text-gray-400">⌘K</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-gray-600 transition hover:text-indigo-600"
        >
          <Bell size={19} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Add Application */}
        <button
          type="button"
          className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Application
        </button>

        {/* Profile Avatar */}
        <button
          type="button"
          aria-label="User profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700"
        >
          K
        </button>
      </div>
    </header>
  );
}

export default Topbar;