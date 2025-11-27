/*
  # Create User Problem Progress Table

  1. New Tables
    - `user_problem_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, not null)
      - `problem_id` (uuid, references java_problems, not null)
      - `completed` (boolean, default false)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    - Unique constraint on (user_id, problem_id) to prevent duplicates

  2. Security
    - Enable RLS on `user_problem_progress` table
    - Add policy for authenticated users to read their own progress
    - Add policy for authenticated users to insert their own progress
    - Add policy for authenticated users to update their own progress

  3. Indexes
    - Create index on user_id for faster queries
    - Create index on problem_id for faster queries
    - Create index on completed for filtering
*/

-- Create user_problem_progress table
CREATE TABLE IF NOT EXISTS user_problem_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES java_problems(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_user_id ON user_problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_problem_id ON user_problem_progress(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_completed ON user_problem_progress(completed);

-- Enable Row Level Security
ALTER TABLE user_problem_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own progress"
  ON user_problem_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_problem_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_problem_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER on_user_problem_progress_updated
  BEFORE UPDATE ON user_problem_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
