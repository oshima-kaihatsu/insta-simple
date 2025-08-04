// Instagram データの型定義
export interface InstagramUser {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
  followers_count: number;
}

export interface InstagramPost {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  caption: string;
  comments_count: number;
  like_count: number;
}

export interface PostInsights {
  post_id: string;
  title: string;
  reach: number;
  likes: number;
  saves: number;
  profile_visits: number;
  follows: number;
  home_impressions: number;
  created_time: string;
}

export interface CalculatedMetrics extends PostInsights {
  save_rate: number; // 保存率
  home_rate: number; // ホーム率
  profile_access_rate: number; // プロフィールアクセス率
  follower_conversion_rate: number; // フォロワー転換率
}