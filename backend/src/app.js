import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import userProfileRoutes from "./routes/userProfile.route.js";
import userPreferenceRoutes from "./routes/userPreference.route.js";
import applicationRoutes from "./routes/application.route.js";

// Middleware
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// 1. Global middleware
app.use(
    cors({
        origin: "http://localhost:5173",
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

// 4. API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/preferences", userPreferenceRoutes);
app.use("/api/applications", applicationRoutes);

// 5. Handle unknown routes (must come after all routes)
app.use(notFoundMiddleware);

// 6. Centralized error handler (must be last)
app.use(errorMiddleware);

export default app;