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
    const pagesResponse = await fetch(
      `https://graph.facebook.com/me/accounts?fields=id,name,instagram_business_account&access_token=${accessToken}`
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
    console.log('📋 Pages data:', pagesData);

    // Instagram Business Accountを探す
    const instagramPage = pagesData.data?.find(page => page.instagram_business_account);
    
    if (!instagramPage) {
      console.log('⚠️ No Instagram Business Account found, trying direct Instagram API...');
      
      // 直接Instagram APIを試す（個人アカウントの場合）
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