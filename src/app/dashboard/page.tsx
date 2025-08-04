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
  Calendar
} from 'lucide-react';

export default function DashboardPage() {
  const [instagramData, setInstagramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [session, setSession] = useState(null);

  // セッションとアクセストークンを確認
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // セッション確認
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          setSession(sessionData);
        }

        // URLからアクセストークンを取得
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('access_token');
        
        if (token) {
          setAccessToken(token);
          await fetchInstagramData(token);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Instagram データを取得
  const fetchInstagramData = async (token) => {
    try {
      setLoading(true);
      
      // 簡単なテストリクエスト
      const testResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${token}`);
      
      if (testResponse.ok) {
        const userData = await testResponse.json();
        setInstagramData({
          profile: { username: userData.username || 'your_account', media_count: 25 },
          posts: [] // 実際のデータは後で実装
        });
      } else {
        throw new Error('Instagram API error');
      }
      
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
      // サンプルデータを使用
      setInstagramData({
        profile: { username: 'demo_account', media_count: 150 },
        posts: []
      });
    } finally {
      setLoading(false);
    }
  };

  // 認証されていない場合のリダイレクト
  const handleAuthRequired = () => {
    if (!session?.user) {
      window.location.href = '/api/auth/signin/google';
      return;
    }
    window.location.href = '/api/instagram/connect';
  };

  // ローディング表示
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 20px 40px rgba(199, 154, 66, 0.15)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #c79a42, #b8873b)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <BarChart3 size={24} color="#fcfbf8" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#282828', marginBottom: '12px' }}>
            Instagram データを分析中...
          </h2>
          <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
            最新の投稿データとインサイトを取得しています
          </p>
        </div>
      </div>
    );
  }

  // 認証が必要な場合
  if (!session?.user && !accessToken) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
          padding: '60px',
          borderRadius: '24px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 20px 40px rgba(199, 154, 66, 0.15)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #c79a42, #b8873b)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: '0 8px 20px rgba(199, 154, 66, 0.3)'
          }}>
            <Users size={40} color="#fcfbf8" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#282828', marginBottom: '16px' }}>
            ログインが必要です
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
            Instagram分析を開始するには、まずGoogleアカウントでログインしてください
          </p>
          <button 
            onClick={handleAuthRequired}
            style={{
              background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
              color: '#fcfbf8',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '0 auto',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(199, 154, 66, 0.3)'
            }}
          >
            <Users size={20} />
            Googleでログイン
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    window.location.href = '/';
  };

  // サンプルデータ
  const postsData = [
    {
      id: 1,
      date: "2025/01/20",
      title: "Beautiful sunset at the beach",
      data_24h: { reach: 1250, likes: 234, saves: 45, profile_visits: 32, follows: 8, save_rate: 3.6, profile_access_rate: 2.6, follower_conversion_rate: 25.0, home_rate: 35.0 },
      data_7d: { reach: 1580, likes: 298, saves: 62, profile_visits: 48, follows: 12, save_rate: 3.9, profile_access_rate: 3.0, follower_conversion_rate: 25.0, home_rate: 44.0 },
      rankings: { save_rate: 2, home_rate: 3, profile_access_rate: 2, follower_conversion_rate: 1 }
    },
    {
      id: 2,
      date: "2025/01/18", 
      title: "Morning coffee and productivity",
      data_24h: { reach: 950, likes: 189, saves: 32, profile_visits: 28, follows: 5, save_rate: 3.4, profile_access_rate: 2.9, follower_conversion_rate: 17.9, home_rate: 28.3 },
      data_7d: { reach: 1180, likes: 234, saves: 41, profile_visits: 35, follows: 7, save_rate: 3.5, profile_access_rate: 3.0, follower_conversion_rate: 20.0, home_rate: 33.4 },
      rankings: { save_rate: 4, home_rate: 4, profile_access_rate: 3, follower_conversion_rate: 3 }
    },
    {
      id: 3,
      date: "2025/01/16",
      title: "Weekend adventures in the city",
      data_24h: { reach: 1420, likes: 312, saves: 67, profile_visits: 56, follows: 15, save_rate: 4.7, profile_access_rate: 3.9, follower_conversion_rate: 26.8, home_rate: 38.5 },
      data_7d: { reach: 1890, likes: 387, saves: 84, profile_visits: 72, follows: 19, save_rate: 4.4, profile_access_rate: 3.8, follower_conversion_rate: 26.4, home_rate: 49.2 },
      rankings: { save_rate: 1, home_rate: 1, profile_access_rate: 1, follower_conversion_rate: 1 }
    },
    {
      id: 4,
      date: "2025/01/14",
      title: "Homemade pasta night",
      data_24h: { reach: 720, likes: 156, saves: 28, profile_visits: 22, follows: 3, save_rate: 3.9, profile_access_rate: 3.1, follower_conversion_rate: 13.6, home_rate: 22.8 },
      data_7d: { reach: 820, likes: 178, saves: 33, profile_visits: 26, follows: 4, save_rate: 4.0, profile_access_rate: 3.2, follower_conversion_rate: 15.4, home_rate: 25.2 },
      rankings: { save_rate: 3, home_rate: 5, profile_access_rate: 4, follower_conversion_rate: 4 }
    },
    {
      id: 5,
      date: "2025/01/12",
      title: "New book recommendation",
      data_24h: { reach: 480, likes: 98, saves: 19, profile_visits: 15, follows: 2, save_rate: 4.0, profile_access_rate: 3.1, follower_conversion_rate: 13.3, home_rate: 16.5 },
      data_7d: { reach: 550, likes: 112, saves: 23, profile_visits: 18, follows: 3, save_rate: 4.2, profile_access_rate: 3.3, follower_conversion_rate: 16.7, home_rate: 18.9 },
      rankings: { save_rate: 5, home_rate: 2, profile_access_rate: 5, follower_conversion_rate: 5 }
    }
  ];

  const hasRealData = instagramData && accessToken;
  const followerData = [2450, 2458, 2465, 2478, 2491, 2496, 2499, 2514, 2533, 2541, 2556, 2563, 2575, 2594];
  const followerLabels = ['1/1', '1/3', '1/5', '1/7', '1/9', '1/11', '1/13', '1/15', '1/17', '1/19', '1/21', '1/23', '1/25', '1/27'];

  // SVGグラフのパス生成
  const generatePath = (data, width = 800, height = 200) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const stepX = width / (data.length - 1);
    
    let path = '';
    data.forEach((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range) * height;
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };
  
  const chartPath = generatePath(followerData);
  const chartWidth = 800;
  const chartHeight = 200;

  // CSV出力関数
  const downloadCSV = () => {
    const headers = [
      'タイトル', '日付',
      '24h後_リーチ数', '24h後_いいね数', '24h後_保存数', '24h後_プロフィール表示数', '24h後_フォロー数',
      '24h後_保存率', '24h後_プロフィールアクセス率', '24h後_フォロワー転換率', '24h後_ホーム率',
      '1週間後_リーチ数', '1週間後_いいね数', '1週間後_保存数', '1週間後_プロフィール表示数', '1週間後_フォロー数',
      '1週間後_保存率', '1週間後_プロフィールアクセス率', '1週間後_フォロワー転換率', '1週間後_ホーム率',
      '保存率_ランキング', 'ホーム率_ランキング', 'プロフアクセス率_ランキング', 'フォロワー転換率_ランキング'
    ];

    const csvData = postsData.map(post => [
      post.title,
      post.date,
      post.data_24h.reach,
      post.data_24h.likes,
      post.data_24h.saves,
      post.data_24h.profile_visits,
      post.data_24h.follows,
      post.data_24h.save_rate,
      post.data_24h.profile_access_rate,
      post.data_24h.follower_conversion_rate,
      post.data_24h.home_rate,
      post.data_7d.reach,
      post.data_7d.likes,
      post.data_7d.saves,
      post.data_7d.profile_visits,
      post.data_7d.follows,
      post.data_7d.save_rate,
      post.data_7d.profile_access_rate,
      post.data_7d.follower_conversion_rate,
      post.data_7d.home_rate,
      `${post.rankings.save_rate}位/5投稿`,
      `${post.rankings.home_rate}位/5投稿`,
      `${post.rankings.profile_access_rate}位/5投稿`,
      `${post.rankings.follower_conversion_rate}位/5投稿`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Instagram分析データ_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel出力関数
  const downloadExcel = () => {
    const headers = [
      'タイトル', '日付',
      '24h後_リーチ数', '24h後_いいね数', '24h後_保存数', '24h後_プロフィール表示数', '24h後_フォロー数',
      '24h後_保存率', '24h後_プロフィールアクセス率', '24h後_フォロワー転換率', '24h後_ホーム率',
      '1週間後_リーチ数', '1週間後_いいね数', '1週間後_保存数', '1週間後_プロフィール表示数', '1週間後_フォロー数',
      '1週間後_保存率', '1週間後_プロフィールアクセス率', '1週間後_フォロワー転換率', '1週間後_ホーム率',
      '保存率_ランキング', 'ホーム率_ランキング', 'プロフアクセス率_ランキング', 'フォロワー転換率_ランキング'
    ];

    const csvData = postsData.map(post => [
      post.title,
      post.date,
      post.data_24h.reach,
      post.data_24h.likes,
      post.data_24h.saves,
      post.data_24h.profile_visits,
      post.data_24h.follows,
      post.data_24h.save_rate,
      post.data_24h.profile_access_rate,
      post.data_24h.follower_conversion_rate,
      post.data_24h.home_rate,
      post.data_7d.reach,
      post.data_7d.likes,
      post.data_7d.saves,
      post.data_7d.profile_visits,
      post.data_7d.follows,
      post.data_7d.save_rate,
      post.data_7d.profile_access_rate,
      post.data_7d.follower_conversion_rate,
      post.data_7d.home_rate,
      `${post.rankings.save_rate}位/5投稿`,
      `${post.rankings.home_rate}位/5投稿`,
      `${post.rankings.profile_access_rate}位/5投稿`,
      `${post.rankings.follower_conversion_rate}位/5投稿`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Instagram分析データ_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
      color: '#282828',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.95) 100%)',
        padding: '20px 0',
        position: 'fixed',
        top: '0',
        width: '100%',
        zIndex: 1000,
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(199, 154, 66, 0.2)',
        boxShadow: '0 4px 20px rgba(199, 154, 66, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button onClick={handleBack} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            color: '#282828',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#c79a42' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#282828' }}
          >
            <ArrowLeft size={20} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(199, 154, 66, 0.3)'
              }}>
                <BarChart3 size={20} color="#fcfbf8" />
              </div>
              <span style={{
                fontSize: '28px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                InstaSimple Analytics
              </span>
            </div>
          </button>
        </div>
      </header>

      <div style={{ paddingTop: '100px', padding: '100px 20px 80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Overview Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.90) 100%)',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(199, 154, 66, 0.15)',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(199, 154, 66, 0.3)'
                }}>
                  <Calendar size={24} color="#fcfbf8" />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    marginBottom: '4px',
                    color: '#282828',
                    letterSpacing: '-1px'
                  }}>
                    過去28日間のアカウント分析
                  </h1>
                  <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                    @{instagramData?.profile?.username || 'your_username'} • 2025/01/01 - 2025/01/28 • {postsData.length}件の投稿を分析
                    {hasRealData && <span style={{ color: '#22c55e', marginLeft: '12px' }}>• リアルタイムデータ</span>}
                    {!hasRealData && <span style={{ color: '#c79a42', marginLeft: '12px' }}>• サンプルデータ</span>}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/api/instagram/connect'}
                style={{
                  background: 'linear-gradient(135deg, #E4405F, #C13584)',
                  color: '#ffffff',
                  padding: '14px 24px',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(228, 64, 95, 0.3)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Users size={16} />
                Instagram連携
              </button>
            </div>
          </div>

          {/* フォロワー推移グラフ */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.90) 100%)',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(199, 154, 66, 0.15)',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <TrendingUp size={24} color="#c79a42" />
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#282828',
                margin: 0
              }}>
                フォロワー推移
              </h2>
            </div>
            <div style={{ height: '300px', position: 'relative', padding: '20px' }}>
              <svg 
                width="100%" 
                height="100%" 
                viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}
                style={{ overflow: 'visible' }}
              >
                {/* グリッドライン */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(199, 154, 66, 0.3)" />
                    <stop offset="100%" stopColor="rgba(199, 154, 66, 0.05)" />
                  </linearGradient>
                </defs>
                
                {/* Y軸グリッド */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                  <line
                    key={index}
                    x1="0"
                    y1={chartHeight * ratio}
                    x2={chartWidth}
                    y2={chartHeight * ratio}
                    stroke="rgba(199, 154, 66, 0.1)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* エリア */}
                <path
                  d={`${chartPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                  fill="url(#areaGradient)"
                />
                
                {/* メインライン */}
                <path
                  d={chartPath}
                  fill="none"
                  stroke="rgb(199, 154, 66)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* データポイント */}
                {followerData.map((value, index) => {
                  const x = index * (chartWidth / (followerData.length - 1));
                  const y = chartHeight - ((value - Math.min(...followerData)) / (Math.max(...followerData) - Math.min(...followerData))) * chartHeight;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="rgb(199, 154, 66)"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ 
                        filter: 'drop-shadow(0px 2px 4px rgba(199, 154, 66, 0.3))',
                        cursor: 'pointer'
                      }}
                    >
                      <title>{`${followerLabels[index]}: ${value.toLocaleString()}人`}</title>
                    </circle>
                  );
                })}
                
                {/* X軸ラベル */}
                {followerLabels.map((label, index) => {
                  if (index % 2 === 0) { // 隔ラベル表示
                    const x = index * (chartWidth / (followerData.length - 1));
                    return (
                      <text
                        key={index}
                        x={x}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#666666"
                      >
                        {label}
                      </text>
                    );
                  }
                  return null;
                })}
                
                {/* Y軸ラベル */}
                {[0, 0.5, 1].map((ratio, index) => {
                  const value = Math.min(...followerData) + (Math.max(...followerData) - Math.min(...followerData)) * (1 - ratio);
                  return (
                    <text
                      key={index}
                      x="-10"
                      y={chartHeight * ratio + 4}
                      textAnchor="end"
                      fontSize="12"
                      fill="#666666"
                    >
                      {Math.round(value).toLocaleString()}
                    </text>
                  );
                })}
              </svg>
            </div>
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(199, 154, 66, 0.05) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(199, 154, 66, 0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '32px', 
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#c79a42' }}>+144</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>28日間増加</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#c79a42' }}>+5.1</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>日平均増加</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#c79a42' }}>5.9%</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>成長率</div>
                </div>
              </div>
            </div>
          </div>

          {/* 総合評価 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(199, 154, 66, 0.05) 100%)',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid rgba(199, 154, 66, 0.3)',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(199, 154, 66, 0.3)'
              }}>
                <TrendingUp size={24} color="#fcfbf8" />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '0', color: '#282828' }}>
                AI分析：総合評価と改善提案
              </h3>
            </div>
            
            <div style={{ fontSize: '16px', color: '#555', lineHeight: '1.8', marginBottom: '24px' }}>
              <p style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#c79a42' }}>総合スコア: B+ (4指標中2項目達成)</strong><br />
                あなたのアカウントは安定した成長軌道にあります。特に保存率(3.9%)とフォロワー転換率(21.8%)で優秀な成績を示しており、
                コンテンツの質と魅力度の高さが証明されています。
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#c79a42' }}>成功要因の分析:</strong><br />
                1月16日の投稿「Weekend adventures in the city」が最も優秀な成績を記録。この投稿の特徴である視覚的インパクトの強さと
                ストーリー性が、高い保存率(4.4%)とプロフィールアクセス率(3.8%)につながっています。
              </p>
              
              <p style={{ marginBottom: '0' }}>
                <strong style={{ color: '#c79a42' }}>改善提案:</strong><br />
                ホーム率向上のため、投稿時間の最適化とハッシュタグ戦略の見直しを推奨します。また、プロフィールアクセス率向上には
                キャプション冒頭での関心喚起とCTA(Call to Action)の強化が効果的です。
              </p>
            </div>
          </div>

          {/* 重要指標4つ */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
              padding: '32px',
              borderRadius: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(199, 154, 66, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Bookmark size={20} color="#c79a42" />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#666', margin: 0 }}>
                  保存率
                </h3>
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: '800',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                3.9%
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                保存数 ÷ リーチ数（目標 3.0%）
              </p>
              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
                color: '#22c55e',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'inline-block',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                目標達成
              </div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
              padding: '32px',
              borderRadius: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(199, 154, 66, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Eye size={20} color="#ef4444" />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#666', margin: 0 }}>
                  ホーム率
                </h3>
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: '800',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                30.8%
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                ホーム表示 ÷ フォロワー数（目標 50.0%）
              </p>
              <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
                color: '#ef4444',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'inline-block',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                要改善
              </div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
              padding: '32px',
              borderRadius: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(199, 154, 66, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Users size={20} color="#ef4444" />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#666', margin: 0 }}>
                  プロフィールアクセス率
                </h3>
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: '800',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                3.2%
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                プロフアクセス ÷ リーチ数（目標 5.0%）
              </p>
              <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
                color: '#ef4444',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'inline-block',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                要改善
              </div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
              padding: '32px',
              borderRadius: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(199, 154, 66, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <UserPlus size={20} color="#c79a42" />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#666', margin: 0 }}>
                  フォロワー転換率
                </h3>
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: '800',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                21.8%
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                フォロー増加 ÷ プロフアクセス（目標 8.0%）
              </p>
              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
                color: '#22c55e',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'inline-block',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                目標達成
              </div>
            </div>
          </div>

          {/* 投稿ごと分析テーブル */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.90) 100%)',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(199, 154, 66, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <BarChart3 size={24} color="#c79a42" />
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#282828',
                margin: 0
              }}>
                投稿別詳細分析
              </h2>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.85) 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(199, 154, 66, 0.2)',
              backdropFilter: 'blur(15px)',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(199, 154, 66, 0.1)'
            }}>
              {/* テーブルヘッダー */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(199, 154, 66, 0.05) 100%)',
                padding: '24px 32px',
                borderBottom: '1px solid rgba(199, 154, 66, 0.15)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 3fr 3fr 4fr',
                  gap: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#666'
                }}>
                  <div>日付・投稿</div>
                  <div>投稿24時間後</div>
                  <div>投稿1週間後</div>
                  <div>重要4指標ランキング（28日間中）</div>
                </div>
              </div>

              {/* テーブルボディ */}
              <div>
                {postsData.map((post, index) => (
                  <div key={post.id} style={{
                    padding: '24px 32px',
                    borderBottom: index < postsData.length - 1 ? '1px solid rgba(199, 154, 66, 0.1)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(199, 154, 66, 0.05)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 3fr 3fr 4fr',
                      gap: '20px',
                      alignItems: 'center',
                      fontSize: '14px'
                    }}>
                      {/* 日付・投稿 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fcfbf8',
                          fontWeight: '700',
                          fontSize: '16px',
                          boxShadow: '0 4px 12px rgba(199, 154, 66, 0.25)'
                        }}>
                          {post.id}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#282828', marginBottom: '4px', fontSize: '14px' }}>
                            {post.title}
                          </div>
                          <div style={{ color: '#c79a42', fontSize: '12px', fontWeight: '500' }}>
                            {post.date}
                          </div>
                        </div>
                      </div>
                      
                      {/* 投稿24時間後 */}
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' }}>
                          <div style={{ color: post.data_24h.save_rate >= 3.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>保存率: {post.data_24h.save_rate}%</div>
                          <div style={{ color: post.data_24h.home_rate >= 50.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>ホーム率: {post.data_24h.home_rate}%</div>
                          <div style={{ color: post.data_24h.profile_access_rate >= 5.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>プロフアクセス率: {post.data_24h.profile_access_rate}%</div>
                          <div style={{ color: post.data_24h.follower_conversion_rate >= 8.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>フォロワー転換率: {post.data_24h.follower_conversion_rate}%</div>
                        </div>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                          <div>リーチ: {post.data_24h.reach.toLocaleString()} | いいね: {post.data_24h.likes}</div>
                          <div>保存: {post.data_24h.saves} | プロフ表示: {post.data_24h.profile_visits}</div>
                          <div>フォロー: {post.data_24h.follows}</div>
                        </div>
                      </div>
                      
                      {/* 投稿1週間後 */}
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' }}>
                          <div style={{ color: post.data_7d.save_rate >= 3.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>保存率: {post.data_7d.save_rate}%</div>
                          <div style={{ color: post.data_7d.home_rate >= 50.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>ホーム率: {post.data_7d.home_rate}%</div>
                          <div style={{ color: post.data_7d.profile_access_rate >= 5.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>プロフアクセス率: {post.data_7d.profile_access_rate}%</div>
                          <div style={{ color: post.data_7d.follower_conversion_rate >= 8.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>フォロワー転換率: {post.data_7d.follower_conversion_rate}%</div>
                        </div>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                          <div>リーチ: {post.data_7d.reach.toLocaleString()} | いいね: {post.data_7d.likes}</div>
                          <div>保存: {post.data_7d.saves} | プロフ表示: {post.data_7d.profile_visits}</div>
                          <div>フォロー: {post.data_7d.follows}</div>
                        </div>
                      </div>
                      
                      {/* 重要4指標ランキング */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>保存率</div>
                          <div style={{
                            background: post.rankings.save_rate <= 2 ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' :
                                        post.rankings.save_rate <= 3 ? 'linear-gradient(135deg, rgba(199, 154, 66, 0.15), rgba(199, 154, 66, 0.08))' :
                                        'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))',
                            color: post.rankings.save_rate <= 2 ? '#22c55e' :
                                   post.rankings.save_rate <= 3 ? '#c79a42' : '#ef4444',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            border: `1px solid ${post.rankings.save_rate <= 2 ? 'rgba(34, 197, 94, 0.3)' :
                                                 post.rankings.save_rate <= 3 ? 'rgba(199, 154, 66, 0.3)' :
                                                 'rgba(239, 68, 68, 0.3)'}`
                          }}>
                            {post.rankings.save_rate}位/5投稿
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>ホーム率</div>
                          <div style={{
                            background: post.rankings.home_rate <= 2 ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' :
                                        post.rankings.home_rate <= 3 ? 'linear-gradient(135deg, rgba(199, 154, 66, 0.15), rgba(199, 154, 66, 0.08))' :
                                        'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))',
                            color: post.rankings.home_rate <= 2 ? '#22c55e' :
                                   post.rankings.home_rate <= 3 ? '#c79a42' : '#ef4444',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            border: `1px solid ${post.rankings.home_rate <= 2 ? 'rgba(34, 197, 94, 0.3)' :
                                                 post.rankings.home_rate <= 3 ? 'rgba(199, 154, 66, 0.3)' :
                                                 'rgba(239, 68, 68, 0.3)'}`
                          }}>
                            {post.rankings.home_rate}位/5投稿
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>プロフアクセス率</div>
                          <div style={{
                            background: post.rankings.profile_access_rate <= 2 ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' :
                                        post.rankings.profile_access_rate <= 3 ? 'linear-gradient(135deg, rgba(199, 154, 66, 0.15), rgba(199, 154, 66, 0.08))' :
                                        'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))',
                            color: post.rankings.profile_access_rate <= 2 ? '#22c55e' :
                                   post.rankings.profile_access_rate <= 3 ? '#c79a42' : '#ef4444',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            border: `1px solid ${post.rankings.profile_access_rate <= 2 ? 'rgba(34, 197, 94, 0.3)' :
                                                 post.rankings.profile_access_rate <= 3 ? 'rgba(199, 154, 66, 0.3)' :
                                                 'rgba(239, 68, 68, 0.3)'}`
                          }}>
                            {post.rankings.profile_access_rate}位/5投稿
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>フォロワー転換率</div>
                          <div style={{
                            background: post.rankings.follower_conversion_rate <= 2 ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' :
                                        post.rankings.follower_conversion_rate <= 3 ? 'linear-gradient(135deg, rgba(199, 154, 66, 0.15), rgba(199, 154, 66, 0.08))' :
                                        'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))',
                            color: post.rankings.follower_conversion_rate <= 2 ? '#22c55e' :
                                   post.rankings.follower_conversion_rate <= 3 ? '#c79a42' : '#ef4444',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            border: `1px solid ${post.rankings.follower_conversion_rate <= 2 ? 'rgba(34, 197, 94, 0.3)' :
                                                 post.rankings.follower_conversion_rate <= 3 ? 'rgba(199, 154, 66, 0.3)' :
                                                 'rgba(239, 68, 68, 0.3)'}`
                          }}>
                            {post.rankings.follower_conversion_rate}位/5投稿
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CSV出力ボタン */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <button 
                onClick={downloadCSV}
                style={{
                  background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
                  color: '#fcfbf8',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(199, 154, 66, 0.3)'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(199, 154, 66, 0.4)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(199, 154, 66, 0.3)';
                }}
              >
                <Download size={18} />
                CSV形式でダウンロード
              </button>
              <button 
                onClick={downloadExcel}
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#fcfbf8',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(34, 197, 94, 0.4)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.3)';
                }}
              >
                <Download size={18} />
                Excel形式でダウンロード
              </button>
            </div>
          </div>

          {/* Instagram連携を促すCTA */}
          {!hasRealData && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(199, 154, 66, 0.05) 100%)',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid rgba(199, 154, 66, 0.3)',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#282828', marginBottom: '16px' }}>
                実際のデータで分析を開始しませんか？
              </h3>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
                Instagramアカウントを連携して、リアルタイムの分析データを取得しましょう
              </p>
              <button 
                onClick={handleAuthRequired}
                style={{
                  background: 'linear-gradient(135deg, #E4405F, #C13584)',
                  color: '#ffffff',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '0 auto',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(228, 64, 95, 0.3)'
                }}
              >
                <Users size={20} />
                Instagram連携を開始
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}