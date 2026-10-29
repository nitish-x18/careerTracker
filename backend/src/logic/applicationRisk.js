
const ACTIVE_STATUSES = new Set(["saved", "applied", "interview"]);
const CLOSED_STATUSES = new Set(["offer", "rejected", "withdrawn"]);

function getDaysRemaining(deadline, today = new Date()) {
    if (deadline == null || deadline === "") {
        return null;
    }

    const deadlineDate = new Date(deadline);

    if (!Number.isFinite(deadlineDate.getTime())) {
        return null;
    }

    const dueDate = Date.UTC(
        deadlineDate.getUTCFullYear(),
        deadlineDate.getUTCMonth(),
        deadlineDate.getUTCDate()
    );

    const currentDate = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
    );

    return Math.ceil((dueDate - currentDate) / 86400000);
}

function classifyApplicationRisk(application, today = new Date()) {
    if (!application || typeof application !== "object") {
        throw new Error("Application data is required");
    }

    const status = String(application.status ?? "").toLowerCase();

    if (!ACTIVE_STATUSES.has(status) && !CLOSED_STATUSES.has(status)) {
        throw new Error("Unsupported application status");
    }

    if (CLOSED_STATUSES.has(status)) {
        return {
            riskStatus: "Not Applicable",
            reason: "Application is in a closed status"
        };
    }

    const deadline = application.deadline ?? application.job_deadline ?? null;
    const daysRemaining = getDaysRemaining(deadline, today);

    if (daysRemaining === null) {
        return {
            riskStatus: "Needs Attention",
            reason: "Deadline is missing or invalid",
            daysRemaining: null
        };
    }

    if (status === "saved" && daysRemaining < 0) {
        return {
            riskStatus: "At Risk",
            reason: "Saved application deadline has passed",
            daysRemaining
        };
    }

    if (daysRemaining <= 3) {
        return {
            riskStatus: "Needs Attention",
            reason: "Deadline is within 3 days or has passed",
            daysRemaining
        };
    }

    return {
        riskStatus: "On Track",
        reason: "Deadline is more than 3 days away",
        daysRemaining
    };
}

export { getDaysRemaining, classifyApplicationRisk };
