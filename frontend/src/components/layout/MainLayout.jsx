

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      
<div
  className={`fixed inset-y-0 left-0 z-50 w-[220px] transform transition-transform duration-200 md:translate-x-0 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  <Sidebar onNavigate={() => setSidebarOpen(false)} />
</div>


      {/* Main content */}
      <div className="flex min-h-screen min-w-0 flex-col md:ml-[220px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-w-0 flex-1 bg-white px-3 py-4 sm:px-5 lg:px-6">
          <div className="mx-auto w-full max-w-[1600px] min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
