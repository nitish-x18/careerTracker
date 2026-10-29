
import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../services/auth";

const DEV_DASHBOARD_PREVIEW = import.meta.env.DEV;

function ProtectedRoute() {
  const token = getAuthToken();

  if (!token && !DEV_DASHBOARD_PREVIEW) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
