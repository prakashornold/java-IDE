/*
  # Add Admin and Blocked Status to User Profiles

  1. Changes
    - Add `is_admin` column to `user_profiles` table (boolean, default false)
    - Add `is_blocked` column to `user_profiles` table (boolean, default false)
    - Set omprakashornold@gmail.com as admin user
    - Update RLS policies to allow admins to manage users
  
  2. Security
    - Admins can view all user profiles
    - Admins can update user admin status and blocked status
    - Regular users can only view their own profile
*/

-- Add admin and blocked columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_admin boolean DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_blocked'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_blocked boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Set omprakashornold@gmail.com as admin
UPDATE user_profiles
SET is_admin = true
WHERE email = 'omprakashornold@gmail.com';

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create new policies that allow admin access
CREATE POLICY "Users can view own profile or admins can view all"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.is_admin = true
    )
  );

CREATE POLICY "Users can update own profile or admins can update all"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.is_admin = true
    )
  )
  WITH CHECK (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.is_admin = true
    )
  );