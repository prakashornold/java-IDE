/*
  # Add User Profile Fields

  ## Changes
  This migration adds user profile fields to support personalization:
  
  1. New Columns Added to `user_profiles` table
    - `first_name` (text) - User's first name
    - `last_name` (text) - User's last name  
    - `avatar_url` (text) - URL to user's profile picture
  
  2. Column Properties
    - All fields are optional (nullable)
    - No default values specified to allow users to set their own
    - Supports user profile customization and personalization
  
  ## Notes
  - Uses IF NOT EXISTS to prevent errors if columns already exist
  - Existing user data is preserved
  - Fields can be populated during signup or updated later by users
*/

-- Add first_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN first_name text;
  END IF;
END $$;

-- Add last_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_name text;
  END IF;
END $$;

-- Add avatar_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN avatar_url text;
  END IF;
END $$;
