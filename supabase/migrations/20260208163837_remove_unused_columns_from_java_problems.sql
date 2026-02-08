/*
  # Remove Unused Columns from java_problems

  ## Changes
  This migration removes columns from the `java_problems` table that are not used in the application:
  
  1. Columns Removed
    - `input` - Previously stored but never displayed or used in the UI
    - `output` - Previously stored but never displayed or used in the UI
    - `solution` - Legacy duplicate of `solution_code`, maintained for backward compatibility but no longer needed
  
  2. Impact
    - These columns are safely removed as they are not referenced in the application code
    - The `solution_code` column continues to store the solution code
    - All other problem data remains unchanged
  
  ## Notes
  - This is a safe operation as these columns were never used in the application logic
  - Data in these columns will be permanently deleted
  - The migration uses `IF EXISTS` to prevent errors if columns were already removed
*/

-- Drop unused columns from java_problems table
DO $$
BEGIN
  -- Drop input column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'input'
  ) THEN
    ALTER TABLE java_problems DROP COLUMN input;
  END IF;

  -- Drop output column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'output'
  ) THEN
    ALTER TABLE java_problems DROP COLUMN output;
  END IF;

  -- Drop solution column if it exists (legacy duplicate of solution_code)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'solution'
  ) THEN
    ALTER TABLE java_problems DROP COLUMN solution;
  END IF;
END $$;
