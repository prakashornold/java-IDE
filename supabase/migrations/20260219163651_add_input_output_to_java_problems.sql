/*
  # Add input and output columns to java_problems

  1. Changes
    - Add `input` column (text, nullable) - stores sample input for the problem
    - Add `output` column (text, nullable) - stores expected output for the problem

  2. Notes
    - Both columns are optional (nullable) to maintain backward compatibility with existing problems
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'input'
  ) THEN
    ALTER TABLE java_problems ADD COLUMN input text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'output'
  ) THEN
    ALTER TABLE java_problems ADD COLUMN output text;
  END IF;
END $$;
