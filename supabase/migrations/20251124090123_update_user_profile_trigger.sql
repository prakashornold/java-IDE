/*
  # Update User Profile Trigger to Parse Google OAuth Data Correctly

  1. Changes
    - Update handle_new_user() function to parse full_name from Google OAuth
    - Split full_name into first_name and last_name
    - Handle cases where only full_name is available (no separate given_name/family_name)
  
  2. Notes
    - Google OAuth provides 'full_name' field, not 'given_name' and 'family_name'
    - Function will split full_name by first space to get first_name and last_name
    - If no space exists, the entire name goes to first_name
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function to handle Google OAuth data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_full_name text;
  v_first_name text;
  v_last_name text;
  v_space_pos integer;
BEGIN
  -- Get full_name from metadata
  v_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name'
  );
  
  -- Try to split full_name into first and last name
  IF v_full_name IS NOT NULL THEN
    v_space_pos := POSITION(' ' IN v_full_name);
    IF v_space_pos > 0 THEN
      v_first_name := SUBSTRING(v_full_name FROM 1 FOR v_space_pos - 1);
      v_last_name := SUBSTRING(v_full_name FROM v_space_pos + 1);
    ELSE
      v_first_name := v_full_name;
      v_last_name := NULL;
    END IF;
  ELSE
    -- Fallback to separate fields if available
    v_first_name := new.raw_user_meta_data->>'given_name';
    v_last_name := new.raw_user_meta_data->>'family_name';
  END IF;

  -- Insert user profile
  INSERT INTO public.user_profiles (id, email, first_name, last_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    v_first_name,
    v_last_name,
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
