import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import JobAndIntern from "../pages/JobAndIntern";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Pages */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </MainLayout>
          }
        />

        <Route
          path="/applications"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">My Applications</h1>
            </MainLayout>
          }
        />

        <Route
          path="/priority-queue"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">Priority Queue</h1>
            </MainLayout>
          }
        />

        <Route
          path="/resume-match"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">Resume Match</h1>
            </MainLayout>
          }
        />

        <Route
          path="/eligibility"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">Eligibility</h1>
            </MainLayout>
          }
        />

        <Route
          path="/job-intern"
          element={
            <MainLayout>
              <JobAndIntern />
            </MainLayout>
          }
        />

        <Route
          path="/timeline"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">Timeline</h1>
            </MainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">Profile</h1>
            </MainLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
