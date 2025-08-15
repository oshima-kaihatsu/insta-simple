// src/app/api/instagram/callback/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  console.log('=== Instagram Graph API Callback (New API) ===');
  console.log('URL:', request.url);
  console.log('Code:', code ? 'Received' : 'Missing');
  console.log('Error:', error);
  console.log('State:', state);

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
        client_id: process.env.INSTAGRAM_CLIENT_ID || '1776291423096614',
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET || '5692721c3f74c29d859469b5de348d1a',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI || 'https://insta-simple.thorsync.com/api/instagram/callback',
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

    // Step 2: ユーザーのFacebookページ一覧を取得
    const pagesResponse = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesResponse.json();
    
    console.log('Pages response:', pagesData);

    if (pagesData.error) {
      console.error('Pages fetch failed:', pagesData.error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=pages_failed`);
    }

    // Step 3: Instagramビジネスアカウントを探す
    let instagramToken = null;
    let instagramUserId = null;

    for (const page of pagesData.data || []) {
      try {
        const pageAccessToken = page.access_token;
        
        // ページのInstagramアカウントを確認
        const igResponse = await fetch(`https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`);
        const igData = await igResponse.json();
        
        if (igData.instagram_business_account) {
          instagramToken = pageAccessToken;
          instagramUserId = igData.instagram_business_account.id;
          console.log('Found Instagram Business Account:', instagramUserId);
          break;
        }
      } catch (error) {
        console.log('Error checking page:', page.name, error.message);
        continue;
      }
    }

    if (!instagramToken || !instagramUserId) {
      console.error('No Instagram Business Account found');
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=no_instagram_account&message=Business/Creator account required`);
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