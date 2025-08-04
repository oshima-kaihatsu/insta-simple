// Instagram API関連の型定義とユーティリティ関数

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  insights?: {
    impressions?: number;
    reach?: number;
    saved?: number;
    profile_visits?: number;
    follows?: number;
  };
}

export interface InstagramProfile {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
  followers_count?: number;
}

export interface InstagramMetrics {
  saveRate: number;
  followerViewRate: number;
  profileAccessRate: number;
  followerConversionRate: number;
}

export async function fetchInstagramPosts(accessToken: string, limit = 25): Promise<InstagramPost[]> {
  try {
    const url = `https://graph.facebook.com/v18.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=${limit}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch Instagram posts');
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}

export async function fetchInstagramProfile(accessToken: string): Promise<InstagramProfile | null> {
  try {
    const url = `https://graph.facebook.com/v18.0/me?fields=id,username,account_type,media_count,followers_count&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch Instagram profile');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return null;
  }
}

export async function fetchPostInsights(postId: string, accessToken: string): Promise<Record<string, number>> {
  try {
    const url = `/insta-simple/api/auth/instagram/insights?postId=${postId}&accessToken=${encodeURIComponent(accessToken)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch post insights');
    }
    
    return data.insights || {};
  } catch (error) {
    console.error('Error fetching post insights:', error);
    return {};
  }
}

export function calculateMetrics(posts: InstagramPost[], profile: InstagramProfile): InstagramMetrics {
  if (!posts.length || !profile.followers_count) {
    return {
      saveRate: 0,
      followerViewRate: 0,
      profileAccessRate: 0,
      followerConversionRate: 0
    };
  }

  const postsWithInsights = posts.filter(post => post.insights);
  
  if (!postsWithInsights.length) {
    return {
      saveRate: 0,
      followerViewRate: 0,
      profileAccessRate: 0,
      followerConversionRate: 0
    };
  }

  // 保存率の計算
  const totalSaved = postsWithInsights.reduce((sum, post) => sum + (post.insights?.saved || 0), 0);
  const totalReach = postsWithInsights.reduce((sum, post) => sum + (post.insights?.reach || 0), 0);
  const saveRate = totalReach > 0 ? (totalSaved / totalReach) * 100 : 0;

  // フォロワー閲覧率の計算（簡易版）
  const averageReach = totalReach / postsWithInsights.length;
  const followerViewRate = profile.followers_count > 0 ? (averageReach / profile.followers_count) * 100 : 0;

  // プロフィールアクセス率の計算
  const totalProfileVisits = postsWithInsights.reduce((sum, post) => sum + (post.insights?.profile_visits || 0), 0);
  const profileAccessRate = totalReach > 0 ? (totalProfileVisits / totalReach) * 100 : 0;

  // フォロワー転換率の計算
  const totalFollows = postsWithInsights.reduce((sum, post) => sum + (post.insights?.follows || 0), 0);
  const followerConversionRate = totalProfileVisits > 0 ? (totalFollows / totalProfileVisits) * 100 : 0;

  return {
    saveRate: Math.round(saveRate * 100) / 100,
    followerViewRate: Math.round(followerViewRate * 100) / 100,
    profileAccessRate: Math.round(profileAccessRate * 100) / 100,
    followerConversionRate: Math.round(followerConversionRate * 100) / 100
  };
}

// ダミーデータ生成関数（開発・デモ用）
export function generateDummyData() {
  const dummyPosts: InstagramPost[] = Array.from({ length: 10 }, (_, i) => ({
    id: `dummy_post_${i + 1}`,
    caption: `ダミー投稿 ${i + 1}`,
    media_type: 'IMAGE' as const,
    media_url: `https://picsum.photos/400/400?random=${i + 1}`,
    permalink: `https://instagram.com/p/dummy${i + 1}`,
    timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    insights: {
      impressions: Math.floor(Math.random() * 1000) + 500,
      reach: Math.floor(Math.random() * 800) + 300,
      saved: Math.floor(Math.random() * 50) + 10,
      profile_visits: Math.floor(Math.random() * 30) + 5,
      follows: Math.floor(Math.random() * 10) + 1
    }
  }));

  const dummyProfile: InstagramProfile = {
    id: 'dummy_profile',
    username: 'demo_account',
    account_type: 'BUSINESS',
    media_count: 150,
    followers_count: 5000
  };

  return { posts: dummyPosts, profile: dummyProfile };
}

// 空のインターフェース問題を修正
export interface EmptyInterface {
  // 空のオブジェクトタイプ
  [key: string]: never;
}

// 未使用パラメータを削除した関数群
export async function connectInstagram(): Promise<string> {
  // Instagram接続用のURL生成
  const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
  const redirectUri = encodeURIComponent('https://thorsync.com/insta-simple/api/auth/instagram/callback');
  
  return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
}

export async function analyzeAccountPerformance(): Promise<InstagramMetrics> {
  // アカウントパフォーマンス分析のダミー実装
  return {
    saveRate: 2.5,
    followerViewRate: 45.2,
    profileAccessRate: 3.1,
    followerConversionRate: 6.8
  };
}

export async function getRecentPosts(): Promise<InstagramPost[]> {
  // 最近の投稿取得のダミー実装
  const { posts } = generateDummyData();
  return posts.slice(0, 5);
}