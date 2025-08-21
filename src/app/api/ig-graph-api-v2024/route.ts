import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token');
  const instagramUserId = request.nextUrl.searchParams.get('instagram_user_id');

  console.log('=== IG GRAPH API V2024 - NEW ENDPOINT ===');
  console.log('Token:', accessToken ? 'Present' : 'Missing');
  console.log('User ID:', instagramUserId);

  if (!accessToken || !instagramUserId) {
    return NextResponse.json({ 
      connected: false, 
      error: 'MISSING_PARAMETERS',
      message: 'アクセストークンまたはInstagram User IDが不足しています。' 
    }, { status: 400 });
  }

  // まずアクセストークンの有効性をチェック
  console.log('🔍 Step 0: Validating access token...');
  try {
    const tokenValidationRes = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`
    );
    const tokenValidationData = await tokenValidationRes.json();
    
    console.log('🔍 Token validation result:', tokenValidationData);
    
    if (tokenValidationData.error || !tokenValidationData.data?.is_valid) {
      console.error('❌ Invalid access token:', tokenValidationData);
      return NextResponse.json({
        connected: false,
        error: 'INVALID_TOKEN',
        message: 'アクセストークンが無効です。再認証が必要です。',
        details: tokenValidationData.error?.message || 'Token validation failed',
        action: {
          type: 'reconnect',
          url: '/api/instagram/connect'
        }
      }, { status: 401 });
    }
    
    console.log('✅ Access token is valid');
  } catch (tokenError) {
    console.error('❌ Token validation failed:', tokenError);
    return NextResponse.json({
      connected: false,
      error: 'TOKEN_VALIDATION_FAILED',
      message: 'アクセストークンの検証に失敗しました。再認証してください。',
      action: {
        type: 'reconnect',
        url: '/api/instagram/connect'
      }
    }, { status: 401 });
  }

  try {
    // Facebook Graph API を使用（Instagram Business Account用）
    console.log('🔍 Step 1: Fetching Facebook Pages with multiple API versions...');
    
    // 複数のAPIバージョンで試行
    let pagesResponse, pagesData;
    
    // まずv23.0で試行
    try {
      console.log('📄 Trying v23.0...');
      pagesResponse = await fetch(
        `https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${accessToken}`
      );
      pagesData = await pagesResponse.json();
      
      // エラーまたは空データの場合、フォールバックで再試行
      if (pagesData.error || !pagesData.data || pagesData.data.length === 0) {
        console.log('📄 Retrying with fallback approach...');
        pagesResponse = await fetch(
          `https://graph.facebook.com/v23.0/me/accounts?access_token=${accessToken}`
        );
        pagesData = await pagesResponse.json();
      }
    } catch (error) {
      console.error('❌ Pages API network error:', error);
      pagesData = { error: { message: 'Network error' } };
    }
    
    console.log('📄 Pages Response Status:', pagesResponse.status);
    console.log('📄 Pages found:', pagesData.data?.length || 0);
    console.log('📄 Full pages response:', JSON.stringify(pagesData, null, 2));
    
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
      console.log('⚠️ No Facebook pages found, trying user-level Instagram data...');
      
      // Facebook Graph APIでユーザー情報を取得
      try {
        console.log('👤 Fetching user profile information...');
        const userProfileRes = await fetch(
          `https://graph.facebook.com/v23.0/me?fields=id,name,email&access_token=${accessToken}`
        );
        const userProfile = await userProfileRes.json();
        
        if (userProfile.error) {
          console.error('❌ User profile error:', userProfile.error);
          throw new Error('Failed to fetch user profile');
        }
        
        console.log('✅ User profile:', userProfile);
        
        // サンプルデータで応答（実際のFacebookページ/Instagram Business Account接続を促すメッセージ付き）
        return NextResponse.json({
          connected: true,
          connectionType: 'user_level',
          profile: {
            id: userProfile.id,
            username: userProfile.name || 'Instagram User',
            name: userProfile.name || 'Instagram User',
            account_type: 'USER_LEVEL',
            followers_count: 0,
            media_count: 0,
            biography: '',
            profile_picture_url: null
          },
          posts: generateSamplePostsForDemo(), // デモ用サンプルデータ
          follower_history: {
            hasData: false,
            data: generateSampleFollowerHistory(),
            dataPoints: 7
          },
          insights_summary: {
            total_reach: 0,
            total_impressions: 0, 
            total_saves: 0,
            average_engagement: 0
          },
          message: '🔍 Facebook Pages APIから空のレスポンスが返されました。Instagram Business Accountのインサイトデータを取得するには、追加設定が必要です。',
          demo_mode: true,
          instructions: {
            step1: 'Facebookページを作成: https://www.facebook.com/pages/create',
            step2: 'Instagramアカウントをビジネスアカウントまたはクリエイターアカウントに変更',
            step3: 'Facebookページの設定 → Instagram → 既存のアカウントをリンク',
            step4: '再度このアプリで連携してリアルデータを取得'
          }
        });
        
      } catch (userError) {
        console.error('❌ Failed to get user data:', userError);
        return NextResponse.json({
          connected: false,
          error: 'USER_PROFILE_ERROR',
          message: 'ユーザープロフィールの取得に失敗しました。'
        });
      }
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
      message: '✅ Instagram Business Account v2024の実データを取得しました'
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
      media_url: null,
      thumbnail_url: null,
      permalink: '#',
      like_count: 234,
      comments_count: 18,
      data_24h: { reach: 1850, likes: 234, saves: 56, impressions: 2100, engagement: 308 },
      data_7d: { reach: 2650, likes: 334, saves: 78, impressions: 3200, engagement: 430 },
      insights: { reach: 2650, impressions: 3200, saved: 78, engagement: 430, shares: 12, plays: 0, total_interactions: 430 },
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
      data_24h: { reach: 1420, likes: 187, saves: 34, impressions: 1680, engagement: 233 },
      data_7d: { reach: 1950, likes: 267, saves: 45, impressions: 2340, engagement: 324 },
      insights: { reach: 1950, impressions: 2340, saved: 45, engagement: 324, shares: 8, plays: 0, total_interactions: 324 },
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
      data_24h: { reach: 3240, likes: 456, saves: 89, impressions: 4100, engagement: 577 },
      data_7d: { reach: 4680, likes: 623, saves: 124, impressions: 5890, engagement: 779 },
      insights: { reach: 4680, impressions: 5890, saved: 124, engagement: 779, shares: 23, plays: 4100, total_interactions: 779 },
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
      followers: 1500 + Math.floor(Math.random() * 100) - 50 + (6 - i) * 10 // 徐々に増加傾向
    });
  }
  return history;
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