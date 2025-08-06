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
  Zap,
  Target,
  Award,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  Activity,
  FileText,
  Share2,
  ChevronUp,
  ChevronDown,
  Filter,
  Search
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instagramData, setInstagramData] = useState(null);
  const [hasRealData, setHasRealData] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterPeriod, setFilterPeriod] = useState('28days');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [animationComplete, setAnimationComplete] = useState(false);

  // URLパラメータをチェック
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const instagramUserId = urlParams.get('instagram_user_id');
    const success = urlParams.get('success');

    if (accessToken && instagramUserId && success === 'true') {
      // 連携成功 - 実データを取得
      fetchRealData(accessToken, instagramUserId);
    } else {
      // サンプルデータを表示
      setInstagramData(getSampleData());
      setHasRealData(false);
      setAnimationComplete(true);
    }
  }, []);

  // アニメーション制御
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setAnimationComplete(true), 500);
    }
  }, [loading]);

  // 実データ取得
  const fetchRealData = async (accessToken, instagramUserId) => {
    setLoading(true);
    setLoadingMessage('Instagram連携成功！データを取得中...');
    
    try {
      // API呼び出しの進捗表示
      const messages = [
        { delay: 1000, text: 'アカウント情報を確認中...' },
        { delay: 2000, text: '投稿データを分析中...' },
        { delay: 3000, text: 'インサイトを計算中...' },
        { delay: 4000, text: 'フォロワー推移を取得中...' },
        { delay: 5000, text: 'AIによる分析を実行中...' }
      ];

      messages.forEach(({ delay, text }) => {
        setTimeout(() => setLoadingMessage(text), delay);
      });

      const response = await fetch('/api/instagram/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, instagramUserId })
      });

      if (!response.ok) throw new Error('データ取得に失敗しました');

      const data = await response.json();
      
      // 実データの整合性チェックと修正
      if (data.posts) {
        data.posts = data.posts.map(post => ({
          ...post,
          insights: {
            reach: parseInt(post.insights?.reach) || 0,
            likes: parseInt(post.insights?.likes) || 0,
            saves: parseInt(post.insights?.saves) || 0,
            profile_views: parseInt(post.insights?.profile_views) || 0,
            website_clicks: parseInt(post.insights?.website_clicks) || 0,
            comments: parseInt(post.insights?.comments) || 0,
            shares: parseInt(post.insights?.shares) || 0,
            impressions: parseInt(post.insights?.impressions) || 0
          }
        }));
      }

      setInstagramData(data);
      setHasRealData(true);
      setShowSuccessMessage(true);
      
      // 成功メッセージを5秒後に非表示
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      // エラー時はサンプルデータを表示
      setInstagramData(getSampleData());
      setHasRealData(false);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // サンプルデータ（豊富な内容）
  const getSampleData = () => ({
    user: {
      username: 'sample_account',
      followers_count: 12456,
      following_count: 892,
      media_count: 234,
      profile_picture_url: null,
      biography: 'サンプルアカウント - Instagram分析ダッシュボード',
      website: 'https://example.com',
      is_verified: false
    },
    posts: [
      {
        id: '1',
        caption: '新商品のご紹介！今話題のアイテムを詳しくレビューしています。ぜひチェックしてください！#新商品 #レビュー',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample1/',
        timestamp: '2025-01-28T10:00:00',
        insights: {
          reach: 3456,
          likes: 234,
          saves: 156,
          profile_views: 89,
          website_clicks: 23,
          comments: 45,
          shares: 12,
          impressions: 4567
        }
      },
      {
        id: '2',
        caption: 'お客様の声をご紹介します。たくさんの嬉しいフィードバックをいただきました！',
        media_type: 'CAROUSEL_ALBUM',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample2/',
        timestamp: '2025-01-27T15:30:00',
        insights: {
          reach: 2890,
          likes: 189,
          saves: 98,
          profile_views: 67,
          website_clicks: 15,
          comments: 34,
          shares: 8,
          impressions: 3456
        }
      },
      {
        id: '3',
        caption: '【動画】使い方を詳しく解説！初心者の方でも簡単に始められます。',
        media_type: 'VIDEO',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample3/',
        timestamp: '2025-01-26T12:00:00',
        insights: {
          reach: 4567,
          likes: 345,
          saves: 234,
          profile_views: 123,
          website_clicks: 34,
          comments: 67,
          shares: 23,
          impressions: 5678
        }
      },
      {
        id: '4',
        caption: 'イベント開催のお知らせ！皆様のご参加をお待ちしています。',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample4/',
        timestamp: '2025-01-25T18:45:00',
        insights: {
          reach: 1234,
          likes: 89,
          saves: 34,
          profile_views: 23,
          website_clicks: 7,
          comments: 12,
          shares: 3,
          impressions: 1567
        }
      },
      {
        id: '5',
        caption: 'スタッフの一日に密着！舞台裏をお見せします。',
        media_type: 'REELS',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample5/',
        timestamp: '2025-01-24T09:30:00',
        insights: {
          reach: 5678,
          likes: 456,
          saves: 345,
          profile_views: 178,
          website_clicks: 45,
          comments: 89,
          shares: 34,
          impressions: 6789
        }
      },
      {
        id: '6',
        caption: 'お得なキャンペーン実施中！期間限定の特別価格でご提供します。',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample6/',
        timestamp: '2025-01-23T14:20:00',
        insights: {
          reach: 3789,
          likes: 267,
          saves: 189,
          profile_views: 98,
          website_clicks: 28,
          comments: 56,
          shares: 19,
          impressions: 4567
        }
      },
      {
        id: '7',
        caption: 'よくある質問にお答えします。皆様の疑問を解決！',
        media_type: 'CAROUSEL_ALBUM',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample7/',
        timestamp: '2025-01-22T11:00:00',
        insights: {
          reach: 2345,
          likes: 156,
          saves: 89,
          profile_views: 56,
          website_clicks: 12,
          comments: 23,
          shares: 9,
          impressions: 2890
        }
      },
      {
        id: '8',
        caption: 'コラボレーション企画！特別ゲストとの対談をお届けします。',
        media_type: 'VIDEO',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample8/',
        timestamp: '2025-01-21T16:30:00',
        insights: {
          reach: 4890,
          likes: 378,
          saves: 267,
          profile_views: 145,
          website_clicks: 38,
          comments: 78,
          shares: 28,
          impressions: 5890
        }
      },
      {
        id: '9',
        caption: '季節のおすすめ商品をピックアップ！今の時期にぴったりです。',
        media_type: 'IMAGE',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample9/',
        timestamp: '2025-01-20T13:15:00',
        insights: {
          reach: 3123,
          likes: 234,
          saves: 145,
          profile_views: 78,
          website_clicks: 19,
          comments: 45,
          shares: 15,
          impressions: 3890
        }
      },
      {
        id: '10',
        caption: 'ユーザー様の作品をご紹介！素敵な投稿ありがとうございます。',
        media_type: 'CAROUSEL_ALBUM',
        media_url: 'https://via.placeholder.com/400',
        permalink: 'https://www.instagram.com/p/sample10/',
        timestamp: '2025-01-19T10:45:00',
        insights: {
          reach: 2678,
          likes: 189,
          saves: 112,
          profile_views: 67,
          website_clicks: 14,
          comments: 34,
          shares: 11,
          impressions: 3234
        }
      }
    ],
    follower_history: {
      hasData: false,
      data: [],
      dataPoints: 0,
      startDate: null,
      endDate: null,
      currentFollowers: 12456,
      growth_rate: 0
    },
    engagement_rate: 4.2,
    best_posting_time: '18:00-20:00',
    audience_demographics: {
      gender: { male: 35, female: 65 },
      age: { '18-24': 25, '25-34': 40, '35-44': 20, '45+': 15 },
      location: { japan: 85, usa: 5, other: 10 }
    }
  });

  // 重要4指標の計算（完全修正版）
  const calculateMetrics = (post) => {
    if (!post || !post.insights) {
      return {
        saves_rate: '0.0',
        home_rate: '0.0',
        profile_access_rate: '0.0',
        follower_conversion_rate: '0.0'
      };
    }

    // 厳密な型変換と計算
    const reach = parseInt(post.insights.reach) || 0;
    const saves = parseInt(post.insights.saves) || 0;
    const profile_views = parseInt(post.insights.profile_views) || 0;
    const website_clicks = parseInt(post.insights.website_clicks) || 0;
    const followers = instagramData?.user?.followers_count || 0;

    // デバッグログ（開発時のみ）
    if (hasRealData && process.env.NODE_ENV === 'development') {
      console.log('Calculating metrics for post:', {
        reach, saves, profile_views, website_clicks, followers
      });
    }

    // 厳密な計算 - 分母が0の場合は必ず0.0を返す
    const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
    const home_rate = followers > 0 ? ((reach / followers) * 100).toFixed(1) : '0.0';
    const profile_access_rate = reach > 0 ? ((profile_views / reach) * 100).toFixed(1) : '0.0';
    const follower_conversion_rate = profile_views > 0 ? ((website_clicks / profile_views) * 100).toFixed(1) : '0.0';

    return {
      saves_rate,
      home_rate,
      profile_access_rate,
      follower_conversion_rate
    };
  };

  // エンゲージメント率の計算
  const calculateEngagementRate = (post) => {
    if (!post || !post.insights) return '0.0';
    
    const reach = parseInt(post.insights.reach) || 0;
    const likes = parseInt(post.insights.likes) || 0;
    const comments = parseInt(post.insights.comments) || 0;
    const saves = parseInt(post.insights.saves) || 0;
    const shares = parseInt(post.insights.shares) || 0;
    
    const totalEngagement = likes + comments + saves + shares;
    return reach > 0 ? ((totalEngagement / reach) * 100).toFixed(1) : '0.0';
  };

  // Instagram連携
  const handleInstagramConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || 'YOUR_CLIENT_ID';
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/instagram/callback`);
    const scope = encodeURIComponent('instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement');
    
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    
    window.location.href = authUrl;
  };

  // データ再取得
  const handleRefreshData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const instagramUserId = urlParams.get('instagram_user_id');

    if (accessToken && instagramUserId) {
      await fetchRealData(accessToken, instagramUserId);
    }
  };

  // ソート機能
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // ソート適用
  const sortedPosts = [...(instagramData?.posts || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue, bValue;
    
    if (sortConfig.key === 'date') {
      aValue = new Date(a.timestamp);
      bValue = new Date(b.timestamp);
    } else if (sortConfig.key.includes('_rate')) {
      const aMetrics = calculateMetrics(a);
      const bMetrics = calculateMetrics(b);
      aValue = parseFloat(aMetrics[sortConfig.key]);
      bValue = parseFloat(bMetrics[sortConfig.key]);
    } else {
      aValue = a.insights?.[sortConfig.key] || 0;
      bValue = b.insights?.[sortConfig.key] || 0;
    }
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // CSV出力（完全版）
  const handleExportCSV = () => {
    if (!instagramData?.posts) return;

    const csvContent = [
      ['タイトル', '日付', 'タイプ', 'リーチ数', 'インプレッション', 'いいね数', '保存数', 'コメント数', 'シェア数', 'プロフィール表示数', 'ウェブサイトクリック', '保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率', 'エンゲージメント率'],
      ...sortedPosts.map(post => {
        const metrics = calculateMetrics(post);
        const engagementRate = calculateEngagementRate(post);
        return [
          post.caption?.substring(0, 50)?.replace(/,/g, '、') || '投稿',
          new Date(post.timestamp).toLocaleDateString('ja-JP'),
          post.media_type,
          post.insights?.reach || 0,
          post.insights?.impressions || 0,
          post.insights?.likes || 0,
          post.insights?.saves || 0,
          post.insights?.comments || 0,
          post.insights?.shares || 0,
          post.insights?.profile_views || 0,
          post.insights?.website_clicks || 0,
          `${metrics.saves_rate}%`,
          `${metrics.home_rate}%`,
          `${metrics.profile_access_rate}%`,
          `${metrics.follower_conversion_rate}%`,
          `${engagementRate}%`
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instagram_analytics_${hasRealData ? 'real' : 'sample'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Excel出力
  const handleExportExcel = () => {
    // 実装省略（外部ライブラリが必要）
    alert('Excel出力機能は準備中です');
  };

  // ローディング画面（豪華版）
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '64px',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
          maxWidth: '500px',
          width: '90%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 32px',
            position: 'relative'
          }}>
            <RefreshCw 
              size={80} 
              style={{
                animation: 'spin 2s linear infinite',
                color: '#667eea'
              }}
            />
          </div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {loadingMessage}
          </h2>
          <div style={{
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '24px'
          }}>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                borderRadius: '4px',
                animation: 'progress 2s ease-in-out infinite'
              }}></div>
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '12px' }}>
              データを分析中です。しばらくお待ちください...
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  // データ準備
  const posts = sortedPosts;
  const followerHistory = instagramData?.follower_history || { hasData: false };
  const user = instagramData?.user || {};

  // メインダッシュボード
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #f8b500 100%)',
      padding: '32px 16px',
      animation: animationComplete ? 'fadeIn 0.5s ease' : 'none'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ヘッダー（豪華版） */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          padding: '32px 40px',
          marginBottom: '32px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: 'linear-gradient(135deg, #fcfbf8, #fff)',
                  border: '2px solid #c79a42',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#c79a42',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(199, 154, 66, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(199, 154, 66, 0.2)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #c79a42, #d4a853)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(199, 154, 66, 0.1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fcfbf8, #fff)';
                  e.currentTarget.style.color = '#c79a42';
                }}
              >
                <ArrowLeft size={20} />
                ホームに戻る
              </button>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  margin: 0,
                  background: 'linear-gradient(135deg, #c79a42, #d4a853)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  InstaSimple Analytics
                </h1>
                <p style={{ 
                  margin: '4px 0 0 0', 
                  color: '#6b7280', 
                  fontSize: '14px' 
                }}>
                  プロフェッショナル Instagram 分析ツール
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                padding: '8px 16px',
                borderRadius: '24px',
                background: hasRealData 
                  ? 'linear-gradient(135deg, #22c55e20, #16a34a20)' 
                  : 'linear-gradient(135deg, #3b82f620, #2563eb20)',
                color: hasRealData ? '#16a34a' : '#2563eb',
                fontSize: '14px',
                fontWeight: '600',
                border: hasRealData ? '1px solid #22c55e40' : '1px solid #3b82f640',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {hasRealData ? <CheckCircle size={16} /> : <Info size={16} />}
                {hasRealData ? 'リアルデータ' : 'サンプルデータ'}
              </span>
              {hasRealData && (
                <button
                  onClick={handleRefreshData}
                  style={{
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c79a42';
                    e.currentTarget.style.transform = 'rotate(180deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <RefreshCw size={20} color="#6b7280" />
                </button>
              )}
              {!hasRealData && (
                <button
                  onClick={handleInstagramConnect}
                  style={{
                    background: 'linear-gradient(135deg, #E4405F 0%, #C13584 50%, #833AB4 100%)',
                    color: 'white',
                    padding: '14px 28px',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(0)',
                    boxShadow: '0 6px 20px rgba(228, 64, 95, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(228, 64, 95, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(228, 64, 95, 0.3)';
                  }}
                >
                  <Users size={20} />
                  Instagram連携
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 連携成功メッセージ（アニメーション付き） */}
        {showSuccessMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #22c55e15, #10b98115)',
            border: '2px solid #22c55e',
            borderRadius: '16px',
            padding: '20px 28px',
            marginBottom: '32px',
            animation: 'slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite'
              }}>
                <CheckCircle size={28} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: '#16a34a', fontWeight: '700', fontSize: '18px' }}>
                  Instagram連携成功！
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#166534', fontSize: '14px' }}>
                  実データの取得が完了しました。分析結果をご確認ください。
                </p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#16a34a'
                }}
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
        )}

        {/* アカウント情報（詳細版） */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)'
            }}>
              <Users size={50} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
                  @{user.username || 'loading'}
                </h2>
                {user.is_verified && (
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle size={16} color="white" />
                  </div>
                )}
              </div>
              <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '15px', lineHeight: '1.6' }}>
                {user.biography || 'プロフィールテキストがここに表示されます'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#c79a42' }}>
                    {user.followers_count?.toLocaleString() || '0'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>フォロワー</div>
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#c79a42' }}>
                    {user.following_count?.toLocaleString() || '0'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>フォロー中</div>
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#c79a42' }}>
                    {user.media_count || '0'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>投稿数</div>
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#c79a42' }}>
                    {instagramData?.engagement_rate || '0.0'}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>エンゲージメント率</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* フォロワー推移（詳細版） */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#5d4e37' }}>
              フォロワー推移
            </h2>
            {followerHistory.growth_rate !== undefined && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: followerHistory.growth_rate >= 0 ? '#22c55e20' : '#ef444420'
              }}>
                {followerHistory.growth_rate >= 0 ? (
                  <TrendingUp size={20} color="#22c55e" />
                ) : (
                  <TrendingDown size={20} color="#ef4444" />
                )}
                <span style={{
                  fontWeight: '600',
                  color: followerHistory.growth_rate >= 0 ? '#22c55e' : '#ef4444'
                }}>
                  {followerHistory.growth_rate >= 0 ? '+' : ''}{followerHistory.growth_rate}%
                </span>
              </div>
            )}
          </div>
          
          {followerHistory.hasData && followerHistory.data.length > 0 ? (
            <div>
              <div style={{ 
                marginBottom: '20px', 
                padding: '12px 16px',
                background: '#f9fafb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  期間: {followerHistory.startDate} - {followerHistory.endDate}
                </span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  データポイント: {followerHistory.dataPoints}日間
                </span>
              </div>
              <div style={{ position: 'relative', height: '300px' }}>
                <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%' }}>
                  {/* グリッド線 */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line
                      key={`grid-${i}`}
                      x1="40"
                      y1={60 + i * 50}
                      x2="780"
                      y2={60 + i * 50}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* データライン */}
                  <polyline
                    points={followerHistory.data.map((d, i) => 
                      `${40 + (i / (followerHistory.data.length - 1)) * 740},${260 - (d.followers / Math.max(...followerHistory.data.map(d => d.followers))) * 200}`
                    ).join(' ')}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                  />
                  
                  {/* データポイント */}
                  {followerHistory.data.map((d, i) => (
                    <g key={`point-${i}`}>
                      <circle
                        cx={40 + (i / (followerHistory.data.length - 1)) * 740}
                        cy={260 - (d.followers / Math.max(...followerHistory.data.map(d => d.followers))) * 200}
                        r="5"
                        fill="#c79a42"
                        stroke="white"
                        strokeWidth="2"
                      />
                      {/* ツールチップ用の透明な領域 */}
                      <circle
                        cx={40 + (i / (followerHistory.data.length - 1)) * 740}
                        cy={260 - (d.followers / Math.max(...followerHistory.data.map(d => d.followers))) * 200}
                        r="20"
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                      >
                        <title>{`${d.date}: ${d.followers.toLocaleString()}フォロワー`}</title>
                      </circle>
                    </g>
                  ))}
                  
                  {/* グラデーション定義 */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c79a42" />
                      <stop offset="100%" stopColor="#d4a853" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, #ffeaa710, #fdcb6e10)',
              borderRadius: '16px',
              border: '2px dashed #c79a4240'
            }}>
              <Calendar size={56} color="#c79a42" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#5d4e37', marginBottom: '12px' }}>
                データ収集を開始しました
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '15px', lineHeight: '1.6' }}>
                フォロワー数の推移は明日から記録されます。<br />
                毎日自動的にデータを収集し、成長を可視化します。
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <Users size={24} color="#c79a42" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>現在のフォロワー</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#c79a42' }}>
                    {followerHistory.currentFollowers?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 重要4指標スコア（詳細版） */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#5d4e37' }}>
              重要4指標スコア
            </h2>
            <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px' }}>
              投稿パフォーマンスを測る重要な指標の平均値
            </p>
          </div>
          
          {posts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {[
                { label: '保存率', key: 'saves_rate', icon: Bookmark, target: 3, unit: '%', description: '投稿が保存された割合' },
                { label: 'ホーム率', key: 'home_rate', icon: Home, target: 20, unit: '%', description: 'フォロワーへのリーチ率' },
                { label: 'プロフィールアクセス率', key: 'profile_access_rate', icon: User, target: 3, unit: '%', description: 'プロフィールへの誘導率' },
                { label: 'フォロワー転換率', key: 'follower_conversion_rate', icon: UserPlus, target: 10, unit: '%', description: '新規フォロワー獲得率' }
              ].map(({ label, key, icon: Icon, target, unit, description }) => {
                const avgValue = posts.reduce((sum, post) => {
                  const metrics = calculateMetrics(post);
                  return sum + parseFloat(metrics[key]);
                }, 0) / posts.length;
                
                const performance = avgValue >= target ? 'good' : avgValue >= target * 0.7 ? 'normal' : 'poor';
                const colors = {
                  good: { bg: '#22c55e20', border: '#22c55e40', text: '#16a34a' },
                  normal: { bg: '#f59e0b20', border: '#f59e0b40', text: '#d97706' },
                  poor: { bg: '#ef444420', border: '#ef444440', text: '#dc2626' }
                };
                
                return (
                  <div key={key} style={{
                    background: colors[performance].bg,
                    border: `2px solid ${colors[performance].border}`,
                    borderRadius: '16px',
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      opacity: 0.1
                    }}>
                      <Icon size={60} color={colors[performance].text} />
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        {label}
                      </div>
                      <div style={{ 
                        fontSize: '36px', 
                        fontWeight: '800', 
                        color: colors[performance].text,
                        marginBottom: '8px'
                      }}>
                        {avgValue.toFixed(1)}{unit}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                        {description}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px'
                      }}>
                        <span style={{ color: '#6b7280' }}>目標:</span>
                        <span style={{ fontWeight: '600', color: '#5d4e37' }}>{target}{unit}</span>
                        {performance === 'good' && <CheckCircle size={16} color="#22c55e" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280',
              background: '#f9fafb',
              borderRadius: '12px'
            }}>
              <BarChart3 size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
              <p>投稿データがありません</p>
            </div>
          )}
        </div>

        {/* 投稿分析テーブル（完全版） */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#5d4e37' }}>
                投稿分析
              </h2>
              <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px' }}>
                直近28日間の投稿パフォーマンス
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  background: 'white',
                  color: '#5d4e37',
                  fontWeight: '500',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="7days">過去7日間</option>
                <option value="28days">過去28日間</option>
                <option value="90days">過去90日間</option>
                <option value="all">すべて</option>
              </select>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  background: 'white',
                  color: '#5d4e37',
                  fontWeight: '500',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="csv">CSV形式</option>
                <option value="excel">Excel形式</option>
              </select>
              <button
                onClick={exportFormat === 'csv' ? handleExportCSV : handleExportExcel}
                style={{
                  background: 'linear-gradient(135deg, #fcfbf8, #fff)',
                  color: '#5d4e37',
                  padding: '10px 20px',
                  border: '2px solid #c79a42',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #c79a42, #d4a853)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fcfbf8, #fff)';
                  e.currentTarget.style.color = '#5d4e37';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Download size={18} />
                エクスポート
              </button>
            </div>
          </div>

          {posts.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #c79a42' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: '#5d4e37', fontWeight: '600', fontSize: '14px' }}>
                      投稿
                    </th>
                    <th 
                      onClick={() => handleSort('timestamp')}
                      style={{ 
                        padding: '16px', 
                        textAlign: 'center', 
                        color: '#5d4e37', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        日付
                        {sortConfig.key === 'timestamp' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', color: '#5d4e37', fontWeight: '600', fontSize: '14px' }}>
                      タイプ
                    </th>
                    <th 
                      onClick={() => handleSort('reach')}
                      style={{ 
                        padding: '16px', 
                        textAlign: 'center', 
                        color: '#5d4e37', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        リーチ
                        {sortConfig.key === 'reach' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('engagement')}
                      style={{ 
                        padding: '16px', 
                        textAlign: 'center', 
                        color: '#5d4e37', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        エンゲージメント
                        {sortConfig.key === 'engagement' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('saves_rate')}
                      style={{ 
                        padding: '16px', 
                        textAlign: 'center', 
                        color: '#5d4e37', 
                        fontWeight: '600', 
                        fontSize: '14px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        保存率
                        {sortConfig.key === 'saves_rate' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', color: '#5d4e37', fontWeight: '600', fontSize: '14px' }}>
                      ホーム率
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', color: '#5d4e37', fontWeight: '600', fontSize: '14px' }}>
                      プロフィールアクセス率
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', color: '#5d4e37', fontWeight: '600', fontSize: '14px' }}>
                      フォロワー転換率
                    </th>
                    <th style={{ padding: '16px', textAlign: 'center', color: '#5d4e37', fontWeight: '600', fontSize: '14px' }}>
                      詳細
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => {
                    const metrics = calculateMetrics(post);
                    const engagementRate = calculateEngagementRate(post);
                    const mediaTypeIcon = {
                      'IMAGE': '🖼️',
                      'VIDEO': '🎥',
                      'CAROUSEL_ALBUM': '📱',
                      'REELS': '🎬'
                    };
                    
                    return (
                      <tr key={post.id} style={{ 
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'background 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}>
                        <td style={{ padding: '16px', color: '#374151', maxWidth: '250px' }}>
                          <div style={{ 
                            fontWeight: '500',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {post.caption?.substring(0, 40) || `投稿${index + 1}`}...
                          </div>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                          {new Date(post.timestamp).toLocaleDateString('ja-JP', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center', fontSize: '20px' }}>
                          {mediaTypeIcon[post.media_type] || '📄'}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#c79a42', fontSize: '15px' }}>
                          {post.insights?.reach?.toLocaleString() || '0'}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: parseFloat(engagementRate) >= 5 ? '#22c55e20' : parseFloat(engagementRate) >= 3 ? '#f59e0b20' : '#ef444420',
                            color: parseFloat(engagementRate) >= 5 ? '#22c55e' : parseFloat(engagementRate) >= 3 ? '#f59e0b' : '#ef4444',
                            fontWeight: '600',
                            fontSize: '13px'
                          }}>
                            {engagementRate}%
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: parseFloat(metrics.saves_rate) >= 3 ? '#22c55e20' : '#ef444420',
                            color: parseFloat(metrics.saves_rate) >= 3 ? '#22c55e' : '#ef4444',
                            fontWeight: '600',
                            fontSize: '13px'
                          }}>
                            {metrics.saves_rate}%
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: parseFloat(metrics.home_rate) >= 20 ? '#22c55e20' : '#ef444420',
                            color: parseFloat(metrics.home_rate) >= 20 ? '#22c55e' : '#ef4444',
                            fontWeight: '600',
                            fontSize: '13px'
                          }}>
                            {metrics.home_rate}%
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: parseFloat(metrics.profile_access_rate) >= 3 ? '#22c55e20' : '#ef444420',
                            color: parseFloat(metrics.profile_access_rate) >= 3 ? '#22c55e' : '#ef4444',
                            fontWeight: '600',
                            fontSize: '13px'
                          }}>
                            {metrics.profile_access_rate}%
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: parseFloat(metrics.follower_conversion_rate) >= 10 ? '#22c55e20' : '#ef444420',
                            color: parseFloat(metrics.follower_conversion_rate) >= 10 ? '#22c55e' : '#ef4444',
                            fontWeight: '600',
                            fontSize: '13px'
                          }}>
                            {metrics.follower_conversion_rate}%
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDetailModal(true);
                            }}
                            style={{
                              background: 'transparent',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              padding: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#c79a42';
                              e.currentTarget.style.background = '#c79a4210';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e5e7eb';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <Eye size={16} color="#6b7280" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, #ffeaa710, #fdcb6e10)',
              borderRadius: '16px',
              border: '2px dashed #c79a4240'
            }}>
              <MessageSquare size={56} color="#c79a42" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#5d4e37', marginBottom: '12px' }}>
                投稿データがありません
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '15px', lineHeight: '1.6' }}>
                まずはInstagramに投稿してから、もう一度お試しください。<br />
                投稿後、データの反映まで数分かかる場合があります。
              </p>
              <button
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
                style={{
                  background: 'linear-gradient(135deg, #E4405F 0%, #C13584 50%, #833AB4 100%)',
                  color: 'white',
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(228, 64, 95, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Share2 size={20} />
                Instagramで投稿する
              </button>
            </div>
          )}
        </div>

        {/* AI総合評価（実データベース） */}
        {posts.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea15, #764ba215)',
            borderRadius: '20px',
            padding: '40px',
            border: '2px solid #667eea40',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
              }}>
                <Brain size={32} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#5d4e37' }}>
                  AI総合評価
                </h2>
                <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
                  データに基づく詳細分析と改善提案
                </p>
              </div>
            </div>

            {/* パフォーマンススコア */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#5d4e37' }}>
                総合パフォーマンススコア
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {(() => {
                  const totalReach = posts.reduce((sum, post) => sum + (post.insights?.reach || 0), 0);
                  const totalEngagement = posts.reduce((sum, post) => {
                    const insights = post.insights || {};
                    return sum + (insights.likes || 0) + (insights.comments || 0) + (insights.saves || 0) + (insights.shares || 0);
                  }, 0);
                  const avgEngagementRate = posts.reduce((sum, post) => sum + parseFloat(calculateEngagementRate(post)), 0) / posts.length;
                  const avgSavesRate = posts.reduce((sum, post) => sum + parseFloat(calculateMetrics(post).saves_rate), 0) / posts.length;
                  
                  const overallScore = Math.min(100, Math.round(
                    (avgEngagementRate * 10) + 
                    (avgSavesRate * 10) + 
                    (Math.min(totalReach / 1000, 50))
                  ));
                  
                  return (
                    <>
                      <div style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #667eea10, #764ba210)',
                        borderRadius: '12px'
                      }}>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#667eea' }}>
                          {overallScore}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                          総合スコア
                        </div>
                      </div>
                      <div style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '12px'
                      }}>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#5d4e37' }}>
                          {totalReach.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                          総リーチ数
                        </div>
                      </div>
                      <div style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '12px'
                      }}>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#5d4e37' }}>
                          {totalEngagement.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                          総エンゲージメント
                        </div>
                      </div>
                      <div style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '12px'
                      }}>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#5d4e37' }}>
                          {avgEngagementRate.toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                          平均エンゲージメント率
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 最高パフォーマンス投稿 */}
            {(() => {
              const bestPost = posts.reduce((best, post) => {
                const currentScore = parseFloat(calculateEngagementRate(post)) + parseFloat(calculateMetrics(post).saves_rate);
                const bestScore = parseFloat(calculateEngagementRate(best)) + parseFloat(calculateMetrics(best).saves_rate);
                return currentScore > bestScore ? post : best;
              }, posts[0]);

              const bestMetrics = calculateMetrics(bestPost);
              const bestEngagement = calculateEngagementRate(bestPost);

              return (
                <div style={{
                  background: 'linear-gradient(135deg, #fbbf2410, #f59e0b10)',
                  borderRadius: '16px',
                  padding: '28px',
                  marginBottom: '24px',
                  border: '1px solid #f59e0b30'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Award size={24} color="#f59e0b" />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#92400e' }}>
                      最高パフォーマンス投稿
                    </h3>
                  </div>
                  <div style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #fbbf2430'
                  }}>
                    <div style={{ color: '#92400e', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                      「{bestPost.caption?.substring(0, 50) || '投稿'}...」
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>リーチ</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                          {bestPost.insights?.reach?.toLocaleString() || '0'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>エンゲージメント率</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                          {bestEngagement}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>保存率</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                          {bestMetrics.saves_rate}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>プロフィール誘導率</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                          {bestMetrics.profile_access_rate}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 改善提案（実データベース） */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Target size={24} color="#667eea" />
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#5d4e37' }}>
                  改善提案
                </h3>
              </div>
              <div style={{ space: '16px' }}>
                {(() => {
                  const suggestions = [];
                  const avgMetrics = posts.reduce((acc, post) => {
                    const metrics = calculateMetrics(post);
                    return {
                      saves_rate: acc.saves_rate + parseFloat(metrics.saves_rate),
                      home_rate: acc.home_rate + parseFloat(metrics.home_rate),
                      profile_access_rate: acc.profile_access_rate + parseFloat(metrics.profile_access_rate),
                      follower_conversion_rate: acc.follower_conversion_rate + parseFloat(metrics.follower_conversion_rate)
                    };
                  }, { saves_rate: 0, home_rate: 0, profile_access_rate: 0, follower_conversion_rate: 0 });

                  Object.keys(avgMetrics).forEach(key => {
                    avgMetrics[key] = avgMetrics[key] / posts.length;
                  });

                  // 実データに基づく具体的な提案
                  if (avgMetrics.saves_rate < 3) {
                    suggestions.push({
                      type: 'warning',
                      title: '保存率の改善が必要',
                      content: `現在の平均保存率は${avgMetrics.saves_rate.toFixed(1)}%です。価値のある情報やチュートリアル、レシピなど、後で見返したくなるコンテンツを増やしましょう。`,
                      priority: 'high'
                    });
                  }

                  if (avgMetrics.profile_access_rate < 3) {
                    suggestions.push({
                      type: 'warning',
                      title: 'プロフィールへの誘導強化',
                      content: `プロフィールアクセス率が${avgMetrics.profile_access_rate.toFixed(1)}%と低めです。投稿の最後にプロフィールへの誘導文を追加し、他の投稿やサービスへの興味を引きましょう。`,
                      priority: 'medium'
                    });
                  }

                  if (avgMetrics.follower_conversion_rate < 10) {
                    suggestions.push({
                      type: 'info',
                      title: 'フォロワー転換率の向上',
                      content: `フォロワー転換率は${avgMetrics.follower_conversion_rate.toFixed(1)}%です。プロフィールの最適化、投稿の統一感、定期的な投稿スケジュールを心がけましょう。`,
                      priority: 'medium'
                    });
                  }

                  if (avgMetrics.home_rate < 20) {
                    suggestions.push({
                      type: 'info',
                      title: 'ホーム表示率の改善',
                      content: `ホーム率が${avgMetrics.home_rate.toFixed(1)}%です。投稿時間の最適化とハッシュタグ戦略の見直しを検討してください。`,
                      priority: 'low'
                    });
                  }

                  // 良好なパフォーマンスの場合
                  if (suggestions.length === 0) {
                    suggestions.push({
                      type: 'success',
                      title: '素晴らしいパフォーマンス！',
                      content: 'すべての指標が目標値を達成しています。この調子で質の高いコンテンツを継続的に投稿していきましょう。',
                      priority: 'low'
                    });
                  }

                  const iconMap = {
                    warning: <AlertCircle size={20} color="#f59e0b" />,
                    info: <Info size={20} color="#3b82f6" />,
                    success: <CheckCircle size={20} color="#22c55e" />
                  };

                  const colorMap = {
                    warning: { bg: '#fef3c7', border: '#f59e0b40', text: '#92400e' },
                    info: { bg: '#dbeafe', border: '#3b82f640', text: '#1e40af' },
                    success: { bg: '#d1fae5', border: '#22c55e40', text: '#065f46' }
                  };

                  return suggestions.map((suggestion, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      background: colorMap[suggestion.type].bg,
                      border: `1px solid ${colorMap[suggestion.type].border}`,
                      borderRadius: '12px',
                      marginBottom: index < suggestions.length - 1 ? '16px' : 0
                    }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ marginTop: '2px' }}>
                          {iconMap[suggestion.type]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ 
                            margin: '0 0 8px 0', 
                            fontSize: '16px', 
                            fontWeight: '600',
                            color: colorMap[suggestion.type].text
                          }}>
                            {suggestion.title}
                          </h4>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '14px', 
                            lineHeight: '1.6',
                            color: '#4b5563'
                          }}>
                            {suggestion.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* フッター */}
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <p style={{ marginBottom: '8px' }}>
            © 2025 InstaSimple Analytics. All rights reserved.
          </p>
          <p style={{ fontSize: '12px' }}>
            {hasRealData ? '実データ' : 'サンプルデータ'}を表示中 | 
            最終更新: {new Date().toLocaleString('ja-JP')}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// Homeアイコンのコンポーネント（Lucide-reactに含まれていない場合の代替）
function Home({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

// Userアイコンのコンポーネント（Lucide-reactに含まれていない場合の代替）  
function User({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}