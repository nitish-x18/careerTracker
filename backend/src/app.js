
import express from "express";
import cors from "cors";

// Existing routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import userProfileRoutes from "./routes/userProfile.route.js";
import userPreferenceRoutes from "./routes/userPreference.route.js";
import applicationRoutes from "./routes/application.route.js";

// New routes
import companyRoutes from "./routes/company.route.js";
import jobRoutes from "./routes/job.route.js";
import jobSkillRoutes from "./routes/jobSkill.route.js";
import skillRoutes from "./routes/skill.route.js";
import resumeRoutes from "./routes/resume.route.js";
import resumeSkillRoutes from "./routes/resumeSkill.route.js";
import skillGapRoutes from "./routes/skillGap.route.js";
import applicationEventRoutes from "./routes/applicationEvent.route.js";
import taskRoutes from "./routes/task.route.js";
import sprintRoutes from "./routes/sprint.route.js";
import notificationRoutes from "./routes/notification.route.js";
import savedSearchRoutes from "./routes/savedSearch.route.js";

// Middleware
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// 1. Global middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Root endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Smart Application Tracker API is running!",
    });
});

// 3. Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
    });
});

// 4. Existing API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/preferences", userPreferenceRoutes);
app.use("/api/applications", applicationRoutes);

// 5. New API routes
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobs", jobSkillRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/resumes", resumeSkillRoutes);
app.use("/api/skill-gaps", skillGapRoutes);
app.use("/api/applications", applicationEventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved-searches", savedSearchRoutes);

// 6. Handle unknown routes
app.use(notFoundMiddleware);

// 7. Centralized error handler (must be last)
app.use(errorMiddleware);

export default app;
