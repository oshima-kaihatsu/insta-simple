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
    const tokenUrl = 'https://graph.facebook.com/v21.0/oauth/access_token';
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

    const accessToken = tokenData.access_token;

    // Step 2: ユーザー情報を取得
    console.log('🔍 Fetching user information...');
    const userResponse = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${accessToken}`
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

    // Step 4: Facebookページを確認（オプション）
    try {
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account&access_token=${accessToken}`
      );
      const pagesData = await pagesResponse.json();
      console.log('📄 Callback Pages API Status:', pagesResponse.status);
      console.log('📄 Callback Pages data:', JSON.stringify(pagesData, null, 2));
      
      // エラーレスポンスをチェック
      if (pagesData.error) {
        console.error('❌ Callback Pages API Error:', pagesData.error);
        console.log('⚠️ Continuing with simplified connection due to pages error');
      }

      if (pagesData.data && pagesData.data.length > 0) {
        // Facebookページが存在する場合
        for (const page of pagesData.data) {
          if (page.instagram_business_account) {
            instagramUserId = page.instagram_business_account.id;
            
            // Instagram Business Accountの詳細を取得
            const igResponse = await fetch(
              `https://graph.facebook.com/v21.0/${instagramUserId}?fields=id,username,name,followers_count,media_count&access_token=${accessToken}`
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
        console.log('⚠️ No Facebook pages found, using simplified connection');
      }
    } catch (pageError) {
      console.log('⚠️ Could not fetch pages, continuing with basic connection:', pageError.message);
    }

    // Step 5: セッションデータを準備
    const sessionData = {
      accessToken: accessToken,
      instagramUserId: instagramUserId,
      instagramUsername: instagramUsername,
      userId: userData.id,
      userName: userData.name,
      connectionType: 'simplified', // 簡略化された接続を示す
      timestamp: new Date().toISOString()
    };

    console.log('📊 Session data prepared:', {
      ...sessionData,
      accessToken: '***' // セキュリティのため非表示
    });

    // Step 6: ダッシュボードにリダイレクト
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('success', 'true');
    dashboardUrl.searchParams.set('access_token', accessToken);
    dashboardUrl.searchParams.set('instagram_user_id', instagramUserId);
    dashboardUrl.searchParams.set('connection_type', 'simplified');
    
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