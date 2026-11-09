
import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import MyApplications from "../pages/MyApplications";
import JobAndIntern from "../pages/JobAndIntern";

import PriorityQueue from "../pages/PriorityQueue";
import ResumeMatch from "../pages/ResumeMatch";
import EligibilityChecker from "../pages/EligibilityChecker";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Pages */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/applications"
          element={
            <MainLayout>
              <MyApplications />
            </MainLayout>
          }
        />

        <Route
          path="/priority-queue"
          element={
            <MainLayout>
              <PriorityQueue />
            </MainLayout>
          }
        />

        <Route
          path="/job-search"
          element={
            <MainLayout>
              <JobAndIntern />
            </MainLayout>
          }
        />

        <Route
          path="/resume-match"
          element={
            <MainLayout>
              <ResumeMatch />
            </MainLayout>
          }
        />

        <Route
          path="/eligibility"
          element={
            <MainLayout>
              <EligibilityChecker />
            </MainLayout>
          }
        />

        <Route
          path="/timeline"
          element={
            <MainLayout>
              <h1 className="text-2xl font-bold">
                Application Timeline
              </h1>
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <h1 className="text-2xl font-bold">
                Settings
              </h1>
            </MainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
