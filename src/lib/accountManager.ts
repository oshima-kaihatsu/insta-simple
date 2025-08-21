// src/lib/accountManager.ts
import { supabaseAdmin } from './supabase';

export interface UserAccount {
  id: number;
  google_user_id: string;
  google_email: string;
  google_name?: string;
  plan_type: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface InstagramConnection {
  id: number;
  user_account_id: number;
  instagram_user_id: string;
  instagram_username?: string;
  access_token: string;
  token_expires_at?: string;
  followers_count: number;
  media_count: number;
  account_type: string;
  connected_at: string;
  last_sync_at?: string;
  is_active: boolean;
}

export interface PlanLimit {
  id: number;
  plan_type: string;
  max_instagram_accounts: number;
  max_monthly_requests: number;
  features: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AccountCheckResult {
  canConnect: boolean;
  errorMessage?: string;
  currentConnections: number;
  maxConnections: number;
  planType: string;
}

/**
 * ユーザーアカウントを取得または作成
 */
export async function getOrCreateUserAccount(
  googleUserId: string,
  googleEmail: string,
  googleName?: string
): Promise<UserAccount> {
  try {
    // 既存ユーザーを検索
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('user_accounts')
      .select('*')
      .eq('google_user_id', googleUserId)
      .eq('is_active', true)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = レコードが見つからない
      throw new Error(`Failed to fetch user: ${fetchError.message}`);
    }

    if (existingUser) {
      // 最終ログイン時刻を更新
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('user_accounts')
        .update({ 
          last_login: new Date().toISOString(),
          google_email: googleEmail, // メールアドレスを最新に更新
          google_name: googleName || existingUser.google_name
        })
        .eq('id', existingUser.id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Failed to update last login:', updateError);
        return existingUser; // 更新失敗でも既存ユーザーを返す
      }

      return updatedUser;
    }

    // 新規ユーザーを作成
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('user_accounts')
      .insert({
        google_user_id: googleUserId,
        google_email: googleEmail,
        google_name: googleName,
        plan_type: 'basic', // デフォルトプラン
        last_login: new Date().toISOString(),
        is_active: true
      })
      .select('*')
      .single();

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    console.log('✅ New user created:', { id: newUser.id, email: googleEmail });
    return newUser;

  } catch (error) {
    console.error('Error in getOrCreateUserAccount:', error);
    throw error;
  }
}

/**
 * プラン制限を取得
 */
export async function getPlanLimit(planType: string): Promise<PlanLimit> {
  try {
    const { data, error } = await supabaseAdmin
      .from('plan_limits')
      .select('*')
      .eq('plan_type', planType)
      .single();

    if (error) {
      throw new Error(`Failed to fetch plan limit: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching plan limit:', error);
    // デフォルト制限を返す
    return {
      id: 0,
      plan_type: planType,
      max_instagram_accounts: 1,
      max_monthly_requests: 1000,
      features: { analytics: true, export: true, ai_comments: false },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

/**
 * 現在のInstagram接続数を取得
 */
export async function getCurrentInstagramConnections(userId: number): Promise<InstagramConnection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('instagram_connections')
      .select('*')
      .eq('user_account_id', userId)
      .eq('is_active', true);

    if (error) {
      throw new Error(`Failed to fetch Instagram connections: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching Instagram connections:', error);
    return [];
  }
}

/**
 * Instagramアカウントの重複チェック
 */
export async function checkInstagramDuplicate(instagramUserId: string): Promise<InstagramConnection | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('instagram_connections')
      .select('*')
      .eq('instagram_user_id', instagramUserId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // レコードが見つからない以外のエラー
      throw new Error(`Failed to check Instagram duplicate: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error('Error checking Instagram duplicate:', error);
    return null;
  }
}

/**
 * アカウント接続可能性をチェック
 */
export async function checkAccountLimits(
  googleUserId: string,
  instagramUserId: string,
  googleEmail: string,
  googleName?: string
): Promise<AccountCheckResult> {
  try {
    // 1. ユーザーアカウントを取得または作成
    const userAccount = await getOrCreateUserAccount(googleUserId, googleEmail, googleName);

    // 2. プラン制限を取得
    const planLimit = await getPlanLimit(userAccount.plan_type);

    // 3. 現在の接続数を取得
    const currentConnections = await getCurrentInstagramConnections(userAccount.id);

    // 4. Instagramアカウントの重複チェック
    const duplicateConnection = await checkInstagramDuplicate(instagramUserId);

    // 5. チェック結果を判定
    const result: AccountCheckResult = {
      canConnect: false,
      currentConnections: currentConnections.length,
      maxConnections: planLimit.max_instagram_accounts,
      planType: userAccount.plan_type
    };

    // 重複チェック
    if (duplicateConnection) {
      // 同じユーザーの既存接続かチェック
      if (duplicateConnection.user_account_id === userAccount.id) {
        result.errorMessage = 'This Instagram account is already connected to your account';
      } else {
        result.errorMessage = 'This Instagram account is already connected to another user';
      }
      return result;
    }

    // プラン制限チェック
    if (currentConnections.length >= planLimit.max_instagram_accounts) {
      result.errorMessage = `Plan limit exceeded. Maximum ${planLimit.max_instagram_accounts} Instagram accounts allowed for ${userAccount.plan_type} plan`;
      return result;
    }

    // 接続可能
    result.canConnect = true;
    return result;

  } catch (error) {
    console.error('Error in checkAccountLimits:', error);
    return {
      canConnect: false,
      errorMessage: 'Internal error occurred while checking account limits',
      currentConnections: 0,
      maxConnections: 1,
      planType: 'basic'
    };
  }
}

/**
 * Instagram接続を保存
 */
export async function saveInstagramConnection(
  userAccountId: number,
  instagramUserId: string,
  instagramUsername: string,
  accessToken: string,
  followersCount: number = 0,
  mediaCount: number = 0,
  accountType: string = 'PERSONAL'
): Promise<InstagramConnection> {
  try {
    // 既存の接続を無効化（再接続の場合）
    await supabaseAdmin
      .from('instagram_connections')
      .update({ is_active: false })
      .eq('user_account_id', userAccountId)
      .eq('instagram_user_id', instagramUserId);

    // 新しい接続を作成
    const { data, error } = await supabaseAdmin
      .from('instagram_connections')
      .insert({
        user_account_id: userAccountId,
        instagram_user_id: instagramUserId,
        instagram_username: instagramUsername,
        access_token: accessToken,
        followers_count: followersCount,
        media_count: mediaCount,
        account_type: accountType,
        connected_at: new Date().toISOString(),
        last_sync_at: new Date().toISOString(),
        is_active: true
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to save Instagram connection: ${error.message}`);
    }

    console.log('✅ Instagram connection saved:', { 
      userId: userAccountId, 
      instagramId: instagramUserId,
      username: instagramUsername 
    });

    return data;

  } catch (error) {
    console.error('Error saving Instagram connection:', error);
    throw error;
  }
}

/**
 * ユーザーのInstagram接続一覧を取得
 */
export async function getUserInstagramConnections(googleUserId: string): Promise<InstagramConnection[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_accounts')
      .select(`
        id,
        instagram_connections!inner (
          id,
          instagram_user_id,
          instagram_username,
          followers_count,
          media_count,
          account_type,
          connected_at,
          last_sync_at,
          is_active
        )
      `)
      .eq('google_user_id', googleUserId)
      .eq('is_active', true)
      .eq('instagram_connections.is_active', true);

    if (error) {
      throw new Error(`Failed to fetch user Instagram connections: ${error.message}`);
    }

    return data?.[0]?.instagram_connections || [];

  } catch (error) {
    console.error('Error fetching user Instagram connections:', error);
    return [];
  }
}