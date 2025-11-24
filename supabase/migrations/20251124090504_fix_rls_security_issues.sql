/*
  # Fix RLS and Function Security Issues

  1. RLS Performance Optimization
    - Update all RLS policies to use (SELECT auth.uid()) instead of auth.uid()
    - This prevents re-evaluation for each row, improving performance at scale
  
  2. Function Security
    - Set explicit search_path for all functions to prevent search path manipulation
    - Use SET search_path = public, pg_temp for security
  
  3. Changes Made
    - Updated "Users can view own profile" policy
    - Updated "Users can insert own profile" policy  
    - Updated "Users can update own profile" policy
    - Fixed handle_new_user() function search path
    - Fixed handle_updated_at() function search path
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create optimized RLS policies with SELECT wrapper
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Update handle_new_user function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Update handle_updated_at function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger 
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
