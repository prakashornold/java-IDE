/*
  # Simplify Difficulty Levels

  This migration updates the java_problems table to enforce only three difficulty levels:
  easy, medium, and hard.

  ## Changes
  
  1. Add check constraint to difficulty column
    - Only allows: 'easy', 'medium', 'hard'
    - Prevents any other difficulty values from being inserted
  
  ## Notes
  
  - This constraint will ensure data consistency going forward
  - Any existing data with different difficulty levels would need to be updated first
  - Since we just deleted all problems, this is a clean state
*/

-- Drop existing check constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'java_problems_difficulty_check'
  ) THEN
    ALTER TABLE java_problems DROP CONSTRAINT java_problems_difficulty_check;
  END IF;
END $$;

-- Add new check constraint for 3 difficulty levels
ALTER TABLE java_problems 
ADD CONSTRAINT java_problems_difficulty_check 
CHECK (difficulty IN ('easy', 'medium', 'hard'));