import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token');
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
  }

  console.log('=== Facebook Debug API ===');
  
  try {
    const results: any = {};

    // 1. ユーザー情報
    console.log('1. Fetching user info...');
    const userRes = await fetch(
      `https://graph.facebook.com/v23.0/me?fields=id,name,email&access_token=${accessToken}`
    );
    results.user = await userRes.json();

    // 2. ページ一覧（シンプル）
    console.log('2. Fetching pages (simple)...');
    const pagesSimpleRes = await fetch(
      `https://graph.facebook.com/v23.0/me/accounts?access_token=${accessToken}`
    );
    results.pages_simple = await pagesSimpleRes.json();

    // 3. ページ一覧（詳細）
    console.log('3. Fetching pages (detailed)...');
    const pagesDetailedRes = await fetch(
      `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`
    );
    results.pages_detailed = await pagesDetailedRes.json();

    // 4. 管理しているページ
    console.log('4. Fetching managed pages...');
    const managedPagesRes = await fetch(
      `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,category,tasks&access_token=${accessToken}`
    );
    results.managed_pages = await managedPagesRes.json();

    // 5. アクセス可能なビジネス
    console.log('5. Fetching businesses...');
    const businessesRes = await fetch(
      `https://graph.facebook.com/v23.0/me/businesses?access_token=${accessToken}`
    );
    results.businesses = await businessesRes.json();

    // 6. 権限の詳細確認
    console.log('6. Checking permissions...');
    const permissionsRes = await fetch(
      `https://graph.facebook.com/v23.0/me/permissions?access_token=${accessToken}`
    );
    results.permissions = await permissionsRes.json();

    // 7. トークンのデバッグ情報
    console.log('7. Debug token info...');
    const debugTokenRes = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`
    );
    results.token_debug = await debugTokenRes.json();

    console.log('=== Debug Results ===');
    console.log(JSON.stringify(results, null, 2));

    return NextResponse.json({
      success: true,
      debug_info: results,
      summary: {
        user_id: results.user?.id,
        user_name: results.user?.name,
        pages_count: results.pages_simple?.data?.length || 0,
        permissions_count: results.permissions?.data?.length || 0,
        businesses_count: results.businesses?.data?.length || 0,
        token_valid: results.token_debug?.data?.is_valid || false,
        token_scopes: results.token_debug?.data?.scopes || []
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}