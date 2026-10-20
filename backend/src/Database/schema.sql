-- CareerTrack Database Schema
-- Database: careerTracker_db

CREATE DATABASE IF NOT EXISTS careerTracker_db;
USE careerTracker_db;

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    auth_provider ENUM('email', 'google') NOT NULL DEFAULT 'email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id CHAR(36) PRIMARY KEY,
    university VARCHAR(160),
    degree VARCHAR(80),
    major VARCHAR(120),
    cgpa DECIMAL(3,2),
    grad_year SMALLINT,
    work_auth VARCHAR(80),
    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- 3. USER PREFERENCES
CREATE TABLE IF NOT EXISTS user_preferences (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    career_stage ENUM('student', 'fresher', 'experienced'),
    career_goal ENUM('job', 'internship', 'higher_studies'),
    education_level VARCHAR(80),
    academic_year VARCHAR(40),
    work_mode ENUM('remote', 'hybrid', 'onsite'),
    preferred_location VARCHAR(160),
    skills JSON,
    onboarding_completed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_preferences_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- 4. COMPANIES
CREATE TABLE IF NOT EXISTS companies (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    location VARCHAR(160)
);

-- 5. JOBS
CREATE TABLE IF NOT EXISTS jobs (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36),
    title VARCHAR(200) NOT NULL,
    type VARCHAR(40),
    season VARCHAR(40),
    location VARCHAR(160),
    pay VARCHAR(80),
    deadline DATE,
    min_cgpa DECIMAL(3,2),
    work_auth_req VARCHAR(80),
    source_url VARCHAR(500),
    CONSTRAINT fk_jobs_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE SET NULL
);

-- 6. SKILLS
CREATE TABLE IF NOT EXISTS skills (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 7. JOB SKILLS
CREATE TABLE IF NOT EXISTS job_skills (
    job_id CHAR(36),
    skill_id CHAR(36),
    required TINYINT(1) DEFAULT 1,
    PRIMARY KEY (job_id, skill_id),
    CONSTRAINT fk_job_skills_job
        FOREIGN KEY (job_id) REFERENCES jobs(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_job_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id)
        ON DELETE CASCADE
);

-- 8. RESUMES
CREATE TABLE IF NOT EXISTS resumes (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    file_url VARCHAR(500),
    version VARCHAR(20),
    ats_score DECIMAL(5,2),
    CONSTRAINT fk_resumes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- 9. RESUME SKILLS
CREATE TABLE IF NOT EXISTS resume_skills (
    resume_id CHAR(36),
    skill_id CHAR(36),
    verified TINYINT(1) DEFAULT 0,
    PRIMARY KEY (resume_id, skill_id),
    CONSTRAINT fk_resume_skills_resume
        FOREIGN KEY (resume_id) REFERENCES resumes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_resume_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id)
        ON DELETE CASCADE
);

-- 10. APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    job_id CHAR(36),
    resume_id CHAR(36),
    status ENUM(
        'saved', 'applied', 'interview',
        'offer', 'rejected', 'withdrawn'
    ) DEFAULT 'saved',
    priority_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    match_score DECIMAL(5,2),
    priority_score DECIMAL(5,2),
    applied_date DATE,
    deadline DATETIME,
    notes TEXT,
    CONSTRAINT fk_applications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_applications_job
        FOREIGN KEY (job_id) REFERENCES jobs(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_applications_resume
        FOREIGN KEY (resume_id) REFERENCES resumes(id)
        ON DELETE SET NULL
);

-- 11. APPLICATION EVENTS
CREATE TABLE IF NOT EXISTS application_events (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36),
    event_type VARCHAR(60),
    scheduled_at DATETIME,
    details TEXT,
    CONSTRAINT fk_application_events_application
        FOREIGN KEY (application_id) REFERENCES applications(id)
        ON DELETE CASCADE
);

-- 12. TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    application_id CHAR(36),
    title VARCHAR(200) NOT NULL,
    est_mins SMALLINT,
    done TINYINT(1) DEFAULT 0,
    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tasks_application
        FOREIGN KEY (application_id) REFERENCES applications(id)
        ON DELETE SET NULL
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    application_id CHAR(36),
    type VARCHAR(60),
    due_at DATETIME,
    is_read TINYINT(1) DEFAULT 0,
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_notifications_application
        FOREIGN KEY (application_id) REFERENCES applications(id)
        ON DELETE SET NULL
);

-- 14. SAVED SEARCHES
CREATE TABLE IF NOT EXISTS saved_searches (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    filters JSON,
    CONSTRAINT fk_saved_searches_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- 15. SKILL GAPS
CREATE TABLE IF NOT EXISTS skill_gaps (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    skill_id CHAR(36),
    urgency ENUM('low', 'medium', 'high'),
    ats_boost SMALLINT,
    frequency_pct DECIMAL(5,2),
    CONSTRAINT fk_skill_gaps_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_skill_gaps_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id)
        ON DELETE CASCADE
);

-- 16. SPRINTS
CREATE TABLE IF NOT EXISTS sprints (
    id CHAR(36) PRIMARY KEY,
    skill_gap_id CHAR(36),
    title VARCHAR(200),
    est_hours DECIMAL(4,1),
    status ENUM('planned', 'in_progress', 'completed'),
    CONSTRAINT fk_sprints_skill_gap
        FOREIGN KEY (skill_gap_id) REFERENCES skill_gaps(id)
        ON DELETE CASCADE
);

-- VERIFY ALL TABLES
SHOW TABLES;

SELECT COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_type = 'BASE TABLE';

-- VERIFY FOREIGN KEYS
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, COLUMN_NAME;