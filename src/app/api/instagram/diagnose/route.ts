import { NextRequest, NextResponse } from 'next/server';

// Dynamic routeに設定
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const accessToken = searchParams.get('access_token');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Missing access token for diagnosis' },
        { status: 400 }
      );
    }

    console.log('🩺 Instagram Graph API v23 診断開始');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      api_version: 'v23.0',
      checks: []
    };

    // 1. トークンの権限確認
    try {
      const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`;
      const debugResponse = await fetch(debugUrl);
      const debugData = await debugResponse.json();
      
      diagnostics.checks.push({
        name: 'Token Permissions',
        status: debugData.data?.is_valid ? 'PASS' : 'FAIL',
        details: {
          is_valid: debugData.data?.is_valid,
          app_id: debugData.data?.app_id,
          scopes: debugData.data?.scopes || [],
          expires_at: debugData.data?.expires_at ? new Date(debugData.data.expires_at * 1000).toISOString() : null,
          token_type: debugData.data?.type
        }
      });
    } catch (error) {
      diagnostics.checks.push({
        name: 'Token Permissions',
        status: 'ERROR',
        error: error.message
      });
    }

    // 2. 必須権限の確認
    const requiredScopes2024 = [
      'business_management',
      'instagram_basic',
      'pages_show_list',
      'instagram_content_publish'
    ];
    
    const optionalScopes = [
      'pages_read_engagement',
      'instagram_manage_insights',
      'instagram_manage_comments'
    ];
    
    const tokenScopes = diagnostics.checks[0]?.details?.scopes || [];
    const missingRequired = requiredScopes2024.filter(scope => !tokenScopes.includes(scope));
    const missingOptional = optionalScopes.filter(scope => !tokenScopes.includes(scope));
    
    diagnostics.checks.push({
      name: 'Required Permissions (2024+)',
      status: missingRequired.length === 0 ? 'PASS' : 'FAIL',
      details: {
        granted: tokenScopes,
        missing_required: missingRequired,
        missing_optional: missingOptional,
        note: missingRequired.includes('business_management') ? 
          '⚠️ business_management権限は2024年以降に作成されたアカウントで必須です' : null
      }
    });

    // 3. ユーザー情報の確認
    try {
      const userResponse = await fetch(
        `https://graph.facebook.com/v23.0/me?fields=id,name,email&access_token=${accessToken}`
      );
      const userData = await userResponse.json();
      
      diagnostics.checks.push({
        name: 'User Account Access',
        status: userData.id ? 'PASS' : 'FAIL',
        details: {
          user_id: userData.id,
          name: userData.name,
          has_email: !!userData.email
        }
      });
    } catch (error) {
      diagnostics.checks.push({
        name: 'User Account Access',
        status: 'ERROR',
        error: error.message
      });
    }

    // 4. Facebookページの確認
    try {
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,category,access_token&access_token=${accessToken}`
      );
      const pagesData = await pagesResponse.json();
      
      const pageCount = pagesData.data?.length || 0;
      
      diagnostics.checks.push({
        name: 'Facebook Pages',
        status: pageCount > 0 ? 'PASS' : 'FAIL',
        details: {
          page_count: pageCount,
          pages: pagesData.data?.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            has_access_token: !!p.access_token
          })) || [],
          note: pageCount === 0 ? 'Facebookページが必要です。https://www.facebook.com/pages/create で作成してください。' : null
        }
      });
    } catch (error) {
      diagnostics.checks.push({
        name: 'Facebook Pages',
        status: 'ERROR',
        error: error.message
      });
    }

    // 5. Instagram Business Account接続の確認
    try {
      const igPagesResponse = await fetch(
        `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count,account_type}&access_token=${accessToken}`
      );
      const igPagesData = await igPagesResponse.json();
      
      const pagesWithInstagram = igPagesData.data?.filter(page => page.instagram_business_account) || [];
      
      diagnostics.checks.push({
        name: 'Instagram Business Account Connection',
        status: pagesWithInstagram.length > 0 ? 'PASS' : 'FAIL',
        details: {
          connected_count: pagesWithInstagram.length,
          total_pages: igPagesData.data?.length || 0,
          instagram_accounts: pagesWithInstagram.map(page => ({
            page_name: page.name,
            page_id: page.id,
            instagram: {
              id: page.instagram_business_account.id,
              username: page.instagram_business_account.username,
              name: page.instagram_business_account.name,
              followers_count: page.instagram_business_account.followers_count,
              media_count: page.instagram_business_account.media_count,
              account_type: page.instagram_business_account.account_type
            }
          })),
          troubleshooting: pagesWithInstagram.length === 0 ? [
            '1. Instagramアカウントがビジネスアカウントに変換されているか確認',
            '2. FacebookページとInstagramアカウントが連携されているか確認',
            '3. Facebook Business Managerで設定を確認',
            '4. 新しい設定の場合、24-48時間待つ必要があります'
          ] : null
        }
      });
    } catch (error) {
      diagnostics.checks.push({
        name: 'Instagram Business Account Connection',
        status: 'ERROR',
        error: error.message
      });
    }

    // 6. Instagram APIのテストコール
    const instagramConnectedPages = diagnostics.checks
      .find(c => c.name === 'Instagram Business Account Connection')
      ?.details?.instagram_accounts || [];
    
    if (instagramConnectedPages.length > 0) {
      try {
        const firstInstagram = instagramConnectedPages[0];
        const mediaResponse = await fetch(
          `https://graph.facebook.com/v23.0/${firstInstagram.instagram.id}/media?fields=id,media_type,media_url,caption,timestamp&limit=1&access_token=${accessToken}`
        );
        const mediaData = await mediaResponse.json();
        
        diagnostics.checks.push({
          name: 'Instagram API Access Test',
          status: !mediaData.error ? 'PASS' : 'FAIL',
          details: {
            account_tested: firstInstagram.instagram.username,
            media_accessible: !mediaData.error,
            sample_media_count: mediaData.data?.length || 0,
            api_error: mediaData.error || null
          }
        });
      } catch (error) {
        diagnostics.checks.push({
          name: 'Instagram API Access Test',
          status: 'ERROR',
          error: error.message
        });
      }
    } else {
      diagnostics.checks.push({
        name: 'Instagram API Access Test',
        status: 'SKIPPED',
        details: {
          reason: 'Instagram Business Accountが見つかりません'
        }
      });
    }

    // 診断結果のサマリー
    const passedChecks = diagnostics.checks.filter(c => c.status === 'PASS').length;
    const totalChecks = diagnostics.checks.length;
    const criticalFailures = diagnostics.checks.filter(c => 
      ['Token Permissions', 'Facebook Pages', 'Instagram Business Account Connection'].includes(c.name) 
      && c.status !== 'PASS'
    );

    diagnostics.summary = {
      overall_status: criticalFailures.length === 0 ? 'READY' : 'NEEDS_SETUP',
      passed_checks: passedChecks,
      total_checks: totalChecks,
      score: Math.round((passedChecks / totalChecks) * 100),
      recommendations: generateRecommendations(diagnostics.checks),
      next_steps: generateNextSteps(diagnostics.checks)
    };

    console.log('🩺 診断完了:', diagnostics.summary.overall_status);
    console.log(`📊 スコア: ${diagnostics.summary.score}% (${passedChecks}/${totalChecks})`);

    return NextResponse.json(diagnostics);

  } catch (error) {
    console.error('🚨 診断エラー:', error);
    return NextResponse.json(
      { 
        error: 'Diagnosis failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(checks) {
  const recommendations = [];
  
  checks.forEach(check => {
    if (check.status === 'FAIL') {
      switch (check.name) {
        case 'Token Permissions':
          recommendations.push('🔑 アクセストークンが無効です。再度ログインしてください。');
          break;
        case 'Required Permissions (2024+)':
          if (check.details.missing_required.includes('business_management')) {
            recommendations.push('🏢 business_management権限が必要です。これは2024年以降に作成されたアカウントで必須です。');
          }
          recommendations.push(`📋 不足している権限: ${check.details.missing_required.join(', ')}`);
          break;
        case 'Facebook Pages':
          recommendations.push('📄 Facebookページを作成し、管理者権限を確認してください。');
          break;
        case 'Instagram Business Account Connection':
          recommendations.push('📱 Instagramをビジネスアカウントに変換し、Facebookページと連携してください。');
          break;
        case 'Instagram API Access Test':
          recommendations.push('🔌 Instagram API へのアクセスに問題があります。権限を確認してください。');
          break;
      }
    }
  });
  
  return recommendations;
}

function generateNextSteps(checks) {
  const steps = [];
  
  // 権限不足の場合
  const permissionCheck = checks.find(c => c.name === 'Required Permissions (2024+)');
  if (permissionCheck?.status === 'FAIL') {
    steps.push('1. 新しい認証URLで必要な権限を再取得してください');
  }
  
  // Facebookページがない場合
  const pageCheck = checks.find(c => c.name === 'Facebook Pages');
  if (pageCheck?.status === 'FAIL') {
    steps.push('2. Facebookページを作成: https://www.facebook.com/pages/create');
  }
  
  // Instagram接続がない場合
  const igCheck = checks.find(c => c.name === 'Instagram Business Account Connection');
  if (igCheck?.status === 'FAIL') {
    steps.push('3. Instagramをビジネスアカウントに変換');
    steps.push('4. FacebookページとInstagramを連携');
    steps.push('5. 24-48時間待ってから再テスト');
  }
  
  if (steps.length === 0) {
    steps.push('✅ すべて正常です。Instagram APIを使用できます。');
  }
  
  return steps;
}