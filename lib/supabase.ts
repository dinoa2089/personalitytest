/**
 * Supabase client configuration
 * Will be initialized with environment variables
 * Note: Supabase is optional - the app works with mock data if not configured
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only log in development mode, and make it clear it's optional
if (process.env.NODE_ENV === "development" && (!supabaseUrl || !supabaseAnonKey)) {
  console.info(
    "ℹ️ Supabase not configured - using mock data. This is fine for development! " +
    "To use Supabase, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
}

// Create Supabase client only if credentials are provided
// Otherwise create a dummy client that will fail gracefully
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient(
      "https://placeholder.supabase.co",
      "placeholder-key",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

