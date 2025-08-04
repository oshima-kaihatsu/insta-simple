// Instagram Graph API クライアント
interface InstagramInsights {
  title: string;
  reach: number;
  likes: number;
  saves: number;
  profile_visits: number;
  follows: number;
  home_impressions: number;
  created_time: string;
  post_id: string;
}

interface CalculatedMetrics extends InstagramInsights {
  save_rate: number; // 保存率：保存数÷リーチ数
  home_rate: number; // ホーム率：ホーム数÷フォロワー数
  profile_access_rate: number; // プロフィールアクセス率：プロフアクセス数÷リーチ数
  follower_conversion_rate: number; // フォロワー転換率：フォロワー増加数÷プロフアクセス数
}

export class InstagramAPIClient {
  private accessToken: string;
  
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // ユーザーの基本情報を取得
  async getUserInfo(): Promise<any> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,username,account_type,media_count,followers_count&access_token=${this.accessToken}`
    );
    return response.json();
  }

  // 投稿データを取得
  async getUserMedia(limit: number = 25): Promise<any> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/media?fields=id,media_type,media_url,permalink,timestamp,caption,comments_count,like_count&limit=${limit}&access_token=${this.accessToken}`
    );
    return response.json();
  }

  // 投稿のインサイトを取得
  async getMediaInsights(mediaId: string): Promise<any> {
    const metrics = [
      'reach',
      'impressions', 
      'likes',
      'saves',
      'comments',
      'shares',
      'profile_visits',
      'follows'
    ];
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${mediaId}/insights?metric=${metrics.join(',')}&access_token=${this.accessToken}`
    );
    return response.json();
  }

  // アカウントインサイト取得
  async getAccountInsights(period: 'day' | 'week' | 'days_28' = 'day'): Promise<any> {
    const metrics = [
      'follower_count',
      'profile_views',
      'reach',
      'impressions'
    ];

    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/insights?metric=${metrics.join(',')}&period=${period}&access_token=${this.accessToken}`
    );
    return response.json();
  }

  // 計算指標を算出
  calculateMetrics(insights: InstagramInsights, totalFollowers: number): CalculatedMetrics {
    return {
      ...insights,
      save_rate: insights.reach > 0 ? (insights.saves / insights.reach) * 100 : 0,
      home_rate: totalFollowers > 0 ? (insights.home_impressions / totalFollowers) * 100 : 0,
      profile_access_rate: insights.reach > 0 ? (insights.profile_visits / insights.reach) * 100 : 0,
      follower_conversion_rate: insights.profile_visits > 0 ? (insights.follows / insights.profile_visits) * 100 : 0
    };
  }
}

export default InstagramAPIClient;
