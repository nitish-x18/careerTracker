USE careerTracker_db;

ALTER TABLE jobs
    ADD COLUMN required_degree VARCHAR(100) NULL,
    ADD COLUMN required_major VARCHAR(100) NULL,
    ADD COLUMN min_grad_year SMALLINT NULL,
    ADD COLUMN max_grad_year SMALLINT NULL;