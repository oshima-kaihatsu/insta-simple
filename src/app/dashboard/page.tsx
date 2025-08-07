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
  Star,
  MessageSquare,
  RefreshCw,
  Image,
  Video,
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [instagramData, setInstagramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSampleData, setShowSampleData] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('28');

  useEffect(() => {
    const initializeData = async () => {
      // 初期ローディング
      setLoading(true);
      
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const instagramUserId = urlParams.get('instagram_user_id');
      const success = urlParams.get('success');

      if (success === 'true' && accessToken && instagramUserId) {
        setShowSampleData(false);
        
        try {
          const response = await fetch(`/api/instagram-data?access_token=${accessToken}&instagram_user_id=${instagramUserId}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.connected) {
              setInstagramData(data);
              window.history.replaceState({}, document.title, window.location.pathname);
            } else {
              setShowSampleData(true);
            }
          } else {
            setShowSampleData(true);
          }
        } catch (error) {
          console.error('Error fetching Instagram data:', error);
          setShowSampleData(true);
        }
      }
      
      // ローディング完了
      setTimeout(() => setLoading(false), 1000);
    };

    initializeData();
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const handleInstagramConnect = () => {
    window.location.href = '/api/instagram/connect';
  };

  // 完全なサンプルデータ（15件の投稿 - 保存率計算の整合性を保証）
  const samplePosts = [
    {
      id: 'sample_1',
      title: '新商品のご紹介✨ お客様の声を反映した改良版',
      media_type: 'IMAGE',
      date: '2025-01-28',
      timestamp: '2025-01-28T10:00:00',
      data_24h: { 
        reach: 4523, 
        likes: 287, 
        saves: 156, 
        profile_views: 89, 
        follows: 12 
      },
      data_7d: { 
        reach: 8234, 
        likes: 423, 
        saves: 289, 
        profile_views: 156, 
        follows: 34 
      }
    },
    {
      id: 'sample_2',
      title: 'お客様からの嬉しいレビュー🎉 感謝の気持ちでいっぱいです',
      media_type: 'CAROUSEL_ALBUM',
      date: '2025-01-27',
      timestamp: '2025-01-27T12:30:00',
      data_24h: { 
        reach: 5672, 
        likes: 412, 
        saves: 234, 
        profile_views: 145, 
        follows: 23 
      },
      data_7d: { 
        reach: 12456, 
        likes: 678, 
        saves: 456, 
        profile_views: 289, 
        follows: 67 
      }
    },
    {
      id: 'sample_3',
      title: '週末限定キャンペーン開催中！詳細はプロフィールから',
      media_type: 'REELS',
      date: '2025-01-26',
      timestamp: '2025-01-26T14:00:00',
      data_24h: { 
        reach: 15234, 
        likes: 892, 
        saves: 567, 
        profile_views: 423, 
        follows: 89 
      },
      data_7d: { 
        reach: 45678, 
        likes: 2341, 
        saves: 1234, 
        profile_views: 892, 
        follows: 234 
      }
    },
    {
      id: 'sample_4',
      title: '本日のおすすめメニュー📸 季節の食材を使用',
      media_type: 'IMAGE',
      date: '2025-01-25',
      timestamp: '2025-01-25T09:30:00',
      data_24h: { 
        reach: 3456, 
        likes: 234, 
        saves: 89, 
        profile_views: 67, 
        follows: 8 
      },
      data_7d: { 
        reach: 6789, 
        likes: 345, 
        saves: 156, 
        profile_views: 123, 
        follows: 19 
      }
    },
    {
      id: 'sample_5',
      title: 'スタッフ紹介vol.3 - 私たちの想いをお伝えします',
      media_type: 'VIDEO',
      date: '2025-01-24',
      timestamp: '2025-01-24T11:00:00',
      data_24h: { 
        reach: 7892, 
        likes: 567, 
        saves: 345, 
        profile_views: 234, 
        follows: 45 
      },
      data_7d: { 
        reach: 23456, 
        likes: 1234, 
        saves: 789, 
        profile_views: 567, 
        follows: 123 
      }
    },
    {
      id: 'sample_6',
      title: '季節限定メニューが登場しました🌸 春の訪れ',
      media_type: 'CAROUSEL_ALBUM',
      date: '2025-01-23',
      timestamp: '2025-01-23T15:00:00',
      data_24h: { 
        reach: 4567, 
        likes: 345, 
        saves: 178, 
        profile_views: 134, 
        follows: 21 
      },
      data_7d: { 
        reach: 9876, 
        likes: 567, 
        saves: 345, 
        profile_views: 234, 
        follows: 45 
      }
    },
    {
      id: 'sample_7',
      title: 'イベント開催レポート📍 たくさんのご来場ありがとうございました',
      media_type: 'REELS',
      date: '2025-01-22',
      timestamp: '2025-01-22T10:30:00',
      data_24h: { 
        reach: 8901, 
        likes: 678, 
        saves: 234, 
        profile_views: 189, 
        follows: 34 
      },
      data_7d: { 
        reach: 18234, 
        likes: 1234, 
        saves: 567, 
        profile_views: 456, 
        follows: 89 
      }
    },
    {
      id: 'sample_8',
      title: '新サービス開始のお知らせ📢 より便利になりました',
      media_type: 'IMAGE',
      date: '2025-01-21',
      timestamp: '2025-01-21T14:30:00',
      data_24h: { 
        reach: 2345, 
        likes: 156, 
        saves: 45, 
        profile_views: 34, 
        follows: 3 
      },
      data_7d: { 
        reach: 5678, 
        likes: 234, 
        saves: 89, 
        profile_views: 78, 
        follows: 12 
      }
    },
    {
      id: 'sample_9',
      title: 'お客様の声を形にしました💡 ご要望にお応えして',
      media_type: 'VIDEO',
      date: '2025-01-20',
      timestamp: '2025-01-20T11:30:00',
      data_24h: { 
        reach: 6789, 
        likes: 456, 
        saves: 289, 
        profile_views: 223, 
        follows: 56 
      },
      data_7d: { 
        reach: 14567, 
        likes: 890, 
        saves: 567, 
        profile_views: 445, 
        follows: 112 
      }
    },
    {
      id: 'sample_10',
      title: '週末限定セールのお知らせ🛍️ お見逃しなく',
      media_type: 'CAROUSEL_ALBUM',
      date: '2025-01-19',
      timestamp: '2025-01-19T09:00:00',
      data_24h: { 
        reach: 3456, 
        likes: 234, 
        saves: 67, 
        profile_views: 56, 
        follows: 7 
      },
      data_7d: { 
        reach: 7890, 
        likes: 456, 
        saves: 178, 
        profile_views: 134, 
        follows: 23 
      }
    },
    {
      id: 'sample_11',
      title: '製品の使い方を詳しく解説📖 初心者の方も安心',
      media_type: 'REELS',
      date: '2025-01-18',
      timestamp: '2025-01-18T13:00:00',
      data_24h: { 
        reach: 12345, 
        likes: 890, 
        saves: 456, 
        profile_views: 345, 
        follows: 67 
      },
      data_7d: { 
        reach: 28901, 
        likes: 1678, 
        saves: 890, 
        profile_views: 678, 
        follows: 156 
      }
    },
    {
      id: 'sample_12',
      title: 'お客様の作品をご紹介🎨 素敵な使い方',
      media_type: 'IMAGE',
      date: '2025-01-17',
      timestamp: '2025-01-17T10:00:00',
      data_24h: { 
        reach: 0, 
        likes: 0, 
        saves: 0, 
        profile_views: 0, 
        follows: 0 
      },
      data_7d: { 
        reach: 0, 
        likes: 0, 
        saves: 0, 
        profile_views: 0, 
        follows: 0 
      }
    },
    {
      id: 'sample_13',
      title: '季節のおすすめアイテム🍂 秋の新作',
      media_type: 'VIDEO',
      date: '2025-01-16',
      timestamp: '2025-01-16T11:00:00',
      data_24h: { 
        reach: 5678, 
        likes: 345, 
        saves: 234, 
        profile_views: 178, 
        follows: 34 
      },
      data_7d: { 
        reach: 11234, 
        likes: 678, 
        saves: 456, 
        profile_views: 345, 
        follows: 78 
      }
    },
    {
      id: 'sample_14',
      title: 'コラボレーション企画のお知らせ🤝 特別企画',
      media_type: 'CAROUSEL_ALBUM',
      date: '2025-01-15',
      timestamp: '2025-01-15T15:30:00',
      data_24h: { 
        reach: 4567, 
        likes: 234, 
        saves: 123, 
        profile_views: 89, 
        follows: 12 
      },
      data_7d: { 
        reach: 8901, 
        likes: 456, 
        saves: 234, 
        profile_views: 178, 
        follows: 34 
      }
    },
    {
      id: 'sample_15',
      title: '年末年始の営業時間のお知らせ📅 重要なお知らせ',
      media_type: 'IMAGE',
      date: '2025-01-14',
      timestamp: '2025-01-14T12:00:00',
      data_24h: { 
        reach: 6789, 
        likes: 234, 
        saves: 345, 
        profile_views: 456, 
        follows: 67 
      },
      data_7d: { 
        reach: 12345, 
        likes: 456, 
        saves: 678, 
        profile_views: 789, 
        follows: 123 
      }
    }
  ];

  // サンプルフォロワーデータ
  const sampleFollowerData = [
    { date: '1/1', followers: 8234 },
    { date: '1/5', followers: 8267 },
    { date: '1/10', followers: 8312 },
    { date: '1/15', followers: 8389 },
    { date: '1/20', followers: 8456 },
    { date: '1/25', followers: 8523 },
    { date: '1/28', followers: 8634 }
  ];

  // 使用するデータの決定（エラーハンドリング強化）
  const postsData = instagramData?.posts || (showSampleData ? samplePosts : []);
  const followerData = instagramData?.follower_history?.data || (showSampleData ? sampleFollowerData : null);
  const hasRealData = instagramData !== null && instagramData !== undefined;
  const hasFollowerData = (instagramData?.follower_history?.hasData === true) || showSampleData;

  // 期間フィルター適用（エラーハンドリング付き）
  const filteredPosts = filterPeriod === 'all' ? postsData : postsData.filter(post => {
    try {
      const postDate = new Date(post.timestamp || post.date);
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(filterPeriod));
      return postDate >= daysAgo;
    } catch (error) {
      console.error('Date filtering error:', error);
      return true;
    }
  });

  // 現在のフォロワー数（実データの場合はAPIから取得）
  const currentFollowers = hasRealData ? 
    (instagramData?.profile?.followers_count || 0) : 8634;

  // フォロワー増減数の計算（エラーハンドリング強化）
  const calculateFollowerIncrease = () => {
    try {
      if (hasRealData && hasFollowerData && followerData && Array.isArray(followerData) && followerData.length > 1) {
        const firstFollower = parseInt(followerData[0].followers) || 0;
        const lastFollower = parseInt(followerData[followerData.length - 1].followers) || 0;
        return lastFollower - firstFollower;
      }
    } catch (error) {
      console.error('Follower calculation error:', error);
    }
    return 400; // サンプルデータのデフォルト値
  };

  const followersIncrease = calculateFollowerIncrease();
  const dailyAverageIncrease = Math.round(followersIncrease / 28);
  const growthRate = currentFollowers > followersIncrease ? 
    ((followersIncrease / (currentFollowers - followersIncrease)) * 100).toFixed(1) : '0.0';

  // 重要4指標の計算（数値整合性を完全保証）
  const calculateMetrics = (post, useData24h = false) => {
    let data;
    
    if (hasRealData && post.insights) {
      data = post.insights;
    } else {
      data = useData24h ? post.data_24h : post.data_7d;
    }

    // 安全な数値取得
    const reach = parseInt(data?.reach) || 0;
    const saves = parseInt(data?.saves) || 0;
    const profile_views = parseInt(data?.profile_views) || 0;
    const follows = parseInt(data?.follows || data?.website_clicks) || 0;
    
    // 計算（分母が0の場合は必ず'0.0'を返す）
    const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
    const home_rate = currentFollowers > 0 && reach > 0 ? 
      ((reach / currentFollowers) * 100).toFixed(1) : '0.0';
    const profile_access_rate = reach > 0 ? 
      ((profile_views / reach) * 100).toFixed(1) : '0.0';
    const follower_conversion_rate = profile_views > 0 ? 
      ((follows / profile_views) * 100).toFixed(1) : '0.0';
    
    return { 
      saves_rate, 
      home_rate, 
      profile_access_rate, 
      follower_conversion_rate,
      raw: { reach, saves, profile_views, follows }
    };
  };

  // ランキング計算（エラーハンドリング付き）
  const calculateRankings = () => {
    const metrics = ['saves_rate', 'home_rate', 'profile_access_rate', 'follower_conversion_rate'];
    
    metrics.forEach(metric => {
      const sorted = [...filteredPosts].sort((a, b) => {
        const aMetrics = calculateMetrics(a);
        const bMetrics = calculateMetrics(b);
        return parseFloat(bMetrics[metric]) - parseFloat(aMetrics[metric]);
      });
      
      sorted.forEach((post, index) => {
        if (!post.rankings) post.rankings = {};
        post.rankings[metric] = index + 1;
      });
    });
  };

  calculateRankings();
// 平均値計算（エラーハンドリング強化）
  const calculateAverages = (posts) => {
    if (!posts || posts.length === 0) {
      return { 
        saves_rate: '0.0', 
        home_rate: '0.0', 
        profile_access_rate: '0.0', 
        follower_conversion_rate: '0.0' 
      };
    }

    const totals = posts.reduce((acc, post) => {
      const metrics = calculateMetrics(post);
      acc.saves_rate += parseFloat(metrics.saves_rate) || 0;
      acc.home_rate += parseFloat(metrics.home_rate) || 0;
      acc.profile_access_rate += parseFloat(metrics.profile_access_rate) || 0;
      acc.follower_conversion_rate += parseFloat(metrics.follower_conversion_rate) || 0;
      return acc;
    }, { saves_rate: 0, home_rate: 0, profile_access_rate: 0, follower_conversion_rate: 0 });

    return {
      saves_rate: (totals.saves_rate / posts.length).toFixed(1),
      home_rate: (totals.home_rate / posts.length).toFixed(1),
      profile_access_rate: (totals.profile_access_rate / posts.length).toFixed(1),
      follower_conversion_rate: (totals.follower_conversion_rate / posts.length).toFixed(1)
    };
  };

  const averages = calculateAverages(filteredPosts);

  // 総合スコア計算とグレード判定（客観的評価のみ）
  const calculateGrade = () => {
    const savesRate = parseFloat(averages.saves_rate) || 0;
    const homeRate = parseFloat(averages.home_rate) || 0;
    const profileRate = parseFloat(averages.profile_access_rate) || 0;
    const conversionRate = parseFloat(averages.follower_conversion_rate) || 0;

    let score = 0;
    let achievements = 0;

    // 各指標の評価（目標値ベース）
    if (savesRate >= 3.0) { score += 25; achievements++; }
    else if (savesRate >= 2.0) score += 15;
    else if (savesRate >= 1.0) score += 10;
    else score += 5;

    if (homeRate >= 50.0) { score += 25; achievements++; }
    else if (homeRate >= 35.0) score += 15;
    else if (homeRate >= 20.0) score += 10;
    else score += 5;

    if (profileRate >= 5.0) { score += 25; achievements++; }
    else if (profileRate >= 3.0) score += 15;
    else if (profileRate >= 1.5) score += 10;
    else score += 5;

    if (conversionRate >= 8.0) { score += 25; achievements++; }
    else if (conversionRate >= 5.0) score += 15;
    else if (conversionRate >= 2.5) score += 10;
    else score += 5;

    // グレード判定
    let grade = 'D';
    if (score >= 85) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 55) grade = 'C';
    else grade = 'D';

    return { grade, score, achievements };
  };

  const gradeInfo = calculateGrade();

  // 最高パフォーマンス投稿の特定（エラーハンドリング付き）
  const getBestPost = () => {
    if (!filteredPosts || filteredPosts.length === 0) return null;
    
    let bestPost = null;
    let bestScore = 0;
    
    filteredPosts.forEach(post => {
      try {
        const metrics = calculateMetrics(post);
        const score = (parseFloat(metrics.saves_rate) || 0) * 0.4 + 
                     (parseFloat(metrics.profile_access_rate) || 0) * 0.3 + 
                     (parseFloat(metrics.follower_conversion_rate) || 0) * 0.3;
        if (score > bestScore) {
          bestScore = score;
          bestPost = post;
        }
      } catch (error) {
        console.error('Best post calculation error:', error);
      }
    });
    
    return bestPost;
  };

  const bestPost = getBestPost();

  // グレードの色を取得
  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return '#22c55e';
      case 'B': return '#3b82f6';
      case 'C': return '#f59e0b';
      case 'D': return '#ef4444';
      default: return '#666';
    }
  };

  // 客観的な総合評価コメント生成（改善提案なし）
  const getObjectiveAnalysis = () => {
    const analysis = {
      投稿数: filteredPosts.length,
      目標達成数: gradeInfo.achievements,
      保存率: parseFloat(averages.saves_rate) || 0,
      ホーム率: parseFloat(averages.home_rate) || 0,
      プロフィールアクセス率: parseFloat(averages.profile_access_rate) || 0,
      フォロワー転換率: parseFloat(averages.follower_conversion_rate) || 0
    };

    return analysis;
  };

  // メディアタイプのアイコンを取得
  const getMediaIcon = (mediaType) => {
    switch(mediaType) {
      case 'VIDEO':
      case 'REELS':
        return <Play size={14} />;
      case 'CAROUSEL_ALBUM':
        return <Image size={14} />;
      default:
        return <Image size={14} />;
    }
  };

  // CSV出力（完全なデータ出力）
  const downloadCSV = () => {
    const headers = [
      '投稿日', '投稿内容', 'メディアタイプ',
      'リーチ数(24h)', 'いいね数(24h)', '保存数(24h)', 'プロフィール表示数(24h)', 'フォロー数(24h)',
      '保存率(24h)', 'ホーム率(24h)', 'プロフィールアクセス率(24h)', 'フォロワー転換率(24h)',
      'リーチ数(7d)', 'いいね数(7d)', '保存数(7d)', 'プロフィール表示数(7d)', 'フォロー数(7d)',
      '保存率(7d)', 'ホーム率(7d)', 'プロフィールアクセス率(7d)', 'フォロワー転換率(7d)',
      '保存率順位', 'ホーム率順位', 'プロフィールアクセス率順位', 'フォロワー転換率順位'
    ];

    const rows = filteredPosts.map(post => {
      const metrics24h = calculateMetrics(post, true);
      const metrics7d = calculateMetrics(post, false);
      const data24h = post.data_24h || {};
      const data7d = post.data_7d || post.insights || {};
      
      return [
        post.date || post.timestamp?.split('T')[0] || '',
        (post.title || post.caption || '投稿内容なし').replace(/,/g, '、'),
        post.media_type || 'IMAGE',
        data24h.reach || 0,
        data24h.likes || 0,
        data24h.saves || 0,
        data24h.profile_views || 0,
        data24h.follows || 0,
        metrics24h.saves_rate + '%',
        metrics24h.home_rate + '%',
        metrics24h.profile_access_rate + '%',
        metrics24h.follower_conversion_rate + '%',
        data7d.reach || 0,
        data7d.likes || 0,
        data7d.saves || 0,
        data7d.profile_views || 0,
        data7d.follows || data7d.website_clicks || 0,
        metrics7d.saves_rate + '%',
        metrics7d.home_rate + '%',
        metrics7d.profile_access_rate + '%',
        metrics7d.follower_conversion_rate + '%',
        post.rankings?.saves_rate || '',
        post.rankings?.home_rate || '',
        post.rankings?.profile_access_rate || '',
        post.rankings?.follower_conversion_rate || ''
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

  // ローディング表示（美しいアニメーション）
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
          <RefreshCw size={32} style={{ 
            color: '#c79a42', 
            animation: 'spin 1s linear infinite' 
          }} />
          <span style={{ 
            fontSize: '20px', 
            color: '#5d4e37', 
            fontWeight: '600' 
          }}>
            {hasRealData ? 'Instagram データを取得中...' : 'ダッシュボードを準備中...'}
          </span>
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

  const dateRangeText = filterPeriod === '7' ? '過去7日間' :
                       filterPeriod === '28' ? '過去28日間' :
                       filterPeriod === '90' ? '過去90日間' : '全期間';

  const objectiveAnalysis = getObjectiveAnalysis();

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
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(199, 154, 66, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                Instagram分析ダッシュボード
              </h1>
              <p style={{ fontSize: '16px', color: '#666', margin: '8px 0 0 0' }}>
                @{hasRealData ? instagramData.profile?.username : 'your_account'} • {dateRangeText} • {filteredPosts.length}件の投稿を分析
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Instagram連携CTA */}
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
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              実際のデータで分析を開始しませんか？
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.9 }}>
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
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
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
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: followersIncrease >= 0 ? '#22c55e' : '#ef4444', 
                marginBottom: '4px' 
              }}>
                {followersIncrease >= 0 ? '+' : ''}{followersIncrease}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>28日間増減</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: dailyAverageIncrease >= 0 ? '#c79a42' : '#ef4444', 
                marginBottom: '4px' 
              }}>
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

          {hasFollowerData && followerData && (
            <div style={{ 
              width: '100%', 
              height: '200px', 
              background: '#fafafa', 
              borderRadius: '12px', 
              padding: '20px' 
            }}>
              <svg width="100%" height="200" viewBox="0 0 800 200">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c79a42" />
                    <stop offset="100%" stopColor="#b8873b" />
                  </linearGradient>
                </defs>
                
                <polyline
                  points={followerData.map((point, index) => {
                    const x = 40 + index * ((800 - 80) / (followerData.length - 1));
                    const minValue = Math.min(...followerData.map(d => d.followers));
                    const maxValue = Math.max(...followerData.map(d => d.followers));
                    const valueRange = maxValue - minValue || 100;
                    const y = 200 - 40 - ((point.followers - minValue) / valueRange) * (200 - 80);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                />
                
                {followerData.map((point, index) => {
                  const x = 40 + index * ((800 - 80) / (followerData.length - 1));
                  const minValue = Math.min(...followerData.map(d => d.followers));
                  const maxValue = Math.max(...followerData.map(d => d.followers));
                  const valueRange = maxValue - minValue || 100;
                  const y = 200 - 40 - ((point.followers - minValue) / valueRange) * (200 - 80);
                  
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="6" fill="#c79a42" stroke="#fcfbf8" strokeWidth="2" />
                      <text x={x} y={190} textAnchor="middle" fontSize="12" fill="#666">
                        {point.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
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
            color: '#5d4e37',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Target size={24} />
            重要4指標スコア
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {parseFloat(averages.saves_rate) >= 3.0 && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  padding: '4px'
                }}>
                  <CheckCircle size={16} color="white" />
                </div>
              )}
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#5d4e37' }}>
                保存率
              </h3>
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
              border: '1px solid rgba(199, 154, 66, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {parseFloat(averages.home_rate) >= 50.0 && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  padding: '4px'
                }}>
                  <CheckCircle size={16} color="white" />
                </div>
              )}
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#5d4e37' }}>
                ホーム率
              </h3>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                ホーム表示 ÷ フォロワー数
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#5d4e37', marginBottom: '8px' }}>
                {averages.home_rate}%
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: parseFloat(averages.home_rate) >= 50.0 ? '#22c55e' : '#ef4444',
                fontWeight: '600'
              }}>
                目標: 50.0%以上 • {parseFloat(averages.home_rate) >= 50.0 ? '✅ 達成' : '❌ 要改善'}
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {parseFloat(averages.profile_access_rate) >= 5.0 && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  padding: '4px'
                }}>
                  <CheckCircle size={16} color="white" />
                </div>
              )}
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#5d4e37' }}>
                プロフィールアクセス率
              </h3>
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
              border: '1px solid rgba(199, 154, 66, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {parseFloat(averages.follower_conversion_rate) >= 8.0 && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  padding: '4px'
                }}>
                  <CheckCircle size={16} color="white" />
                </div>
              )}
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#5d4e37' }}>
                フォロワー転換率
              </h3>
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              margin: 0, 
              color: '#5d4e37',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <BarChart3 size={24} />
              投稿別詳細分析
            </h2>
            
            <div style={{ display: 'flex', gap: '12px' }}>
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
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(199, 154, 66, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(199, 154, 66, 0.3)';
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
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#5d4e37', 
                    borderBottom: '2px solid #c79a42',
                    minWidth: '250px'
                  }}>
                    投稿
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    color: '#5d4e37', 
                    borderBottom: '2px solid #c79a42',
                    minWidth: '200px'
                  }}>
                    24時間後インサイト
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    color: '#5d4e37', 
                    borderBottom: '2px solid #c79a42',
                    minWidth: '200px'
                  }}>
                    1週間後インサイト
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    color: '#5d4e37', 
                    borderBottom: '2px solid #c79a42',
                    minWidth: '250px'
                  }}>
                    重要4指標ランキング（{filteredPosts.length}投稿中）
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, index) => {
                  const metrics24h = calculateMetrics(post, true);
                  const metrics7d = calculateMetrics(post, false);
                  const data24h = post.data_24h || {};
                  const data7d = post.data_7d || post.insights || {};
                  const isTop25 = post.rankings && (
                    post.rankings.saves_rate <= Math.ceil(filteredPosts.length * 0.25) ||
                    post.rankings.home_rate <= Math.ceil(filteredPosts.length * 0.25) ||
                    post.rankings.profile_access_rate <= Math.ceil(filteredPosts.length * 0.25) ||
                    post.rankings.follower_conversion_rate <= Math.ceil(filteredPosts.length * 0.25)
                  );
                  
                  return (
                    <tr key={post.id} style={{ 
                      borderBottom: '1px solid rgba(199, 154, 66, 0.1)',
                      background: index % 2 === 0 ? 'rgba(252, 251, 248, 0.3)' : 'transparent'
                    }}>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                          <div style={{ color: '#c79a42', marginTop: '2px' }}>
                            {getMediaIcon(post.media_type)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#5d4e37', marginBottom: '4px' }}>
                              {post.title || post.caption || '投稿内容なし'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {post.date || post.timestamp?.split('T')[0]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                          <div>リーチ: <strong>{(data24h.reach || 0).toLocaleString()}</strong></div>
                          <div>いいね: <strong>{(data24h.likes || 0).toLocaleString()}</strong></div>
                          <div>保存: <strong>{(data24h.saves || 0).toLocaleString()}</strong></div>
                          <div>プロフィール: <strong>{(data24h.profile_views || 0).toLocaleString()}</strong></div>
                          <div>フォロー: <strong>{(data24h.follows || 0).toLocaleString()}</strong></div>
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#666', 
                          borderTop: '1px solid #e0e0e0', 
                          paddingTop: '8px' 
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '2px 0'
                          }}>
                            <span>保存率:</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: parseFloat(metrics24h.saves_rate) >= 3.0 ? '#22c55e' : '#666'
                            }}>
                              {metrics24h.saves_rate}%
                              {parseFloat(metrics24h.saves_rate) >= 3.0 && ' ✓'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '2px 0'
                          }}>
                            <span>ホーム率:</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: parseFloat(metrics24h.home_rate) >= 50.0 ? '#22c55e' : '#666'
                            }}>
                              {metrics24h.home_rate}%
                              {parseFloat(metrics24h.home_rate) >= 50.0 && ' ✓'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '2px 0'
                          }}>
                            <span>プロフィール率:</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: parseFloat(metrics24h.profile_access_rate) >= 5.0 ? '#22c55e' : '#666'
                            }}>
                              {metrics24h.profile_access_rate}%
                              {parseFloat(metrics24h.profile_access_rate) >= 5.0 && ' ✓'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '2px 0'
                          }}>
                            <span>転換率:</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: parseFloat(metrics24h.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#666'
                            }}>
                              {metrics24h.follower_conversion_rate}%
                              {parseFloat(metrics24h.follower_conversion_rate) >= 8.0 && ' ✓'}
                            </span>
                          </div>
                        </div>
                      </td>
<td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                          <div>リーチ: <strong>{(data7d.reach || 0).toLocaleString()}</strong></div>
                          <div>いいね: <strong>{(data7d.likes || 0).toLocaleString()}</strong></div>
                          <div>保存: <strong>{(data7d.saves || 0).toLocaleString()}</strong></div>
                          <div>プロフィール: <strong>{(data7d.profile_views || 0).toLocaleString()}</strong></div>
                          <div>フォロー: <strong>{(data7d.follows || data7d.website_clicks || 0).toLocaleString()}</strong></div>
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#666', 
                          borderTop: '1px solid #e0e0e0', 
                          paddingTop: '8px' 
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '2px 0'
                          }}>
                            <span>保存率:</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: parseFloat(metrics7d.saves_rate) >= 3.0 ? '#22c55e' : '#666'
                            }}>
                              {metrics7d.saves_rate}%
                              {parseFloat(metrics7d.saves_rate) >= 3.0 && ' ✓'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '2px 0'
                          }}>
                            <span>ホーム率:</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: parseFloat(metrics7d.home_rate) >= 50.0 ? '#22c55e' : '#666'
                            }}>
                              {metrics7d.home_rate}%
                              {parseFloat(metrics7d.home_rate) >= 50.0 && ' ✓'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '2px 0'
                          }}>
                            <span>プロフィール率:</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: parseFloat(metrics7d.profile_access_rate) >= 5.0 ? '#22c55e' : '#666'
                            }}>
                              {metrics7d.profile_access_rate}%
                              {parseFloat(metrics7d.profile_access_rate) >= 5.0 && ' ✓'}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '2px 0'
                          }}>
                            <span>転換率:</span>
                            <span style={{ 
                              fontWeight: '600',
                              color: parseFloat(metrics7d.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#666'
                            }}>
                              {metrics7d.follower_conversion_rate}%
                              {parseFloat(metrics7d.follower_conversion_rate) >= 8.0 && ' ✓'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        {isTop25 && (
                          <div style={{
                            background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#856404',
                            marginBottom: '8px',
                            display: 'inline-block'
                          }}>
                            <Trophy size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            TOP 25%
                          </div>
                        )}
                        <div style={{ fontSize: '12px' }}>
                          <div style={{
                            padding: '2px 8px',
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: post.rankings?.saves_rate <= Math.ceil(filteredPosts.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings?.saves_rate > Math.ceil(filteredPosts.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings?.saves_rate <= Math.ceil(filteredPosts.length * 0.25) ? '#16a34a' : 
                                   post.rankings?.saves_rate > Math.ceil(filteredPosts.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            保存率: {post.rankings?.saves_rate}位
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: post.rankings?.home_rate <= Math.ceil(filteredPosts.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings?.home_rate > Math.ceil(filteredPosts.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings?.home_rate <= Math.ceil(filteredPosts.length * 0.25) ? '#16a34a' : 
                                   post.rankings?.home_rate > Math.ceil(filteredPosts.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            ホーム率: {post.rankings?.home_rate}位
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: post.rankings?.profile_access_rate <= Math.ceil(filteredPosts.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings?.profile_access_rate > Math.ceil(filteredPosts.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings?.profile_access_rate <= Math.ceil(filteredPosts.length * 0.25) ? '#16a34a' : 
                                   post.rankings?.profile_access_rate > Math.ceil(filteredPosts.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            プロフ率: {post.rankings?.profile_access_rate}位
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: post.rankings?.follower_conversion_rate <= Math.ceil(filteredPosts.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings?.follower_conversion_rate > Math.ceil(filteredPosts.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings?.follower_conversion_rate <= Math.ceil(filteredPosts.length * 0.25) ? '#16a34a' : 
                                   post.rankings?.follower_conversion_rate > Math.ceil(filteredPosts.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            転換率: {post.rankings?.follower_conversion_rate}位
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

        {/* 総合評価 */}
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
            <Star size={24} />
            総合評価
          </h2>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-block' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#5d4e37', marginBottom: '8px' }}>
                総合スコア
              </div>
              <div style={{
                fontSize: '72px',
                fontWeight: '700',
                padding: '24px 40px',
                borderRadius: '16px',
                border: `3px solid ${getGradeColor(gradeInfo.grade)}`,
                background: `${getGradeColor(gradeInfo.grade)}10`,
                color: getGradeColor(gradeInfo.grade),
                display: 'inline-block',
                letterSpacing: '2px'
              }}>
                {gradeInfo.grade}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
                スコア: {gradeInfo.score}/100点（{gradeInfo.achievements}/4指標達成）
              </div>
            </div>
          </div>

          {bestPost && (
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 237, 78, 0.1))', 
              border: '2px solid #ffd700', 
              borderRadius: '12px', 
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <Trophy size={20} style={{ color: '#ffd700', marginRight: '8px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#856404' }}>
                  最高パフォーマンス投稿
                </h3>
              </div>
              <div style={{ color: '#5d4e37', fontSize: '16px', fontWeight: '500' }}>
                「{bestPost.title || bestPost.caption || '投稿'}」
              </div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  投稿日: {bestPost.date || bestPost.timestamp?.split('T')[0]}
                </span>
                <span style={{ fontSize: '14px', color: '#22c55e', fontWeight: '600' }}>
                  保存率: {calculateMetrics(bestPost).saves_rate}%
                </span>
                <span style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600' }}>
                  プロフィール率: {calculateMetrics(bestPost).profile_access_rate}%
                </span>
              </div>
            </div>
          )}

          <div style={{ 
            background: 'rgba(252, 251, 248, 0.8)', 
            borderLeft: '4px solid #c79a42', 
            padding: '24px',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#5d4e37', marginBottom: '16px' }}>
              客観的分析結果
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>分析投稿数</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#5d4e37' }}>
                  {objectiveAnalysis.投稿数}件
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>目標達成指標</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#5d4e37' }}>
                  {objectiveAnalysis.目標達成数}/4
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>平均保存率</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: objectiveAnalysis.保存率 >= 3.0 ? '#22c55e' : '#5d4e37' }}>
                  {objectiveAnalysis.保存率.toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>平均ホーム率</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: objectiveAnalysis.ホーム率 >= 50.0 ? '#22c55e' : '#5d4e37' }}>
                  {objectiveAnalysis.ホーム率.toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>平均プロフィール率</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: objectiveAnalysis.プロフィールアクセス率 >= 5.0 ? '#22c55e' : '#5d4e37' }}>
                  {objectiveAnalysis.プロフィールアクセス率.toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>平均転換率</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: objectiveAnalysis.フォロワー転換率 >= 8.0 ? '#22c55e' : '#5d4e37' }}>
                  {objectiveAnalysis.フォロワー転換率.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
