import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token');
  const instagramUserId = request.nextUrl.searchParams.get('instagram_user_id');

  console.log('=== Instagram Real Data API ===');
  console.log('Token:', accessToken ? 'Present' : 'Missing');
  console.log('User ID:', instagramUserId);

  if (!accessToken || !instagramUserId) {
    return NextResponse.json({ 
      connected: false, 
      error: 'Missing parameters' 
    }, { status: 400 });
  }

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
      // Facebookページがない場合はユーザーレベルでデモデータを返す
      console.log('⚠️ No Facebook pages found, returning demo data...');
      
      // デモ用投稿データを生成
      const demoPosts = generateSamplePostsForDemo();
      const demoFollowerHistory = generateSampleFollowerHistory();
      
      return NextResponse.json({
        connected: true,
        connectionType: 'user_level',
        profile: {
          id: 'demo_user',
          username: 'Instagram User',
          name: 'Instagram User',
          account_type: 'USER_LEVEL',
          followers_count: 8634,
          media_count: 15,
          biography: '',
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
        message: '🔍 Facebook Pages APIから空のレスポンスが返されました。デモデータを表示しています。',
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
    
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v23.0/${igBusinessId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,insights.metric(reach,impressions,saved,engagement,shares,plays,total_interactions)&limit=28&access_token=${pageAccessToken}`
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

    // Step 4: データを整形
    const posts = (mediaData.data || []).map((post: any, index: number) => {
      // インサイトデータを抽出
      const insights: any = {};
      if (post.insights?.data) {
        post.insights.data.forEach((metric: any) => {
          insights[metric.name] = metric.values?.[0]?.value || 0;
        });
      }

      // 24時間と7日間のデータ（実際は同じデータを使用、APIの制限）
      const reach = insights.reach || 0;
      const likes = post.like_count || 0;
      const saves = insights.saved || 0;
      const impressions = insights.impressions || 0;
      const engagement = insights.engagement || 0;
      
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
          plays: insights.plays || 0,
          total_interactions: insights.total_interactions || engagement
        },
        
        // パフォーマンスランキング（実際のデータに基づく）
        rankings: calculateRankings(post, mediaData.data, insights)
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
    console.error('❌ API Error:', error);
    return NextResponse.json({
      connected: false,
      error: 'API_ERROR',
      message: 'APIエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
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
      const { supabase } = await import('@/lib/supabase');
      
      if (supabase) {
        const { data: history } = await supabase
          .from('follower_history')
          .select('date, follower_count')
          .eq('instagram_user_id', instagramUserId)
          .order('date', { ascending: true })
          .limit(30);
          
        if (history && history.length > 0) {
          return history.map(h => ({
            date: new Date(h.date).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
            followers: h.follower_count
          }));
        }
      }
    }
  } catch (error) {
    console.log('Could not fetch follower history from database, using current value only');
  }
  
  // フォールバック: 現在の値のみ
  return [{
    date: new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
    followers: currentFollowers
  }];
}