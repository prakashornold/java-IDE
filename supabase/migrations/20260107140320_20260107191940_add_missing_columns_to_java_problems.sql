/*
  # Add missing columns to java_problems table

  1. Changes
    - Add `description` column (text, default: '')
    - Add `starter_code` column (text, default: '')
    - Add `solution_code` column (text, default: '')

  2. Notes
    - These columns align with the frontend form fields
    - Existing problems will get empty string as defaults
    - The original columns (input, solution) will be kept for backward compatibility
*/

-- Add description column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'description'
  ) THEN
    ALTER TABLE java_problems ADD COLUMN description text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Add starter_code column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'starter_code'
  ) THEN
    ALTER TABLE java_problems ADD COLUMN starter_code text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Add solution_code column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'solution_code'
  ) THEN
    ALTER TABLE java_problems ADD COLUMN solution_code text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Copy existing data from input to starter_code and solution to solution_code
UPDATE java_problems 
SET 
  starter_code = COALESCE(input, ''),
  solution_code = COALESCE(solution, '')
WHERE starter_code = '' OR solution_code = '';