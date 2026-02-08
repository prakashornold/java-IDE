/*
  # Set Default Admin Email

  ## Changes
  This migration updates the user profile creation trigger to automatically grant admin privileges to a specific email address.
  
  1. Function Update
    - Modifies `handle_new_user()` function to check if the user's email matches the default admin email
    - If email is `omprakashornold@gmail.com`, sets `is_admin` to true automatically
    - All other users default to `is_admin` false
  
  ## Security
  - Admin privileges are granted only to the specified email address
  - No user input can bypass this check as it's enforced at the database level
  - The check happens during user creation, ensuring immediate admin access
  
  ## Notes
  - Existing users are not affected by this migration
  - Only new signups will trigger this logic
  - The default admin email is: omprakashornold@gmail.com
*/

-- Update function to automatically set admin for default email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, avatar_url, is_admin)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'given_name',
    new.raw_user_meta_data->>'family_name',
    new.raw_user_meta_data->>'avatar_url',
    CASE 
      WHEN new.email = 'omprakashornold@gmail.com' THEN true 
      ELSE false 
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
