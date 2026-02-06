/*
  # Drop notes and folders tables

  1. Removed Tables
    - `notes` - User notes with markdown content
    - `folders` - Folder organization for notes

  2. Security Changes
    - All RLS policies on `notes` and `folders` are removed along with the tables

  3. Notes
    - The entire notes feature is being removed from the application
    - Both tables and all associated policies, indexes, and triggers are dropped
*/

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;
