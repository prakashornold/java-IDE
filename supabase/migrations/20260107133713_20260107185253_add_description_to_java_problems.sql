/*
  # Add description column to java_problems table

  1. Changes
    - Add `description` column to `java_problems` table
      - Type: text
      - Default: ''
      - Not null

  2. Notes
    - Description helps provide detailed problem descriptions
    - Existing problems will get empty string as default description
*/

-- Add description column to java_problems table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'description'
  ) THEN
    ALTER TABLE java_problems ADD COLUMN description text NOT NULL DEFAULT '';
  END IF;
END $$;