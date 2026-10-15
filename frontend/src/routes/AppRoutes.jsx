import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<h1>Landing Page</h1>} />
      <Route path="/login" element={<h1>Login Page</h1>} />
      <Route path="/register" element={<h1>Register Page</h1>} />

      {/* Protected/App pages */}
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
        path="/job-search"
        element={
          <MainLayout>
            <h1 className="text-3xl font-bold">Job Search</h1>
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
    </Routes>
  );
}

export default AppRoutes;