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

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instagramData, setInstagramData] = useState(null);
  const [hasRealData, setHasRealData] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    }
  }, []);

  // 実データ取得
  const fetchRealData = async (accessToken, instagramUserId) => {
    setLoading(true);
    setLoadingMessage('Instagram連携成功！データを取得中...');
    
    try {
      // API呼び出しの進捗表示
      setTimeout(() => setLoadingMessage('アカウント情報を確認中...'), 1000);
      setTimeout(() => setLoadingMessage('投稿データを分析中...'), 2000);
      setTimeout(() => setLoadingMessage('インサイトを計算中...'), 3000);

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
            website_clicks: parseInt(post.insights?.website_clicks) || 0
          }
        }));
      }

      setInstagramData(data);
      setHasRealData(true);
      setShowSuccessMessage(true);
      
      // 成功メッセージを3秒後に非表示
      setTimeout(() => setShowSuccessMessage(false), 3000);
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

  // サンプルデータ
  const getSampleData = () => ({
    user: {
      username: 'sample_account',
      followers_count: 3456,
      media_count: 78,
      profile_picture_url: null
    },
    posts: [
      {
        id: '1',
        caption: '朝の園庭で元気いっぱい遊ぶ子どもたち。今日も笑顔がたくさん見られました！',
        media_type: 'IMAGE',
        timestamp: '2025-01-28T10:00:00',
        insights: {
          reach: 1234,
          likes: 89,
          saves: 45,
          profile_views: 34,
          website_clicks: 5
        }
      },
      {
        id: '2',
        caption: '今月の製作活動「冬の雪だるま」みんな上手に作れました',
        media_type: 'CAROUSEL_ALBUM',
        timestamp: '2025-01-27T10:00:00',
        insights: {
          reach: 2345,
          likes: 156,
          saves: 89,
          profile_views: 67,
          website_clicks: 12
        }
      },
      {
        id: '3',
        caption: '給食の時間。好き嫌いなく食べられるようになりました',
        media_type: 'IMAGE',
        timestamp: '2025-01-26T10:00:00',
        insights: {
          reach: 1890,
          likes: 123,
          saves: 67,
          profile_views: 45,
          website_clicks: 8
        }
      },
      {
        id: '4',
        caption: '節分の準備中！鬼のお面作りに夢中です',
        media_type: 'VIDEO',
        timestamp: '2025-01-25T10:00:00',
        insights: {
          reach: 3456,
          likes: 234,
          saves: 145,
          profile_views: 89,
          website_clicks: 23
        }
      },
      {
        id: '5',
        caption: '保護者参観日の様子。たくさんのご参加ありがとうございました',
        media_type: 'IMAGE',
        timestamp: '2025-01-24T10:00:00',
        insights: {
          reach: 4567,
          likes: 345,
          saves: 234,
          profile_views: 123,
          website_clicks: 34
        }
      },
      {
        id: '6',
        caption: '午後のお昼寝タイム。ぐっすり眠って午後も元気に活動します',
        media_type: 'IMAGE',
        timestamp: '2025-01-23T10:00:00',
        insights: {
          reach: 890,
          likes: 56,
          saves: 23,
          profile_views: 12,
          website_clicks: 2
        }
      },
      {
        id: '7',
        caption: '英語の時間！楽しく歌いながら学んでいます',
        media_type: 'VIDEO',
        timestamp: '2025-01-22T10:00:00',
        insights: {
          reach: 2678,
          likes: 189,
          saves: 112,
          profile_views: 78,
          website_clicks: 19
        }
      },
      {
        id: '8',
        caption: '体操教室で体力づくり。みんな一生懸命頑張っています',
        media_type: 'IMAGE',
        timestamp: '2025-01-21T10:00:00',
        insights: {
          reach: 1567,
          likes: 98,
          saves: 56,
          profile_views: 34,
          website_clicks: 7
        }
      },
      {
        id: '9',
        caption: '絵本の読み聞かせ。真剣に聞いている姿が素敵です',
        media_type: 'IMAGE',
        timestamp: '2025-01-20T10:00:00',
        insights: {
          reach: 2234,
          likes: 145,
          saves: 78,
          profile_views: 56,
          website_clicks: 11
        }
      },
      {
        id: '10',
        caption: 'お誕生日会を開催しました！1月生まれのお友達おめでとう',
        media_type: 'CAROUSEL_ALBUM',
        timestamp: '2025-01-19T10:00:00',
        insights: {
          reach: 3789,
          likes: 267,
          saves: 189,
          profile_views: 98,
          website_clicks: 28
        }
      },
      {
        id: '11',
        caption: '雨の日の室内遊び。ブロックで大きなお城を作りました',
        media_type: 'IMAGE',
        timestamp: '2025-01-18T10:00:00',
        insights: {
          reach: 1123,
          likes: 67,
          saves: 34,
          profile_views: 23,
          website_clicks: 4
        }
      },
      {
        id: '12',
        caption: 'お散歩で近くの公園へ。自然観察を楽しみました',
        media_type: 'IMAGE',
        timestamp: '2025-01-17T10:00:00',
        insights: {
          reach: 1987,
          likes: 134,
          saves: 67,
          profile_views: 45,
          website_clicks: 9
        }
      },
      {
        id: '13',
        caption: '音楽の時間♪楽器を使ってリズム遊びを楽しんでいます',
        media_type: 'VIDEO',
        timestamp: '2025-01-16T10:00:00',
        insights: {
          reach: 2876,
          likes: 198,
          saves: 123,
          profile_views: 87,
          website_clicks: 21
        }
      },
      {
        id: '14',
        caption: '避難訓練を実施しました。みんな真剣に取り組めました',
        media_type: 'IMAGE',
        timestamp: '2025-01-15T10:00:00',
        insights: {
          reach: 1456,
          likes: 89,
          saves: 45,
          profile_views: 29,
          website_clicks: 6
        }
      },
      {
        id: '15',
        caption: '来月の入園説明会のお知らせ。ご興味のある方はぜひご参加ください',
        media_type: 'IMAGE',
        timestamp: '2025-01-14T10:00:00',
        insights: {
          reach: 5678,
          likes: 389,
          saves: 289,
          profile_views: 156,
          website_clicks: 45
        }
      }
    ],
    follower_history: {
      hasData: false,
      data: [],
      dataPoints: 0,
      startDate: null,
      endDate: null,
      currentFollowers: 3456
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

    const reach = parseInt(post.insights.reach) || 0;
    const saves = parseInt(post.insights.saves) || 0;
    const profile_views = parseInt(post.insights.profile_views) || 0;
    const website_clicks = parseInt(post.insights.website_clicks) || 0;
    const followers = instagramData?.user?.followers_count || 0;

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

  // Instagram連携
  const handleInstagramConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || 'YOUR_CLIENT_ID';
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/instagram/callback`);
    const scope = encodeURIComponent('instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement');
    
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    
    window.location.href = authUrl;
  };

  // CSV出力
  const handleExportCSV = () => {
    if (!instagramData?.posts) return;

    const csvContent = [
      ['タイトル', '日付', 'リーチ数', 'いいね数', '保存数', 'プロフィール表示数', 'ウェブサイトクリック', '保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率'],
      ...instagramData.posts.map(post => {
        const metrics = calculateMetrics(post);
        return [
          post.caption?.substring(0, 30) || '投稿',
          new Date(post.timestamp).toLocaleDateString('ja-JP'),
          post.insights?.reach || 0,
          post.insights?.likes || 0,
          post.insights?.saves || 0,
          post.insights?.profile_views || 0,
          post.insights?.website_clicks || 0,
          `${metrics.saves_rate}%`,
          `${metrics.home_rate}%`,
          `${metrics.profile_access_rate}%`,
          `${metrics.follower_conversion_rate}%`
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instagram_analytics_${hasRealData ? 'real' : 'sample'}.csv`;
    link.click();
  };

  // ローディング画面
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
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <RefreshCw 
            size={48} 
            style={{
              animation: 'spin 1s linear infinite',
              color: '#667eea',
              marginBottom: '24px'
            }}
          />
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
            {loadingMessage}
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
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

  // データ準備
  const posts = instagramData?.posts || [];
  const followerHistory = instagramData?.follower_history || { hasData: false };
  const user = instagramData?.user || {};

  // 投稿をランキング計算
  const postsWithRankings = posts.map(post => {
    const metrics = calculateMetrics(post);
    return { ...post, metrics };
  });

  // ランキング付与
  const rankings = {
    saves_rate: [...postsWithRankings].sort((a, b) => parseFloat(b.metrics.saves_rate) - parseFloat(a.metrics.saves_rate)),
    home_rate: [...postsWithRankings].sort((a, b) => parseFloat(b.metrics.home_rate) - parseFloat(a.metrics.home_rate)),
    profile_access_rate: [...postsWithRankings].sort((a, b) => parseFloat(b.metrics.profile_access_rate) - parseFloat(a.metrics.profile_access_rate)),
    follower_conversion_rate: [...postsWithRankings].sort((a, b) => parseFloat(b.metrics.follower_conversion_rate) - parseFloat(a.metrics.follower_conversion_rate))
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #f8b500 100%)',
      padding: '32px 16px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: 'transparent',
                  border: '2px solid #c79a42',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#c79a42',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c79a42';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#c79a42';
                }}
              >
                <ArrowLeft size={20} />
                戻る
              </button>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#5d4e37' }}>
                InstaSimple Analytics
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                background: hasRealData ? '#22c55e20' : '#3b82f620',
                color: hasRealData ? '#22c55e' : '#3b82f6',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {hasRealData ? '✅ リアルデータ' : '📋 サンプルデータ'}
              </span>
              {!hasRealData && (
                <button
                  onClick={handleInstagramConnect}
                  style={{
                    background: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    boxShadow: '0 4px 12px rgba(228, 64, 95, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(228, 64, 95, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(228, 64, 95, 0.3)';
                  }}
                >
                  Instagram連携
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 連携成功メッセージ */}
        {showSuccessMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #22c55e20, #10b98120)',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            padding: '16px 24px',
            marginBottom: '24px',
            animation: 'slideDown 0.5s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🎉</span>
              <div>
                <h3 style={{ margin: 0, color: '#16a34a', fontWeight: '600' }}>
                  Instagram連携成功！
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#166534', fontSize: '14px' }}>
                  実データの取得が完了しました
                </p>
              </div>
            </div>
          </div>
        )}

        {/* アカウント情報 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={40} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                @{user.username || 'loading'}
              </h2>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#c79a42' }}>
                    {user.followers_count?.toLocaleString() || '0'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>フォロワー</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#c79a42' }}>
                    {user.media_count || '0'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>投稿数</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* フォロワー推移 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#5d4e37' }}>
            フォロワー推移
          </h2>
          
          {followerHistory.hasData && followerHistory.data.length > 0 ? (
            <div>
              <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                実データ {followerHistory.dataPoints}日間 ({followerHistory.startDate} - {followerHistory.endDate})
              </div>
              <svg viewBox="0 0 800 300" style={{ width: '100%', height: 'auto' }}>
                {/* グラフ描画 */}
                <polyline
                  points={followerHistory.data.map((d, i) => 
                    `${(i / (followerHistory.data.length - 1)) * 780 + 10},${280 - (d.followers / Math.max(...followerHistory.data.map(d => d.followers))) * 260}`
                  ).join(' ')}
                  fill="none"
                  stroke="#c79a42"
                  strokeWidth="2"
                />
                {followerHistory.data.map((d, i) => (
                  <circle
                    key={i}
                    cx={(i / (followerHistory.data.length - 1)) * 780 + 10}
                    cy={280 - (d.followers / Math.max(...followerHistory.data.map(d => d.followers))) * 260}
                    r="4"
                    fill="#c79a42"
                  />
                ))}
              </svg>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              background: 'linear-gradient(135deg, #ffeaa720, #fdcb6e20)',
              borderRadius: '12px'
            }}>
              <Calendar size={48} color="#c79a42" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#5d4e37', marginBottom: '12px' }}>
                データ収集を開始しました
              </h3>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                フォロワー数の推移は明日から記録されます
              </p>
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#c79a4220',
                borderRadius: '20px',
                color: '#c79a42',
                fontWeight: '600'
              }}>
                現在のフォロワー: {followerHistory.currentFollowers?.toLocaleString() || '0'}
              </div>
            </div>
          )}
        </div>

        {/* 重要4指標スコア */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#5d4e37' }}>
            重要4指標スコア
          </h2>
          
          {posts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {['保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率'].map((label, index) => {
                const avgMetrics = posts.reduce((acc, post) => {
                  const metrics = calculateMetrics(post);
                  return {
                    saves_rate: acc.saves_rate + parseFloat(metrics.saves_rate),
                    home_rate: acc.home_rate + parseFloat(metrics.home_rate),
                    profile_access_rate: acc.profile_access_rate + parseFloat(metrics.profile_access_rate),
                    follower_conversion_rate: acc.follower_conversion_rate + parseFloat(metrics.follower_conversion_rate)
                  };
                }, { saves_rate: 0, home_rate: 0, profile_access_rate: 0, follower_conversion_rate: 0 });

                const metricKey = ['saves_rate', 'home_rate', 'profile_access_rate', 'follower_conversion_rate'][index];
                const avgValue = (avgMetrics[metricKey] / posts.length).toFixed(1);

                return (
                  <div key={label} style={{
                    textAlign: 'center',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #ffeaa720, #fdcb6e20)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#c79a42', marginBottom: '8px' }}>
                      {avgValue}%
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{label}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
              投稿データがありません
            </div>
          )}
        </div>

        {/* 投稿分析テーブル */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(199, 154, 66, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#5d4e37' }}>
              投稿分析（直近28日間）
            </h2>
            <button
              onClick={handleExportCSV}
              style={{
                background: '#fcfbf8',
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
                e.currentTarget.style.background = '#c79a42';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fcfbf8';
                e.currentTarget.style.color = '#5d4e37';
              }}
            >
              <Download size={18} />
              CSV出力
            </button>
          </div>

          {posts.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #c79a42' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#5d4e37', fontWeight: '600' }}>投稿</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#5d4e37', fontWeight: '600' }}>日付</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#5d4e37', fontWeight: '600' }}>リーチ</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#5d4e37', fontWeight: '600' }}>保存率</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#5d4e37', fontWeight: '600' }}>ホーム率</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#5d4e37', fontWeight: '600' }}>プロフィールアクセス率</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#5d4e37', fontWeight: '600' }}>フォロワー転換率</th>
                  </tr>
                </thead>
                <tbody>
                  {postsWithRankings.map((post, index) => {
                    const savesRank = rankings.saves_rate.findIndex(p => p.id === post.id) + 1;
                    const homeRank = rankings.home_rate.findIndex(p => p.id === post.id) + 1;
                    const profileRank = rankings.profile_access_rate.findIndex(p => p.id === post.id) + 1;
                    const followerRank = rankings.follower_conversion_rate.findIndex(p => p.id === post.id) + 1;

                    return (
                      <tr key={post.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                        <td style={{ padding: '12px', color: '#333' }}>
                          {post.caption?.substring(0, 30) || `投稿${index + 1}`}...
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                          {new Date(post.timestamp).toLocaleDateString('ja-JP')}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#c79a42' }}>
                          {post.insights?.reach?.toLocaleString() || '0'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              background: savesRank <= Math.ceil(posts.length * 0.25) ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : parseFloat(post.metrics.saves_rate) >= 3 ? '#22c55e20' : '#ef444420',
                              color: savesRank <= Math.ceil(posts.length * 0.25) ? 'white' : parseFloat(post.metrics.saves_rate) >= 3 ? '#22c55e' : '#ef4444',
                              fontWeight: '600'
                            }}>
                              {post.metrics.saves_rate}%
                            </span>
                            <span style={{ fontSize: '11px', color: '#888' }}>
                              {savesRank}位/{posts.length}投稿
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              background: homeRank <= Math.ceil(posts.length * 0.25) ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : parseFloat(post.metrics.home_rate) >= 20 ? '#22c55e20' : '#ef444420',
                              color: homeRank <= Math.ceil(posts.length * 0.25) ? 'white' : parseFloat(post.metrics.home_rate) >= 20 ? '#22c55e' : '#ef4444',
                              fontWeight: '600'
                            }}>
                              {post.metrics.home_rate}%
                            </span>
                            <span style={{ fontSize: '11px', color: '#888' }}>
                              {homeRank}位/{posts.length}投稿
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              background: profileRank <= Math.ceil(posts.length * 0.25) ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : parseFloat(post.metrics.profile_access_rate) >= 3 ? '#22c55e20' : '#ef444420',
                              color: profileRank <= Math.ceil(posts.length * 0.25) ? 'white' : parseFloat(post.metrics.profile_access_rate) >= 3 ? '#22c55e' : '#ef4444',
                              fontWeight: '600'
                            }}>
                              {post.metrics.profile_access_rate}%
                            </span>
                            <span style={{ fontSize: '11px', color: '#888' }}>
                              {profileRank}位/{posts.length}投稿
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              background: followerRank <= Math.ceil(posts.length * 0.25) ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : parseFloat(post.metrics.follower_conversion_rate) >= 10 ? '#22c55e20' : '#ef444420',
                              color: followerRank <= Math.ceil(posts.length * 0.25) ? 'white' : parseFloat(post.metrics.follower_conversion_rate) >= 10 ? '#22c55e' : '#ef4444',
                              fontWeight: '600'
                            }}>
                              {post.metrics.follower_conversion_rate}%
                            </span>
                            <span style={{ fontSize: '11px', color: '#888' }}>
                              {followerRank}位/{posts.length}投稿
                            </span>
                          </div>
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
              padding: '48px',
              background: 'linear-gradient(135deg, #ffeaa720, #fdcb6e20)',
              borderRadius: '12px'
            }}>
              <MessageSquare size={48} color="#c79a42" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#5d4e37', marginBottom: '12px' }}>
                投稿データがありません
              </h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                まずはInstagramに投稿してから、もう一度お試しください
              </p>
              <button
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
                style={{
                  background: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Instagramで投稿する
              </button>
            </div>
          )}
        </div>

        {/* AI総合評価 */}
        {posts.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea20, #764ba220)',
            borderRadius: '16px',
            padding: '32px',
            border: '2px solid #667eea'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Brain size={28} color="#667eea" />
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#5d4e37' }}>
                AI総合評価
              </h2>
            </div>

            {/* 最高パフォーマンス投稿 */}
            {(() => {
              const bestPost = posts.reduce((best, post) => {
                const currentMetrics = calculateMetrics(post);
                const bestMetrics = calculateMetrics(best);
                const currentScore = parseFloat(currentMetrics.saves_rate) + parseFloat(currentMetrics.profile_access_rate);
                const bestScore = parseFloat(bestMetrics.saves_rate) + parseFloat(bestMetrics.profile_access_rate);
                return currentScore > bestScore ? post : best;
              }, posts[0]);

              const bestMetrics = calculateMetrics(bestPost);

              return (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Star size={20} color="#f59e0b" />
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#856404' }}>
                      最高パフォーマンス投稿
                    </h3>
                  </div>
                  <div style={{ color: '#856404', fontSize: '16px', marginBottom: '8px' }}>
                    「{bestPost.caption?.substring(0, 30) || '投稿'}...」
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    保存率: {bestMetrics.saves_rate}% / プロフィールアクセス率: {bestMetrics.profile_access_rate}%
                  </div>
                </div>
              );
            })()}

            {/* 改善提案 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#5d4e37' }}>
                改善提案
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.8' }}>
                {(() => {
                  const avgMetrics = posts.reduce((acc, post) => {
                    const metrics = calculateMetrics(post);
                    return {
                      saves_rate: acc.saves_rate + parseFloat(metrics.saves_rate),
                      profile_access_rate: acc.profile_access_rate + parseFloat(metrics.profile_access_rate)
                    };
                  }, { saves_rate: 0, profile_access_rate: 0 });

                  const avgSavesRate = (avgMetrics.saves_rate / posts.length).toFixed(1);
                  const avgProfileRate = (avgMetrics.profile_access_rate / posts.length).toFixed(1);

                  const suggestions = [];

                  if (parseFloat(avgSavesRate) < 3) {
                    suggestions.push(`保存率が平均${avgSavesRate}%と低めです。価値のある情報や後で見返したくなるコンテンツを増やしましょう。`);
                  }
                  if (parseFloat(avgProfileRate) < 3) {
                    suggestions.push(`プロフィールアクセス率が平均${avgProfileRate}%です。投稿にプロフィールへの誘導を追加してみましょう。`);
                  }
                  if (suggestions.length === 0) {
                    suggestions.push('素晴らしいパフォーマンスです！この調子で継続していきましょう。');
                  }

                  return suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}