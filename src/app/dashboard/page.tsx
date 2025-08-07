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
  const [instagramData, setInstagramData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSampleData, setShowSampleData] = useState(true);
  const [aiComments, setAiComments] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('28');

  useEffect(() => {
    const checkForRealData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const instagramUserId = urlParams.get('instagram_user_id');
      const success = urlParams.get('success');

      if (success === 'true' && accessToken && instagramUserId) {
        setLoading(true);
        setShowSampleData(false);
        
        try {
          const response = await fetch(`/api/instagram-data?access_token=${accessToken}&instagram_user_id=${instagramUserId}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.connected) {
              setInstagramData(data);
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else {
            setShowSampleData(true);
          }
        } catch (error) {
          console.error('Error fetching Instagram data:', error);
          setShowSampleData(true);
        } finally {
          setLoading(false);
        }
      }
    };

    checkForRealData();
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const handleInstagramConnect = () => {
    window.location.href = '/api/instagram/connect';
  };

  // サンプルデータ（15件）
  const samplePosts = [
    {
      id: 'sample_1',
      title: '新商品のご紹介！皆様のお声を反映して開発しました',
      date: '2025-01-28',
      timestamp: '2025-01-28T10:00:00',
      data_24h: { reach: 2847, likes: 184, saves: 112, profile_views: 89, follows: 12 },
      data_7d: { reach: 3251, likes: 237, saves: 134, profile_views: 102, follows: 14 }
    },
    {
      id: 'sample_2',
      title: 'お客様からいただいた嬉しいレビューをご紹介',
      date: '2025-01-27',
      timestamp: '2025-01-27T12:30:00',
      data_24h: { reach: 3124, likes: 256, saves: 87, profile_views: 124, follows: 8 },
      data_7d: { reach: 3892, likes: 312, saves: 98, profile_views: 156, follows: 11 }
    },
    {
      id: 'sample_3',
      title: '期間限定キャンペーンのお知らせ',
      date: '2025-01-26',
      timestamp: '2025-01-26T14:00:00',
      data_24h: { reach: 4231, likes: 342, saves: 178, profile_views: 234, follows: 28 },
      data_7d: { reach: 5124, likes: 456, saves: 213, profile_views: 289, follows: 34 }
    },
    {
      id: 'sample_4',
      title: 'スタッフの1日に密着！舞台裏をお見せします',
      date: '2025-01-25',
      timestamp: '2025-01-25T09:30:00',
      data_24h: { reach: 5672, likes: 489, saves: 234, profile_views: 345, follows: 42 },
      data_7d: { reach: 6891, likes: 612, saves: 298, profile_views: 412, follows: 51 }
    },
    {
      id: 'sample_5',
      title: 'よくあるご質問にお答えします',
      date: '2025-01-24',
      timestamp: '2025-01-24T11:00:00',
      data_24h: { reach: 3892, likes: 298, saves: 156, profile_views: 189, follows: 19 },
      data_7d: { reach: 4567, likes: 367, saves: 189, profile_views: 234, follows: 24 }
    },
    {
      id: 'sample_6',
      title: '今月の人気商品TOP5を発表',
      date: '2025-01-23',
      timestamp: '2025-01-23T15:00:00',
      data_24h: { reach: 2456, likes: 167, saves: 89, profile_views: 78, follows: 6 },
      data_7d: { reach: 3124, likes: 198, saves: 102, profile_views: 98, follows: 8 }
    },
    {
      id: 'sample_7',
      title: 'イベント開催レポート',
      date: '2025-01-22',
      timestamp: '2025-01-22T10:30:00',
      data_24h: { reach: 3567, likes: 278, saves: 134, profile_views: 167, follows: 15 },
      data_7d: { reach: 4231, likes: 345, saves: 167, profile_views: 198, follows: 18 }
    },
    {
      id: 'sample_8',
      title: '新サービス開始のお知らせ',
      date: '2025-01-21',
      timestamp: '2025-01-21T14:30:00',
      data_24h: { reach: 4123, likes: 367, saves: 198, profile_views: 234, follows: 23 },
      data_7d: { reach: 4892, likes: 445, saves: 234, profile_views: 278, follows: 29 }
    },
    {
      id: 'sample_9',
      title: 'お客様の声を形にしました',
      date: '2025-01-20',
      timestamp: '2025-01-20T11:30:00',
      data_24h: { reach: 5234, likes: 445, saves: 267, profile_views: 312, follows: 38 },
      data_7d: { reach: 6123, likes: 556, saves: 334, profile_views: 389, follows: 45 }
    },
    {
      id: 'sample_10',
      title: '週末限定セールのお知らせ',
      date: '2025-01-19',
      timestamp: '2025-01-19T09:00:00',
      data_24h: { reach: 2789, likes: 198, saves: 76, profile_views: 89, follows: 7 },
      data_7d: { reach: 3456, likes: 245, saves: 89, profile_views: 112, follows: 9 }
    },
    {
      id: 'sample_11',
      title: '製品の使い方を詳しく解説',
      date: '2025-01-18',
      timestamp: '2025-01-18T13:00:00',
      data_24h: { reach: 1892, likes: 134, saves: 45, profile_views: 56, follows: 4 },
      data_7d: { reach: 2345, likes: 167, saves: 56, profile_views: 67, follows: 5 }
    },
    {
      id: 'sample_12',
      title: 'お客様の作品をご紹介',
      date: '2025-01-17',
      timestamp: '2025-01-17T10:00:00',
      data_24h: { reach: 3345, likes: 256, saves: 145, profile_views: 178, follows: 16 },
      data_7d: { reach: 4012, likes: 312, saves: 178, profile_views: 212, follows: 20 }
    },
    {
      id: 'sample_13',
      title: '季節のおすすめアイテム',
      date: '2025-01-16',
      timestamp: '2025-01-16T11:00:00',
      data_24h: { reach: 4567, likes: 389, saves: 212, profile_views: 267, follows: 31 },
      data_7d: { reach: 5432, likes: 478, saves: 256, profile_views: 323, follows: 37 }
    },
    {
      id: 'sample_14',
      title: 'コラボレーション企画のお知らせ',
      date: '2025-01-15',
      timestamp: '2025-01-15T15:30:00',
      data_24h: { reach: 2234, likes: 156, saves: 67, profile_views: 78, follows: 5 },
      data_7d: { reach: 2890, likes: 189, saves: 78, profile_views: 89, follows: 6 }
    },
    {
      id: 'sample_15',
      title: '年末年始の営業時間のお知らせ',
      date: '2025-01-14',
      timestamp: '2025-01-14T12:00:00',
      data_24h: { reach: 6789, likes: 234, saves: 345, profile_views: 456, follows: 67 },
      data_7d: { reach: 8234, likes: 289, saves: 412, profile_views: 567, follows: 78 }
    }
  ];

  // サンプルフォロワーデータ
  const sampleFollowerData = [
    { date: '1/1', followers: 8234 },
    { date: '1/5', followers: 8267 },
    { date: '1/10', followers: 8312 },
    { date: '1/15', followers: 8389 },
    { date: '1/20', followers: 8456 },
    { date: '1/25', followers: 8567 },
    { date: '1/28', followers: 8634 }
  ];

  // 使用するデータの決定
  const postsData = instagramData?.posts || (showSampleData ? samplePosts : []);
  const followerData = instagramData?.follower_history?.data || (showSampleData ? sampleFollowerData : null);
  const hasRealData = instagramData !== null;
  const hasFollowerData = instagramData?.follower_history?.hasData || showSampleData;

  // 期間フィルター適用
  const filteredPosts = filterPeriod === 'all' ? postsData : postsData.filter(post => {
    const postDate = new Date(post.timestamp || post.date);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(filterPeriod));
    return postDate >= daysAgo;
  });

  // 重要4指標の計算（数値整合性修正版）
  const calculateMetrics = (post) => {
    if (hasRealData && post.insights) {
      const reach = parseInt(post.insights.reach) || 0;
      const saves = parseInt(post.insights.saves) || 0;
      const profile_views = parseInt(post.insights.profile_views) || 0;
      const website_clicks = parseInt(post.insights.website_clicks) || 0;
      const currentFollowers = parseInt(instagramData?.profile?.followers_count) || 8634;
      
      const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
      const home_rate = currentFollowers > 0 && reach > 0 ? ((reach / currentFollowers) * 100).toFixed(1) : '0.0';
      const profile_access_rate = reach > 0 ? ((profile_views / reach) * 100).toFixed(1) : '0.0';
      const follower_conversion_rate = profile_views > 0 ? ((website_clicks / profile_views) * 100).toFixed(1) : '0.0';
      
      return { saves_rate, home_rate, profile_access_rate, follower_conversion_rate };
    } else {
      const data = post.data_7d || {};
      const reach = parseInt(data.reach) || 0;
      const saves = parseInt(data.saves) || 0;
      const profile_views = parseInt(data.profile_views) || 0;
      const follows = parseInt(data.follows) || 0;
      const currentFollowers = 8634;
      
      const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
      const home_rate = currentFollowers > 0 && reach > 0 ? ((reach / currentFollowers) * 100).toFixed(1) : '0.0';
      const profile_access_rate = reach > 0 ? ((profile_views / reach) * 100).toFixed(1) : '0.0';
      const follower_conversion_rate = profile_views > 0 ? ((follows / profile_views) * 100).toFixed(1) : '0.0';
      
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

  const averages = calculateAverages(filteredPosts);

  // ランキング計算
  filteredPosts.forEach((post, index) => {
    post.metrics = calculateMetrics(post);
    post.rankings = {
      saves_rate: index + 1,
      home_rate: index + 1,
      profile_access_rate: index + 1,
      follower_conversion_rate: index + 1
    };
  });

  // AIコメント生成
  const generateAIComments = () => {
    const savesRate = parseFloat(averages.saves_rate);
    const homeRate = parseFloat(averages.home_rate);
    const profileRate = parseFloat(averages.profile_access_rate);
    const conversionRate = parseFloat(averages.follower_conversion_rate);

    let overallComment = `${filteredPosts.length}件の投稿を分析しました。`;
    
    if (savesRate >= 3.0 && homeRate >= 50.0) {
      overallComment += '全体的に優秀なパフォーマンスです。現在の投稿戦略を継続してください。';
    } else if (savesRate >= 2.0 || homeRate >= 40.0) {
      overallComment += '標準的なパフォーマンスです。コンテンツの質と投稿時間の最適化で改善の余地があります。';
    } else {
      overallComment += '改善の余地が大きくあります。コンテンツ戦略の見直しを推奨します。';
    }
    
    const suggestions = [];
    if (savesRate < 3.0) {
      suggestions.push('保存されやすい実用的なコンテンツを増やす');
    }
    if (homeRate < 50.0) {
      suggestions.push('フォロワーのアクティブ時間帯を分析し、投稿時間を最適化する');
    }
    if (profileRate < 3.0) {
      suggestions.push('投稿内でプロフィールへの誘導を強化する');
    }
    if (conversionRate < 7.0) {
      suggestions.push('プロフィールの内容を充実させ、フォローする価値を明確に伝える');
    }

    setAiComments({
      overallComment,
      suggestions
    });
  };

  useEffect(() => {
    if (filteredPosts.length > 0) {
      generateAIComments();
    }
  }, [filteredPosts, hasRealData]);

  // フォロワー統計
  const currentFollowers = instagramData?.profile?.followers_count || 8634;
  const followersIncrease = hasFollowerData && followerData && followerData.length > 1 ? 
    followerData[followerData.length - 1].followers - followerData[0].followers : 400;
  const dailyAverageIncrease = Math.round(followersIncrease / 28);
  const growthRate = ((followersIncrease / (currentFollowers - followersIncrease)) * 100).toFixed(1);

  // 日付範囲
  const today = new Date();
  const days28Ago = new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000));
  const dateRangeText = filterPeriod === '7' ? '過去7日間' :
                       filterPeriod === '28' ? '過去28日間' :
                       filterPeriod === '90' ? '過去90日間' : '全期間';

  // CSV出力
  const downloadCSV = () => {
    const headers = [
      '投稿日', '投稿内容',
      'リーチ数', 'いいね数', '保存数', 'プロフィール表示数', 'フォロー数',
      '保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率'
    ];

    const rows = filteredPosts.map(post => {
      const metrics = calculateMetrics(post);
      const data = post.data_7d || post.insights || {};
      
      return [
        post.date || post.timestamp?.split('T')[0] || '',
        post.title || post.caption || '',
        data.reach || 0,
        data.likes || 0,
        data.saves || 0,
        data.profile_views || 0,
        data.follows || data.website_clicks || 0,
        metrics.saves_rate + '%',
        metrics.home_rate + '%',
        metrics.profile_access_rate + '%',
        metrics.follower_conversion_rate + '%'
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
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
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
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e', marginBottom: '4px' }}>
                +{followersIncrease}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>28日間増減</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#c79a42', marginBottom: '4px' }}>
                +{dailyAverageIncrease}
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

          {hasFollowerData && (
            <div style={{ width: '100%', height: '200px', background: '#fafafa', borderRadius: '12px', padding: '20px' }}>
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
                目標: 3.0%以上
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
                fontWeight: '600'
              }}>
                目標: 50.0%以上
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
                目標: 5.0%以上
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
                目標: 8.0%以上
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
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    投稿日
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    投稿内容
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    保存率
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    ホーム率
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    プロフィール<br/>アクセス率
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>
                    フォロワー<br/>転換率
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, index) => {
                  const metrics = calculateMetrics(post);
                  const isTop25 = index < Math.ceil(filteredPosts.length * 0.25);
                  
                  return (
                    <tr key={post.id} style={{ 
                      borderBottom: '1px solid rgba(199, 154, 66, 0.1)',
                      background: index % 2 === 0 ? 'rgba(252, 251, 248, 0.3)' : 'transparent'
                    }}>
                      <td style={{ padding: '16px' }}>
                        {post.date || post.timestamp?.split('T')[0]}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isTop25 && (
                            <span style={{
                              background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '700',
                              color: '#856404'
                            }}>
                              TOP 25%
                            </span>
                          )}
                          <span>{post.title || post.caption || '投稿内容なし'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(metrics.saves_rate) >= 3.0 ? '#22c55e' : '#5d4e37' }}>
                          {metrics.saves_rate}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {post.rankings?.saves_rate}位/{filteredPosts.length}
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(metrics.home_rate) >= 50.0 ? '#22c55e' : '#5d4e37' }}>
                          {metrics.home_rate}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {post.rankings?.home_rate}位/{filteredPosts.length}
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(metrics.profile_access_rate) >= 5.0 ? '#22c55e' : '#5d4e37' }}>
                          {metrics.profile_access_rate}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {post.rankings?.profile_access_rate}位/{filteredPosts.length}
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(metrics.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#5d4e37' }}>
                          {metrics.follower_conversion_rate}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {post.rankings?.follower_conversion_rate}位/{filteredPosts.length}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI総合評価と改善提案 */}
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
            AI総合評価と改善提案
          </h2>
          
          <div style={{ 
            background: 'rgba(252, 251, 248, 0.8)', 
            borderLeft: '4px solid #c79a42', 
            padding: '20px',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', margin: 0 }}>
              {aiComments.overallComment}
            </p>
          </div>

          {aiComments.suggestions && aiComments.suggestions.length > 0 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#5d4e37' }}>
                改善提案
              </h3>
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
                      background: '#c79a42', 
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
      </div>
    </div>
  );
}