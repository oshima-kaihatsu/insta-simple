import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    console.log('🔍 Fetching Instagram user info via Basic Display API...');
    
    // ユーザー情報を取得
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${token}`
    );
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    const userData = await userResponse.json();
    console.log('👤 User data:', userData);
    
    // メディア情報を取得
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${token}`
    );
    
    if (!mediaResponse.ok) {
      throw new Error('Failed to fetch media');
    }
    
    const mediaData = await mediaResponse.json();
    console.log('📸 Media data:', mediaData);
    
    return NextResponse.json({
      connected: true,
      user: userData,
      media: mediaData.data || [],
      message: 'Instagram Basic Display API connection successful'
    });
    
  } catch (error) {
    console.error('❌ Instagram Basic API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch Instagram data',
      message: error.message
    }, { status: 500 });
  }
}