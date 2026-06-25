import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Surfaced clearly during dev if the .env file is missing.
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.')
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
})

export const isSupabaseConfigured = Boolean(url && anonKey)
