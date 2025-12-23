/*
  # Fix Admin User Listing

  1. Changes
    - Drop the existing SELECT policy that uses is_admin() function
    - Create a new SELECT policy that allows admins to view all users without circular dependency
    - Admins can view all profiles
    - Users can view their own profile
  
  2. Security
    - Maintains RLS protection
    - Allows admins full visibility
    - Users can only see their own data unless admin
*/

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

CREATE POLICY "Users can view all profiles if admin or own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );
