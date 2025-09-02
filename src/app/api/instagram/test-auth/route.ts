import { NextRequest, NextResponse } from 'next/server';

// Instagram認証テストページ
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || process.env.INSTAGRAM_CLIENT_ID || '1776291423096614';
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://insta-simple.thorsync.com');
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    
    const scopes = [
      'business_management',
      'pages_show_list', 
      'pages_read_engagement',
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_insights'
    ];
    
    const extras = JSON.stringify({
      setup: {
        channel: 'IG_API_ONBOARDING'
      }
    });
    
    const authUrl = `https://www.facebook.com/v23.0/dialog/oauth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${scopes.join(',')}&` +
      `response_type=code&` +
      `state=test&` +
      `extras=${encodeURIComponent(extras)}`;
    
    // HTMLテストページを返す
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram Graph API v23 認証テスト</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
        .info { background: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        .warning { background: #fff3cd; border-color: #ffeaa7; color: #856404; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
        button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0056b3; }
        .debug-info { font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Instagram Graph API v23 認証テスト</h1>
        
        <div class="section info">
            <h2>📋 設定情報</h2>
            <div class="debug-info">
                <p><strong>Client ID:</strong> ${clientId}</p>
                <p><strong>Redirect URI:</strong> ${redirectUri}</p>
                <p><strong>Base URL:</strong> ${baseUrl}</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            </div>
        </div>
        
        <div class="section success">
            <h2>🎯 必要な権限 (Instagram Graph API v23)</h2>
            <ul>
                ${scopes.map(scope => `<li><code>${scope}</code></li>`).join('')}
            </ul>
            <p><strong>🔑 重要:</strong> <code>business_management</code> 権限は2024年以降に作成されたアカウントで必須です。</p>
        </div>
        
        <div class="section warning">
            <h2>⚡ Extras パラメータ (Instagram Onboarding)</h2>
            <pre>${extras}</pre>
            <p>このパラメータにより、Instagram Business Accountの自動セットアップが可能になります。</p>
        </div>
        
        <div class="section">
            <h2>🚀 認証テスト</h2>
            <p>以下のボタンをクリックしてFacebook認証を開始してください：</p>
            <button onclick="window.location.href='${authUrl}'">
                Instagram Graph API v23 認証を開始
            </button>
        </div>
        
        <div class="section info">
            <h2>🔗 生成された認証URL</h2>
            <pre style="word-break: break-all;">${authUrl}</pre>
        </div>
        
        <div class="section">
            <h2>🛠️ その他のテストツール</h2>
            <p>
                <a href="/api/instagram/diagnose?access_token=test" target="_blank">
                    <button>診断ツールを実行</button>
                </a>
                <a href="/api/instagram/reconnect" target="_blank">
                    <button>再認証エンドポイント</button>
                </a>
            </p>
        </div>
        
        <div class="section warning">
            <h2>⚠️ トラブルシューティング</h2>
            <ul>
                <li><strong>アプリIDが無効:</strong> Facebook開発者コンソールでアプリIDを確認</li>
                <li><strong>リダイレクトURI エラー:</strong> Facebookアプリ設定で有効なOAuthリダイレクトURIに追加</li>
                <li><strong>権限エラー:</strong> Facebookアプリですべての権限が承認されているか確認</li>
                <li><strong>Instagram Basic Display API廃止:</strong> 2024年12月4日で廃止、Instagram Graph APIへ移行必要</li>
            </ul>
        </div>
    </div>
</body>
</html>`;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error('Test auth page error:', error);
    return NextResponse.json(
      { error: 'Failed to generate test page', details: error.message },
      { status: 500 }
    );
  }
}