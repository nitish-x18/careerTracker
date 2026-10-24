import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;