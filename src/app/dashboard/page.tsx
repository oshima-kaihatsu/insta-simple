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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiComments, setAiComments] = useState({});

  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        setLoading(true);
        
        // URLパラメータからアクセストークンとユーザーIDを取得
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const instagramUserId = urlParams.get('instagram_user_id');
        const success = urlParams.get('success');

        console.log('🔍 Debug Info:');
        console.log('Current URL:', window.location.href);
        console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None');
        console.log('Instagram User ID:', instagramUserId);
        console.log('Success:', success);

        if (success === 'true' && accessToken && instagramUserId) {
          console.log('🚀 Calling Instagram API...');
          
          // 実データを取得
          const response = await fetch(`/api/instagram-data?access_token=${accessToken}&instagram_user_id=${instagramUserId}`);
          
          console.log('📡 API Response Status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Real Instagram data loaded:', data);
            
            if (data.connected) {
              setInstagramData(data);
              // 成功後にURLパラメータをクリア
              window.history.replaceState({}, document.title, window.location.pathname);
            } else {
              setError('Instagram データの取得に失敗しました');
            }
          } else {
            const errorText = await response.text();
            console.error('❌ Failed to fetch Instagram data - Status:', response.status);
            console.error('❌ Error response body:', errorText);
            setError('Instagram データの取得に失敗しました');
          }
        } else {
          setError('Instagram 連携が必要です');
        }
      } catch (error) {
        console.error('📊 Error fetching Instagram data:', error);
        setError('データの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // 実データのみ使用
  const postsData = instagramData?.posts || [];
  const hasRealData = instagramData !== null;

  // フォロワー推移データ（実データのみ）
  const followerHistory = instagramData?.follower_history || {};
  const hasFollowerData = followerHistory.hasData;
  const followerData = hasFollowerData ? followerHistory.data : null;
  const dataCollectionStatus = followerHistory.status || {};

  // 重要4指標の計算（実データベース）
  const calculateMetrics = (post) => {
    if (!post || !post.insights) {
      return { 
        saves_rate: '0.0', 
        home_rate: '0.0', 
        profile_access_rate: '0.0', 
        follower_conversion_rate: '0.0' 
      };
    }
    
    const reach = post.insights.reach || 0;
    const saves = post.insights.saves || 0;
    const profile_views = post.insights.profile_views || 0;
    const website_clicks = post.insights.website_clicks || 0;
    const currentFollowers = instagramData?.profile?.followers_count || 1;
    
    const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
    const home_rate = Math.min(((reach * 0.7) / currentFollowers * 100), 100).toFixed(1);
    const profile_access_rate = reach > 0 ? ((profile_views / reach) * 100).toFixed(1) : '0.0';
    const follower_conversion_rate = profile_views > 0 ? ((website_clicks / profile_views) * 100).toFixed(1) : '0.0';
    
    return { saves_rate, home_rate, profile_access_rate, follower_conversion_rate };
  };

  // 平均値計算（実データ）
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

  // 実際のデータに基づくAIコメント生成
  const generateRealAIComments = () => {
    if (!instagramData || postsData.length === 0) {
      setAiComments({
        grade: 'N/A',
        score: 0,
        achievements: 0,
        bestPost: null,
        overallComment: '投稿データが不足しているため、AI分析を実行できません。まずは投稿を作成してください。',
        suggestions: ['Instagram投稿を開始してデータを蓄積しましょう', '定期的な投稿でエンゲージメントを向上させましょう']
      });
      return;
    }

    // 実データに基づく評価
    const savesRate = parseFloat(averages.saves_rate);
    const homeRate = parseFloat(averages.home_rate);
    const profileRate = parseFloat(averages.profile_access_rate);
    const conversionRate = parseFloat(averages.follower_conversion_rate);

    let score = 0;
    let achievements = 0;
    let grade = 'C';

    // 各指標の評価
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

    // グレード算出
    if (score >= 85) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 55) grade = "C";
    else grade = "D";

    // 最高パフォーマンス投稿（実データのみ）
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

    // 実データに基づく改善提案
    const suggestions = [];
    const username = instagramData.profile?.username || 'あなた';
    const followerCount = instagramData.profile?.followers_count || 0;

    if (savesRate < 3.0) {
      suggestions.push(`@${username} の保存率${savesRate}%は改善が必要です。実用的なカルーセル投稿や情報価値の高いコンテンツを増やしましょう`);
    }
    if (profileRate < 5.0) {
      suggestions.push(`プロフィールアクセス率${profileRate}%向上のため、投稿キャプションでプロフィールへの誘導を強化してください`);
    }
    if (followerCount < 100) {
      suggestions.push('フォロワー数が少ないため、ハッシュタグ戦略とコミュニティ参加を積極的に行いましょう');
    }
    if (conversionRate < 8.0) {
      suggestions.push(`ウェブサイトクリック率${conversionRate}%を改善するため、プロフィールリンクの価値を明確に示しましょう`);
    }

    // 総合コメント（実データベース）
    const postCount = postsData.length;
    const bestPostTitle = bestPost?.caption ? bestPost.caption.substring(0, 30) + '...' : '投稿';
    const bestMetrics = bestPost ? calculateMetrics(bestPost) : null;

    let overallComment = `@${username} の分析結果: ${postCount}件の投稿を分析しました。`;
    
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
    if (instagramData) {
      generateRealAIComments();
    }
  }, [instagramData, postsData]);

  const getGradeColor = (grade) => {
    if (!grade || grade === 'N/A') return '#c79a42';
    if (grade === 'A') return '#22c55e';
    if (grade === 'B') return '#3b82f6';
    if (grade === 'C') return '#f59e0b';
    return '#ef4444';
  };

  // 現在の日付範囲を計算
  const today = new Date();
  const days28Ago = new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000));
  const dateRangeText = `${days28Ago.toLocaleDateString('ja-JP')} - ${today.toLocaleDateString('ja-JP')}`;

  // フォロワー統計（実データのみ）
  const currentFollowers = instagramData?.profile?.followers_count || 0;
  const followersIncrease = hasFollowerData && followerData && followerData.length > 1 ? 
    followerData[followerData.length - 1].followers - followerData[0].followers : 0;
  const dailyAverageIncrease = followersIncrease !== 0 ? Math.round(followersIncrease / (followerHistory.dataPoints || 28)) : 0;
  const pastFollowers = currentFollowers - followersIncrease;
  const growthRate = pastFollowers > 0 ? ((followersIncrease / pastFollowers) * 100).toFixed(1) : '0.0';

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

  // ランキング計算
  const calculateRankings = (posts) => {
    if (!posts || posts.length === 0) return posts;

    const postsWithMetrics = posts.map(post => ({
      ...post,
      metrics: calculateMetrics(post)
    }));

    const savesSorted = [...postsWithMetrics].sort((a, b) => parseFloat(b.metrics.saves_rate) - parseFloat(a.metrics.saves_rate));
    const homeSorted = [...postsWithMetrics].sort((a, b) => parseFloat(b.metrics.home_rate) - parseFloat(a.metrics.home_rate));
    const profileSorted = [...postsWithMetrics].sort((a, b) => parseFloat(b.metrics.profile_access_rate) - parseFloat(a.metrics.profile_access_rate));
    const conversionSorted = [...postsWithMetrics].sort((a, b) => parseFloat(b.metrics.follower_conversion_rate) - parseFloat(a.metrics.follower_conversion_rate));

    return postsWithMetrics.map(post => ({
      ...post,
      rankings: {
        saves_rate: savesSorted.findIndex(p => p.id === post.id) + 1,
        home_rate: homeSorted.findIndex(p => p.id === post.id) + 1,
        profile_access_rate: profileSorted.findIndex(p => p.id === post.id) + 1,
        follower_conversion_rate: conversionSorted.findIndex(p => p.id === post.id) + 1
      }
    }));
  };

  const rankedPosts = calculateRankings(postsData);

  // CSV出力
  const downloadCSV = () => {
    if (!postsData || postsData.length === 0) {
      alert('出力するデータがありません');
      return;
    }

    const headers = [
      'キャプション', '投稿日', 'リーチ数', 'いいね数', '保存数', 'プロフィール表示数', 'ウェブサイトクリック数',
      '保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率',
      '保存率ランキング', 'ホーム率ランキング', 'プロフィールアクセス率ランキング', 'フォロワー転換率ランキング'
    ].join(',');

    const rows = rankedPosts.map(post => {
      const metrics = calculateMetrics(post);
      
      return [
        `"${(post.caption || '').replace(/"/g, '""')}"`,
        new Date(post.timestamp).toLocaleDateString('ja-JP'),
        post.insights?.reach || 0,
        post.like_count || 0,
        post.insights?.saves || 0,
        post.insights?.profile_views || 0,
        post.insights?.website_clicks || 0,
        metrics.saves_rate,
        metrics.home_rate,
        metrics.profile_access_rate,
        metrics.follower_conversion_rate,
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
    link.download = 'instagram_analytics.csv';
    link.click();
  };

  // Excel出力
  const downloadExcel = () => {
    if (!postsData || postsData.length === 0) {
      alert('出力するデータがありません');
      return;
    }

    const headers = [
      'キャプション', '投稿日', 'リーチ数', 'いいね数', '保存数', 'プロフィール表示数', 'ウェブサイトクリック数',
      '保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率',
      '保存率ランキング', 'ホーム率ランキング', 'プロフィールアクセス率ランキング', 'フォロワー転換率ランキング'
    ];

    const data = rankedPosts.map(post => {
      const metrics = calculateMetrics(post);
      
      return [
        (post.caption || '').replace(/\t/g, ' '),
        new Date(post.timestamp).toLocaleDateString('ja-JP'),
        post.insights?.reach || 0,
        post.like_count || 0,
        post.insights?.saves || 0,
        post.insights?.profile_views || 0,
        post.insights?.website_clicks || 0,
        parseFloat(metrics.saves_rate),
        parseFloat(metrics.home_rate),
        parseFloat(metrics.profile_access_rate),
        parseFloat(metrics.follower_conversion_rate),
        `${post.rankings?.saves_rate || 0}位/${postsData.length}投稿`,
        `${post.rankings?.home_rate || 0}位/${postsData.length}投稿`,
        `${post.rankings?.profile_access_rate || 0}位/${postsData.length}投稿`,
        `${post.rankings?.follower_conversion_rate || 0}位/${postsData.length}投稿`
      ];
    });

    const excelContent = [headers.join('\t'), ...data.map(row => row.join('\t'))].join('\n');
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'instagram_analytics.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  if (error || !instagramData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: '#ef4444', marginBottom: '16px' }}>
            {error || 'Instagram データが見つかりません'}
          </div>
          <button
            onClick={handleBack}
            style={{
              background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
              color: '#fcfbf8',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ホームに戻る
          </button>
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
                  <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                    @{instagramData.profile?.username} • {dateRangeText} • {postsData.length}件の投稿を分析
                    <span style={{ 
                      color: '#22c55e', 
                      fontSize: '14px', 
                      marginLeft: '8px',
                      fontWeight: '600'
                    }}>
                      ✅ リアルデータ
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* フォロワー推移（絵文字削除版） */}
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
                  <div style={{ fontSize: '14px', color: '#666' }}>{followerHistory.dataPoints}日間増減</div>
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

              <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                実データ {followerHistory.dataPoints}日間 ({followerHistory.startDate} - {followerHistory.endDate})
              </div>

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
                  
                  {followerData.map((point, index) => {
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
              
              <div style={{
                background: 'rgba(199, 154, 66, 0.1)',
                border: '1px solid rgba(199, 154, 66, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                maxWidth: '400px',
                margin: '0 auto',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '14px', color: '#5d4e37' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>現在のフォロワー数:</strong> {currentFollowers.toLocaleString()}人
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>収集開始日:</strong> {new Date().toLocaleDateString('ja-JP')}
                  </div>
                  {dataCollectionStatus.daysCollected && (
                    <div>
                      <strong>収集日数:</strong> {dataCollectionStatus.daysCollected}日目
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 重要4指標（実データのみ） */}
        {postsData.length > 0 && (
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
              重要4指標ランキング（28日間中）
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
                  fontWeight: '600'
                }}>
                  目標: 50.0%以上 • {parseFloat(averages.home_rate) >= 50.0 ? '✅ 達成' : '❌ 要改善'}
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
                  ウェブクリック ÷ プロフ表示
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
        )}

        {/* 投稿別詳細分析（実データのみ） */}
        {postsData.length > 0 && (
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
                
                <button 
                  onClick={downloadExcel}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <Download size={18} />
                  Excel出力
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 100%)' }}>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>投稿</th>
                    <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>リーチ・いいね・保存</th>
                    <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>重要4指標</th>
                    <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>ランキング（28日間中）</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedPosts.map((post, index) => {
                    const metrics = calculateMetrics(post);
                    
                    return (
                      <tr key={post.id} style={{ 
                        borderBottom: '1px solid rgba(199, 154, 66, 0.1)',
                        background: index % 2 === 0 ? 'rgba(252, 251, 248, 0.3)' : 'transparent'
                      }}>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontWeight: '600', color: '#5d4e37', marginBottom: '4px', maxWidth: '200px' }}>
                            {post.caption ? post.caption.substring(0, 50) + '...' : '投稿'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {new Date(post.timestamp).toLocaleDateString('ja-JP')}
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                            <div>リーチ: {post.insights?.reach?.toLocaleString() || 0}</div>
                            <div>いいね: {post.like_count?.toLocaleString() || 0}</div>
                            <div>保存: {post.insights?.saves?.toLocaleString() || 0}</div>
                            <div>プロフ: {post.insights?.profile_views?.toLocaleString() || 0}</div>
                            <div>ウェブ: {post.insights?.website_clicks?.toLocaleString() || 0}</div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: '#666' }}>
                            <div style={{ color: parseFloat(metrics.saves_rate) >= 3.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>保存率: {metrics.saves_rate}%</div>
                            <div style={{ color: parseFloat(metrics.home_rate) >= 50.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>ホーム率: {metrics.home_rate}%</div>
                            <div style={{ color: parseFloat(metrics.profile_access_rate) >= 5.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>プロフィールアクセス率: {metrics.profile_access_rate}%</div>
                            <div style={{ color: parseFloat(metrics.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>フォロワー転換率: {metrics.follower_conversion_rate}%</div>
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
        )}

        {/* AI総合評価と改善提案（実データベース） */}
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
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#5d4e37', marginBottom: '8px' }}>総合スコア</div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: `2px solid ${getGradeColor(aiComments.grade || 'N/A')}`,
                  background: `${getGradeColor(aiComments.grade || 'N/A')}10`,
                  color: getGradeColor(aiComments.grade || 'N/A'),
                  display: 'inline-block'
                }}>
                  {aiComments.grade || 'N/A'}
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
                「{aiComments.bestPost.caption ? aiComments.bestPost.caption.substring(0, 50) + '...' : '投稿'}」
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#5d4e37' }}>具体的な改善提案</h3>
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

        {/* 投稿データがない場合のメッセージ */}
        {postsData.length === 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '60px 32px',
            textAlign: 'center',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            boxShadow: '0 8px 32px rgba(199, 154, 66, 0.1)',
            marginBottom: '32px'
          }}>
            <BarChart3 size={48} style={{ color: '#c79a42', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#5d4e37', marginBottom: '12px', margin: '0 0 12px 0' }}>
              過去28日間に投稿データがありません
            </h3>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', margin: '0 0 24px 0' }}>
              投稿を作成すると、詳細な分析データが表示されます。
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={handleBack}
                style={{
                  background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
                  color: '#fcfbf8',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ArrowLeft size={16} />
                ホームに戻る
              </button>
              <button 
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
                style={{
                  background: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
                  color: '#fcfbf8',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Users size={16} />
                Instagramで投稿する
              </button>
            </div>
          </div>
        )}

        {/* 連携成功メッセージ */}
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
            @{instagramData?.profile?.username} のリアルデータを分析中です。より詳細なインサイトを取得するため、継続してご利用ください。
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
      </div>
    </div>
  );
}