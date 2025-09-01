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

    console.log('🔍 Instagram Media API - Server-side request');
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

    // Step 2: Instagram Basic Display API でメディア取得を試行
    console.log('🎯 Trying Instagram Basic Display API...');
    const instagramResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&limit=10&access_token=${accessToken}`
    );

    console.log('Instagram API response status:', instagramResponse.status);

    if (instagramResponse.ok) {
      const instagramData = await instagramResponse.json();
      console.log('✅ Instagram media data:', instagramData);
      
      return NextResponse.json({
        success: true,
        data: instagramData,
        profile: {
          id: userData.id,
          name: userData.name
        }
      });
    } else {
      const instagramError = await instagramResponse.json();
      console.error('❌ Instagram API error:', instagramError);
      
      // Step 3: Instagram APIが失敗した場合、詳細なエラー情報を返す
      return NextResponse.json({
        success: false,
        error: 'Instagram API failed',
        details: instagramError,
        profile: {
          id: userData.id,
          name: userData.name
        },
        // 代替手段の提案
        suggestion: 'This might be due to Instagram Basic Display API limitations. Consider using Instagram Graph API for business accounts or check if your app is properly configured.'
      }, { status: instagramResponse.status });
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