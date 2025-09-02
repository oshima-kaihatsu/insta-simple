'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Bookmark, 
  UserPlus,
  BarChart3,
  Download,
  Calendar,
  Brain,
  Star,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [instagramAccounts, setInstagramAccounts] = useState([]); // 複数アカウント管理
  const [activeAccountIndex, setActiveAccountIndex] = useState(0); // アクティブアカウント
  const [loading, setLoading] = useState(false);
  const [showSampleData, setShowSampleData] = useState(true);
  const [aiComments, setAiComments] = useState({});
  const [postsDataSource, setPostsDataSource] = useState('7d');
  const [postsPeriod, setPostsPeriod] = useState('28d');
  const [userPlan, setUserPlan] = useState('basic'); // basic, pro, enterprise
  
  // アクティブなInstagramアカウントデータ
  const instagramData = instagramAccounts[activeAccountIndex] || null;

  useEffect(() => {
    const checkForRealData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const instagramToken = urlParams.get('instagram_token');
      const instagramUserId = urlParams.get('instagram_user_id');
      const instagramUsername = urlParams.get('instagram_username');
      const success = urlParams.get('success');

      console.log('📄 URL Parameters:', {
        success,
        instagramToken: instagramToken ? `${instagramToken.substring(0, 20)}...` : null,
        instagramUserId,
        instagramUsername
      });
      
      console.log('🔍 Current URL:', window.location.href);
      console.log('🔍 Search params:', window.location.search);

      // URLパラメータがある場合のみ実データ取得
      if (success === 'true' && instagramToken && instagramUserId) {
        setLoading(true);
        setShowSampleData(false);
        
        try {
          console.log('🚀 Storing Instagram token and fetching data...');
          
          // ローカルストレージに保存
          localStorage.setItem('instagram_token', instagramToken);
          localStorage.setItem('instagram_user_id', instagramUserId);
          if (instagramUsername) {
            localStorage.setItem('instagram_username', instagramUsername);
          }
          
          // URLパラメータをクリア
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // まずトークンをテストしてみる
          console.log('🧪 Testing token first...');
          const tokenTestResponse = await fetch(`/api/test-token?token=${instagramToken}`);
          const tokenTestData = await tokenTestResponse.json();
          console.log('🧪 Token test results:', tokenTestData);
          
          // Instagram Basic Display API から取得を試行
          console.log('🚀 Attempting Instagram Basic Display API call...');
          
          // 🚀 サーバーサイドAPIでInstagramデータを取得（CORS回避）
          console.log('🚀 Using server-side Instagram API...');
          const response = await fetch(`/api/instagram/media?access_token=${instagramToken}`);
          console.log('Response status:', response.status);
          
          console.log('Server API response status:', response.status);
          const responseData = await response.json();
          console.log('Server API response:', responseData);
          
          if (response.ok && responseData.success && responseData.data?.data) {
            // サーバーサイドから成功レスポンス - Instagram Graph APIデータを正しく変換
            const accountType = responseData.account_type || 'business';
            
            // Instagram用の正しいプロファイル情報を取得
            let instagramProfile = {};
            if (responseData.profile?.instagram_account_id) {
              // ビジネスアカウントの場合
              instagramProfile = {
                username: instagramUsername || responseData.instagram_username || responseData.profile.instagram_username || responseData.profile.page_name || `user_${responseData.profile.instagram_account_id}`,
                user_id: responseData.profile.instagram_account_id,
                account_type: accountType,
                followers_count: responseData.followers_count || 0,
                media_count: responseData.media_count || responseData.data.data.length,
                profile_picture_url: responseData.profile_picture_url || null
              };
            } else {
              // 個人アカウントまたは基本情報の場合
              instagramProfile = {
                username: instagramUsername || responseData.instagram_username || responseData.profile.instagram_username || `user_${responseData.profile.id}`, // URLパラメータのInstagram名を最優先
                user_id: responseData.profile.id,
                account_type: accountType,
                followers_count: responseData.followers_count || 0,
                media_count: responseData.media_count || responseData.data.data.length,
                profile_picture_url: responseData.profile_picture_url || null
              };
            }

            const transformedData = {
              connected: true,
              account_type: accountType,
              profile: instagramProfile,
              raw_profile: responseData.profile, // デバッグ用
              posts: responseData.data.data.map(item => ({
                id: item.id,
                caption: item.caption || 'キャプションなし',
                media_type: item.media_type,
                media_url: item.media_url,
                thumbnail_url: item.thumbnail_url,
                timestamp: item.timestamp,
                permalink: item.permalink,
                like_count: item.like_count || 0,
                comments_count: item.comments_count || 0,
                // 実際のインサイトデータ（取得できない場合は推定値）
                insights: {
                  reach: item.insights?.reach || 0, // 実データが無い場合は0
                  impressions: item.insights?.impressions || 0,
                  saves: item.insights?.saves || 0,
                  profile_views: item.insights?.profile_views || 0,
                  website_clicks: item.insights?.website_clicks || 0,
                  engagement: item.like_count + (item.comments_count || 0),
                  data_available: !!item.insights // インサイトデータが利用可能かどうかのフラグ
                }
              })),
              token: instagramToken,
              last_updated: new Date().toISOString()
            };
            
            // 複数アカウント対応 - 既存アカウントを更新または新規追加
            setInstagramAccounts(prevAccounts => {
              const existingIndex = prevAccounts.findIndex(acc => acc.profile.user_id === instagramProfile.user_id);
              if (existingIndex >= 0) {
                // 既存アカウントを更新
                const updatedAccounts = [...prevAccounts];
                updatedAccounts[existingIndex] = transformedData;
                return updatedAccounts;
              } else {
                // 新規アカウントを追加 - プラン制限チェック
                const maxAccounts = userPlan === 'basic' ? 1 : userPlan === 'pro' ? 5 : Infinity;
                if (prevAccounts.length >= maxAccounts) {
                  console.warn(`⚠️ Account limit reached for ${userPlan} plan (${maxAccounts === Infinity ? '無制限' : maxAccounts} accounts)`);
                  const limitText = maxAccounts === Infinity ? '無制限' : `${maxAccounts}`;
                  alert(`${userPlan}プランでは最大${limitText}アカウントまでしか管理できません。プランをアップグレードするか、既存のアカウントを削除してください。`);
                  return prevAccounts; // 追加せずに既存の配列を返す
                }
                return [...prevAccounts, transformedData];
              }
            });
            
            setShowSampleData(false);
            console.log('✅ Set real Instagram data:', {
              username: instagramProfile.username,
              account_type: accountType,
              posts_count: transformedData.posts.length,
              followers: instagramProfile.followers_count
            });
          } else {
            // サーバーサイドエラーまたはデータなし
            console.error('❌ Server-side Instagram API failed:', responseData);
            
            if (responseData.suggestion) {
              console.log('💡 Suggestion:', responseData.suggestion);
            }
            
            // Instagram連携成功だが投稿データが取得できない場合
            if (responseData.error === 'No Instagram account found') {
              // 連携成功だが設定不完全の状態として表示
              const incompleteAccountData = {
                connected: true,
                setup_incomplete: true,
                profile: responseData.profile,
                error_message: responseData.suggestion,
                posts: []
              };
              setInstagramAccounts([incompleteAccountData]);
              setShowSampleData(false);
              console.log('⚠️ Instagram connected but setup incomplete');
            } else {
              setShowSampleData(true);
            }
          }
        } catch (error) {
          console.error('📊 Error fetching Instagram data:', error);
          setShowSampleData(true); // エラー時はサンプルに戻す
        } finally {
          setLoading(false);
        }
      } else {
        // URLパラメータがない場合、ローカルストレージから確認
        const storedToken = localStorage.getItem('instagram_token');
        if (storedToken) {
          console.log('🔄 Found stored Instagram token, fetching data...');
          setLoading(true);
          setShowSampleData(false);
          
          try {
            // サーバーサイドAPIでメディアを取得
            const response = await fetch(`/api/instagram/media?access_token=${storedToken}`);
            const responseData = await response.json();
            
            if (response.ok && responseData.success && responseData.data?.data) {
              const transformedData = {
                connected: true,
                profile: {
                  username: responseData.instagram_username || responseData.profile.instagram_username || responseData.profile.username || `user_${responseData.profile.id}`,
                  user_id: responseData.profile.id,
                  followers_count: responseData.profile.followers_count || 0,
                  media_count: responseData.profile.media_count || 0,
                  account_type: responseData.profile.account_type || 'PERSONAL'
                },
                posts: responseData.data.data.map(item => ({
                  id: item.id,
                  caption: item.caption || 'No caption',
                  media_type: item.media_type,
                  media_url: item.media_url,
                  thumbnail_url: item.thumbnail_url,
                  timestamp: item.timestamp,
                  permalink: item.permalink,
                  insights: {
                    reach: item.insights?.reach || 0, // 実データが無い場合は0
                    impressions: item.insights?.impressions || 0,
                    saves: item.insights?.saves || 0,
                    profile_views: item.insights?.profile_views || 0,
                    website_clicks: item.insights?.website_clicks || 0,
                    engagement: (item.like_count || 0) + (item.comments_count || 0),
                    data_available: !!item.insights // インサイトデータが利用可能かどうかのフラグ
                  }
                }))
              };
              
              setInstagramAccounts([transformedData]);
              setShowSampleData(false);
              console.log('✅ Loaded Instagram data from stored token via server API');
            } else {
              console.error('Stored token invalid or no data, clearing and showing sample data');
              localStorage.removeItem('instagram_token');
              localStorage.removeItem('instagram_user_id');
              localStorage.removeItem('instagram_username');
              setShowSampleData(true);
            }
          } catch (error) {
            console.error('Error with stored token:', error);
            localStorage.removeItem('instagram_token');
            localStorage.removeItem('instagram_user_id');
            localStorage.removeItem('instagram_username');
            setShowSampleData(true);
          } finally {
            setLoading(false);
          }
        } else {
          console.log('⚠️ No Instagram connection found, showing sample data');
          setShowSampleData(true);
          setLoading(false);
        }
      }
    };

    checkForRealData();
  }, []);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleInstagramConnect = () => {
    window.location.href = '/api/instagram/connect';
  };

  // サンプルデータ（デモ用）
  const samplePosts = [
    {
      id: 'sample_1',
      title: 'Weekend adventures in the city',
      date: '2025-07-28',
      data_24h: { reach: 2847, likes: 184, saves: 112, profile_views: 89, follows: 12 },
      data_7d: { reach: 3251, likes: 203, saves: 127, profile_views: 98, follows: 15 },
      rankings: { saves_rate: 1, home_rate: 2, profile_access_rate: 1, follower_conversion_rate: 1 }
    },
    {
      id: 'sample_2',
      title: 'Morning coffee routine',
      date: '2025-07-27',
      data_24h: { reach: 1892, likes: 156, saves: 45, profile_views: 67, follows: 8 },
      data_7d: { reach: 2156, likes: 172, saves: 51, profile_views: 74, follows: 9 },
      rankings: { saves_rate: 5, home_rate: 4, profile_access_rate: 3, follower_conversion_rate: 4 }
    },
    {
      id: 'sample_3',
      title: 'New recipe experiment',
      date: '2025-07-26',
      data_24h: { reach: 3124, likes: 298, saves: 156, profile_views: 124, follows: 18 },
      data_7d: { reach: 3567, likes: 321, saves: 178, profile_views: 142, follows: 21 },
      rankings: { saves_rate: 2, home_rate: 1, profile_access_rate: 2, follower_conversion_rate: 2 }
    },
    {
      id: 'sample_4',
      title: 'Sunset photography tips',
      date: '2025-07-25',
      data_24h: { reach: 2456, likes: 189, saves: 67, profile_views: 78, follows: 6 },
      data_7d: { reach: 2801, likes: 210, saves: 79, profile_views: 89, follows: 7 },
      rankings: { saves_rate: 8, home_rate: 6, profile_access_rate: 5, follower_conversion_rate: 8 }
    },
    {
      id: 'sample_5',
      title: 'Healthy meal prep ideas',
      date: '2025-07-24',
      data_24h: { reach: 2789, likes: 234, saves: 134, profile_views: 98, follows: 14 },
      data_7d: { reach: 3198, likes: 267, saves: 156, profile_views: 112, follows: 16 },
      rankings: { saves_rate: 3, home_rate: 3, profile_access_rate: 4, follower_conversion_rate: 3 }
    },
    {
      id: 'sample_6',
      title: 'Home office setup tour',
      date: '2025-07-23',
      data_24h: { reach: 1567, likes: 123, saves: 34, profile_views: 45, follows: 3 },
      data_7d: { reach: 1789, likes: 141, saves: 39, profile_views: 52, follows: 4 },
      rankings: { saves_rate: 12, home_rate: 11, profile_access_rate: 9, follower_conversion_rate: 12 }
    },
    {
      id: 'sample_7',
      title: 'Travel essentials checklist',
      date: '2025-07-22',
      data_24h: { reach: 2234, likes: 167, saves: 89, profile_views: 67, follows: 9 },
      data_7d: { reach: 2567, likes: 189, saves: 102, profile_views: 78, follows: 11 },
      rankings: { saves_rate: 6, home_rate: 7, profile_access_rate: 6, follower_conversion_rate: 6 }
    },
    {
      id: 'sample_8',
      title: 'Book recommendations',
      date: '2025-07-21',
      data_24h: { reach: 1789, likes: 134, saves: 56, profile_views: 43, follows: 5 },
      data_7d: { reach: 2034, likes: 152, saves: 64, profile_views: 49, follows: 6 },
      rankings: { saves_rate: 9, home_rate: 9, profile_access_rate: 8, follower_conversion_rate: 9 }
    },
    {
      id: 'sample_9',
      title: 'DIY plant care tips',
      date: '2025-07-20',
      data_24h: { reach: 2678, likes: 201, saves: 98, profile_views: 87, follows: 12 },
      data_7d: { reach: 3034, likes: 223, saves: 112, profile_views: 98, follows: 14 },
      rankings: { saves_rate: 7, home_rate: 5, profile_access_rate: 7, follower_conversion_rate: 5 }
    },
    {
      id: 'sample_10',
      title: 'Weekend market finds',
      date: '2025-07-19',
      data_24h: { reach: 2345, likes: 178, saves: 78, profile_views: 65, follows: 8 },
      data_7d: { reach: 2687, likes: 198, saves: 89, profile_views: 74, follows: 9 },
      rankings: { saves_rate: 10, home_rate: 8, profile_access_rate: 10, follower_conversion_rate: 7 }
    },
    {
      id: 'sample_11',
      title: 'Productivity hacks',
      date: '2025-07-18',
      data_24h: { reach: 1923, likes: 145, saves: 45, profile_views: 56, follows: 4 },
      data_7d: { reach: 2198, likes: 165, saves: 52, profile_views: 64, follows: 5 },
      rankings: { saves_rate: 13, home_rate: 12, profile_access_rate: 11, follower_conversion_rate: 11 }
    },
    {
      id: 'sample_12',
      title: 'Fashion styling tips',
      date: '2025-07-17',
      data_24h: { reach: 2567, likes: 192, saves: 87, profile_views: 78, follows: 10 },
      data_7d: { reach: 2923, likes: 214, saves: 99, profile_views: 89, follows: 12 },
      rankings: { saves_rate: 11, home_rate: 10, profile_access_rate: 12, follower_conversion_rate: 10 }
    },
    {
      id: 'sample_13',
      title: 'Mindfulness exercises',
      date: '2025-07-16',
      data_24h: { reach: 1678, likes: 123, saves: 34, profile_views: 45, follows: 3 },
      data_7d: { reach: 1923, likes: 141, saves: 39, profile_views: 52, follows: 4 },
      rankings: { saves_rate: 14, home_rate: 13, profile_access_rate: 13, follower_conversion_rate: 13 }
    },
    {
      id: 'sample_14',
      title: 'Tech gadget reviews',
      date: '2025-07-15',
      data_24h: { reach: 2134, likes: 167, saves: 67, profile_views: 58, follows: 7 },
      data_7d: { reach: 2456, likes: 189, saves: 78, profile_views: 67, follows: 8 },
      rankings: { saves_rate: 15, home_rate: 14, profile_access_rate: 14, follower_conversion_rate: 14 }
    },
    {
      id: 'sample_15',
      title: 'Local food discoveries',
      date: '2025-07-14',
      data_24h: { reach: 1456, likes: 112, saves: 28, profile_views: 34, follows: 2 },
      data_7d: { reach: 1678, likes: 128, saves: 32, profile_views: 39, follows: 3 },
      rankings: { saves_rate: 4, home_rate: 15, profile_access_rate: 15, follower_conversion_rate: 15 }
    }
  ];

  // サンプルフォロワーデータ
  const sampleFollowerData = [
    { date: '07/07', followers: 8420 },
    { date: '07/14', followers: 8467 },
    { date: '07/21', followers: 8523 },
    { date: '07/28', followers: 8578 },
    { date: '08/04', followers: 8634 }
  ];

  // 使用するデータの決定
  const postsData = instagramData?.posts || (showSampleData ? samplePosts : []);
  const followerData = instagramData?.follower_history?.data || (showSampleData ? sampleFollowerData : null);
  const hasRealData = instagramData !== null;
  const hasFollowerData = instagramData?.follower_history?.hasData || showSampleData;
  
  // 期間フィルタリング処理
  const filteredPosts = postsData.filter((post) => {
    if (postsPeriod === 'all') return true;
    
    const postDate = hasRealData ? new Date(post.timestamp) : new Date(post.date);
    const now = new Date();
    const daysAgo = parseInt(postsPeriod);
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return postDate >= cutoffDate;
  });

  // ホーム数推定関数
  const estimateHomeImpressions = (impressions, media_type) => {
    if (!impressions) return 0;
    
    // 投稿タイプで比率を決める
    let homeRatio;
    if (media_type === 'VIDEO' || media_type === 'REELS') {
      homeRatio = 0.25;  // リール：25%がホーム
    } else {
      homeRatio = 0.45;  // 通常投稿：45%がホーム
    }
    
    return Math.round(impressions * homeRatio);
  };

  // 重要4指標の計算（修正版 - ホーム率推定値対応）
  const calculateMetrics = (post) => {
    if (hasRealData && post.insights) {
      // 実データの場合
      const reach = post.insights.reach || 0;
      const saves = post.insights.saves || 0;
      const profile_views = post.insights.profile_views || 0;
      const website_clicks = post.insights.website_clicks || 0;
      const currentFollowers = instagramData?.profile?.followers_count || 1;
      const impressions = post.insights.impressions || reach; // impressionsが無い場合はreachを使用
      
      // ホーム数の推定値を計算
      const estimatedHomeImpressions = estimateHomeImpressions(impressions, post.media_type);
      
      // 分母が0の場合は0.0を返す
      const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
      const home_rate = currentFollowers > 0 ? ((estimatedHomeImpressions / currentFollowers) * 100).toFixed(1) : '0.0';
      const profile_access_rate = reach > 0 ? ((profile_views / reach) * 100).toFixed(1) : '0.0';
      const follower_conversion_rate = profile_views > 0 ? ((website_clicks / profile_views) * 100).toFixed(1) : '0.0';
      
      return { saves_rate, home_rate, profile_access_rate, follower_conversion_rate };
    } else {
      // サンプルデータの場合
      const data = post.data_7d;
      const saves_rate = data.reach > 0 ? ((data.saves / data.reach) * 100).toFixed(1) : '0.0';
      const estimatedHomeImpressions = estimateHomeImpressions(data.reach, post.media_type || 'IMAGE');
      const home_rate = estimatedHomeImpressions > 0 ? ((estimatedHomeImpressions / 8634) * 100).toFixed(1) : '0.0';
      const profile_access_rate = data.reach > 0 ? ((data.profile_views / data.reach) * 100).toFixed(1) : '0.0';
      const follower_conversion_rate = data.profile_views > 0 ? ((data.follows / data.profile_views) * 100).toFixed(1) : '0.0';
      
      return { saves_rate, home_rate, profile_access_rate, follower_conversion_rate };
    }
  };

  // 平均値計算
  const calculateAverages = (posts) => {
    if (!posts || posts.length === 0) {
      return { saves_rate: '0.0', home_rate: '0.0', profile_access_rate: '0.0', follower_conversion_rate: '0.0' };
    }

    const totals = posts.reduce((acc, post) => {
      const metrics = calculateMetrics(post);
      acc.saves_rate += parseFloat(metrics.saves_rate);
      acc.home_rate += parseFloat(metrics.home_rate);
      acc.profile_access_rate += parseFloat(metrics.profile_access_rate);
      acc.follower_conversion_rate += parseFloat(metrics.follower_conversion_rate);
      return acc;
    }, { saves_rate: 0, home_rate: 0, profile_access_rate: 0, follower_conversion_rate: 0 });

    return {
      saves_rate: (totals.saves_rate / posts.length).toFixed(1),
      home_rate: (totals.home_rate / posts.length).toFixed(1),
      profile_access_rate: (totals.profile_access_rate / posts.length).toFixed(1),
      follower_conversion_rate: (totals.follower_conversion_rate / posts.length).toFixed(1)
    };
  };

  const averages = calculateAverages(postsData);

  // AIコメント生成
  const generateAIComments = () => {
    const savesRate = parseFloat(averages.saves_rate);
    const homeRate = parseFloat(averages.home_rate);
    const profileRate = parseFloat(averages.profile_access_rate);
    const conversionRate = parseFloat(averages.follower_conversion_rate);

    let score = 0;
    let achievements = 0;
    let grade = 'C';

    if (savesRate >= 3.0) { score += 25; achievements++; }
    else if (savesRate >= 1.5) score += 15;
    else score += 5;

    if (homeRate >= 50.0) { score += 25; achievements++; }
    else if (homeRate >= 30.0) score += 15;
    else score += 5;

    if (profileRate >= 5.0) { score += 25; achievements++; }
    else if (profileRate >= 2.5) score += 15;
    else score += 5;

    if (conversionRate >= 8.0) { score += 25; achievements++; }
    else if (conversionRate >= 4.0) score += 15;
    else score += 5;

    if (score >= 85) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 55) grade = "C";
    else grade = "D";

    // 最高パフォーマンス投稿
    let bestPost = null;
    let bestScore = 0;
    
    postsData.forEach(post => {
      const metrics = calculateMetrics(post);
      const postScore = parseFloat(metrics.saves_rate) * 0.4 + 
                       parseFloat(metrics.profile_access_rate) * 0.3 + 
                       parseFloat(metrics.follower_conversion_rate) * 0.3;
      if (postScore > bestScore) {
        bestScore = postScore;
        bestPost = post;
      }
    });

    const suggestions = []; // 改善提案は無効化

    const bestPostTitle = bestPost ? (hasRealData ? (bestPost.caption?.substring(0, 30) + '...' || '投稿') : bestPost.title) : '';
    const bestMetrics = bestPost ? calculateMetrics(bestPost) : null;

    let overallComment = `${postsData.length}件の投稿を分析しました。`;
    
    if (achievements >= 3) {
      overallComment += ` 優秀な成果です！4指標中${achievements}項目で目標を達成しています。`;
    } else if (achievements >= 2) {
      overallComment += ` 良好な結果です。${achievements}項目で目標達成していますが、さらなる向上が可能です。`;
    } else {
      overallComment += ` 改善の余地があります。基本的な運用戦略の見直しから始めましょう。`;
    }

    if (bestPost && bestMetrics) {
      overallComment += ` 最高パフォーマンスは「${bestPostTitle}」で保存率${bestMetrics.saves_rate}%を記録しています。`;
    }

    setAiComments({
      grade,
      score,
      achievements,
      bestPost,
      overallComment,
      suggestions
    });
  };

  useEffect(() => {
    if (filteredPosts.length > 0) {
      generateAIComments();
    }
  }, [filteredPosts, hasRealData]);

  const getGradeColor = (grade) => {
    if (!grade) return '#c79a42';
    if (grade === 'A') return '#22c55e';
    if (grade === 'B') return '#3b82f6';
    if (grade === 'C') return '#f59e0b';
    return '#ef4444';
  };

  // 日付範囲
  const today = new Date();
  const days28Ago = new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000));
  const dateRangeText = `${days28Ago.toLocaleDateString('ja-JP')} - ${today.toLocaleDateString('ja-JP')}`;

  // フォロワー統計
  const currentFollowers = instagramData?.profile?.followers_count || 0; // リアルデータのみ、無い場合は0
  const followersIncrease = hasFollowerData && followerData && followerData.length > 1 ? 
    followerData[followerData.length - 1].followers - followerData[0].followers : 0; // リアルデータのみ、無い場合は0
  const dailyAverageIncrease = Math.round(followersIncrease / 28);
  const pastFollowers = currentFollowers - followersIncrease;
  const growthRate = pastFollowers > 0 ? ((followersIncrease / pastFollowers) * 100).toFixed(1) : '0.0'; // リアルデータのみ、無い場合は0.0

  // SVGパス生成
  const generatePath = (data) => {
    if (!data || data.length === 0) return '';
    
    const width = 800;
    const height = 200;
    const padding = 40;
    
    const xStep = (width - 2 * padding) / (data.length - 1);
    const minValue = Math.min(...data.map(d => d.followers));
    const maxValue = Math.max(...data.map(d => d.followers));
    const valueRange = maxValue - minValue || 100;
    
    let path = '';
    data.forEach((point, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((point.followers - minValue) / valueRange) * (height - 2 * padding);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  const chartPath = hasFollowerData ? generatePath(followerData) : '';
  const chartWidth = 800;
  const chartHeight = 200;

  // CSV出力
  const downloadCSV = () => {
    const headers = [
      'タイトル', '日付', 'リーチ数', 'いいね数', '保存数', 'プロフィール表示数', 'フォロー数',
      '保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率',
      '保存率ランキング', 'ホーム率ランキング', 'プロフィールアクセス率ランキング', 'フォロワー転換率ランキング'
    ].join(',');

    const rows = postsData.map(post => {
      const metrics = calculateMetrics(post);
      const title = hasRealData ? (post.caption?.substring(0, 50) || '投稿') : post.title;
      const date = hasRealData ? new Date(post.timestamp).toLocaleDateString('ja-JP') : post.date;
      const data = hasRealData ? {
        reach: post.insights?.reach || 0,
        likes: post.like_count || 0,
        saves: post.insights?.saves || 0,
        profile_views: post.insights?.profile_views || 0,
        follows: post.insights?.website_clicks || 0
      } : post.data_7d;
      
      return [
        `"${title}"`, date,
        data.reach, data.likes, data.saves, data.profile_views, data.follows,
        metrics.saves_rate, metrics.home_rate, metrics.profile_access_rate, metrics.follower_conversion_rate,
        `${post.rankings?.saves_rate || 0}位/${postsData.length}投稿`,
        `${post.rankings?.home_rate || 0}位/${postsData.length}投稿`,
        `${post.rankings?.profile_access_rate || 0}位/${postsData.length}投稿`,
        `${post.rankings?.follower_conversion_rate || 0}位/${postsData.length}投稿`
      ].join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = hasRealData ? 'instagram_analytics_real.csv' : 'instagram_analytics_sample.csv';
    link.click();
  };

  // ローディング表示
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RefreshCw size={32} style={{ color: '#c79a42', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '20px', color: '#5d4e37', fontWeight: '600' }}>Instagram データを取得中...</span>
        </div>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p style={{ margin: '0 0 8px 0' }}>アカウント情報を読み込んでいます</p>
          <p style={{ margin: '0', fontSize: '14px' }}>初回は少し時間がかかる場合があります</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
      color: '#282828',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(199, 154, 66, 0.2)',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: '#5d4e37',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                transition: 'background-color 0.2s',
                fontWeight: '600'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(199, 154, 66, 0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <ArrowLeft size={20} />
              戻る
            </button>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                margin: 0, 
                color: '#5d4e37',
                background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                過去28日間のアカウント分析
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fcfbf8',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  @
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                      @{hasRealData ? instagramData.profile?.username : 'sample_account'} • {dateRangeText} • {filteredPosts.length}件の投稿を分析
                      <span style={{ 
                        color: hasRealData ? '#22c55e' : '#f59e0b', 
                        fontSize: '14px', 
                        marginLeft: '8px',
                        fontWeight: '600'
                      }}>
                        {hasRealData ? '✅ リアルデータ' : '📋 サンプルデータ'}
                      </span>
                    </p>
                    
                    {/* アカウント切り替えドロップダウン（複数アカウントがある場合のみ表示） */}
                    {instagramAccounts.length > 1 && (
                      <select 
                        value={activeAccountIndex} 
                        onChange={(e) => setActiveAccountIndex(parseInt(e.target.value))}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          fontSize: '14px',
                          background: '#fff',
                          color: '#666',
                          cursor: 'pointer'
                        }}
                      >
                        {instagramAccounts.map((account, index) => (
                          <option key={index} value={index}>
                            @{account.profile?.username || `Account ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {/* プラン制限の表示 */}
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      ({instagramAccounts.length}/{userPlan === 'basic' ? 1 : userPlan === 'pro' ? 5 : '無制限'}アカウント)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Instagram連携CTA（サンプルデータ表示時のみ） */}
        {showSampleData && !hasRealData && (
          <div style={{
            background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            color: '#fcfbf8',
            boxShadow: '0 8px 32px rgba(199, 154, 66, 0.3)',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', margin: '0 0 16px 0' }}>
              実際のデータで分析を開始しませんか？
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.9, margin: '0 0 24px 0' }}>
              現在はサンプルデータを表示しています。Instagramアカウントを連携して、リアルタイムデータでより精密な分析を体験しましょう。
            </p>
            <button 
              onClick={handleInstagramConnect}
              style={{
                background: '#fcfbf8',
                color: '#5d4e37',
                padding: '16px 32px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(0px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              Instagram連携を開始
            </button>
          </div>
        )}

        {/* フォロワー推移 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(199, 154, 66, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '24px', 
            color: '#5d4e37',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <TrendingUp size={24} />
            フォロワー推移
          </h2>
          
          {hasFollowerData ? (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '32px' 
              }}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#5d4e37', marginBottom: '4px' }}>
                    {currentFollowers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>現在のフォロワー</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: followersIncrease >= 0 ? '#22c55e' : '#ef4444', marginBottom: '4px' }}>
                    {followersIncrease >= 0 ? '+' : ''}{followersIncrease}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>28日間増減</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: dailyAverageIncrease >= 0 ? '#c79a42' : '#ef4444', marginBottom: '4px' }}>
                    {dailyAverageIncrease >= 0 ? '+' : ''}{dailyAverageIncrease}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>1日平均増減</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#8b7355', marginBottom: '4px' }}>
                    {growthRate}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>成長率</div>
                </div>
              </div>

              {hasRealData && instagramData?.follower_history?.hasData && (
                <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                  実データ {instagramData.follower_history.dataPoints}日間 ({instagramData.follower_history.startDate} - {instagramData.follower_history.endDate})
                </div>
              )}

              <div style={{ width: '100%', height: '200px', background: '#fafafa', borderRadius: '12px', padding: '20px' }}>
                <svg width="100%" height="200" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c79a42" />
                      <stop offset="100%" stopColor="#b8873b" />
                    </linearGradient>
                  </defs>
                  
                  {[1,2,3,4].map(i => (
                    <line
                      key={i}
                      x1={40}
                      y1={40 + (i * 30)}
                      x2={760}
                      y2={40 + (i * 30)}
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {followerData && followerData.map((point, index) => {
                    const x = 40 + index * ((chartWidth - 80) / (followerData.length - 1));
                    const minValue = Math.min(...followerData.map(d => d.followers));
                    const maxValue = Math.max(...followerData.map(d => d.followers));
                    const valueRange = maxValue - minValue || 100;
                    const y = chartHeight - 40 - ((point.followers - minValue) / valueRange) * (chartHeight - 80);
                    
                    return (
                      <g key={index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill="#c79a42"
                          stroke="#fcfbf8"
                          strokeWidth="2"
                        />
                        <text
                          x={x}
                          y={chartHeight - 10}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#666"
                        >
                          {point.date}
                        </text>
                        <text
                          x={x}
                          y={y - 15}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#5d4e37"
                          fontWeight="600"
                        >
                          {point.followers.toLocaleString()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Calendar size={48} style={{ color: '#c79a42', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#5d4e37', marginBottom: '12px', margin: '0 0 12px 0' }}>
                データ収集を開始しました
              </h3>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', margin: '0 0 24px 0' }}>
                明日から実際のフォロワー推移データを表示します。
              </p>
            </div>
          )}
        </div>

        {/* 重要4指標 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(199, 154, 66, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '24px', 
            color: '#5d4e37'
          }}>
            重要4指標スコア
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#5d4e37' }}>保存率</h3>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                保存数 ÷ リーチ数
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#5d4e37', marginBottom: '8px' }}>
                {averages.saves_rate}%
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: parseFloat(averages.saves_rate) >= 3.0 ? '#22c55e' : '#ef4444',
                fontWeight: '600'
              }}>
                目標: 3.0%以上 • {parseFloat(averages.saves_rate) >= 3.0 ? '✅ 達成' : '❌ 要改善'}
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#5d4e37' }}>ホーム率</h3>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                ホーム表示 ÷ フォロワー数
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#5d4e37', marginBottom: '8px' }}>
                {averages.home_rate}%
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: parseFloat(averages.home_rate) >= 50.0 ? '#22c55e' : '#ef4444',
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                目標: 50.0%以上 • {parseFloat(averages.home_rate) >= 50.0 ? '✅ 達成' : '❌ 要改善'}
              </div>
              <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>
                ※ホーム数は推定値（APIで取得できないため）
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#5d4e37' }}>プロフィールアクセス率</h3>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                プロフ表示 ÷ リーチ数
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#5d4e37', marginBottom: '8px' }}>
                {averages.profile_access_rate}%
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: parseFloat(averages.profile_access_rate) >= 5.0 ? '#22c55e' : '#ef4444',
                fontWeight: '600'
              }}>
                目標: 5.0%以上 • {parseFloat(averages.profile_access_rate) >= 5.0 ? '✅ 達成' : '❌ 要改善'}
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#5d4e37' }}>フォロワー転換率</h3>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                フォロー増加 ÷ プロフ表示
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#5d4e37', marginBottom: '8px' }}>
                {averages.follower_conversion_rate}%
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: parseFloat(averages.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#ef4444',
                fontWeight: '600'
              }}>
                目標: 8.0%以上 • {parseFloat(averages.follower_conversion_rate) >= 8.0 ? '✅ 達成' : '❌ 要改善'}
              </div>
            </div>
          </div>
        </div>

        {/* 投稿別詳細分析 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(199, 154, 66, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              margin: 0, 
              color: '#5d4e37'
            }}>
              投稿別詳細分析
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* 期間ソートボタン */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['7', '14', '28', 'all'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setPostsPeriod(period)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: postsPeriod === period 
                        ? 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)'
                        : 'rgba(199, 154, 66, 0.1)',
                      color: postsPeriod === period ? '#fcfbf8' : '#5d4e37',
                      boxShadow: postsPeriod === period 
                        ? '0 2px 8px rgba(199, 154, 66, 0.3)' 
                        : 'none'
                    }}
                  >
                    {period === 'all' ? '全期間' : `${period}日間`}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={downloadCSV}
                style={{
                background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
                color: '#fcfbf8',
                padding: '16px 32px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(199, 154, 66, 0.3)'
              }}
            >
              <Download size={18} />
              CSV出力
            </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 100%)' }}>
                  <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>投稿</th>
                  <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>24時間後</th>
                  <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>1週間後</th>
                  <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>重要4指標ランキング（28日間中）</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, index) => {
                  const metrics24h = hasRealData ? calculateMetrics(post) : calculateMetrics({ data_7d: post.data_24h });
                  const metrics7d = calculateMetrics(post);
                  const title = hasRealData ? (post.caption?.substring(0, 50) + '...' || '投稿') : post.title;
                  const date = hasRealData ? new Date(post.timestamp).toLocaleDateString('ja-JP') : post.date;
                  
                  return (
                    <tr key={post.id} style={{ 
                      borderBottom: '1px solid rgba(199, 154, 66, 0.1)',
                      background: index % 2 === 0 ? 'rgba(252, 251, 248, 0.3)' : 'transparent'
                    }}>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ fontWeight: '600', color: '#5d4e37', marginBottom: '4px' }}>{title}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{date}</div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                          {hasRealData ? (
                            <>
                              <div>リーチ: {post.insights?.reach?.toLocaleString() || 0}</div>
                              <div>いいね: {post.like_count || 0}</div>
                              <div>保存: {post.insights?.saves || 0}</div>
                              <div>プロフ: {post.insights?.profile_views || 0}</div>
                              <div>ウェブ: {post.insights?.website_clicks || 0}</div>
                            </>
                          ) : (
                            <>
                              <div>リーチ: {post.data_24h.reach.toLocaleString()}</div>
                              <div>いいね: {post.data_24h.likes}</div>
                              <div>保存: {post.data_24h.saves}</div>
                              <div>プロフ: {post.data_24h.profile_views}</div>
                              <div>フォロー: {post.data_24h.follows}</div>
                            </>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          <div style={{ color: parseFloat(metrics24h.saves_rate) >= 3.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>保存率: {metrics24h.saves_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.home_rate) >= 50.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>ホーム率: {metrics24h.home_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.profile_access_rate) >= 5.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>プロフィールアクセス率: {metrics24h.profile_access_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>フォロワー転換率: {metrics24h.follower_conversion_rate}%</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                          {hasRealData ? (
                            <>
                              <div>リーチ: {post.insights?.reach?.toLocaleString() || 0}</div>
                              <div>いいね: {post.like_count || 0}</div>
                              <div>保存: {post.insights?.saves || 0}</div>
                              <div>プロフ: {post.insights?.profile_views || 0}</div>
                              <div>ウェブ: {post.insights?.website_clicks || 0}</div>
                            </>
                          ) : (
                            <>
                              <div>リーチ: {post.data_7d.reach.toLocaleString()}</div>
                              <div>いいね: {post.data_7d.likes}</div>
                              <div>保存: {post.data_7d.saves}</div>
                              <div>プロフ: {post.data_7d.profile_views}</div>
                              <div>フォロー: {post.data_7d.follows}</div>
                            </>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          <div style={{ color: parseFloat(metrics7d.saves_rate) >= 3.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>保存率: {metrics7d.saves_rate}%</div>
                          <div style={{ color: parseFloat(metrics7d.home_rate) >= 50.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>ホーム率: {metrics7d.home_rate}%</div>
                          <div style={{ color: parseFloat(metrics7d.profile_access_rate) >= 5.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>プロフィールアクセス率: {metrics7d.profile_access_rate}%</div>
                          <div style={{ color: parseFloat(metrics7d.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>フォロワー転換率: {metrics7d.follower_conversion_rate}%</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px' }}>
                          <div style={{
                            padding: '2px 8px',
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: post.rankings?.saves_rate <= Math.ceil(postsData.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings?.saves_rate > Math.ceil(postsData.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings?.saves_rate <= Math.ceil(postsData.length * 0.25) ? '#16a34a' : 
                                   post.rankings?.saves_rate > Math.ceil(postsData.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            保存率: {post.rankings?.saves_rate || 0}位/{postsData.length}投稿
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: post.rankings?.home_rate <= Math.ceil(postsData.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings?.home_rate > Math.ceil(postsData.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings?.home_rate <= Math.ceil(postsData.length * 0.25) ? '#16a34a' : 
                                   post.rankings?.home_rate > Math.ceil(postsData.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            ホーム率: {post.rankings?.home_rate || 0}位/{postsData.length}投稿
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: post.rankings?.profile_access_rate <= Math.ceil(postsData.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings?.profile_access_rate > Math.ceil(postsData.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings?.profile_access_rate <= Math.ceil(postsData.length * 0.25) ? '#16a34a' : 
                                   post.rankings?.profile_access_rate > Math.ceil(postsData.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            プロフ率: {post.rankings?.profile_access_rate || 0}位/{postsData.length}投稿
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: post.rankings?.follower_conversion_rate <= Math.ceil(postsData.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings?.follower_conversion_rate > Math.ceil(postsData.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings?.follower_conversion_rate <= Math.ceil(postsData.length * 0.25) ? '#16a34a' : 
                                   post.rankings?.follower_conversion_rate > Math.ceil(postsData.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            転換率: {post.rankings?.follower_conversion_rate || 0}位/{postsData.length}投稿
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI総合評価と改善提案 - 無効化
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(199, 154, 66, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            marginBottom: '24px', 
            color: '#5d4e37'
          }}>
          </h2>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#5d4e37', marginBottom: '8px' }}>総合スコア</div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: `2px solid ${getGradeColor(aiComments.grade || 'C')}`,
                  background: `${getGradeColor(aiComments.grade || 'C')}10`,
                  color: getGradeColor(aiComments.grade || 'C'),
                  display: 'inline-block'
                }}>
                  {aiComments.grade || 'C'}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                  ({aiComments.achievements || 0}/4指標達成)
                </div>
              </div>
            </div>
          </div>

          {aiComments.bestPost && (
            <div style={{ 
              background: 'rgba(255, 193, 7, 0.1)', 
              border: '1px solid rgba(255, 193, 7, 0.3)', 
              borderRadius: '12px', 
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Star size={20} style={{ color: '#ffc107', marginRight: '8px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#856404' }}>最高パフォーマンス投稿</h3>
              </div>
              <div style={{ color: '#856404', fontSize: '16px' }}>
                「{hasRealData ? (aiComments.bestPost.caption?.substring(0, 50) + '...' || '投稿') : aiComments.bestPost.title}」
                <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '8px' }}>
                  (保存率: {calculateMetrics(aiComments.bestPost).saves_rate}%)
                </span>
              </div>
            </div>
          )}

          {aiComments.overallComment && (
            <div style={{ 
              background: 'rgba(252, 251, 248, 0.8)', 
              borderLeft: '4px solid #c79a42', 
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <MessageSquare size={20} style={{ color: '#c79a42', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                <p style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.6', 
                  color: '#333', 
                  margin: 0
                }}>
                  {aiComments.overallComment}
                </p>
              </div>
            </div>
          )}

          {aiComments.suggestions && aiComments.suggestions.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {aiComments.suggestions.map((suggestion, index) => (
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'start', 
                    marginBottom: '12px',
                    fontSize: '14px',
                    color: '#555'
                  }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      background: '#3b82f6', 
                      borderRadius: '50%', 
                      marginRight: '12px', 
                      marginTop: '6px',
                      flexShrink: 0
                    }}></div>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        */}

        {/* Instagram連携状況の表示 */}
        {instagramData && instagramData.setup_incomplete ? (
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            color: '#fcfbf8',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                ⚠️
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                Instagram連携の設定が必要です
              </h3>
            </div>
            <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.9, margin: '0 0 24px 0' }}>
              認証は成功しましたが、FacebookページとInstagramアカウントの連携が完了していません。
            </p>
            <p style={{ fontSize: '14px', marginBottom: '24px', opacity: 0.8, margin: '0 0 24px 0' }}>
              {instagramData.error_message}
            </p>
            <div style={{ fontSize: '14px', opacity: 0.9, textAlign: 'left', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>
                📋 設定手順:
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                1. Facebook Business Managerでページを作成
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                2. Instagramをビジネスアカウントにアップグレード  
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                3. FacebookページとInstagramアカウントを連携
              </p>
              <p style={{ margin: '0' }}>
                4. 再度Instagram連携を実行
              </p>
            </div>
          </div>
        ) : hasRealData ? (
          <div style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            color: '#fcfbf8',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                ✅
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                Instagram連携が完了しました！
              </h3>
            </div>
            <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.9, margin: '0 0 24px 0' }}>
              @{instagramData.profile?.username} のリアルデータを分析中です。より詳細なインサイトを取得するため、継続してご利用ください。
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {currentFollowers.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>現在のフォロワー数</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {instagramData?.profile?.media_count || 0}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>総投稿数</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {postsData.length}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>分析対象投稿</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {instagramData?.profile?.account_type || 'PERSONAL'}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>アカウントタイプ</div>
              </div>
            </div>

            <div style={{ fontSize: '14px', opacity: 0.8, lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                🎯 <strong>次のステップ:</strong>
              </p>
              <p style={{ margin: '0 0 4px 0' }}>
                • 定期的に投稿してデータを蓄積しましょう
              </p>
              <p style={{ margin: '0 0 4px 0' }}>
                • フォロワー推移データは明日から表示されます
              </p>
              <p style={{ margin: '0' }}>
                • 1週間後により詳細な分析が可能になります
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}