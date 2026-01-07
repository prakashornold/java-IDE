/*
  # Add hints column to java_problems table

  1. Changes
    - Add `hints` column (text, nullable)

  2. Notes
    - hints will store helpful tips for solving the problem
    - solution_code already maps to expected_output, so no new column needed
*/

-- Add hints column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'hints'
  ) THEN
    ALTER TABLE java_problems ADD COLUMN hints text;
  END IF;
END $$;
