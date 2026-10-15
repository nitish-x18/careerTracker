function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">CareerTracker</h1>

      <nav className="space-y-3">
        <a href="/dashboard" className="block hover:text-blue-400">
          Dashboard
        </a>

        <a href="/applications" className="block hover:text-blue-400">
          My Applications
        </a>

        <a href="/priority-queue" className="block hover:text-blue-400">
          Priority Queue
        </a>

        <a href="/resume-match" className="block hover:text-blue-400">
          Resume Match
        </a>

        <a href="/eligibility" className="block hover:text-blue-400">
          Eligibility
        </a>

        <a href="/job-search" className="block hover:text-blue-400">
          Job Search
        </a>

        <a href="/timeline" className="block hover:text-blue-400">
          Timeline
        </a>

        <a href="/profile" className="block hover:text-blue-400">
          Profile
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;