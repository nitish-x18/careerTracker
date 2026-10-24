
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-44 flex min-h-screen min-w-0 flex-col sm:ml-48 lg:ml-40 xl:ml-44">
        <Topbar />

        {/* Current Page Content */}
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

