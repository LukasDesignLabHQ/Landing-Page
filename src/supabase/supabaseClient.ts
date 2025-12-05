
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tlfklimhsgxzpaehngwr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmtsaW1oc2d4enBhZWhuZ3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MTQ1NDYsImV4cCI6MjA4MDQ5MDU0Nn0.oDFo7DYKWnm_GTfD_MtYlpYMiVXYWI3CtFqksqrIJx4";

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);