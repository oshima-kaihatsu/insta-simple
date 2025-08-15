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

    // Step 2: ユーザーのFacebookページ一覧を取得（追加フィールドとデバッグ情報付き）
    console.log('🔍 Fetching user pages with detailed permissions check...');
    
    // まず、現在のユーザー情報を取得
    const userResponse = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${accessToken}`);
    const userData = await userResponse.json();
    console.log('Current user data:', userData);
    
    // ページを取得（詳細フィールド付き）
    const pagesResponse = await fetch(`https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,category,tasks,instagram_business_account&access_token=${accessToken}`);
    const pagesData = await pagesResponse.json();
    
    console.log('Pages response status:', pagesResponse.status);
    console.log('Pages response:', JSON.stringify(pagesData, null, 2));

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
      console.log('🔍 No pages found, trying direct Instagram user account...');
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
      console.error(`   - Pages details:`, pagesData.data?.map(p => ({ name: p.name, id: p.id, category: p.category })));
      console.error('⚠️ Troubleshooting checklist:');
      console.error('1. Instagram account must be Business or Creator');
      console.error('2. Instagram account must be connected to Facebook page');
      console.error('3. User must have admin/editor access to the Facebook page');
      console.error('4. Facebook app must have proper permissions');
      console.error('5. Try switching to Business account in Instagram settings');
      
      const errorMessage = `Instagram Business/Creator account not found. 
        Found ${pagesData.data?.length || 0} Facebook pages. 
        Steps to fix: 1) Switch Instagram to Business/Creator account, 
        2) Connect to Facebook page, 3) Ensure you have page admin access, 
        4) Try reconnecting`;
      
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=no_instagram_account&message=${encodeURIComponent(errorMessage)}`);
    }

    console.log('✅ Instagram connection successful');
    
    // ダッシュボードにリダイレクト（アクセストークンとユーザーIDを含む）
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard?access_token=${instagramToken}&instagram_user_id=${instagramUserId}&success=true`
    );

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=callback_failed`);
  }
}