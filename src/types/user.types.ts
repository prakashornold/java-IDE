/**
 * User profile data from the user_profiles table.
 * Single source of truth for user profile shape across the app.
 */
export interface UserProfile {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    is_admin: boolean;
    is_blocked: boolean;
    created_at?: string;
}
