import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token');
  const instagramUserId = request.nextUrl.searchParams.get('instagram_user_id');

  console.log('=== Instagram Real Data API (DEBUG MODE) ===');
  console.log('Token:', accessToken ? 'Present' : 'Missing');
  console.log('User ID:', instagramUserId);

  if (!accessToken || !instagramUserId) {
    return NextResponse.json({ 
      connected: false, 
      error: 'Missing parameters' 
    }, { status: 400 });
  }

  try {
    // 段階的デバッグ: 最初に基本レスポンスをテスト
    console.log('🔍 DEBUG: Starting API execution...');
    console.log('🔍 DEBUG: Access token length:', accessToken?.length || 0);
    console.log('🔍 DEBUG: User ID:', instagramUserId);
    
    // まず簡単なFacebook Graph APIテストを実行
    console.log('🔍 Step 0: Testing basic Facebook Graph API connection...');
    const basicTestResponse = await fetch(
      `https://graph.facebook.com/v23.0/me?access_token=${accessToken}`
    );
    console.log('🔍 Basic test response status:', basicTestResponse.status);
    
    if (!basicTestResponse.ok) {
      const errorData = await basicTestResponse.json();
      console.error('❌ Basic Facebook API test failed:', errorData);
      return NextResponse.json({
        connected: false,
        error: 'FACEBOOK_API_TEST_FAILED',
        message: `Facebook APIの基本テストに失敗: ${errorData.error?.message || 'Unknown error'}`,
        details: errorData
      }, { status: 500 });
    }
    
    const basicUserData = await basicTestResponse.json();
    console.log('✅ Basic test successful, user:', basicUserData.name);
    
    // Facebook Graph API を使用（Instagram Business Account用）
    console.log('🔍 Step 1: Fetching Facebook Pages...');
    
    // まずFacebookページを取得
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v23.0/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesResponse.json();
    
    console.log('📄 Pages Response Status:', pagesResponse.status);
    console.log('📄 Pages found:', pagesData.data?.length || 0);
    
    if (pagesData.error) {
      console.error('❌ Pages API Error:', pagesData.error);
      return NextResponse.json({
        connected: false,
        error: 'PAGES_API_ERROR',
        message: `Facebook Pages APIエラー: ${pagesData.error.message}`,
        details: pagesData.error
      });
    }
    
    if (!pagesData.data || pagesData.data.length === 0) {
      console.log('⚠️ No Facebook pages found, trying user-level Instagram connection...');
      
      // ユーザーレベルでInstagram Basic Display APIを試す
      try {
        const userMediaResponse = await fetch(
          `https://graph.facebook.com/v23.0/me?fields=id,name&access_token=${accessToken}`
        );
        const userMediaData = await userMediaResponse.json();
        
        if (userMediaData.id) {
          console.log('✅ User-level connection available, but returning empty data as no Instagram Business Account found');
          
          return NextResponse.json({
            connected: false,
            error: 'NO_FACEBOOK_PAGES',
            message: 'Facebookページが見つかりません。Instagram Business Accountを使用するには、まずFacebookページを作成し、Instagramアカウントを連携してください。',
            user_info: {
              id: userMediaData.id,
              name: userMediaData.name
            }
          });
        }
      } catch (userError) {
        console.error('User-level connection failed:', userError);
      }
      
      // フォールバック: デモデータを返す（開発時のみ）
      console.log('⚠️ Returning demo data as fallback...');
      
      const demoPosts = generateSamplePostsForDemo();
      const demoFollowerHistory = generateSampleFollowerHistory();
      
      return NextResponse.json({
        connected: true,
        connectionType: 'demo',
        profile: {
          id: 'demo_user',
          username: 'Demo User',
          name: 'Demo User',
          account_type: 'DEMO',
          followers_count: 8634,
          media_count: 15,
          biography: 'This is demo data - please connect your Instagram Business Account',
          profile_picture_url: null
        },
        posts: demoPosts,
        follower_history: {
          hasData: true,
          data: demoFollowerHistory,
          dataPoints: demoFollowerHistory.length
        },
        insights_summary: {
          total_reach: demoPosts.reduce((sum, p) => sum + (p.data_7d?.reach || 0), 0),
          total_impressions: demoPosts.reduce((sum, p) => sum + (p.data_7d?.reach || 0), 0),
          total_saves: demoPosts.reduce((sum, p) => sum + (p.data_7d?.saves || 0), 0),
          average_engagement: demoPosts.length > 0 ? 
            demoPosts.reduce((sum, p) => sum + (p.data_7d?.likes || 0) + (p.data_7d?.saves || 0), 0) / demoPosts.length : 0
        },
        message: '⚠️ デモデータを表示中 - Instagram Business Accountを接続してください',
        demo_mode: true
      });
    }

    // ページのアクセストークンを取得
    const page = pagesData.data[0];
    const pageAccessToken = page.access_token;
    
    console.log('📄 Page Details:', {
      pageId: page.id,
      pageName: page.name,
      hasPageToken: !!pageAccessToken,
      pageTokenPreview: pageAccessToken ? `${pageAccessToken.substring(0, 15)}...` : 'none',
      userTokenPreview: accessToken ? `${accessToken.substring(0, 15)}...` : 'none'
    });

    // Instagram Business Accountを取得
    console.log('🔍 Step 2: Checking Instagram Business Account connection...');
    const igRes = await fetch(
      `https://graph.facebook.com/v23.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );
    const igData = await igRes.json();

    if (igData.error) {
      console.error('❌ Instagram Business Account check error:', igData.error);
      return NextResponse.json({
        connected: false,
        error: 'IG_BUSINESS_ERROR',
        message: `Instagram Business Account確認エラー: ${igData.error.message}`
      });
    }

    if (!igData.instagram_business_account) {
      return NextResponse.json({
        connected: false,
        error: 'NO_INSTAGRAM_CONNECTION',
        message: 'InstagramがFacebookページに接続されていません。Facebookページの設定でInstagramアカウントを連携してください。'
      });
    }

    const igBusinessId = igData.instagram_business_account.id;
    console.log('📱 Instagram Business Account ID:', igBusinessId);

    // Step 2: Instagram Business Accountのプロフィール情報を取得
    console.log('📊 Step 2: Fetching Instagram profile...');
    
    const profileResponse = await fetch(
      `https://graph.facebook.com/v23.0/${igBusinessId}?fields=id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url&access_token=${pageAccessToken}`
    );
    const profileData = await profileResponse.json();
    
    if (profileData.error) {
      console.error('Profile error:', profileData.error);
      return NextResponse.json({
        connected: false,
        error: 'PROFILE_ERROR',
        message: 'プロフィール情報の取得に失敗しました',
        details: profileData.error
      });
    }

    console.log('✅ Profile data:', {
      username: profileData.username,
      followers: profileData.followers_count
    });

    // Step 3: 最新の投稿とインサイトを取得
    console.log('📈 Step 3: Fetching posts with insights...');
    
    // まず投稿の基本情報を取得
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v23.0/${igBusinessId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=28&access_token=${pageAccessToken}`
    );
    const mediaData = await mediaResponse.json();
    
    if (mediaData.error) {
      console.error('Media error:', mediaData.error);
      return NextResponse.json({
        connected: true,
        profile: profileData,
        posts: [],
        error: 'MEDIA_ERROR',
        message: 'メディアデータの取得に失敗しました',
        details: mediaData.error
      });
    }

    console.log('✅ Found', mediaData.data?.length || 0, 'posts');
    
    // 各投稿のインサイトを個別に取得
    const postsWithInsights = [];
    for (const post of (mediaData.data || [])) {
      try {
        console.log(`📊 Fetching insights for post ${post.id}...`);
        
        // Instagram Graph API v23で利用可能なメトリクスのみ使用
        let metricsToFetch = 'reach,saved'; // impressions,playsは v22.0以降廃止
        
        // メディアタイプ別の追加メトリクス（v23対応）
        if (post.media_type === 'VIDEO' || post.media_type === 'REELS') {
          metricsToFetch = 'reach,saved'; // plays廃止のため削除
        } else if (post.media_type === 'CAROUSEL_ALBUM') {
          metricsToFetch = 'reach,saved'; // carousel用
        }
        
        const insightsUrl = `https://graph.facebook.com/v23.0/${post.id}/insights?metric=${metricsToFetch}&access_token=${pageAccessToken}`;
        console.log(`🔍 Fetching insights for post ${post.id}:`);
        console.log(`   URL: ${insightsUrl.replace(pageAccessToken, 'TOKEN_HIDDEN')}`);
        console.log(`   Metrics: ${metricsToFetch}`);
        console.log(`   Media Type: ${post.media_type}`);
        console.log(`   🔑 Token Debug Info:`);
        console.log(`      Page Access Token Length: ${pageAccessToken?.length || 0}`);
        console.log(`      Token Preview: ${pageAccessToken ? `${pageAccessToken.substring(0, 10)}...${pageAccessToken.substring(pageAccessToken.length - 10)}` : 'undefined'}`);
        console.log(`      Original Access Token Length: ${accessToken?.length || 0}`);
        console.log(`      Original Token Preview: ${accessToken ? `${accessToken.substring(0, 10)}...${accessToken.substring(accessToken.length - 10)}` : 'undefined'}`);
        
        // 🔍 Token validation before insights call
        console.log(`   🔍 Validating page access token before insights call...`);
        try {
          const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${pageAccessToken}&access_token=${pageAccessToken}`;
          const debugResponse = await fetch(debugTokenUrl);
          const debugData = await debugResponse.json();
          
          if (debugData.error) {
            console.error(`❌ Page token validation failed:`, debugData.error);
            console.error(`   Error Code: ${debugData.error.code}`);
            console.error(`   Error Message: ${debugData.error.message}`);
          } else if (debugData.data) {
            console.log(`✅ Page token is valid:`);
            console.log(`   Valid: ${debugData.data.is_valid}`);
            console.log(`   App ID: ${debugData.data.app_id}`);
            console.log(`   Scopes: ${debugData.data.scopes?.join(', ') || 'none'}`);
            console.log(`   Expires: ${debugData.data.expires_at ? new Date(debugData.data.expires_at * 1000) : 'never'}`);
          }
        } catch (debugError) {
          console.error(`❌ Page token debug failed:`, debugError.message);
        }
        
        const insightsResponse = await fetch(insightsUrl);
        console.log(`📊 Insights response status: ${insightsResponse.status} ${insightsResponse.statusText}`);
        
        const insightsData = await insightsResponse.json();
        
        if (insightsData.error) {
          console.error(`❌ Insights API Error for post ${post.id}:`, {
            code: insightsData.error.code,
            message: insightsData.error.message,
            type: insightsData.error.type,
            fbtrace_id: insightsData.error.fbtrace_id
          });
        }
        
        console.log(`📈 Insights response for ${post.id}:`, {
          hasData: !!insightsData.data,
          dataLength: insightsData.data?.length || 0,
          error: insightsData.error,
          metrics: insightsData.data?.map(d => ({
            name: d.name,
            hasValues: !!d.values,
            valueCount: d.values?.length || 0,
            firstValue: d.values?.[0]?.value,
            period: d.period
          })) || []
        });
        
        // インサイトデータをpostオブジェクトに追加
        post.insights = insightsData;
        postsWithInsights.push(post);
        
      } catch (insightError) {
        console.error(`Failed to fetch insights for post ${post.id}:`, insightError);
        // インサイトが取得できない場合も投稿自体は含める
        post.insights = { data: [] };
        postsWithInsights.push(post);
      }
    }
    
    console.log('✅ Processed', postsWithInsights.length, 'posts with insights');

    // Step 4: データを整形
    const posts = postsWithInsights.map((post: any, index: number) => {
      // インサイトデータを抽出
      const insights: any = {};
      if (post.insights?.data) {
        post.insights.data.forEach((metric: any) => {
          // メトリクスによっては期間別のデータがある場合がある
          if (metric.values && metric.values.length > 0) {
            insights[metric.name] = metric.values[0].value || 0;
          } else {
            insights[metric.name] = 0;
          }
        });
      }

      // インサイトデータから個別のメトリクスを抽出（v23対応）
      const reach = insights.reach || 0;
      const saves = insights.saved || 0;
      const likes = post.like_count || 0;
      const comments = post.comments_count || 0;
      
      // engagementはreach基準で計算（impressionsが廃止されたため）
      const engagement = reach > 0 ? Math.round((likes + comments + saves) * 100 / reach) : 0;

      // デバッグ: 取得できたインサイトを確認
      if (index < 3) { // 最初の3投稿のみログ出力
        console.log(`Post ${post.id} processed insights:`, {
          raw_insights: insights,
          reach: reach,
          saves: saves,
          likes: likes,
          comments: comments,
          engagement: engagement
        });
      }

      
      return {
        id: post.id,
        caption: post.caption || '',
        title: post.caption?.substring(0, 50) || `投稿 ${index + 1}`,
        date: new Date(post.timestamp).toLocaleDateString('ja-JP'),
        timestamp: post.timestamp,
        media_type: post.media_type,
        media_url: post.media_url,
        thumbnail_url: post.thumbnail_url,
        permalink: post.permalink,
        like_count: likes,
        comments_count: post.comments_count || 0,
        
        // Instagram Graph APIの制限により、期間別データは利用できません
        // 実際のlifetimeデータのみ提供します（v23対応）
        lifetime_data: {
          reach: reach,
          likes: likes,
          saves: saves,
          comments: comments,
          engagement: engagement,
          note: "Instagram Graph API v23では reach と saved のみ利用可能です"
        },
        
        // 実際のインサイトデータ（v23対応）
        insights: {
          reach: reach,
          saved: saves,
          likes: likes,
          comments: comments,
          engagement: engagement,
          shares: insights.shares || 0,
          total_interactions: likes + comments + saves
        },
        
        // パフォーマンスランキング（実際のデータに基づく）
        rankings: calculateRankings(post, postsWithInsights, insights)
      };
    });

    // Step 5: フォロワー推移（データベースから取得、なければ現在値のみ）
    console.log('🔍 Attempting to get follower history...');
    const followerHistory = await getFollowerHistory(igBusinessId, profileData.followers_count).catch(historyError => {
      console.warn('⚠️ Follower history fetch failed:', historyError.message);
      console.warn('⚠️ Using fallback single data point');
      const safeFallbackFollowers = Math.max(0, parseInt(profileData.followers_count) || 0);
      return [{
        date: new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
        followers: safeFallbackFollowers
      }];
    });
    console.log('✅ Follower history result:', followerHistory.length, 'records');

    // デバッグ用: 最初の投稿のインサイト詳細を記録
    const firstPostDebug = postsWithInsights[0] ? {
      id: postsWithInsights[0].id,
      hasInsights: !!postsWithInsights[0].insights,
      insightsData: postsWithInsights[0].insights?.data?.length || 0,
      insightsError: postsWithInsights[0].insights?.error,
      rawInsights: postsWithInsights[0].insights
    } : null;

    // 成功レスポンス
    return NextResponse.json({
      connected: true,
      connectionType: 'business',
      profile: {
        id: profileData.id,
        username: profileData.username,
        name: profileData.name,
        biography: profileData.biography,
        followers_count: profileData.followers_count,
        follows_count: profileData.follows_count,
        media_count: profileData.media_count,
        profile_picture_url: profileData.profile_picture_url,
        account_type: 'BUSINESS'
      },
      posts: posts,
      follower_history: {
        hasData: true,
        data: followerHistory,
        dataPoints: followerHistory.length,
        startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP'),
        endDate: new Date().toLocaleDateString('ja-JP')
      },
      insights_summary: {
        total_reach: posts.reduce((sum: number, p: any) => sum + (p.insights.reach || 0), 0),
        total_saves: posts.reduce((sum: number, p: any) => sum + (p.insights.saved || 0), 0),
        total_likes: posts.reduce((sum: number, p: any) => sum + (p.insights.likes || 0), 0),
        total_comments: posts.reduce((sum: number, p: any) => sum + (p.insights.comments || 0), 0),
        average_engagement: posts.length > 0 ? 
          posts.reduce((sum: number, p: any) => sum + (p.insights.engagement || 0), 0) / posts.length : 0
      },
      message: '✅ Instagram Business Accountの実データを取得しました',
      // デバッグ情報を追加（本番環境でのトラブルシューティング用）
      debug: {
        firstPostInsights: firstPostDebug,
        tokenInfo: {
          originalTokenLength: accessToken?.length || 0,
          pageTokenExists: !!pageAccessToken,
          pageTokenLength: pageAccessToken?.length || 0,
          tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'none'
        },
        apiInfo: {
          fbAppId: process.env.INSTAGRAM_CLIENT_ID || process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
          pageId: page?.id,
          igBusinessId: igBusinessId,
          postsWithInsightsCount: postsWithInsights.length,
          totalPosts: posts.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Instagram Data API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      cause: error instanceof Error ? error.cause : undefined
    });
    
    return NextResponse.json({
      connected: false,
      error: 'API_ERROR',
      message: 'APIエラーが発生しました',
      details: error instanceof Error ? error.message : String(error),
      errorType: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      debugInfo: {
        hasToken: !!accessToken,
        hasUserId: !!instagramUserId,
        timestamp: new Date().toISOString(),
        errorLocation: 'main_catch_block'
      }
    }, { status: 500 });
  }
}

// ランキング計算（実データベース）
function calculateRankings(post: any, allPosts: any[], insights: any) {
  const sortedByReach = [...allPosts].sort((a, b) => {
    const aReach = a.insights?.data?.find((m: any) => m.name === 'reach')?.values?.[0]?.value || 0;
    const bReach = b.insights?.data?.find((m: any) => m.name === 'reach')?.values?.[0]?.value || 0;
    return bReach - aReach;
  });
  
  const sortedBySaves = [...allPosts].sort((a, b) => {
    const aSaves = a.insights?.data?.find((m: any) => m.name === 'saved')?.values?.[0]?.value || 0;
    const bSaves = b.insights?.data?.find((m: any) => m.name === 'saved')?.values?.[0]?.value || 0;
    return bSaves - aSaves;
  });

  const reachRank = sortedByReach.findIndex(p => p.id === post.id) + 1;
  const savesRank = sortedBySaves.findIndex(p => p.id === post.id) + 1;

  // 保存率でランキング
  const reach = insights.reach || 0;
  const saved = insights.saved || 0;
  const savesRate = reach > 0 ? (saved / reach) * 100 : 0;
  const sortedBySavesRate = [...allPosts].sort((a, b) => {
    const aReach = a.insights?.data?.find((m: any) => m.name === 'reach')?.values?.[0]?.value || 1;
    const aSaves = a.insights?.data?.find((m: any) => m.name === 'saved')?.values?.[0]?.value || 0;
    const bReach = b.insights?.data?.find((m: any) => m.name === 'reach')?.values?.[0]?.value || 1;
    const bSaves = b.insights?.data?.find((m: any) => m.name === 'saved')?.values?.[0]?.value || 0;
    return (bSaves/bReach) - (aSaves/aReach);
  });
  const savesRateRank = sortedBySavesRate.findIndex(p => p.id === post.id) + 1;

  return {
    saves_rate: savesRateRank || 1,
    home_rate: reachRank || 1,
    profile_access_rate: reachRank || 1,
    follower_conversion_rate: savesRateRank || 1
  };
}

// デモ用サンプルデータ生成
function generateSamplePostsForDemo() {
  return [
    {
      id: 'demo_1',
      caption: '新年の目標設定について✨ 今年こそは継続できる習慣を身につけたいですね！',
      title: '新年の目標設定について',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP'),
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      media_type: 'IMAGE',
      like_count: 234,
      comments_count: 18,
      data_24h: { reach: 1850, likes: 234, saves: 56, profile_views: 89, follows: 12 },
      data_7d: { reach: 2650, likes: 334, saves: 78, profile_views: 98, follows: 15 },
      insights: { reach: 2650, impressions: 3200, saved: 78, engagement: 430 },
      rankings: { saves_rate: 2, home_rate: 1, profile_access_rate: 3, follower_conversion_rate: 2 }
    },
    {
      id: 'demo_2',
      caption: 'カフェで見つけた美味しいパンケーキ🥞 週末の小さな幸せです',
      title: 'カフェで見つけた美味しいパンケーキ',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP'),
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      media_type: 'CAROUSEL_ALBUM',
      like_count: 187,
      comments_count: 12,
      data_24h: { reach: 1420, likes: 187, saves: 34, profile_views: 67, follows: 8 },
      data_7d: { reach: 1950, likes: 267, saves: 45, profile_views: 74, follows: 9 },
      insights: { reach: 1950, impressions: 2340, saved: 45, engagement: 324 },
      rankings: { saves_rate: 3, home_rate: 2, profile_access_rate: 4, follower_conversion_rate: 3 }
    },
    {
      id: 'demo_3',
      caption: '朝のルーティン公開！ 早起きして運動することで一日が充実します💪',
      title: '朝のルーティン公開',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP'),
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      media_type: 'REELS',
      like_count: 456,
      comments_count: 32,
      data_24h: { reach: 3240, likes: 456, saves: 89, profile_views: 124, follows: 18 },
      data_7d: { reach: 4680, likes: 623, saves: 124, profile_views: 142, follows: 21 },
      insights: { reach: 4680, impressions: 5890, saved: 124, engagement: 779 },
      rankings: { saves_rate: 1, home_rate: 1, profile_access_rate: 1, follower_conversion_rate: 1 }
    }
  ];
}

function generateSampleFollowerHistory() {
  const history = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    history.push({
      date: date.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
      followers: 8634 - (i * 10) + Math.floor(Math.random() * 20)
    });
  }
  return history;
}

// フォロワー履歴取得（データベースから実際のデータを取得）
async function getFollowerHistory(instagramUserId: string, currentFollowers: number) {
  // データベースから履歴を取得（Supabase利用時）
  try {
    if (typeof window === 'undefined') { // サーバーサイドでのみ実行
      console.log('Attempting to fetch follower history from database...');
      
      // Supabaseインポートを安全に試行
      console.log('🔍 Attempting to import Supabase module...');
      const supabaseModule = await import('@/lib/supabase').catch((importError) => {
        console.warn('⚠️ Supabase import failed:', importError.message);
        console.warn('⚠️ Import error details:', {
          name: importError.name,
          stack: importError.stack?.substring(0, 500)
        });
        return null;
      });
      
      if (supabaseModule?.supabase) {
        console.log('Supabase connection available, querying follower history...');
        const { data: history, error } = await supabaseModule.supabase
          .from('follower_history')
          .select('date, follower_count')
          .eq('instagram_user_id', instagramUserId)
          .order('date', { ascending: true })
          .limit(30);
          
        if (error) {
          console.warn('Supabase query error:', error);
        } else if (history && history.length > 0) {
          console.log(`Found ${history.length} follower history records`);
          return history.map(h => ({
            date: new Date(h.date).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
            followers: Math.max(0, parseInt(h.follower_count) || 0) // NaN防止
          }));
        }
      }
    }
  } catch (error) {
    console.warn('Could not fetch follower history from database:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // フォールバック: 現在の値のみ
  const safeFollowers = Math.max(0, parseInt(currentFollowers) || 0);
  return [{
    date: new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
    followers: safeFollowers
  }];
}