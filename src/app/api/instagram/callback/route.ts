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

    // Step 1: アクセストークン取得
    const tokenUrl = 'https://graph.facebook.com/v23.0/oauth/access_token';
    const tokenParams = new URLSearchParams({
      client_id: process.env.INSTAGRAM_CLIENT_ID!,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
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

    // Step 1.5: 短期トークンを長期トークンに交換
    console.log('🔄 Converting short-term token to long-term token...');
    const longTermTokenUrl = 'https://graph.facebook.com/v23.0/oauth/access_token';
    const longTermParams = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: process.env.INSTAGRAM_CLIENT_ID!,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
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

    // Step 2: ユーザー情報を取得
    console.log('🔍 Fetching user information...');
    const userResponse = await fetch(
      `https://graph.facebook.com/v23.0/me?fields=id,name&access_token=${accessToken}`
    );
    const userData = await userResponse.json();
    console.log('User data:', userData);

    if (!userData.id) {
      throw new Error('Failed to get user ID');
    }

    // Step 3: Instagram Business Account IDを直接設定
    // 注: 実際のプロダクション環境では、ユーザーごとのInstagram IDを
    // データベースに保存し、適切に管理する必要があります
    let instagramUserId = userData.id; // FacebookユーザーIDを使用
    let instagramUsername = userData.name || 'Instagram User';

    // Step 4: Facebookページを確認（複数のAPIバージョンで試行）
    let pageAccessToken = null;
    let hasValidPageToken = false;
    
    try {
      // まずv23.0で試行
      console.log('📄 Trying Facebook Pages API v23.0...');
      let pagesResponse = await fetch(
        `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count}&access_token=${accessToken}`
      );
      let pagesData = await pagesResponse.json();
      
      // v23.0でエラーまたは空の場合、フォールバックで再試行
      if (pagesData.error || !pagesData.data || pagesData.data.length === 0) {
        console.log('📄 Retrying with fallback approach...');
        pagesResponse = await fetch(
          `https://graph.facebook.com/v23.0/me/accounts?access_token=${accessToken}`
        );
        pagesData = await pagesResponse.json();
      }
      
      console.log('📄 Callback Pages API Status:', pagesResponse.status);
      console.log('📄 Callback Pages data:', JSON.stringify(pagesData, null, 2));
      
      // エラーレスポンスをチェック
      if (pagesData.error) {
        console.error('❌ Callback Pages API Error:', pagesData.error);
        console.log('⚠️ Continuing with user token due to pages error');
      }

      if (pagesData.data && pagesData.data.length > 0) {
        // Facebookページが存在する場合
        for (const page of pagesData.data) {
          // ページアクセストークンを保存
          if (page.access_token) {
            pageAccessToken = page.access_token;
            hasValidPageToken = true;
            console.log('✅ Got page access token for:', page.name);
          }
          
          if (page.instagram_business_account) {
            instagramUserId = page.instagram_business_account.id;
            
            // Instagram Business Accountの詳細を取得（ページトークンを使用）
            const tokenToUse = pageAccessToken || accessToken;
            const igResponse = await fetch(
              `https://graph.facebook.com/v23.0/${instagramUserId}?fields=id,username,name,followers_count,media_count&access_token=${tokenToUse}`
            );
            const igData = await igResponse.json();
            
            if (igData.username) {
              instagramUsername = igData.username;
            }
            
            console.log('✅ Found Instagram Business Account:', instagramUserId);
            break;
          }
        }
      } else {
        console.log('⚠️ No Facebook pages found, trying alternative approach...');
        
        // 代替手段: 直接Instagram Business Accountを検索
        try {
          const directIgResponse = await fetch(
            `https://graph.facebook.com/v23.0/me?fields=instagram_business_account&access_token=${accessToken}`
          );
          const directIgData = await directIgResponse.json();
          console.log('🔍 Direct Instagram Business Account check:', directIgData);
          
          if (directIgData.instagram_business_account) {
            instagramUserId = directIgData.instagram_business_account.id;
            console.log('✅ Found Instagram Business Account via direct method:', instagramUserId);
          }
        } catch (directError) {
          console.log('⚠️ Direct Instagram check also failed:', directError.message);
        }
      }
    } catch (pageError) {
      console.log('⚠️ Could not fetch pages, continuing with basic connection:', pageError.message);
    }

    // Step 5: セッションデータを準備
    const sessionData = {
      accessToken: pageAccessToken || accessToken, // ページトークンを優先
      userAccessToken: accessToken, // ユーザートークンも保存
      instagramUserId: instagramUserId,
      instagramUsername: instagramUsername,
      userId: userData.id,
      userName: userData.name,
      connectionType: hasValidPageToken ? 'business' : 'simplified',
      hasPageToken: hasValidPageToken,
      tokenInfo: tokenInfo, // トークン詳細情報
      timestamp: new Date().toISOString()
    };

    console.log('📊 Session data prepared:', {
      ...sessionData,
      accessToken: '***' // セキュリティのため非表示
    });

    // Step 6: データベースに接続情報を保存（スキップ - テーブル構造の問題のため）
    console.log('⚠️ Database save temporarily skipped due to table structure issues');
    console.log('💾 Connection data would be:', {
      user_id: userData.id,
      instagram_user_id: instagramUserId,
      access_token: '***', // セキュリティのため非表示
      username: instagramUsername,
      connection_type: hasValidPageToken ? 'business' : 'simplified'
    });

    // Step 7: ダッシュボードにリダイレクト
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('success', 'true');
    dashboardUrl.searchParams.set('access_token', pageAccessToken || accessToken);
    dashboardUrl.searchParams.set('instagram_user_id', instagramUserId);
    dashboardUrl.searchParams.set('connection_type', hasValidPageToken ? 'business' : 'simplified');
    dashboardUrl.searchParams.set('has_page_token', hasValidPageToken.toString());
    dashboardUrl.searchParams.set('token_type', tokenType);
    dashboardUrl.searchParams.set('expires_in', tokenExpiresIn.toString());
    
    console.log('✅ Instagram connection successful!');
    console.log('Redirecting to dashboard...');
    
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