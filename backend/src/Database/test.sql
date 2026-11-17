USE careerTracker_db;

-- 1. Confirm the tables
SHOW TABLES;

-- Expected: 16
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

-- 2b. Confirm the 4 job eligibility columns exist
-- Expected: 4 rows (required_degree, required_major, min_grad_year, max_grad_year)
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND TABLE_NAME = 'jobs'
  AND COLUMN_NAME IN ('required_degree', 'required_major', 'min_grad_year', 'max_grad_year')
ORDER BY ORDINAL_POSITION;

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

-- 4. Test the job-company-skill relationship (now with eligibility columns)
SELECT
    j.title AS job_title,
    c.name AS company_name,
    s.name AS skill_name,
    js.required,
    j.required_degree,
    j.required_major,
    j.min_grad_year,
    j.max_grad_year
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

-- 6b. Check job eligibility data
-- Expected: 0 for each result (the database does not enforce CHECK, so this query is the safety net)
SELECT 'jobs_bad_year_range' AS check_name, COUNT(*) AS problem_count
FROM jobs
WHERE min_grad_year > max_grad_year

UNION ALL

SELECT 'jobs_year_out_of_range', COUNT(*)
FROM jobs
WHERE min_grad_year NOT BETWEEN 1990 AND 2100
   OR max_grad_year NOT BETWEEN 1990 AND 2100;

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

-- 7b. Count the performance indexes
-- Expected: 10
SELECT COUNT(DISTINCT INDEX_NAME) AS idx_count
FROM information_schema.statistics
WHERE TABLE_SCHEMA = DATABASE()
  AND INDEX_NAME LIKE 'idx_%';

-- 8. Count the CHECK constraints
-- Expected: 12 (saved but not enforced on TiDB Cloud Serverless)
SELECT TABLE_NAME, CONSTRAINT_NAME
FROM information_schema.table_constraints
WHERE TABLE_SCHEMA = DATABASE()
  AND CONSTRAINT_TYPE = 'CHECK'
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- 9. Test eligibility matching for the sample user
-- Expected with seed_data.sql only: 1 row (Software Engineer Intern)
SELECT j.title, j.required_degree, j.required_major, j.min_grad_year, j.max_grad_year
FROM user_profiles p
JOIN jobs j
  ON (j.required_degree IS NULL OR j.required_degree = p.degree)
 AND (j.required_major  IS NULL OR j.required_major  = p.major)
 AND (j.min_grad_year   IS NULL OR p.grad_year >= j.min_grad_year)
 AND (j.max_grad_year   IS NULL OR p.grad_year <= j.max_grad_year)
WHERE p.user_id = '11111111-1111-4111-8111-111111111111';