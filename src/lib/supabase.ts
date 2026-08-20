// ─── Supabase Client (browser / client-side) ─────────────────────────────────
// Uses VITE_SUPABASE_ANON_KEY — safe to expose to the browser.
// RLS policies ensure public users only read published content.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env["VITE_SUPABASE_URL"] as string) || "";
const supabaseAnonKey = (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string) || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
