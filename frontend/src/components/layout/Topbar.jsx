import { Link, useNavigate } from "react-router-dom";
import { removeAuthToken } from "../../services/auth";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-xl font-semibold text-gray-800">
        CareerTracker
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Welcome</span>

        <Link
          to="/profile"
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Profile
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;