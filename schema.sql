-- Run this file to set up the database schema

CREATE DATABASE exam_prep;

\c exam_prep;

CREATE TABLE IF NOT EXISTS exam_date (
  id SERIAL PRIMARY KEY,
  exam_date DATE NOT NULL
);

-- Insert default exam date
INSERT INTO exam_date (exam_date) VALUES ('2026-06-15') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS monthly_plan (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed'))
);

CREATE TABLE IF NOT EXISTS weekly_schedule (
  id SERIAL PRIMARY KEY,
  day VARCHAR(20) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  hours NUMERIC(4,1) NOT NULL,
  completed BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS daily_tracker (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  topics_completed TEXT NOT NULL,
  study_hours NUMERIC(4,1) NOT NULL,
  difficult_topics TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS revision_tracker (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  first_revision BOOLEAN DEFAULT false,
  second_revision BOOLEAN DEFAULT false,
  final_revision BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS mock_tests (
  id SERIAL PRIMARY KEY,
  test_date DATE NOT NULL,
  subject VARCHAR(100) NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  weak_areas TEXT
);
