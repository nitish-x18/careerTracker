
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white text-slate-800">
      {/* Shared sidebar */}
      <Sidebar />

      {/* Main workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Shared topbar */}
        <Topbar />

        {/* Current page content */}
        <main className="min-w-0 flex-1 bg-white px-4 py-4 sm:px-5 lg:px-6">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
