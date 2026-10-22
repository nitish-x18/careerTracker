USE careerTracker_db;

-- Unique constraints
ALTER TABLE applications
    ADD CONSTRAINT uq_applications_user_job UNIQUE (user_id, job_id);

ALTER TABLE skills
    ADD CONSTRAINT uq_skills_name UNIQUE (name);

ALTER TABLE resumes
    ADD CONSTRAINT uq_resumes_user_version UNIQUE (user_id, version);

ALTER TABLE skill_gaps
    ADD CONSTRAINT uq_skill_gaps_user_skill UNIQUE (user_id, skill_id);

ALTER TABLE companies
    ADD CONSTRAINT uq_companies_name_location UNIQUE (name, location);

-- Check constraints
ALTER TABLE user_profiles
    ADD CONSTRAINT chk_user_profiles_cgpa
        CHECK (cgpa IS NULL OR (cgpa >= 0 AND cgpa <= 10)),
    ADD CONSTRAINT chk_user_profiles_grad_year
        CHECK (grad_year IS NULL OR (grad_year BETWEEN 1990 AND 2100));

ALTER TABLE jobs
    ADD CONSTRAINT chk_jobs_min_cgpa
        CHECK (min_cgpa IS NULL OR (min_cgpa >= 0 AND min_cgpa <= 10));

ALTER TABLE resumes
    ADD CONSTRAINT chk_resumes_ats_score
        CHECK (ats_score IS NULL OR (ats_score >= 0 AND ats_score <= 100));

ALTER TABLE applications
    ADD CONSTRAINT chk_applications_match_score
        CHECK (match_score IS NULL OR (match_score >= 0 AND match_score <= 100)),
    ADD CONSTRAINT chk_applications_priority_score
        CHECK (priority_score IS NULL OR (priority_score >= 0 AND priority_score <= 100));

ALTER TABLE skill_gaps
    ADD CONSTRAINT chk_skill_gaps_frequency
        CHECK (frequency_pct IS NULL OR (frequency_pct >= 0 AND frequency_pct <= 100));

ALTER TABLE tasks
    ADD CONSTRAINT chk_tasks_est_mins
        CHECK (est_mins IS NULL OR est_mins > 0);

ALTER TABLE sprints
    ADD CONSTRAINT chk_sprints_est_hours
        CHECK (est_hours IS NULL OR est_hours > 0);

-- Performance indexes
CREATE INDEX idx_jobs_location_type_deadline
    ON jobs (location, type, deadline);

CREATE INDEX idx_jobs_deadline
    ON jobs (deadline);

CREATE INDEX idx_applications_user_status
    ON applications (user_id, status);

CREATE INDEX idx_applications_deadline
    ON applications (deadline);

CREATE INDEX idx_notifications_user_read_due
    ON notifications (user_id, is_read, due_at);

CREATE INDEX idx_application_events_app_scheduled
    ON application_events (application_id, scheduled_at);

CREATE INDEX idx_tasks_user_done
    ON tasks (user_id, done);

CREATE INDEX idx_sprints_gap_status
    ON sprints (skill_gap_id, status);