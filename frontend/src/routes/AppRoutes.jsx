import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import PriorityQueue from "../pages/PriorityQueue";
import ResumeMatch from "../pages/ResumeMatch";
import EligibilityChecker from "../pages/EligibilityChecker";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<h1>Landing Page</h1>} />

      <Route path="/login" element={<h1>Login Page</h1>} />

      <Route path="/register" element={<h1>Register Page</h1>} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </MainLayout>
        }
      />

      {/* My Applications */}
      <Route
        path="/applications"
        element={
          <MainLayout>
            <h1 className="text-3xl font-bold">My Applications</h1>
          </MainLayout>
        }
      />

      {/* Priority Queue — Complete UI */}
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
      <Route
        path="/job-search"
        element={
          <MainLayout>
            <h1 className="text-3xl font-bold">
              Job &amp; Internship Search
            </h1>
          </MainLayout>
        }
      />

      {/* Application Timeline */}
      <Route
        path="/timeline"
        element={
          <MainLayout>
            <h1 className="text-3xl font-bold">Application Timeline</h1>
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
    </Routes>
  );
}

export default AppRoutes;