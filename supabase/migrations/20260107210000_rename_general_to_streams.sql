/*
  # Rename category from General to Streams

  1. Changes
    - Update all existing problems with category 'General' to 'Streams'
    - Update default value for category column to 'Streams'

  2. Notes
    - This aligns the database with the new naming convention
*/

-- Update existing problems from 'General' to 'Streams'
UPDATE java_problems 
SET category = 'Streams' 
WHERE category = 'General';

-- Update the default value for the category column
ALTER TABLE java_problems 
ALTER COLUMN category SET DEFAULT 'Streams';
