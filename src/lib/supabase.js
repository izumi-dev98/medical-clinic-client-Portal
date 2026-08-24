import { createClient } from '@supabase/supabase-js'

const directSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseUrl = import.meta.env.PROD && typeof window !== 'undefined'
  ? `${window.location.origin}/supabase`
  : directSupabaseUrl

export const supabase = createClient(
  supabaseUrl,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
)

export const storageUrl = (bucket, path) =>
  path?.startsWith('cloudinary:')
    ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${path.slice('cloudinary:'.length)}`
    : `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
