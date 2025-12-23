/*
  # Add category column to java_problems table

  1. Changes
    - Add `category` column to `java_problems` table
      - Type: text
      - Default: 'General'
      - Not null
    - Add index on category for faster filtering

  2. Notes
    - Category helps organize problems by topic (e.g., Arrays, Strings, OOP, etc.)
    - Existing problems will get 'General' as default category
*/

-- Add category column to java_problems table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'java_problems' AND column_name = 'category'
  ) THEN
    ALTER TABLE java_problems ADD COLUMN category text NOT NULL DEFAULT 'General';
  END IF;
END $$;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_java_problems_category ON java_problems(category);