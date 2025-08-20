import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('🧪 Testing database connection...')
  console.warn('⚠️ Supabase環境変数が設定されていません。モックモードで動作します。')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// サーバーサイド用（管理者権限）
export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

// データベース接続テスト
export async function testDatabaseConnection() {
  if (!supabase) {
    return { connected: false, message: 'Supabase not configured' }
  }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return { connected: false, error: error.message }
    }
    
    return { connected: true, message: 'Database connected successfully' }
  } catch (error) {
    console.error('Database test failed:', error)
    return { connected: false, error: error.message }
  }
}

// ユーザー管理機能
export async function createUser(userData) {
  if (!supabase) return { data: null, error: 'Database not available' }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        name: userData.name,
        google_id: userData.google_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating user:', error)
    return { data: null, error: error.message }
  }
}

export async function getUserByEmail(email) {
  if (!supabase) return { data: null, error: 'Database not available' }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error getting user:', error)
    return { data: null, error: error.message }
  }
}

export async function updateUser(userId, updates) {
  if (!supabase) return { data: null, error: 'Database not available' }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating user:', error)
    return { data: null, error: error.message }
  }
}

// Instagram接続管理
export async function saveInstagramConnection(connectionData) {
  if (!supabase) return { data: null, error: 'Database not available' }
  
  try {
    const { data, error } = await supabase
      .from('instagram_connections')
      .upsert([{
        user_id: connectionData.user_id,
        instagram_user_id: connectionData.instagram_user_id,
        access_token: connectionData.access_token,
        username: connectionData.username,
        followers_count: connectionData.followers_count,
        connected_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error saving Instagram connection:', error)
    return { data: null, error: error.message }
  }
}

export async function getInstagramConnection(userId) {
  if (!supabase) return { data: null, error: 'Database not available' }
  
  try {
    const { data, error } = await supabase
      .from('instagram_connections')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error getting Instagram connection:', error)
    return { data: null, error: error.message }
  }
}

// 投稿データ管理
export async function savePostData(postData) {
  if (!supabase) return { data: null, error: 'Database not available' }
  
  try {
    const { data, error } = await supabase
      .from('posts_data')
      .upsert([{
        instagram_user_id: postData.instagram_user_id,
        post_id: postData.post_id,
        caption: postData.caption,
        media_type: postData.media_type,
        timestamp: postData.timestamp,
        data_24h: postData.data_24h,
        data_7d: postData.data_7d,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error saving post data:', error)
    return { data: null, error: error.message }
  }
}

export async function getPostsData(instagramUserId, limit = 50) {
  if (!supabase) return { data: [], error: 'Database not available' }
  
  try {
    const { data, error } = await supabase
      .from('posts_data')
      .select('*')
      .eq('instagram_user_id', instagramUserId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error getting posts data:', error)
    return { data: [], error: error.message }
  }
}

// フォロワー履歴管理
export async function saveFollowerHistory(historyData) {
  if (!supabase) return { data: null, error: 'Database not available' }
  
  try {
    const { data, error } = await supabase
      .from('follower_history')
      .upsert([{
        instagram_user_id: historyData.instagram_user_id,
        date: historyData.date,
        followers_count: historyData.followers_count,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error saving follower history:', error)
    return { data: null, error: error.message }
  }
}

export async function getFollowerHistory(instagramUserId, days = 30) {
  if (!supabase) return { data: [], error: 'Database not available' }
  
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('follower_history')
      .select('*')
      .eq('instagram_user_id', instagramUserId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true })
    
    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error getting follower history:', error)
    return { data: [], error: error.message }
  }
}