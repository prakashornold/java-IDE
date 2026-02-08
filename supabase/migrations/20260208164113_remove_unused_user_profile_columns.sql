/*
  # Remove Unused User Profile Columns

  ## Changes
  This migration removes columns from the `user_profiles` table that are never used in the application:
  
  1. Columns Removed
    - `first_name` - Only populated from OAuth providers, but app uses email/password auth
    - `last_name` - Only populated from OAuth providers, but app uses email/password auth
    - `avatar_url` - Only populated from OAuth providers, but app uses email/password auth
  
  2. Impact
    - These columns are never populated since the application only uses email/password authentication
    - No profile editing UI exists to collect this information
    - UI components will be updated to remove references to these fields
  
  3. Functions Updated
    - The `handle_new_user()` trigger function will be simplified to only insert id and email
  
  ## Notes
  - This is a safe operation as these columns are never populated in the current authentication flow
  - Data in these columns will be permanently deleted
  - The migration uses `IF EXISTS` to prevent errors if columns were already removed
*/

-- Update the handle_new_user function to remove references to unused fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop unused columns from user_profiles table
DO $$
BEGIN
  -- Drop first_name column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE user_profiles DROP COLUMN first_name;
  END IF;

  -- Drop last_name column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE user_profiles DROP COLUMN last_name;
  END IF;

  -- Drop avatar_url column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE user_profiles DROP COLUMN avatar_url;
  END IF;
END $$;
