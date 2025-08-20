import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token');
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Access token required' }, { status: 400 });
  }

  console.log('🔍 Debug Instagram API - Access Token exists:', !!accessToken);
  console.log('🔍 Access Token length:', accessToken.length);
  console.log('🔍 Access Token preview:', accessToken.substring(0, 20) + '...');

  try {
    // 1. ユーザー情報を確認
    console.log('📋 Step 1: Checking user info...');
    const userResponse = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,email&access_token=${accessToken}`
    );
    const userData = await userResponse.json();
    console.log('👤 User Response Status:', userResponse.status);
    console.log('👤 User Data:', JSON.stringify(userData, null, 2));

    // 2. アクセストークンの詳細を確認
    console.log('🔑 Step 2: Checking access token details...');
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/permissions?access_token=${accessToken}`
    );
    const tokenData = await tokenResponse.json();
    console.log('🔑 Token Permissions Status:', tokenResponse.status);
    console.log('🔑 Token Permissions:', JSON.stringify(tokenData, null, 2));

    // 3. Pages APIを直接テスト
    console.log('📄 Step 3: Testing Pages API...');
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`
    );
    const pagesData = await pagesResponse.json();
    console.log('📄 Pages Response Status:', pagesResponse.status);
    console.log('📄 Pages Response Headers:', Object.fromEntries(pagesResponse.headers.entries()));
    console.log('📄 Full Pages Data:', JSON.stringify(pagesData, null, 2));

    // 4. App情報を確認
    console.log('🎯 Step 4: Checking app info...');
    const appResponse = await fetch(
      `https://graph.facebook.com/v21.0/app?access_token=${accessToken}`
    );
    const appData = await appResponse.json();
    console.log('🎯 App Response Status:', appResponse.status);
    console.log('🎯 App Data:', JSON.stringify(appData, null, 2));

    return NextResponse.json({
      success: true,
      debug_results: {
        user: {
          status: userResponse.status,
          data: userData
        },
        permissions: {
          status: tokenResponse.status,
          data: tokenData
        },
        pages: {
          status: pagesResponse.status,
          data: pagesData,
          headers: Object.fromEntries(pagesResponse.headers.entries())
        },
        app: {
          status: appResponse.status,
          data: appData
        }
      }
    });

  } catch (error) {
    console.error('❌ Debug API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}