import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const accessToken = searchParams.get('access_token');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Missing access token' },
        { status: 400 }
      );
    }

    console.log('🔍 Instagram Media API - Server-side request (New Instagram Graph API)');
    console.log('Token preview:', accessToken.substring(0, 20) + '...');

    // Step 1: まずユーザー情報を取得（Facebook Graph API）
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`
    );

    if (!userResponse.ok) {
      const userError = await userResponse.json();
      console.error('User API error:', userError);
      return NextResponse.json(
        { error: 'Failed to get user info', details: userError },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    console.log('✅ User data obtained:', userData);

    // Step 2: Pagesを取得してInstagram Business Accountを探す
    console.log('🎯 Getting user pages and Instagram accounts...');
    
    // まずデバッグ用にトークン情報を詳細に確認
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`;
    const debugResponse = await fetch(debugTokenUrl);
    const debugData = await debugResponse.json();
    console.log('🔍 Token Debug Info:', debugData);
    
    // 全てのフィールドを含む詳細なページ情報を取得
    const pagesResponse = await fetch(
      `https://graph.facebook.com/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name,biography,profile_picture_url,followers_count,media_count}&access_token=${accessToken}`
    );

    console.log('Pages API response status:', pagesResponse.status);
    
    if (!pagesResponse.ok) {
      const pagesError = await pagesResponse.json();
      console.error('Pages API error:', pagesError);
      return NextResponse.json({
        success: false,
        error: 'Failed to get pages',
        details: pagesError,
        profile: { id: userData.id, name: userData.name }
      }, { status: pagesResponse.status });
    }

    const pagesData = await pagesResponse.json();
    console.log('📋 Full Pages data:', JSON.stringify(pagesData, null, 2));
    
    // 各ページの詳細をログ出力
    if (pagesData.data && pagesData.data.length > 0) {
      pagesData.data.forEach((page, index) => {
        console.log(`\n📄 Page ${index + 1}: ${page.name}`);
        console.log(`  - Page ID: ${page.id}`);
        console.log(`  - Has Instagram: ${!!page.instagram_business_account}`);
        if (page.instagram_business_account) {
          console.log(`  - Instagram ID: ${page.instagram_business_account.id}`);
          console.log(`  - Instagram Username: ${page.instagram_business_account.username}`);
          console.log(`  - Followers: ${page.instagram_business_account.followers_count}`);
          console.log(`  - Media Count: ${page.instagram_business_account.media_count}`);
        }
      });
    } else {
      console.log('⚠️ No pages found in response');
    }

    // Instagram Business Accountを探す
    const instagramPage = pagesData.data?.find(page => page.instagram_business_account);
    
    if (!instagramPage) {
      console.log('⚠️ No Instagram Business Account found in pages');
      console.log('🔍 Checking if this is an Instagram-scoped token...');
      
      // トークンがInstagram用か確認
      const scopesFromDebug = debugData?.data?.scopes || [];
      console.log('Token scopes:', scopesFromDebug);
      
      // 直接Instagram APIを試す（個人アカウントの場合）
      console.log('🎯 Trying direct Instagram Graph API...');
      const instagramResponse = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&limit=10&access_token=${accessToken}`
      );
      
      if (instagramResponse.ok) {
        const instagramData = await instagramResponse.json();
        console.log('✅ Instagram personal media data:', instagramData);
        
        return NextResponse.json({
          success: true,
          data: instagramData,
          profile: { id: userData.id, name: userData.name },
          account_type: 'personal'
        });
      } else {
        const instagramError = await instagramResponse.json();
        console.error('❌ Instagram personal API error:', instagramError);
        
        return NextResponse.json({
          success: false,
          error: 'No Instagram account found',
          details: instagramError,
          profile: { id: userData.id, name: userData.name },
          suggestion: 'Please connect a Facebook Page with an Instagram Business Account, or ensure your personal Instagram account has proper permissions.'
        }, { status: 400 });
      }
    }

    // Step 3: Instagram Business Accountのメディアを取得
    const instagramAccountId = instagramPage.instagram_business_account.id;
    console.log('🎯 Getting Instagram Business media for account:', instagramAccountId);
    
    const mediaResponse = await fetch(
      `https://graph.facebook.com/${instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&limit=10&access_token=${accessToken}`
    );

    console.log('Instagram Business media response status:', mediaResponse.status);

    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      console.log('✅ Instagram Business media data:', mediaData);
      
      return NextResponse.json({
        success: true,
        data: mediaData,
        profile: {
          id: userData.id,
          name: userData.name,
          instagram_account_id: instagramAccountId,
          page_name: instagramPage.name
        },
        account_type: 'business'
      });
    } else {
      const mediaError = await mediaResponse.json();
      console.error('❌ Instagram Business media error:', mediaError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to get Instagram Business media',
        details: mediaError,
        profile: {
          id: userData.id,
          name: userData.name,
          instagram_account_id: instagramAccountId
        },
        suggestion: 'Instagram Business Account found but media access failed. Check permissions and account status.'
      }, { status: mediaResponse.status });
    }

  } catch (error) {
    console.error('🚨 Server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}