import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  console.log('=== Instagram Graph API Callback (Simplified) ===');
  console.log('URL:', request.url);
  console.log('Code:', code ? 'Received' : 'Not received');
  console.log('Error:', error);
  console.log('State:', state);

  // エラーチェック
  if (error) {
    console.error('Instagram OAuth error:', error);
    const url = new URL('/dashboard', request.url);
    url.searchParams.set('error', 'instagram_auth_failed');
    url.searchParams.set('message', error);
    return NextResponse.redirect(url);
  }

  if (!code) {
    console.error('No authorization code received');
    const url = new URL('/dashboard', request.url);
    url.searchParams.set('error', 'no_code');
    return NextResponse.redirect(url);
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://insta-simple.thorsync.com';
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    console.log('Using Redirect URI:', redirectUri);

    // Step 1: アクセストークン取得（Facebook Graph API）
    const tokenUrl = 'https://graph.facebook.com/v23.0/oauth/access_token';
    const clientId = process.env.INSTAGRAM_CLIENT_ID || '1776291423096614';
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || '5692721c3f74c29d859469b5de348d1a';
    
    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    });

    const tokenResponse = await fetch(`${tokenUrl}?${tokenParams.toString()}`, {
      method: 'GET',
    });

    console.log('Token response status:', tokenResponse.status);
    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    const shortTermToken = tokenData.access_token;

    // Step 1.5: 短期トークンを長期トークンに交換（Facebook Graph API）
    console.log('🔄 Converting short-term token to long-term token...');
    const longTermTokenUrl = 'https://graph.facebook.com/v23.0/oauth/access_token';
    const longTermParams = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: clientId,
      client_secret: clientSecret,
      fb_exchange_token: shortTermToken
    });

    const longTermResponse = await fetch(`${longTermTokenUrl}?${longTermParams.toString()}`, {
      method: 'GET',
    });

    console.log('Long-term token response status:', longTermResponse.status);
    const longTermData = await longTermResponse.json();
    console.log('Long-term token response:', longTermData);

    let accessToken = shortTermToken; // デフォルトは短期トークン
    let tokenExpiresIn = 'unknown';
    let tokenType = 'short-term';
    
    if (longTermData.access_token && !longTermData.error) {
      accessToken = longTermData.access_token;
      tokenExpiresIn = longTermData.expires_in || 'unknown';
      tokenType = 'long-term';
      console.log('✅ Successfully obtained long-term token');
    } else {
      console.warn('⚠️ Long-term token exchange failed, using short-term token');
      if (longTermData.error) {
        console.warn('Long-term token error:', longTermData.error);
      }
      // 短期トークンの期限（通常1時間）
      tokenExpiresIn = 3600;
      tokenType = 'short-term';
    }
    
    console.log(`✅ Using ${tokenType} access token`);
    console.log('Token expires in:', tokenExpiresIn, 'seconds');
    
    // トークンタイプも追加情報として記録
    const tokenInfo = {
      type: tokenType,
      expires_in: tokenExpiresIn,
      created_at: new Date().toISOString()
    };

    // Step 1.6: トークンの権限とスコープを確認
    console.log('🔍 Checking token permissions...');
    try {
      const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`;
      const debugResponse = await fetch(debugTokenUrl);
      const debugData = await debugResponse.json();
      console.log('📋 Token debug info:', debugData);
      
      // トークンの有効性チェック
      if (debugData.error) {
        console.error('❌ Token validation failed:', debugData.error);
        throw new Error(`Token validation failed: ${debugData.error.message}`);
      }
      
      if (!debugData.data || !debugData.data.is_valid) {
        console.error('❌ Token is invalid');
        throw new Error('Access token is invalid');
      }
      
      if (debugData.data?.scopes) {
        console.log('✅ Token scopes:', debugData.data.scopes);
        
        // 必要な権限があるかチェック
        const requiredScopes = ['instagram_basic', 'pages_show_list'];
        const grantedScopes = debugData.data.scopes;
        const missingScopes = requiredScopes.filter(scope => !grantedScopes.includes(scope));
        
        if (missingScopes.length > 0) {
          console.warn('⚠️ Missing required scopes:', missingScopes);
          // 必要に応じてエラーにするか、警告として扱うかを決める
        }
      }
      
      // トークンの有効期限をチェック
      if (debugData.data?.expires_at) {
        const expiresAt = new Date(debugData.data.expires_at * 1000);
        console.log('⏰ Token expires at:', expiresAt.toISOString());
        
        // 1時間以内に期限切れの場合は警告
        const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
        if (expiresAt < oneHourFromNow) {
          console.warn('⚠️ Token will expire soon:', expiresAt);
        }
      }
      
    } catch (debugError) {
      console.error('❌ Token validation error:', debugError.message);
      // トークンが無効な場合はエラー画面にリダイレクト
      const errorUrl = new URL('/dashboard', request.url);
      errorUrl.searchParams.set('error', 'token_invalid');
      errorUrl.searchParams.set('message', 'アクセストークンが無効です。再度認証してください。');
      return NextResponse.redirect(errorUrl);
    }

    // Step 2: ユーザー情報を取得（Facebook Graph API）
    console.log('🔍 Fetching user information...');
    const userResponse = await fetch(
      `https://graph.facebook.com/v23.0/me?fields=id,name&access_token=${accessToken}`
    );
    const userData = await userResponse.json();
    console.log('User data:', userData);

    if (!userData.id) {
      throw new Error('Failed to get user ID');
    }

    // Step 3: User ID設定（シンプル）
    let instagramUserId = userData.id;
    let instagramUsername = userData.name || 'Facebook User';

    // Step 4: Facebook Graph API - ローカルストレージに保存してリダイレクト  
    console.log('📄 Using Facebook Graph API - storing token for frontend use');
    
    // ダッシュボードでローカルストレージに保存させる
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('success', 'true');
    dashboardUrl.searchParams.set('instagram_token', accessToken);
    dashboardUrl.searchParams.set('instagram_user_id', instagramUserId);
    dashboardUrl.searchParams.set('instagram_username', instagramUsername);
    
    console.log('✅ Instagram Basic Display connection successful!');
    console.log('Redirecting to dashboard with token...');
    
    return NextResponse.redirect(dashboardUrl);

  } catch (error) {
    console.error('❌ Instagram callback error:', error);
    
    // エラー時のリダイレクト
    const errorUrl = new URL('/dashboard', request.url);
    errorUrl.searchParams.set('error', 'connection_failed');
    errorUrl.searchParams.set('message', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.redirect(errorUrl);
  }
}