import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token');
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
  }

  console.log('=== Instagram Comprehensive Debug v2024 ===');
  
  try {
    const results: any = {};

    // 1. トークンの詳細情報
    console.log('1. 🔍 Debugging access token...');
    try {
      const debugTokenRes = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`
      );
      results.token_debug = await debugTokenRes.json();
      console.log('Token debug result:', results.token_debug);
    } catch (error) {
      results.token_debug = { error: error.message };
    }

    // 2. ユーザー基本情報
    console.log('2. 👤 Fetching user info...');
    try {
      const userRes = await fetch(
        `https://graph.facebook.com/v23.0/me?fields=id,name,email&access_token=${accessToken}`
      );
      results.user = await userRes.json();
      console.log('User info:', results.user);
    } catch (error) {
      results.user = { error: error.message };
    }

    // 3. 権限一覧
    console.log('3. 🔐 Checking permissions...');
    try {
      const permissionsRes = await fetch(
        `https://graph.facebook.com/v23.0/me/permissions?access_token=${accessToken}`
      );
      results.permissions = await permissionsRes.json();
      console.log('Permissions:', results.permissions);
    } catch (error) {
      results.permissions = { error: error.message };
    }

    // 4. Facebook Pages - 複数バージョンで試行
    console.log('4. 📄 Testing Facebook Pages API with multiple versions...');
    results.pages = {};
    
    // v23.0 (詳細)
    try {
      const pagesV23DetailedRes = await fetch(
        `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token,category,tasks,instagram_business_account{id,username,name}&access_token=${accessToken}`
      );
      results.pages.v23_detailed = {
        status: pagesV23DetailedRes.status,
        data: await pagesV23DetailedRes.json()
      };
      console.log('Pages v23.0 (detailed):', results.pages.v23_detailed);
    } catch (error) {
      results.pages.v23_detailed = { error: error.message };
    }

    // v23.0 (シンプル)
    try {
      const pagesV23SimpleRes = await fetch(
        `https://graph.facebook.com/v23.0/me/accounts?access_token=${accessToken}`
      );
      results.pages.v23_simple = {
        status: pagesV23SimpleRes.status,
        data: await pagesV23SimpleRes.json()
      };
      console.log('Pages v23.0 (simple):', results.pages.v23_simple);
    } catch (error) {
      results.pages.v23_simple = { error: error.message };
    }

    // 5. 管理しているビジネス
    console.log('5. 🏢 Checking businesses...');
    try {
      const businessesRes = await fetch(
        `https://graph.facebook.com/v23.0/me/businesses?access_token=${accessToken}`
      );
      results.businesses = await businessesRes.json();
      console.log('Businesses:', results.businesses);
    } catch (error) {
      results.businesses = { error: error.message };
    }

    // 6. Instagram Business Account直接確認
    console.log('6. 📱 Direct Instagram Business Account check...');
    try {
      const directIgRes = await fetch(
        `https://graph.facebook.com/v23.0/me?fields=instagram_business_account&access_token=${accessToken}`
      );
      results.direct_instagram = await directIgRes.json();
      console.log('Direct Instagram:', results.direct_instagram);
    } catch (error) {
      results.direct_instagram = { error: error.message };
    }

    // 7. アプリの詳細情報
    console.log('7. 📱 App info...');
    try {
      const appRes = await fetch(
        `https://graph.facebook.com/v23.0/app?access_token=${accessToken}`
      );
      results.app_info = await appRes.json();
      console.log('App info:', results.app_info);
    } catch (error) {
      results.app_info = { error: error.message };
    }

    // 8. 総合分析
    console.log('8. 📊 Analysis...');
    const analysis = {
      token_valid: results.token_debug?.data?.is_valid || false,
      token_type: results.token_debug?.data?.type || 'unknown',
      token_scopes: results.token_debug?.data?.scopes || [],
      user_id: results.user?.id || 'unknown',
      permissions_granted: results.permissions?.data?.filter((p: any) => p.status === 'granted').map((p: any) => p.permission) || [],
      pages_found_detailed: results.pages?.v23_detailed?.data?.data?.length || 0,
      pages_found_simple: results.pages?.v23_simple?.data?.data?.length || 0,
      has_instagram_permission: results.permissions?.data?.some((p: any) => p.permission.includes('instagram') && p.status === 'granted') || false,
      has_pages_permission: results.permissions?.data?.some((p: any) => p.permission.includes('pages') && p.status === 'granted') || false,
      direct_instagram_found: !!results.direct_instagram?.instagram_business_account,
      businesses_count: results.businesses?.data?.length || 0
    };

    console.log('=== Final Analysis ===');
    console.log(JSON.stringify(analysis, null, 2));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      debug_results: results,
      analysis: analysis,
      recommendations: generateRecommendations(analysis, results)
    });

  } catch (error) {
    console.error('Comprehensive debug error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function generateRecommendations(analysis: any, results: any) {
  const recommendations = [];

  if (!analysis.token_valid) {
    recommendations.push({
      type: 'error',
      message: 'アクセストークンが無効です。再認証が必要です。'
    });
  }

  if (analysis.pages_found_detailed === 0 && analysis.pages_found_simple === 0) {
    recommendations.push({
      type: 'warning',
      message: 'Facebookページが見つかりません。',
      actions: [
        'https://www.facebook.com/pages/create でFacebookページを作成',
        'ページの設定 > Instagram > アカウントをリンク',
        'Instagramアカウントをビジネスアカウントに変更'
      ]
    });
  }

  if (!analysis.has_instagram_permission) {
    recommendations.push({
      type: 'error',
      message: 'Instagram関連の権限が不足しています。',
      required_permissions: ['instagram_basic', 'instagram_manage_insights']
    });
  }

  if (!analysis.has_pages_permission) {
    recommendations.push({
      type: 'error', 
      message: 'Facebook Pages関連の権限が不足しています。',
      required_permissions: ['pages_show_list', 'pages_read_engagement']
    });
  }

  if (results.pages?.v23_detailed?.data?.error?.code === 200) {
    recommendations.push({
      type: 'info',
      message: 'Facebook App Reviewが必要な可能性があります。',
      details: 'pages_show_listなどの権限は本番環境でApp Reviewが必要です。'
    });
  }

  return recommendations;
}