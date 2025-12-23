/*
  # Fix Admin RLS Infinite Recursion

  1. Changes
    - Create a SECURITY DEFINER function to check admin status without RLS
    - Update SELECT policy to use the new function
    - This prevents infinite recursion when admins query user_profiles
  
  2. Security
    - Function bypasses RLS (SECURITY DEFINER) but only returns boolean
    - Admins can view all profiles
    - Users can only view their own profile
*/

DROP POLICY IF EXISTS "Users can view all profiles if admin or own profile" ON user_profiles;

CREATE OR REPLACE FUNCTION check_is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM user_profiles WHERE id = user_id LIMIT 1),
    false
  );
$$;

CREATE POLICY "Users can view profiles based on admin status"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    check_is_admin(auth.uid()) = true
  );
