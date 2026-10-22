USE careerTracker_db;

-- Sample user
INSERT INTO users (id, name, email, password_hash, auth_provider)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    'Test User',
    'testuser@example.com',
    'sample_hash_not_a_real_password',
    'email'
);

-- Sample company
INSERT INTO companies (id, name, location)
VALUES (
    '22222222-2222-4222-8222-222222222222',
    'Test Company',
    'India'
);

-- Sample job
INSERT INTO jobs (
    id, company_id, title, type, season, location,
    pay, deadline, min_cgpa, work_auth_req, source_url
)
VALUES (
    '33333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222222',
    'Software Engineer Intern',
    'Internship',
    'Summer',
    'India',
    'INR 20000/month',
    '2027-03-31',
    7.00,
    'Authorized to work',
    'https://example.com/jobs'
);

-- Sample skill
INSERT INTO skills (id, name)
VALUES (
    '44444444-4444-4444-8444-444444444444',
    'Python'
);

-- Link the job to Python
INSERT INTO job_skills (job_id, skill_id, required)
VALUES (
    '33333333-3333-4333-8333-333333333333',
    '44444444-4444-4444-8444-444444444444',
    1
);

-- Sample resume
INSERT INTO resumes (id, user_id, file_url, version, ats_score)
VALUES (
    '55555555-5555-4555-8555-555555555555',
    '11111111-1111-4111-8111-111111111111',
    'https://example.com/test-resume.pdf',
    'v1',
    75.50
);

-- Link the resume to Python
INSERT INTO resume_skills (resume_id, skill_id, verified)
VALUES (
    '55555555-5555-4555-8555-555555555555',
    '44444444-4444-4444-8444-444444444444',
    1
);

-- Sample application
INSERT INTO applications (
    id, user_id, job_id, resume_id, status,
    priority_level, match_score, priority_score,
    applied_date, deadline, notes
)
VALUES (
    '66666666-6666-4666-8666-666666666666',
    '11111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    '55555555-5555-4555-8555-555555555555',
    'saved',
    'high',
    85.50,
    90.00,
    NULL,
    '2027-03-31 23:59:00',
    'Test application'
);

-- Sample user preferences
INSERT INTO user_preferences (
    id, user_id, career_stage, career_goal, education_level,
    academic_year, work_mode, preferred_location, skills,
    onboarding_completed
)
VALUES (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    '11111111-1111-4111-8111-111111111111',
    'student',
    'internship',
    'B.Tech',
    '3rd Year',
    'hybrid',
    'India',
    '["Python", "SQL", "Machine Learning"]',
    1
);