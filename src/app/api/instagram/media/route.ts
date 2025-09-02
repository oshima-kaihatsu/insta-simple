import { NextRequest, NextResponse } from 'next/server';

// Dynamic routeに設定
export const dynamic = 'force-dynamic';

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
      console.log('🔍 Running diagnosis to understand the issue...');
      
      // トークンがInstagram用か確認
      const scopesFromDebug = debugData?.data?.scopes || [];
      console.log('Token scopes:', scopesFromDebug);
      
      // 2024年以降の必須権限をチェック
      const requiredScopes2024 = ['business_management', 'instagram_basic', 'pages_show_list'];
      const missingScopes = requiredScopes2024.filter(scope => !scopesFromDebug.includes(scope));
      
      if (missingScopes.length > 0) {
        console.log('❌ Missing required scopes for 2024+:', missingScopes);
        return NextResponse.json({
          success: false,
          error: 'Missing required permissions',
          details: {
            missing_scopes: missingScopes,
            granted_scopes: scopesFromDebug,
            migration_note: 'Instagram Basic Display API was deprecated in December 2024'
          },
          profile: { id: userData.id, name: userData.name },
          troubleshooting: {
            title: 'Instagram Graph API v23 権限不足',
            steps: [
              '1. business_management権限が2024年以降に作成されたアカウントで必須です',
              '2. Instagram Basic Display APIは2024年12月4日に廃止されました',
              '3. 新しい認証URLで必要な権限を再取得してください',
              '4. Instagramアカウントがビジネスアカウントであることを確認してください'
            ],
            reauth_required: true
          }
        }, { status: 400 });
      }
      
      // アカウントタイプの詳細診断
      console.log('🔬 Detailed account analysis...');
      const accountAnalysis = {
        has_facebook_pages: pagesData.data && pagesData.data.length > 0,
        facebook_pages_count: pagesData.data?.length || 0,
        pages_with_instagram: 0,
        page_details: pagesData.data?.map(page => ({
          id: page.id,
          name: page.name,
          has_instagram: !!page.instagram_business_account,
          instagram_id: page.instagram_business_account?.id || null
        })) || []
      };
      
      accountAnalysis.pages_with_instagram = accountAnalysis.page_details.filter(p => p.has_instagram).length;
      
      console.log('📊 Account analysis:', accountAnalysis);
      
      return NextResponse.json({
        success: false,
        error: 'Instagram Business Account setup incomplete',
        details: accountAnalysis,
        profile: { id: userData.id, name: userData.name },
        troubleshooting: {
          title: 'Instagram Business Account設定が必要です',
          current_status: {
            has_facebook_pages: accountAnalysis.has_facebook_pages,
            facebook_pages_count: accountAnalysis.facebook_pages_count,
            pages_with_instagram: accountAnalysis.pages_with_instagram
          },
          steps: [
            accountAnalysis.has_facebook_pages ? 
              '✅ Facebookページは存在します' : 
              '❌ Facebookページを作成してください: https://www.facebook.com/pages/create',
            '📱 Instagramアカウントをビジネスアカウントに変換してください',
            '🔗 FacebookページとInstagramビジネスアカウントを連携してください',
            '📋 Facebook Business Managerで設定を確認してください',
            '⏰ 新しい設定の場合、24-48時間待ってから再試行してください'
          ],
          links: {
            create_page: 'https://www.facebook.com/pages/create',
            business_manager: 'https://business.facebook.com',
            instagram_business: 'https://business.instagram.com'
          }
        }
      }, { status: 400 });
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