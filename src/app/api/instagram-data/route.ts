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

  // デバッグ: 最小限のレスポンスでテスト
  try {
    console.log('🔍 Testing basic API functionality...');
    
    // 簡単なテストレスポンスを返す
    return NextResponse.json({
      connected: true,
      debug: true,
      message: '✅ API endpoint is working - basic test successful',
      receivedParams: {
        hasToken: !!accessToken,
        tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : null,
        userId: instagramUserId
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Even basic API test failed:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({
      connected: false,
      error: 'BASIC_API_ERROR',
      message: 'Basic API functionality test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }

  // 元のコードは一時的にコメントアウト
  /*
  try {
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
    
    console.log('📄 Using page:', page.name);

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
        
        // インサイトを個別に取得（メディアタイプに応じて適切なメトリクスを使用）
        let metricsToFetch = 'impressions,reach,saved';
        
        // Reelsの場合は再生回数も取得
        if (post.media_type === 'VIDEO' || post.media_type === 'REELS') {
          metricsToFetch = 'impressions,reach,saved,plays';
        }
        
        const insightsResponse = await fetch(
          `https://graph.facebook.com/v23.0/${post.id}/insights?metric=${metricsToFetch}&access_token=${pageAccessToken}`
        );
        const insightsData = await insightsResponse.json();
        
        console.log(`  Insights response for ${post.id}:`, {
          hasData: !!insightsData.data,
          dataLength: insightsData.data?.length || 0,
          error: insightsData.error,
          metrics: insightsData.data?.map(d => ({
            name: d.name,
            value: d.values?.[0]?.value
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

      // デバッグ: 取得できたインサイトを確認
      if (index < 3) { // 最初の3投稿のみログ出力
        console.log(`Post ${post.id} processed insights:`, {
          raw_insights: insights,
          reach: reach,
          impressions: impressions,
          saves: saves,
          plays: plays,
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
        
        // 実際のデータのみ使用（推定値は使用しない）
        data_24h: {
          reach: reach,
          likes: likes,
          saves: saves,
          impressions: impressions,
          engagement: engagement
        },
        data_7d: {
          reach: reach,
          likes: likes,
          saves: saves,
          impressions: impressions,
          engagement: engagement
        },
        
        // 実際のインサイトデータ
        insights: {
          reach: reach,
          impressions: impressions,
          saved: saves,
          engagement: engagement,
          shares: insights.shares || 0,
          plays: plays,
          total_interactions: engagement
        },
        
        // パフォーマンスランキング（実際のデータに基づく）
        rankings: calculateRankings(post, postsWithInsights, insights)
      };
    });

    // Step 5: フォロワー推移（データベースから取得、なければ現在値のみ）
    const followerHistory = await getFollowerHistory(igBusinessId, profileData.followers_count);

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
        total_impressions: posts.reduce((sum: number, p: any) => sum + (p.insights.impressions || 0), 0),
        total_saves: posts.reduce((sum: number, p: any) => sum + (p.insights.saved || 0), 0),
        average_engagement: posts.length > 0 ? 
          posts.reduce((sum: number, p: any) => sum + (p.insights.engagement || 0), 0) / posts.length : 0
      },
      message: '✅ Instagram Business Accountの実データを取得しました'
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
      errorType: error instanceof Error ? error.name : 'Unknown'
    }, { status: 500 });
  }
  */
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
  const savesRate = insights.reach > 0 ? (insights.saved / insights.reach) * 100 : 0;
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
      const supabaseModule = await import('@/lib/supabase').catch((importError) => {
        console.warn('Supabase import failed:', importError.message);
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
            followers: h.follower_count
          }));
        }
      }
    }
  } catch (error) {
    console.warn('Could not fetch follower history from database:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // フォールバック: 現在の値のみ
  return [{
    date: new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
    followers: currentFollowers
  }];
}