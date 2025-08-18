// src/app/api/instagram/callback/route.js
import { NextResponse } from 'next/server';

// Dynamic routeに設定
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // 本番環境では確実にHTTPSのURLを使用
  const REDIRECT_URI = 'https://insta-simple.thorsync.com/api/instagram/callback';
  const CLIENT_ID = '1776291423096614';
  const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET || '5692721c3f74c29d859469b5de348d1a';

  console.log('=== Instagram Graph API Callback (New API) ===');
  console.log('URL:', request.url);
  console.log('Code:', code ? 'Received' : 'Missing');
  console.log('Error:', error);
  console.log('State:', state);
  console.log('Using Redirect URI:', REDIRECT_URI);

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=${error}`);
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=no_code`);
  }

  try {
    // Step 1: コードをアクセストークンに交換（新しいGraph API）
    const tokenResponse = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response status:', tokenResponse.status);
    console.log('Token response:', tokenData);

    if (tokenData.error) {
      console.error('Token exchange failed:', tokenData.error);
      console.error('Error details:', {
        error: tokenData.error,
        error_description: tokenData.error_description,
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code_length: code?.length
      });
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=token_failed&details=${encodeURIComponent(tokenData.error_description || tokenData.error.message || 'Unknown error')}`);
    }

    const accessToken = tokenData.access_token;

    // デバッグ: トークンの権限を確認
    console.log('🔍 Checking token permissions...');
    const debugResponse = await fetch(`https://graph.facebook.com/v21.0/debug_token?input_token=${accessToken}&access_token=${accessToken}`);
    const debugData = await debugResponse.json();
    console.log('Token debug info:', debugData);

    // Step 2: ユーザーのFacebookページ一覧を取得（追加フィールドとデバッグ情報付き）
    console.log('🔍 Fetching user pages with detailed permissions check...');
    
    // まず、現在のユーザー情報を取得
    const userResponse = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${accessToken}`);
    const userData = await userResponse.json();
    console.log('Current user data:', userData);
    
    // ユーザーの権限を確認
    const permissionsResponse = await fetch(`https://graph.facebook.com/v21.0/me/permissions?access_token=${accessToken}`);
    const permissionsData = await permissionsResponse.json();
    console.log('User permissions:', JSON.stringify(permissionsData, null, 2));
    
    // ページを取得（詳細フィールド付き + 権限チェック）
    // まず通常のaccountsエンドポイント
    const pagesResponse = await fetch(`https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,category,tasks,instagram_business_account,perms&access_token=${accessToken}`);
    const pagesData = await pagesResponse.json();
    
    console.log('Pages response status:', pagesResponse.status);
    console.log('Pages response:', JSON.stringify(pagesData, null, 2));
    
    // ページが見つからない場合、別の方法を試す
    if (!pagesData.data || pagesData.data.length === 0) {
      console.log('🔍 No pages found via /me/accounts, trying /me/businesses...');
      
      // Business Managerから取得を試みる
      const businessResponse = await fetch(`https://graph.facebook.com/v21.0/me/businesses?fields=id,name&access_token=${accessToken}`);
      const businessData = await businessResponse.json();
      console.log('Business response:', JSON.stringify(businessData, null, 2));
      
      // Instagram Business Accountを直接取得する試み
      console.log('🔍 Trying direct Instagram Business Account lookup...');
      const igBusinessResponse = await fetch(`https://graph.facebook.com/v21.0/me?fields=accounts{id,name,instagram_business_account}&access_token=${accessToken}`);
      const igBusinessData = await igBusinessResponse.json();
      console.log('IG Business response:', JSON.stringify(igBusinessData, null, 2));
      
      // Instagram User IDを直接指定する方法も試す
      console.log('🔍 Trying with Instagram Basic Display...');
      // Instagram Basic Display APIのユーザー情報取得
      const igUserResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`);
      const igUserData = await igUserResponse.json();
      console.log('Instagram User response:', JSON.stringify(igUserData, null, 2));
      
      // もしInstagram User IDが取得できたら、それを使用
      if (igUserData.id) {
        console.log('✅ Found Instagram User ID via Basic Display:', igUserData.id);
        instagramToken = accessToken;
        instagramUserId = igUserData.id;
      }
    }

    if (pagesData.error) {
      console.error('Pages fetch failed:', pagesData.error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=pages_failed`);
    }

    // Step 3: Instagramビジネスアカウントを探す
    let instagramToken = null;
    let instagramUserId = null;

    console.log('🔍 Searching for Instagram accounts...');
    console.log('Available pages count:', pagesData.data?.length || 0);

    // 方法1: Facebookページ経由でInstagramビジネスアカウントを探す
    for (const page of pagesData.data || []) {
      try {
        const pageAccessToken = page.access_token;
        
        console.log(`📄 Checking page: ${page.name} (ID: ${page.id})`);
        console.log(`   - Category: ${page.category}`);
        console.log(`   - Tasks: ${JSON.stringify(page.tasks)}`);
        console.log(`   - Permissions: ${JSON.stringify(page.perms)}`);
        console.log(`   - Has access token: ${!!page.access_token}`);
        
        // ページのInstagramアカウントを確認（Business & Creator両対応）
        const igResponse = await fetch(`https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`);
        const igData = await igResponse.json();
        
        console.log(`   - Instagram check result:`, igData);
        
        if (igData.instagram_business_account) {
          instagramToken = pageAccessToken;
          instagramUserId = igData.instagram_business_account.id;
          console.log('✅ Found Instagram Business Account via page:', instagramUserId);
          break;
        } else {
          console.log(`   - No Instagram Business Account found for this page`);
        }
      } catch (error) {
        console.log(`❌ Error checking page ${page.name}:`, error.message);
        continue;
      }
    }

    // 方法2: 直接個人のInstagramアカウントを確認（ページが見つからない場合）
    if (!instagramToken && (!pagesData.data || pagesData.data.length === 0)) {
      console.log('🔍 No pages found, trying alternative methods...');
      
      // 方法2a: Instagram Business Discovery APIを試す
      try {
        console.log('Trying Instagram Business Discovery...');
        
        // Instagram IDが環境変数で指定されている場合は直接使用
        const hardcodedInstagramId = process.env.INSTAGRAM_BUSINESS_ID;
        if (hardcodedInstagramId) {
          console.log('Using hardcoded Instagram Business ID:', hardcodedInstagramId);
          // ハードコードされたIDでアカウント情報を取得
          const igAccountResponse = await fetch(
            `https://graph.facebook.com/v21.0/${hardcodedInstagramId}?fields=id,username,name,followers_count,media_count&access_token=${accessToken}`
          );
          const igAccountData = await igAccountResponse.json();
          console.log('Hardcoded Instagram account data:', igAccountData);
          
          if (igAccountData.id) {
            instagramToken = accessToken;
            instagramUserId = igAccountData.id;
            console.log('✅ Using hardcoded Instagram Business Account:', instagramUserId);
          }
        }
        
        // ユーザーのInstagram IDを探す
        if (!instagramToken) {
          const igUserSearchResponse = await fetch(
            `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${accessToken}`
          );
          const igUserData = await igUserSearchResponse.json();
          
          // Instagram Business IDを使用してアカウント情報を取得
          if (igUserData.id) {
            // ページを作成するか、既存のページを取得する別の方法を試す
            console.log('User Facebook ID:', igUserData.id);
            
            // Instagram connected accountsを確認
            const connectedResponse = await fetch(
              `https://graph.facebook.com/v21.0/${igUserData.id}/accounts?fields=id,name,instagram_business_account,connected_instagram_account&access_token=${accessToken}`
            );
            const connectedData = await connectedResponse.json();
            console.log('Connected accounts check:', connectedData);
          }
        }
      } catch (error) {
        console.log('❌ Error with Business Discovery:', error.message);
      }
      
      // 方法2b: 元の方法も維持
      try {
        // 個人のInstagramアカウント（Creator account）を確認
        const directIgResponse = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name,instagram_business_account&access_token=${accessToken}`);
        const directIgData = await directIgResponse.json();
        
        console.log('Direct Instagram check result:', directIgData);
        
        if (directIgData.instagram_business_account) {
          instagramToken = accessToken;
          instagramUserId = directIgData.instagram_business_account.id;
          console.log('✅ Found Instagram Business Account directly:', instagramUserId);
        }
      } catch (error) {
        console.log('❌ Error checking direct Instagram account:', error.message);
      }
    }

    if (!instagramToken || !instagramUserId) {
      console.error('❌ No Instagram Business Account found after all attempts');
      console.error('📊 Summary:');
      console.error(`   - Facebook pages found: ${pagesData.data?.length || 0}`);
      console.error(`   - Pages details:`, pagesData.data?.map(p => ({ 
        name: p.name, 
        id: p.id, 
        category: p.category,
        hasAccessToken: !!p.access_token,
        permissions: p.perms 
      })));
      console.error('⚠️ Troubleshooting checklist:');
      console.error('1. Instagram account must be Business or Creator');
      console.error('2. Instagram account must be connected to Facebook page');
      console.error('3. User must have admin/editor access to the Facebook page');
      console.error('4. Facebook app must have proper permissions (pages_manage_posts, etc.)');
      console.error('5. Try switching to Business account in Instagram settings');
      console.error('6. Re-authorize with updated permissions');
      
      const errorMessage = `Instagram Business/Creator account not found. 
        Found ${pagesData.data?.length || 0} Facebook pages. 
        Steps to fix: 1) Switch Instagram to Business/Creator account, 
        2) Connect to Facebook page, 3) Ensure you have page admin access, 
        4) Try reconnecting`;
      
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=no_instagram_account&message=${encodeURIComponent(errorMessage)}`);
    }

    console.log('✅ Instagram connection successful');
    console.log('Access Token:', instagramToken ? 'Present' : 'Missing');
    console.log('Instagram User ID:', instagramUserId);
    
    // ダッシュボードにリダイレクト（アクセストークンとユーザーIDを含む）
    const dashboardUrl = new URL('/dashboard', process.env.NEXTAUTH_URL);
    dashboardUrl.searchParams.set('access_token', instagramToken);
    dashboardUrl.searchParams.set('instagram_user_id', instagramUserId);
    dashboardUrl.searchParams.set('success', 'true');
    
    console.log('Redirecting to:', dashboardUrl.toString());
    return NextResponse.redirect(dashboardUrl.toString());

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=callback_failed`);
  }
}