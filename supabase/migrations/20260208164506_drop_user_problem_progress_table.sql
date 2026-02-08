/*
  # Drop User Problem Progress Table

  ## Changes
  This migration removes the user problem progress tracking feature from the database:
  
  1. Tables Dropped
    - `user_problem_progress` - Tracks which problems users have solved and attempted
  
  2. Impact
    - All user progress data will be permanently deleted
    - The application will no longer track solved problems or attempts
    - Admin panel will no longer display solved/attempts statistics
  
  3. Related Objects Removed
    - All RLS policies on user_problem_progress table
    - All indexes on user_problem_progress table
    - Update trigger on user_problem_progress table
  
  ## Notes
  - This is a destructive operation that permanently deletes all user progress data
  - The migration uses IF EXISTS to prevent errors if the table was already removed
*/

-- Drop the user_problem_progress table and all related objects
DROP TABLE IF EXISTS user_problem_progress CASCADE;
