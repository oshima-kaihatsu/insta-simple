import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// クライアントサイド用
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// サーバーサイド用（管理者権限）
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ブラウザ用クライアント作成関数
export const createBrowserSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}