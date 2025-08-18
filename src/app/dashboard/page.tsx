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
  RefreshCw,
  Image,
  Video,
  Film,
  Layers,
  Zap,
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Award,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [instagramData, setInstagramData] = useState(null);
  const [showSampleData, setShowSampleData] = useState(true);
  const [aiComments, setAiComments] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('28');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // サンプルデータ（15件の一般的なインスタ投稿）
  const samplePosts = [
    {
      id: 'sample_1',
      title: '週末の特別なディナー',
      date: '2025-01-13',
      timestamp: '2025-01-13T19:00:00',
      media_type: 'CAROUSEL_ALBUM',
      data_24h: { reach: 2847, likes: 184, saves: 45, profile_views: 89, follows: 3 },
      data_7d: { reach: 3251, likes: 237, saves: 58, profile_views: 142, follows: 5 },
      advanced_metrics: {
        engagement_quality_score: 6.8,
        viral_index: 135.2,
        optimization_score: 82,
        content_type_performance: { mediaType: 'CAROUSEL_ALBUM', relative_performance: 'excellent' }
      },
      ai_recommendations: [
        {
          type: 'content_format',
          priority: 'medium',
          message: 'カルーセル投稿が好調です。この形式を継続しましょう。',
          actionable_tips: ['スワイプ投稿で情報量を増やす', '視覚的な統一感を保つ']
        }
      ]
    },
    {
      id: 'sample_2',
      title: '新年の目標設定',
      date: '2025-01-08',
      timestamp: '2025-01-08T10:00:00',
      media_type: 'IMAGE',
      data_24h: { reach: 5124, likes: 256, saves: 34, profile_views: 124, follows: 2 },
      data_7d: { reach: 6892, likes: 312, saves: 45, profile_views: 156, follows: 3 }
    },
    {
      id: 'sample_3',
      title: '冬のカフェ巡り',
      date: '2025-01-03',
      timestamp: '2025-01-03T14:00:00',
      media_type: 'VIDEO',
      data_24h: { reach: 4231, likes: 342, saves: 178, profile_views: 234, follows: 28 },
      data_7d: { reach: 5124, likes: 456, saves: 213, profile_views: 289, follows: 34 }
    },
    {
      id: 'sample_4',
      title: '年末年始の過ごし方',
      date: '2024-12-28',
      timestamp: '2024-12-28T09:30:00',
      media_type: 'REELS',
      data_24h: { reach: 3672, likes: 489, saves: 28, profile_views: 98, follows: 1 },
      data_7d: { reach: 4891, likes: 612, saves: 38, profile_views: 124, follows: 2 }
    },
    {
      id: 'sample_5',
      title: 'クリスマスパーティーの準備',
      date: '2024-12-23',
      timestamp: '2024-12-23T11:00:00',
      media_type: 'CAROUSEL_ALBUM',
      data_24h: { reach: 3892, likes: 298, saves: 156, profile_views: 189, follows: 19 },
      data_7d: { reach: 4567, likes: 367, saves: 189, profile_views: 234, follows: 24 }
    },
    {
      id: 'sample_6',
      title: '冬のファッションコーデ',
      date: '2024-12-18',
      timestamp: '2024-12-18T15:00:00',
      media_type: 'IMAGE',
      data_24h: { reach: 3456, likes: 167, saves: 22, profile_views: 78, follows: 1 },
      data_7d: { reach: 4324, likes: 198, saves: 28, profile_views: 98, follows: 2 }
    },
    {
      id: 'sample_7',
      title: '紅葉狩りの思い出',
      date: '2024-11-25',
      timestamp: '2024-11-25T10:30:00',
      media_type: 'VIDEO',
      data_24h: { reach: 4567, likes: 278, saves: 34, profile_views: 78, follows: 2 },
      data_7d: { reach: 5431, likes: 345, saves: 45, profile_views: 98, follows: 3 }
    },
    {
      id: 'sample_8',
      title: '秋の料理レシピ',
      date: '2024-11-20',
      timestamp: '2024-11-20T14:30:00',
      media_type: 'CAROUSEL_ALBUM',
      data_24h: { reach: 4123, likes: 367, saves: 198, profile_views: 234, follows: 23 },
      data_7d: { reach: 4892, likes: 445, saves: 234, profile_views: 278, follows: 29 }
    },
    {
      id: 'sample_9',
      title: 'ハロウィンパーティー',
      date: '2024-10-31',
      timestamp: '2024-10-31T11:30:00',
      media_type: 'REELS',
      data_24h: { reach: 5234, likes: 445, saves: 267, profile_views: 312, follows: 38 },
      data_7d: { reach: 6123, likes: 556, saves: 334, profile_views: 389, follows: 45 }
    },
    {
      id: 'sample_10',
      title: '読書の秋',
      date: '2024-10-25',
      timestamp: '2024-10-25T09:00:00',
      media_type: 'IMAGE',
      data_24h: { reach: 3789, likes: 198, saves: 28, profile_views: 67, follows: 1 },
      data_7d: { reach: 4456, likes: 245, saves: 38, profile_views: 89, follows: 2 }
    },
    {
      id: 'sample_11',
      title: 'スポーツの秋',
      date: '2024-10-20',
      timestamp: '2024-10-20T13:00:00',
      media_type: 'VIDEO',
      data_24h: { reach: 2892, likes: 134, saves: 18, profile_views: 45, follows: 1 },
      data_7d: { reach: 3345, likes: 167, saves: 22, profile_views: 56, follows: 1 }
    },
    {
      id: 'sample_12',
      title: '夏の思い出アルバム',
      date: '2024-09-15',
      timestamp: '2024-09-15T10:00:00',
      media_type: 'CAROUSEL_ALBUM',
      data_24h: { reach: 3345, likes: 256, saves: 145, profile_views: 178, follows: 16 },
      data_7d: { reach: 4012, likes: 312, saves: 178, profile_views: 212, follows: 20 }
    },
    {
      id: 'sample_13',
      title: '夏フェスのハイライト',
      date: '2024-09-10',
      timestamp: '2024-09-10T11:00:00',
      media_type: 'REELS',
      data_24h: { reach: 4567, likes: 389, saves: 212, profile_views: 267, follows: 31 },
      data_7d: { reach: 5432, likes: 478, saves: 256, profile_views: 323, follows: 37 }
    },
    {
      id: 'sample_14',
      title: '海水浴の楽しい一日',
      date: '2024-09-05',
      timestamp: '2024-09-05T15:30:00',
      media_type: 'IMAGE',
      data_24h: { reach: 3234, likes: 156, saves: 24, profile_views: 56, follows: 1 },
      data_7d: { reach: 3890, likes: 189, saves: 32, profile_views: 78, follows: 2 }
    },
    {
      id: 'sample_15',
      title: '新学期の準備',
      date: '2024-09-01',
      timestamp: '2024-09-01T12:00:00',
      media_type: 'IMAGE',
      data_24h: { reach: 2789, likes: 234, saves: 18, profile_views: 89, follows: 1 },
      data_7d: { reach: 3234, likes: 289, saves: 22, profile_views: 112, follows: 2 }
    }
  ];

  // サンプルフォロワーデータ
  const sampleFollowerData = {
    labels: ['1/1', '1/5', '1/10', '1/15', '1/20', '1/25', '1/28'],
    data: [8234, 8267, 8312, 8389, 8456, 8567, 8634]
  };

  // 現在のフォロワー数を計算
  const currentFollowers = instagramData?.profile?.followers_count || 8634;
  
  // 使用するデータの決定
  const postsData = instagramData?.posts || (showSampleData ? samplePosts : []);
  const followerData = instagramData?.follower_history?.data || (showSampleData ? sampleFollowerData : null);
  const hasRealData = instagramData !== null;
  
  // フォロワー履歴から初期フォロワー数を取得
  const getInitialFollowers = () => {
    if (hasRealData && instagramData?.follower_history?.data && instagramData.follower_history.data.length > 0) {
      return instagramData.follower_history.data[0].followers;
    }
    return 8234; // サンプルデータの初期値
  };
  
  const initialFollowers = getInitialFollowers();
  
  // followerDataがnullの場合のセーフガード
  const safeFollowerData = followerData || { data: [], labels: [] };

  // 期間フィルター適用
  const filteredPosts = filterPeriod === 'all' ? postsData : postsData.filter(post => {
    const postDate = new Date(post.timestamp || post.date);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(filterPeriod));
    return postDate >= daysAgo;
  });

  // ソート機能
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.timestamp || a.date);
      const dateB = new Date(b.timestamp || b.date);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  // 重要4指標の計算（完全修正版）
  const calculateMetrics = (post) => {
    console.log('calculateMetrics - Input post:', { hasRealData, postKeys: Object.keys(post), post });
    console.log('calculateMetrics - Current followers:', currentFollowers, 'Instagram data:', instagramData?.profile);
    
    if (hasRealData && (post.insights || post.data_7d)) {
      // 実データの場合 - data_7dまたはinsightsから取得
      const dataSource = post.data_7d || post.insights || {};
      const reach = parseInt(dataSource.reach) || 0;
      const saves = parseInt(dataSource.saved || dataSource.saves) || 0;
      const profile_views = parseInt(dataSource.profile_visits || dataSource.profile_views) || 0;
      const follows = parseInt(dataSource.follows) || 0;
      
      console.log('calculateMetrics - Real data extracted:', { reach, saves, profile_views, follows, postId: post.id, dataSource });
      
      const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
      const home_rate = currentFollowers > 0 && reach > 0 ? ((reach / currentFollowers) * 100).toFixed(1) : '0.0';
      const profile_access_rate = reach > 0 ? ((profile_views / reach) * 100).toFixed(1) : '0.0';
      const follower_conversion_rate = profile_views > 0 ? ((follows / profile_views) * 100).toFixed(1) : '0.0';
      
      console.log('calculateMetrics - Calculated rates:', { saves_rate, home_rate, profile_access_rate, follower_conversion_rate, currentFollowers, reach });
      
      return { saves_rate, home_rate, profile_access_rate, follower_conversion_rate };
    } else if (!hasRealData && post.data_7d) {
      // サンプルデータの場合も厳格にチェック
      const reach = post.data_7d.reach || 0;
      const saves = post.data_7d.saves || 0;
      const profile_views = post.data_7d.profile_views || 0;
      const follows = post.data_7d.follows || 0;
      
      const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
      const home_rate = currentFollowers > 0 && reach > 0 ? ((reach / currentFollowers) * 100).toFixed(1) : '0.0';
      const profile_access_rate = reach > 0 ? ((profile_views / reach) * 100).toFixed(1) : '0.0';
      const follower_conversion_rate = profile_views > 0 ? ((follows / profile_views) * 100).toFixed(1) : '0.0';
      
      return { saves_rate, home_rate, profile_access_rate, follower_conversion_rate };
    }
    return { saves_rate: '0.0', home_rate: '0.0', profile_access_rate: '0.0', follower_conversion_rate: '0.0' };
  };

  // 平均値計算
  const calculateAverages = (posts) => {
    if (posts.length === 0) {
      return {
        avg_saves_rate: '0.0',
        avg_home_rate: '0.0',
        avg_profile_access_rate: '0.0',
        avg_follower_conversion_rate: '0.0'
      };
    }

    let total_saves = 0, total_reach = 0, total_profile_views = 0, total_follows = 0;
    let home_reach_sum = 0;

    posts.forEach(post => {
      if (hasRealData && (post.insights || post.data_7d)) {
        const dataSource = post.data_7d || post.insights || {};
        total_reach += parseInt(dataSource.reach) || 0;
        total_saves += parseInt(dataSource.saved || dataSource.saves) || 0;
        total_profile_views += parseInt(dataSource.profile_visits || dataSource.profile_views) || 0;
        total_follows += parseInt(dataSource.follows) || 0;
        home_reach_sum += parseInt(dataSource.reach) || 0;
      } else if (!hasRealData && post.data_7d) {
        total_reach += post.data_7d.reach || 0;
        total_saves += post.data_7d.saves || 0;
        total_profile_views += post.data_7d.profile_views || 0;
        total_follows += post.data_7d.follows || 0;
        home_reach_sum += post.data_7d.reach || 0;
      }
    });

    return {
      avg_saves_rate: total_reach > 0 ? ((total_saves / total_reach) * 100).toFixed(1) : '0.0',
      avg_home_rate: currentFollowers > 0 && home_reach_sum > 0 ? ((home_reach_sum / posts.length / currentFollowers) * 100).toFixed(1) : '0.0',
      avg_profile_access_rate: total_reach > 0 ? ((total_profile_views / total_reach) * 100).toFixed(1) : '0.0',
      avg_follower_conversion_rate: total_profile_views > 0 ? ((total_follows / total_profile_views) * 100).toFixed(1) : '0.0'
    };
  };

  // 重要4指標スコアの平均はフィルター後の投稿から計算
  const averages = calculateAverages(filteredPosts);

  // ランキング計算
  const calculateRankings = () => {
    const rankings = {};
    
    filteredPosts.forEach(post => {
      const metrics = calculateMetrics(post);
      post.metrics = metrics;
      post.rankings = {};
    });

    // 各指標でランキング
    ['saves_rate', 'home_rate', 'profile_access_rate', 'follower_conversion_rate'].forEach(metric => {
      const sorted = [...filteredPosts].sort((a, b) => 
        parseFloat(b.metrics[metric]) - parseFloat(a.metrics[metric])
      );
      sorted.forEach((post, index) => {
        post.rankings[metric] = index + 1;
      });
    });

    return filteredPosts;
  };

  calculateRankings();

  // AI分析コメント生成
  const generateAIComments = () => {
    const newComments = {};
    
    filteredPosts.forEach(post => {
      const metrics = calculateMetrics(post);
      const comments = [];
      
      // 保存率の評価
      const savesRate = parseFloat(metrics.saves_rate);
      if (savesRate >= 5.0) {
        comments.push('保存率が非常に高く、価値のあるコンテンツとして認識されています。');
      } else if (savesRate >= 3.0) {
        comments.push('保存率が良好です。');
      } else if (savesRate > 0) {
        comments.push('保存率を向上させる余地があります。より実用的な情報を含めることを検討してください。');
      }
      
      // ホーム率の評価
      const homeRate = parseFloat(metrics.home_rate);
      if (homeRate >= 70.0) {
        comments.push('ホーム率が優秀で、多くのフォロワーに届いています。');
      } else if (homeRate >= 50.0) {
        comments.push('ホーム率は標準的です。');
      } else if (homeRate > 0) {
        comments.push('投稿時間の最適化でホーム率を改善できる可能性があります。');
      }
      
      // プロフィールアクセス率の評価
      const profileRate = parseFloat(metrics.profile_access_rate);
      if (profileRate >= 5.0) {
        comments.push('プロフィールへの誘導が非常に効果的です。');
      } else if (profileRate >= 2.0) {
        comments.push('プロフィールアクセス率は良好です。');
      } else if (profileRate > 0) {
        comments.push('CTAを追加してプロフィールへの誘導を強化することを推奨します。');
      }
      
      // フォロワー転換率の評価
      const conversionRate = parseFloat(metrics.follower_conversion_rate);
      if (conversionRate >= 10.0) {
        comments.push('フォロワー転換率が優秀です。');
      } else if (conversionRate >= 5.0) {
        comments.push('フォロワー転換率は標準的です。');
      } else if (conversionRate > 0) {
        comments.push('プロフィールの最適化でフォロワー転換率を改善できます。');
      }
      
      // 総合評価
      const score = (savesRate * 0.3 + homeRate * 0.3 + profileRate * 0.2 + conversionRate * 0.2);
      let grade = 'C';
      if (score >= 30) grade = 'S';
      else if (score >= 20) grade = 'A';
      else if (score >= 10) grade = 'B';
      
      newComments[post.id] = {
        grade,
        comments: comments.length > 0 ? comments : ['この投稿のパフォーマンスを分析中です。']
      };
    });
    
    // 総合評価コメント
    let overallComment = `${filteredPosts.length}件の投稿を分析しました。`;
    
    const avgSaves = parseFloat(averages.avg_saves_rate);
    const avgHome = parseFloat(averages.avg_home_rate);
    const avgProfile = parseFloat(averages.avg_profile_access_rate);
    const avgConversion = parseFloat(averages.avg_follower_conversion_rate);
    
    if (avgSaves >= 3.0 && avgHome >= 50.0) {
      overallComment += '全体的に優秀なパフォーマンスです。現在の投稿戦略を継続してください。';
    } else if (avgSaves >= 2.0 || avgHome >= 40.0) {
      overallComment += '標準的なパフォーマンスです。コンテンツの質と投稿時間の最適化で改善の余地があります。';
    } else {
      overallComment += '改善の余地が大きくあります。コンテンツ戦略の見直しを推奨します。';
    }
    
    // 改善提案
    const suggestions = [];
    if (avgSaves < 3.0) {
      suggestions.push('保存されやすい実用的なコンテンツ（まとめ情報、チェックリストなど）を増やす');
    }
    if (avgHome < 50.0) {
      suggestions.push('フォロワーのアクティブ時間帯を分析し、投稿時間を最適化する');
    }
    if (avgProfile < 3.0) {
      suggestions.push('投稿内でプロフィールへの誘導（CTA）を強化する');
    }
    if (avgConversion < 7.0) {
      suggestions.push('プロフィールの内容を充実させ、フォローする価値を明確に伝える');
    }
    
    newComments.overall = {
      comment: overallComment,
      suggestions
    };
    
    setAiComments(newComments);
  };

  useEffect(() => {
    if (filteredPosts.length > 0) {
      generateAIComments();
    }
  }, [filteredPosts, hasRealData]);

  // Instagram連携とURLパラメーターのチェック
  useEffect(() => {
    const initializeData = async () => {
      // URLパラメーターをチェック
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const instagramUserId = urlParams.get('instagram_user_id');
      const success = urlParams.get('success');
      const error = urlParams.get('error');

      // エラーパラメーターがある場合の処理
      if (error) {
        console.error('Instagram OAuth error:', error);
        const details = urlParams.get('details');
        const message = urlParams.get('message');
        
        let errorMsg = 'Instagram連携エラー: ';
        if (error === 'token_failed') {
          errorMsg += 'アクセストークンの取得に失敗しました。';
        } else if (error === 'no_instagram_account') {
          errorMsg += 'Instagramビジネスアカウントまたはクリエイターアカウントが必要です。';
        } else if (error === 'pages_failed') {
          errorMsg += 'Facebookページの取得に失敗しました。';
        } else if (error === 'no_code') {
          errorMsg += '認証コードが取得できませんでした。';
        } else {
          errorMsg += error;
        }
        
        if (details) {
          errorMsg += ` 詳細: ${decodeURIComponent(details)}`;
        }
        if (message) {
          errorMsg += ` ${decodeURIComponent(message)}`;
        }
        
        setErrorMessage(errorMsg);
        setShowSampleData(true);
        setLoading(false);
        // URLパラメーターをクリア
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // 成功パラメーターがある場合の処理
      if (success === 'true' && accessToken && instagramUserId) {
        console.log('Instagram connection successful, fetching data...');
        try {
          const res = await fetch(`/api/instagram-data?access_token=${accessToken}&instagram_user_id=${instagramUserId}`);
          if (res.ok) {
            const data = await res.json();
            setInstagramData(data);
            setShowSampleData(false);
            // URLパラメーターをクリア
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error('Failed to fetch Instagram data');
            setShowSampleData(true);
          }
        } catch (error) {
          console.error('Error fetching Instagram data:', error);
          setShowSampleData(true);
        }
      } else {
        // 通常のInstagram接続チェック
        try {
          const res = await fetch('/api/instagram/user');
          if (res.ok) {
            const data = await res.json();
            setInstagramData(data);
            setShowSampleData(false);
          } else {
            setShowSampleData(true);
          }
        } catch (error) {
          console.error('Instagram connection check failed:', error);
          setShowSampleData(true);
        }
      }
      
      setLoading(false);
    };

    initializeData();
  }, []);

  // CSV出力機能
  const downloadCSV = () => {
    const headers = [
      '投稿日', '投稿内容', 'メディアタイプ',
      'リーチ数(24h)', 'いいね数(24h)', '保存数(24h)', 'プロフィール表示(24h)', 'フォロー数(24h)',
      'リーチ数(7d)', 'いいね数(7d)', '保存数(7d)', 'プロフィール表示(7d)', 'フォロー数(7d)',
      '保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率',
      '保存率順位', 'ホーム率順位', 'プロフィールアクセス率順位', 'フォロワー転換率順位'
    ];
    
    const rows = filteredPosts.map(post => {
      const metrics = calculateMetrics(post);
      const data24h = post.data_24h || {};
      const data7d = post.data_7d || post.insights || {};
      
      return [
        post.date || post.timestamp?.split('T')[0] || '',
        post.title || post.caption || '',
        post.media_type || 'IMAGE',
        data24h.reach || 0,
        data24h.likes || 0,
        data24h.saves || 0,
        data24h.profile_views || 0,
        data24h.follows || 0,
        data7d.reach || 0,
        data7d.likes || 0,
        data7d.saves || 0,
        data7d.profile_views || 0,
        data7d.follows || 0,
        metrics.saves_rate + '%',
        metrics.home_rate + '%',
        metrics.profile_access_rate + '%',
        metrics.follower_conversion_rate + '%',
        `${post.rankings?.saves_rate || 0}位/${filteredPosts.length}投稿`,
        `${post.rankings?.home_rate || 0}位/${filteredPosts.length}投稿`,
        `${post.rankings?.profile_access_rate || 0}位/${filteredPosts.length}投稿`,
        `${post.rankings?.follower_conversion_rate || 0}位/${filteredPosts.length}投稿`
      ];
    });
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instagram_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // メディアタイプアイコン取得
  const getMediaIcon = (type) => {
    switch(type) {
      case 'VIDEO': return <Video size={16} />;
      case 'CAROUSEL_ALBUM': return <Layers size={16} />;
      case 'REELS': return <Film size={16} />;
      default: return <Image size={16} />;
    }
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
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <RefreshCw 
            size={48} 
            style={{ 
              color: '#c79a42',
              marginBottom: '24px',
              animation: 'spin 1s linear infinite'
            }} 
          />
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            color: '#5d4e37',
            marginBottom: '8px'
          }}>
            データを読み込み中
          </h2>
          <p style={{ color: '#8b7355', fontSize: '14px' }}>
            しばらくお待ちください...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 期間テキスト取得
  const dateRangeText = filterPeriod === '7' ? '過去7日間' :
                       filterPeriod === '28' ? '過去28日間' :
                       filterPeriod === '90' ? '過去90日間' : '全期間';

  // メインUI
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(199, 154, 66, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                border: '2px solid #c79a42',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#c79a42';
                e.currentTarget.style.transform = 'translateX(-2px)';
                e.currentTarget.querySelector('svg').style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.querySelector('svg').style.color = '#c79a42';
              }}
            >
              <ArrowLeft size={20} style={{ color: '#c79a42' }} />
            </button>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                margin: 0,
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Instagram分析ダッシュボード
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#8b7355', 
                margin: '4px 0 0 0' 
              }}>
                @{hasRealData ? instagramData.profile?.username : 'sample_account'} • {dateRangeText} • {filteredPosts.length}件の投稿を分析
              </p>
            </div>
          </div>
          
          {!hasRealData && (
            <button 
              onClick={() => {
                window.location.href = '/api/instagram/connect';
              }}
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
              Instagram連携
            </button>
          )}
        </div>

        {/* エラーメッセージ表示 */}
        {errorMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
            border: '1px solid #ef4444',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>!</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#991b1b', margin: '0 0 8px 0' }}>
                {errorMessage}
              </h3>
              <p style={{ fontSize: '14px', color: '#7f1d1d', margin: '0 0 12px 0' }}>
                サンプルデータを表示中です。Instagram連携をするには以下を確認してください：
              </p>
              <ul style={{ fontSize: '13px', color: '#7f1d1d', margin: 0, paddingLeft: '20px' }}>
                <li>Instagramアカウントがビジネスまたはクリエイターアカウントであること</li>
                <li>FacebookページとInstagramアカウントが連携されていること</li>
                <li>必要な権限をすべて許可していること</li>
              </ul>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#991b1b',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '0',
                lineHeight: '1'
              }}
            >
              ×
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
            gap: '8px'
          }}>
            <Users size={24} />
            フォロワー推移
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#8b7355', marginBottom: '8px' }}>現在のフォロワー</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#c79a42' }}>{currentFollowers.toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#8b7355', marginBottom: '8px' }}>28日間増減</p>
              {(() => {
                const change = currentFollowers - initialFollowers;
                const isPositive = change >= 0;
                return (
                  <p style={{ 
                    fontSize: '32px', 
                    fontWeight: '700', 
                    color: isPositive ? '#52c41a' : '#ef4444' 
                  }}>
                    {isPositive ? '+' : ''}{change.toLocaleString()}
                  </p>
                );
              })()}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#8b7355', marginBottom: '8px' }}>1日平均増減</p>
              {(() => {
                const dailyChange = Math.round((currentFollowers - initialFollowers) / 28);
                const isPositive = dailyChange >= 0;
                return (
                  <p style={{ 
                    fontSize: '32px', 
                    fontWeight: '700', 
                    color: isPositive ? '#52c41a' : '#ef4444' 
                  }}>
                    {isPositive ? '+' : ''}{dailyChange}
                  </p>
                );
              })()}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#8b7355', marginBottom: '8px' }}>成長率</p>
              {(() => {
                const growthRate = initialFollowers > 0 ? (((currentFollowers - initialFollowers) / initialFollowers) * 100).toFixed(1) : '0.0';
                const isPositive = parseFloat(growthRate) >= 0;
                return (
                  <p style={{ 
                    fontSize: '32px', 
                    fontWeight: '700', 
                    color: isPositive ? '#52c41a' : '#ef4444' 
                  }}>
                    {isPositive ? '+' : ''}{growthRate}%
                  </p>
                );
              })()}
            </div>
          </div>
          
          {safeFollowerData.data && safeFollowerData.data.length > 0 && (
            <div style={{ height: '300px', background: '#fafafa', borderRadius: '8px', padding: '20px' }}>
              <svg viewBox="0 0 800 250" style={{ width: '100%', height: '100%' }}>
                <polyline
                  points={safeFollowerData.data?.map((val, i) => 
                    `${(i / (safeFollowerData.data.length - 1)) * 780 + 10},${240 - ((val - 8200) / 450) * 220}`
                  ).join(' ') || ''}
                  fill="none"
                  stroke="#c79a42"
                  strokeWidth="3"
                />
                {safeFollowerData.data?.map((val, i) => (
                  <circle
                    key={i}
                    cx={(i / (safeFollowerData.data.length - 1)) * 780 + 10}
                    cy={240 - ((val - 8200) / 450) * 220}
                    r="5"
                    fill="#c79a42"
                  />
                )) || []}
                {safeFollowerData.labels?.map((label, i) => (
                  <text
                    key={i}
                    x={(i / (safeFollowerData.labels.length - 1)) * 780 + 10}
                    y="250"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#666"
                  >
                    {label}
                  </text>
                )) || []}
              </svg>
            </div>
          )}
        </div>

        {/* 重要4指標スコア - ゴージャス白金デザイン */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 246, 243, 0.98) 100%)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '32px',
          border: '2px solid rgba(199, 154, 66, 0.3)',
          boxShadow: '0 20px 60px rgba(199, 154, 66, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* ゴージャス背景パターン */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(199, 154, 66, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(184, 135, 59, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '32px', 
            color: '#5d4e37',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
            zIndex: 1
          }}>
            <BarChart3 size={28} style={{ color: '#c79a42' }} />
            重要4指標スコア
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', position: 'relative', zIndex: 1 }}>
            {[
              { key: 'saves_rate', title: '保存率', value: averages.avg_saves_rate, target: 3.0, formula: '保存数 ÷ リーチ数', note: '' },
              { key: 'home_rate', title: 'ホーム率', value: averages.avg_home_rate, target: 50.0, formula: 'ホーム数 ÷ フォロワー数', note: 'ホーム数：実データ取得不可のため推定値' },
              { key: 'profile_access_rate', title: 'プロフィールアクセス率', value: averages.avg_profile_access_rate, target: 5.0, formula: 'プロフィール表示 ÷ リーチ数', note: '' },
              { key: 'follower_conversion_rate', title: 'フォロワー転換率', value: averages.avg_follower_conversion_rate, target: 8.0, formula: 'フォロー数 ÷ プロフィール表示', note: '' }
            ].map((metric) => (
              <div key={metric.key} style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(252, 251, 248, 0.95) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(199, 154, 66, 0.2)',
                boxShadow: '0 8px 24px rgba(199, 154, 66, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '200px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-30%',
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(184, 135, 59, 0.05) 100%)',
                  borderRadius: '50%',
                  filter: 'blur(20px)'
                }} />
                <div style={{ marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#5d4e37', margin: 0, marginBottom: '8px' }}>
                    {metric.title}
                  </h3>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: '700', 
                    background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(199, 154, 66, 0.1)',
                    display: 'block'
                  }}>
                    {metric.value}%
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#8b7355', marginBottom: '8px', opacity: 0.8 }}>
                  計算式: {metric.formula}
                </p>
                <p style={{ fontSize: '12px', color: parseFloat(metric.value) >= metric.target ? '#22c55e' : '#ef4444', fontWeight: '600', marginBottom: 'auto' }}>
                  目標: {metric.target}%以上 • {parseFloat(metric.value) >= metric.target ? '達成' : '要改善'}
                </p>
                {metric.note && (
                  <p style={{ 
                    fontSize: '10px', 
                    color: '#9ca3af',
                    marginTop: '12px',
                    padding: '6px 8px',
                    background: 'rgba(199, 154, 66, 0.05)',
                    borderRadius: '6px',
                    textAlign: 'right',
                    fontStyle: 'italic'
                  }}>
                    {metric.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 🚀 NEW: 高度なAI分析ダッシュボード */}
        {instagramData?.advanced_engagement?.hasAdvancedData && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 246, 243, 0.98) 100%)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '32px',
            border: '2px solid rgba(199, 154, 66, 0.3)',
            boxShadow: '0 20px 60px rgba(199, 154, 66, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 30%, rgba(199, 154, 66, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(184, 135, 59, 0.03) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />
            
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              marginBottom: '32px', 
              color: '#5d4e37',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              position: 'relative',
              zIndex: 1
            }}>
              <Brain size={28} style={{ color: '#c79a42' }} />
              AI分析ダッシュボード
              <div style={{
                background: 'linear-gradient(135deg, #c79a42, #d4af37)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                marginLeft: '8px'
              }}>
                ADVANCED
              </div>
            </h2>

            {/* AI分析グリッド */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', position: 'relative', zIndex: 1 }}>
              
              {/* エンゲージメント品質スコア */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Activity size={24} style={{ color: '#22c55e' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#065f46', margin: 0 }}>
                    エンゲージメント品質
                  </h3>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#22c55e', marginBottom: '8px' }}>
                  {instagramData?.advanced_engagement?.ai_insights?.growth_potential === 'high' ? '85' : 
                   instagramData?.advanced_engagement?.ai_insights?.growth_potential === 'medium' ? '72' : '58'}/100
                </div>
                <div style={{ fontSize: '14px', color: '#065f46' }}>
                  品質の高いエンゲージメントを獲得しています
                </div>
              </div>

              {/* ベストコンテンツタイプ */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Award size={24} style={{ color: '#a855f7' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#581c87', margin: 0 }}>
                    最強コンテンツ形式
                  </h3>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#a855f7', marginBottom: '8px' }}>
                  {instagramData?.advanced_engagement?.ai_insights?.best_performing_content_type === 'CAROUSEL_ALBUM' ? 'カルーセル' :
                   instagramData?.advanced_engagement?.ai_insights?.best_performing_content_type === 'VIDEO' ? 'リール' : '画像投稿'}
                </div>
                <div style={{ fontSize: '14px', color: '#581c87' }}>
                  この形式で投稿を増やしましょう
                </div>
              </div>

              {/* 成長ポテンシャル */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <TrendingUp size={24} style={{ color: '#f59e0b' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#92400e', margin: 0 }}>
                    成長ポテンシャル
                  </h3>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b', marginBottom: '8px' }}>
                  {instagramData?.advanced_engagement?.ai_insights?.growth_potential === 'high' ? '🚀 高' :
                   instagramData?.advanced_engagement?.ai_insights?.growth_potential === 'medium' ? '📈 中' : '📊 要改善'}
                </div>
                <div style={{ fontSize: '14px', color: '#92400e' }}>
                  継続すれば大きく成長します
                </div>
              </div>
            </div>

            {/* AI推奨事項 */}
            {instagramData?.advanced_engagement?.ai_insights?.key_recommendations?.length > 0 && (
              <div style={{ marginTop: '32px', position: 'relative', zIndex: 1 }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#5d4e37', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Lightbulb size={20} style={{ color: '#c79a42' }} />
                  AI推奨事項
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {instagramData.advanced_engagement.ai_insights.key_recommendations.map((rec, index) => (
                    <div key={index} style={{
                      background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(199, 154, 66, 0.05) 100%)',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(199, 154, 66, 0.2)',
                      fontSize: '14px',
                      color: '#5d4e37',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <CheckCircle size={16} style={{ color: '#c79a42' }} />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '1px solid #c79a42',
                  background: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="7">過去7日間</option>
                <option value="28">過去28日間</option>
                <option value="90">過去90日間</option>
                <option value="all">全期間</option>
              </select>
              
              <button 
                onClick={downloadCSV}
                style={{
                  background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
                  color: '#fcfbf8',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(199, 154, 66, 0.3)'
                }}
              >
                <Download size={16} />
                CSV出力
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #faf8f5, #f5f2ed)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    投稿
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    24時間後
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    1週間後
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    重要4指標
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(sortedPosts) && sortedPosts.length > 0 ? sortedPosts.map((post, index) => {
                  const metrics24h = calculateMetrics({ ...post, data_7d: post.data_24h });
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
                        <div style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {getMediaIcon(post.media_type)}
                          {date}
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>
                          <div>リーチ: {post.data_24h.reach.toLocaleString()}</div>
                          <div>いいね: {post.data_24h.likes}</div>
                          <div>保存: {post.data_24h.saves}</div>
                          <div>プロフ: {post.data_24h.profile_views}</div>
                          <div>フォロー: {post.data_24h.follows}</div>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '600' }}>
                          <div style={{ color: parseFloat(metrics24h.saves_rate) >= 3.0 ? '#22c55e' : '#ef4444' }}>保存率: {metrics24h.saves_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.home_rate) >= 50.0 ? '#22c55e' : '#ef4444' }}>ホーム率: {metrics24h.home_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.profile_access_rate) >= 5.0 ? '#22c55e' : '#ef4444' }}>プロフ率: {metrics24h.profile_access_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#ef4444' }}>転換率: {metrics24h.follower_conversion_rate}%</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>
                          <div>リーチ: {post.data_7d.reach.toLocaleString()}</div>
                          <div>いいね: {post.data_7d.likes}</div>
                          <div>保存: {post.data_7d.saves}</div>
                          <div>プロフ: {post.data_7d.profile_views}</div>
                          <div>フォロー: {post.data_7d.follows}</div>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '600' }}>
                          <div style={{ color: parseFloat(metrics7d.saves_rate) >= 3.0 ? '#22c55e' : '#ef4444' }}>保存率: {metrics7d.saves_rate}%</div>
                          <div style={{ color: parseFloat(metrics7d.home_rate) >= 50.0 ? '#22c55e' : '#ef4444' }}>ホーム率: {metrics7d.home_rate}%</div>
                          <div style={{ color: parseFloat(metrics7d.profile_access_rate) >= 5.0 ? '#22c55e' : '#ef4444' }}>プロフ率: {metrics7d.profile_access_rate}%</div>
                          <div style={{ color: parseFloat(metrics7d.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#ef4444' }}>転換率: {metrics7d.follower_conversion_rate}%</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px' }}>
                          {(() => {
                            // 最小4投稿以上の場合のみ色分け
                            const shouldColorCode = filteredPosts.length >= 4;
                            const top25Threshold = Math.max(1, Math.floor(filteredPosts.length * 0.25));
                            const bottom25Threshold = filteredPosts.length - Math.max(0, Math.floor(filteredPosts.length * 0.25)) + 1;
                            
                            return (
                              <>
                                <div style={{
                                  padding: '2px 8px',
                                  marginBottom: '4px',
                                  borderRadius: '12px',
                                  background: shouldColorCode ? 
                                    (post.rankings?.saves_rate <= top25Threshold ? 'rgba(34, 197, 94, 0.2)' : 
                                     post.rankings?.saves_rate >= bottom25Threshold ? 'rgba(239, 68, 68, 0.2)' : 
                                     'rgba(199, 154, 66, 0.1)') : 'rgba(199, 154, 66, 0.1)',
                                  color: shouldColorCode ? 
                                    (post.rankings?.saves_rate <= top25Threshold ? '#16a34a' : 
                                     post.rankings?.saves_rate >= bottom25Threshold ? '#dc2626' : 
                                     '#b8873b') : '#b8873b',
                                  fontWeight: '600'
                                }}>
                                  保存率: {post.rankings?.saves_rate || (index + 1)}位/{filteredPosts.length}
                                </div>
                                <div style={{
                                  padding: '2px 8px',
                                  marginBottom: '4px',
                                  borderRadius: '12px',
                                  background: shouldColorCode ? 
                                    (post.rankings?.home_rate <= top25Threshold ? 'rgba(34, 197, 94, 0.2)' : 
                                     post.rankings?.home_rate >= bottom25Threshold ? 'rgba(239, 68, 68, 0.2)' : 
                                     'rgba(199, 154, 66, 0.1)') : 'rgba(199, 154, 66, 0.1)',
                                  color: shouldColorCode ? 
                                    (post.rankings?.home_rate <= top25Threshold ? '#16a34a' : 
                                     post.rankings?.home_rate >= bottom25Threshold ? '#dc2626' : 
                                     '#b8873b') : '#b8873b',
                                  fontWeight: '600'
                                }}>
                                  ホーム率: {post.rankings?.home_rate || (index + 1)}位/{filteredPosts.length}
                                </div>
                                <div style={{
                                  padding: '2px 8px',
                                  marginBottom: '4px',
                                  borderRadius: '12px',
                                  background: shouldColorCode ? 
                                    (post.rankings?.profile_access_rate <= top25Threshold ? 'rgba(34, 197, 94, 0.2)' : 
                                     post.rankings?.profile_access_rate >= bottom25Threshold ? 'rgba(239, 68, 68, 0.2)' : 
                                     'rgba(199, 154, 66, 0.1)') : 'rgba(199, 154, 66, 0.1)',
                                  color: shouldColorCode ? 
                                    (post.rankings?.profile_access_rate <= top25Threshold ? '#16a34a' : 
                                     post.rankings?.profile_access_rate >= bottom25Threshold ? '#dc2626' : 
                                     '#b8873b') : '#b8873b',
                                  fontWeight: '600'
                                }}>
                                  プロフ率: {post.rankings?.profile_access_rate || (index + 1)}位/{filteredPosts.length}
                                </div>
                                <div style={{
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  background: shouldColorCode ? 
                                    (post.rankings?.follower_conversion_rate <= top25Threshold ? 'rgba(34, 197, 94, 0.2)' : 
                                     post.rankings?.follower_conversion_rate >= bottom25Threshold ? 'rgba(239, 68, 68, 0.2)' : 
                                     'rgba(199, 154, 66, 0.1)') : 'rgba(199, 154, 66, 0.1)',
                                  color: shouldColorCode ? 
                                    (post.rankings?.follower_conversion_rate <= top25Threshold ? '#16a34a' : 
                                     post.rankings?.follower_conversion_rate >= bottom25Threshold ? '#dc2626' : 
                                     '#b8873b') : '#b8873b',
                                  fontWeight: '600'
                                }}>
                                  転換率: {post.rankings?.follower_conversion_rate || (index + 1)}位/{filteredPosts.length}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                      <MessageSquare size={48} style={{ margin: '0 auto 16px', color: '#ccc' }} />
                      <p>表示する投稿データがありません</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 総合評価セクション */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 246, 243, 0.98) 100%)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '32px',
          border: '2px solid rgba(199, 154, 66, 0.3)',
          boxShadow: '0 20px 60px rgba(199, 154, 66, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* ゴージャス背景パターン */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(199, 154, 66, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(184, 135, 59, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '32px', 
            color: '#5d4e37',
            position: 'relative',
            zIndex: 1
          }}>
            総合評価
          </h2>
          
          {(() => {
            // 目標達成数を計算
            const metrics = [
              { value: parseFloat(averages.avg_saves_rate), target: 3.0 },
              { value: parseFloat(averages.avg_home_rate), target: 50.0 },
              { value: parseFloat(averages.avg_profile_access_rate), target: 5.0 },
              { value: parseFloat(averages.avg_follower_conversion_rate), target: 8.0 }
            ];
            
            const achievedCount = metrics.filter(metric => metric.value >= metric.target).length;
            
            let grade = 'D';
            let gradeColor = '#ef4444';
            let comment = '';
            
            if (achievedCount === 4) {
              grade = 'A';
              gradeColor = '#22c55e';
              comment = '素晴らしい成果です！全ての重要指標で目標を達成しています。';
            } else if (achievedCount === 3) {
              grade = 'B';
              gradeColor = '#3b82f6';
              comment = '良好な結果です。ほぼ全ての指標で目標を達成しています。';
            } else if (achievedCount === 2) {
              grade = 'C';
              gradeColor = '#f59e0b';
              comment = '標準的な成果です。半数の指標で目標を達成しています。';
            } else {
              grade = 'D';
              gradeColor = '#ef4444';
              comment = '改善の余地があります。基本的な運用戦略の見直しを推奨します。';
            }
            
            return (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(252, 251, 248, 0.95) 100%)',
                borderRadius: '16px',
                padding: '40px',
                border: '1px solid rgba(199, 154, 66, 0.2)',
                boxShadow: '0 8px 24px rgba(199, 154, 66, 0.1)',
                position: 'relative',
                zIndex: 1,
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    fontSize: '72px',
                    fontWeight: '700',
                    color: gradeColor,
                    marginBottom: '16px',
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    {grade}
                  </div>
                  <div style={{ 
                    fontSize: '20px', 
                    color: '#5d4e37', 
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    4指標中 {achievedCount}項目 達成
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    color: '#8b7355',
                    lineHeight: '1.6'
                  }}>
                    {comment}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* 🚀 NEW: 競合分析・ベンチマーク */}
        {false && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 246, 243, 0.98) 100%)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '32px',
          border: '2px solid rgba(199, 154, 66, 0.3)',
          boxShadow: '0 20px 60px rgba(199, 154, 66, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 40% 40%, rgba(199, 154, 66, 0.03) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(184, 135, 59, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />
          
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '32px', 
            color: '#5d4e37',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
            zIndex: 1
          }}>
            <Target size={28} style={{ color: '#c79a42' }} />
            業界ベンチマーク分析
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              marginLeft: '8px'
            }}>
              PRO
            </div>
          </h2>

          {/* ベンチマーク比較グリッド */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', position: 'relative', zIndex: 1 }}>
            
            {/* 保存率ベンチマーク */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Bookmark size={20} style={{ color: '#22c55e' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#065f46', margin: 0 }}>
                  保存率ベンチマーク
                </h3>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#065f46' }}>あなた</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>
                    {averages.avg_saves_rate.toFixed(1)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#065f46' }}>業界平均</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>2.1%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#065f46' }}>上位25%</span>
                  <span style={{ fontSize: '14px', color: '#f59e0b' }}>3.2%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#065f46' }}>上位10%</span>
                  <span style={{ fontSize: '14px', color: '#ef4444' }}>4.8%</span>
                </div>
              </div>
              <div style={{
                background: averages.avg_saves_rate >= 3.2 ? 'rgba(34, 197, 94, 0.2)' :
                           averages.avg_saves_rate >= 2.1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: averages.avg_saves_rate >= 3.2 ? '#16a34a' :
                       averages.avg_saves_rate >= 2.1 ? '#d97706' : '#dc2626',
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {averages.avg_saves_rate >= 4.8 ? '🏆 業界トップ10%' :
                 averages.avg_saves_rate >= 3.2 ? '🥉 上位25%' :
                 averages.avg_saves_rate >= 2.1 ? '📊 平均レベル' : '📉 要改善'}
              </div>
            </div>

            {/* エンゲージメント率ベンチマーク */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              boxShadow: '0 8px 24px rgba(168, 85, 247, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Heart size={20} style={{ color: '#a855f7' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#581c87', margin: 0 }}>
                  総合エンゲージメント
                </h3>
              </div>
              <div style={{ marginBottom: '16px' }}>
                {(() => {
                  // 総合エンゲージメント率を計算
                  const avgEngagement = ((averages.avg_saves_rate + averages.avg_profile_access_rate + averages.avg_follower_conversion_rate) / 3).toFixed(1);
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#581c87' }}>あなた</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#a855f7' }}>
                          {avgEngagement}%
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#581c87' }}>業界平均</span>
                        <span style={{ fontSize: '14px', color: '#666' }}>3.8%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#581c87' }}>上位25%</span>
                        <span style={{ fontSize: '14px', color: '#f59e0b' }}>5.2%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#581c87' }}>上位10%</span>
                        <span style={{ fontSize: '14px', color: '#ef4444' }}>7.1%</span>
                      </div>
                      <div style={{
                        marginTop: '12px',
                        background: parseFloat(avgEngagement) >= 5.2 ? 'rgba(168, 85, 247, 0.2)' :
                                   parseFloat(avgEngagement) >= 3.8 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: parseFloat(avgEngagement) >= 5.2 ? '#7c3aed' :
                               parseFloat(avgEngagement) >= 3.8 ? '#d97706' : '#dc2626',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {parseFloat(avgEngagement) >= 7.1 ? '🏆 業界トップ10%' :
                         parseFloat(avgEngagement) >= 5.2 ? '🥉 上位25%' :
                         parseFloat(avgEngagement) >= 3.8 ? '📊 平均レベル' : '📉 要改善'}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 成長速度ベンチマーク */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <TrendingUp size={20} style={{ color: '#3b82f6' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', margin: 0 }}>
                  フォロワー成長率
                </h3>
              </div>
              <div style={{ marginBottom: '16px' }}>
                {(() => {
                  // フォロワー成長率を計算（月間推定）
                  const monthlyGrowth = averages.avg_follower_conversion_rate * 4; // 週間×4
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#1e40af' }}>あなた（月間）</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>
                          +{monthlyGrowth.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#1e40af' }}>業界平均</span>
                        <span style={{ fontSize: '14px', color: '#666' }}>+2.8%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#1e40af' }}>急成長アカウント</span>
                        <span style={{ fontSize: '14px', color: '#f59e0b' }}>+8.5%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#1e40af' }}>バイラルアカウント</span>
                        <span style={{ fontSize: '14px', color: '#ef4444' }}>+15.0%</span>
                      </div>
                      <div style={{
                        marginTop: '12px',
                        background: monthlyGrowth >= 8.5 ? 'rgba(59, 130, 246, 0.2)' :
                                   monthlyGrowth >= 2.8 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: monthlyGrowth >= 8.5 ? '#2563eb' :
                               monthlyGrowth >= 2.8 ? '#d97706' : '#dc2626',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {monthlyGrowth >= 15.0 ? '🚀 バイラル成長' :
                         monthlyGrowth >= 8.5 ? '📈 急成長中' :
                         monthlyGrowth >= 2.8 ? '📊 安定成長' : '🐌 成長鈍化'}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* AI改善提案 */}
          <div style={{ marginTop: '32px', position: 'relative', zIndex: 1 }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#5d4e37', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Brain size={20} style={{ color: '#c79a42' }} />
              AI戦略提案
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {(() => {
                const suggestions = [];
                
                if (averages.avg_saves_rate < 2.1) {
                  suggestions.push({
                    priority: 'high',
                    title: '保存率向上戦略',
                    message: 'ハウツー系コンテンツとインフォグラフィックを増やしましょう',
                    color: '#ef4444'
                  });
                }
                
                if (averages.avg_home_rate < 40.0) {
                  suggestions.push({
                    priority: 'medium',
                    title: 'ホーム表示最適化',
                    message: 'フォロワーがアクティブな時間帯の投稿を心がけましょう',
                    color: '#f59e0b'
                  });
                }
                
                if (averages.avg_follower_conversion_rate < 5.0) {
                  suggestions.push({
                    priority: 'medium',
                    title: 'フォロワー獲得強化',
                    message: 'プロフィール最適化とCTAの改善で転換率を上げましょう',
                    color: '#3b82f6'
                  });
                }
                
                // デフォルト提案
                if (suggestions.length === 0) {
                  suggestions.push({
                    priority: 'low',
                    title: '継続的改善',
                    message: '現在のパフォーマンスを維持しつつ、新しいコンテンツ形式にもチャレンジしましょう',
                    color: '#22c55e'
                  });
                }
                
                return suggestions.map((suggestion, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${suggestion.color}33`,
                    borderLeft: `4px solid ${suggestion.color}`
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: suggestion.color,
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {suggestion.priority === 'high' && <AlertCircle size={14} />}
                      {suggestion.priority === 'medium' && <Target size={14} />}
                      {suggestion.priority === 'low' && <CheckCircle size={14} />}
                      {suggestion.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                      {suggestion.message}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
}