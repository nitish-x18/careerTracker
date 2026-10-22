USE careerTracker_db;

-- 1. Confirm the tables
SHOW TABLES;

SELECT COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_type = 'BASE TABLE';

-- 2. Inspect all columns
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY
FROM information_schema.columns
WHERE table_schema = DATABASE()
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- 3. Inspect foreign-key relationships
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.key_column_usage
WHERE TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, COLUMN_NAME;

-- 4. Test the job-company-skill relationship
SELECT
    j.title AS job_title,
    c.name AS company_name,
    s.name AS skill_name,
    js.required
FROM jobs j
LEFT JOIN companies c ON j.company_id = c.id
LEFT JOIN job_skills js ON js.job_id = j.id
LEFT JOIN skills s ON s.id = js.skill_id
ORDER BY j.title
LIMIT 20;

-- 5. Test the user-application-job-resume relationship
SELECT
    u.name AS user_name,
    j.title AS job_title,
    r.version AS resume_version,
    a.status,
    a.priority_level,
    a.match_score
FROM applications a
JOIN users u ON a.user_id = u.id
LEFT JOIN jobs j ON a.job_id = j.id
LEFT JOIN resumes r ON a.resume_id = r.id
LIMIT 20;

-- 6. Check for applications with invalid references
-- Expected: 0 for each result
SELECT 'applications_missing_user' AS check_name, COUNT(*) AS problem_count
FROM applications a
LEFT JOIN users u ON a.user_id = u.id
WHERE a.user_id IS NOT NULL AND u.id IS NULL

UNION ALL

SELECT 'applications_missing_job', COUNT(*)
FROM applications a
LEFT JOIN jobs j ON a.job_id = j.id
WHERE a.job_id IS NOT NULL AND j.id IS NULL

UNION ALL

SELECT 'applications_missing_resume', COUNT(*)
FROM applications a
LEFT JOIN resumes r ON a.resume_id = r.id
WHERE a.resume_id IS NOT NULL AND r.id IS NULL;

-- 7. Inspect indexes
SELECT
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE,
    SEQ_IN_INDEX
FROM information_schema.statistics
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;