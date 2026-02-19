/*
  # Add admin DELETE policy for user_profiles

  ## Changes
  - Adds a DELETE policy on `user_profiles` allowing admins to delete any user profile

  ## Security
  - Only authenticated admins (checked via check_is_admin helper) can delete profiles
  - Regular users cannot delete any profile
*/

CREATE POLICY "Admins can delete user profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (check_is_admin(auth.uid()) = true);
