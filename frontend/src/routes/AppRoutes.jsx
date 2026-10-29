import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyApplications from "../pages/MyApplications";

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
        {/* Dashboard */}
        <Route
  path="/dashboard"
  element={
    <MainLayout>
      <Dashboard />
    </MainLayout>
  }
/>

        {/* My Applications */}
        <Route
  path="/applications"
  element={
    <MainLayout>
      <MyApplications />
    </MainLayout>
  }
/>

        {/* Priority Queue */}
        <Route
          path="/priority-queue"
          element={
            <MainLayout>
              <PriorityQueue />
            </MainLayout>
          }
        />

        {/* Resume Match */}
        <Route
          path="/resume-match"
          element={
            <MainLayout>
              <ResumeMatch />
            </MainLayout>
          }
        />

        {/* Eligibility Checker */}
        <Route
          path="/eligibility"
          element={
            <MainLayout>
              <EligibilityChecker />
            </MainLayout>
          }
        />

        {/* Job & Internship Search */}
        {/* Support the existing sidebar route too */}
<Route
  path="/job-search"
  element={
    <MainLayout>
      <h1 className="text-3xl font-bold">Job & Internship Search</h1>
      <p className="mt-2 text-slate-600">
        This page is under development.
      </p>
    </MainLayout>
  }
/>
        
        {/* Application Timeline */}
        <Route
          path="/timeline"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">Timeline</h1>
            </MainLayout>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <MainLayout>
              <h1 className="text-3xl font-bold">Settings</h1>
            </MainLayout>
          }
        />

        {/* User Profile */}
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