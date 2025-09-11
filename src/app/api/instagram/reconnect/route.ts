import { NextRequest, NextResponse } from 'next/server';

// Instagram Graph API v23 完全対応の再認証エンドポイント
export async function GET(request: NextRequest) {
  try {
    console.log('=== Instagram Graph API v23 再認証エンドポイント ===');
    
    // Facebook App IDを正しく取得
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || process.env.INSTAGRAM_CLIENT_ID || '1776291423096614';
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://insta-simple.thorsync.com');
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    
    console.log('Client ID:', clientId);
    console.log('Base URL:', baseUrl);
    console.log('Redirect URI:', redirectUri);
    
    // Instagram Graph API v23で必要な最小権限（business_management除外）
    const scopes = [
      'instagram_business_basic',      // Instagram Business 基本情報
      'instagram_business_manage_insights', // Instagram Business インサイト
      'pages_show_list',               // ページアクセス
      'pages_read_engagement',         // エンゲージメントデータ
    ];
    
    // Instagram onboarding用のextrasパラメータ（重要）
    const extras = JSON.stringify({
      setup: {
        channel: 'IG_API_ONBOARDING'
      }
    });
    
    // URLパラメータを構築
    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(','),
      response_type: 'code',
      state: JSON.stringify({
        source: 'reconnect',
        timestamp: Date.now(),
        flow: 'instagram_graph_api_v23'
      }),
      extras: extras
    });
    
    const authUrl = `https://www.facebook.com/v23.0/dialog/oauth?${authParams.toString()}`;
    
    console.log('=== 認証URL詳細 ===');
    console.log('Full Auth URL:', authUrl);
    console.log('Scopes:', scopes.join(', '));
    console.log('Extras Parameter:', extras);
    
    // デバッグ情報をレスポンスに含める（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      const debugInfo = {
        client_id: clientId,
        redirect_uri: redirectUri,
        scopes: scopes,
        extras: extras,
        auth_url: authUrl,
        note: 'Instagram Graph API v23 対応の再認証URL'
      };
      
      console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));
    }
    
    return NextResponse.redirect(authUrl);
    
  } catch (error) {
    console.error('❌ Instagram reconnect error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate reconnect URL',
        details: error instanceof Error ? error.message : 'Unknown error',
        troubleshooting: [
          '1. Facebook App IDが正しく設定されているか確認してください',
          '2. 環境変数 NEXT_PUBLIC_INSTAGRAM_CLIENT_ID または INSTAGRAM_CLIENT_ID を確認してください',
          '3. Facebookアプリの設定でInstagram製品が有効になっているか確認してください',
          '4. リダイレクトURIがFacebookアプリに正しく登録されているか確認してください'
        ]
      },
      { status: 500 }
    );
  }
}

// POSTメソッドでも同じ処理を可能にする
export async function POST(request: NextRequest) {
  return GET(request);
}