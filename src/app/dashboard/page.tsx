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
  CheckCircle,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [instagramData, setInstagramData] = useState(null);
  const [showSampleData, setShowSampleData] = useState(true);
  const [aiComments, setAiComments] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('28');

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
  const sampleFollowerData = {
    labels: ['1/1', '1/5', '1/10', '1/15', '1/20', '1/25', '1/28'],
    data: [8234, 8267, 8312, 8389, 8456, 8567, 8634]
  };

  // 現在のフォロワー数
  const currentFollowers = instagramData?.profile?.followers_count || 8634;

  // 使用するデータの決定
  const postsData = instagramData?.posts || (showSampleData ? samplePosts : []);
  const followerData = instagramData?.follower_history?.data || (showSampleData ? sampleFollowerData : null);
  const hasRealData = instagramData !== null;

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
      const follows = parseInt(post.insights.follows) || 0;
      
      const saves_rate = reach > 0 ? ((saves / reach) * 100).toFixed(1) : '0.0';
      const home_rate = currentFollowers > 0 && reach > 0 ? ((reach / currentFollowers) * 100).toFixed(1) : '0.0';
      const profile_access_rate = reach > 0 ? ((profile_views / reach) * 100).toFixed(1) : '0.0';
      const follower_conversion_rate = profile_views > 0 ? ((follows / profile_views) * 100).toFixed(1) : '0.0';
      
      return { saves_rate, home_rate, profile_access_rate, follower_conversion_rate };
    } else if (post.data_7d) {
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
      if (hasRealData && post.insights) {
        total_reach += parseInt(post.insights.reach) || 0;
        total_saves += parseInt(post.insights.saves) || 0;
        total_profile_views += parseInt(post.insights.profile_views) || 0;
        total_follows += parseInt(post.insights.follows) || 0;
        home_reach_sum += parseInt(post.insights.reach) || 0;
      } else if (post.data_7d) {
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

  const averages = calculateAverages(filteredPosts);

  // ランキング計算
  const calculateRankings = () => {
    filteredPosts.forEach(post => {
      const metrics = calculateMetrics(post);
      post.metrics = metrics;
      post.rankings = {};
    });

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
      
      const savesRate = parseFloat(metrics.saves_rate);
      if (savesRate >= 5.0) {
        comments.push('保存率が非常に高く、価値のあるコンテンツとして認識されています');
      } else if (savesRate >= 3.0) {
        comments.push('保存率が良好です');
      } else if (savesRate > 0) {
        comments.push('保存率を向上させる余地があります');
      }
      
      const homeRate = parseFloat(metrics.home_rate);
      if (homeRate >= 70.0) {
        comments.push('ホーム率が優秀で、多くのフォロワーに届いています');
      } else if (homeRate >= 50.0) {
        comments.push('ホーム率は標準的です');
      } else if (homeRate > 0) {
        comments.push('投稿時間の最適化でホーム率を改善できる可能性があります');
      }
      
      const profileRate = parseFloat(metrics.profile_access_rate);
      if (profileRate >= 5.0) {
        comments.push('プロフィールへの誘導が非常に効果的です');
      } else if (profileRate >= 2.0) {
        comments.push('プロフィールアクセス率は良好です');
      } else if (profileRate > 0) {
        comments.push('CTAを追加してプロフィールへの誘導を強化することを推奨します');
      }
      
      const conversionRate = parseFloat(metrics.follower_conversion_rate);
      if (conversionRate >= 10.0) {
        comments.push('フォロワー転換率が優秀です');
      } else if (conversionRate >= 5.0) {
        comments.push('フォロワー転換率は標準的です');
      } else if (conversionRate > 0) {
        comments.push('プロフィールの最適化でフォロワー転換率を改善できます');
      }
      
      const score = (savesRate * 0.3 + homeRate * 0.3 + profileRate * 0.2 + conversionRate * 0.2);
      let grade = 'C';
      if (score >= 30) grade = 'S';
      else if (score >= 20) grade = 'A';
      else if (score >= 10) grade = 'B';
      
      newComments[post.id] = {
        grade,
        comments: comments.length > 0 ? comments : ['この投稿のパフォーマンスを分析中です']
      };
    });
    
    let overallComment = `${filteredPosts.length}件の投稿を分析しました。`;
    
    const avgSaves = parseFloat(averages.avg_saves_rate);
    const avgHome = parseFloat(averages.avg_home_rate);
    
    if (avgSaves >= 3.0 && avgHome >= 50.0) {
      overallComment += '全体的に優秀なパフォーマンスです。現在の投稿戦略を継続してください。';
    } else if (avgSaves >= 2.0 || avgHome >= 40.0) {
      overallComment += '標準的なパフォーマンスです。コンテンツの質と投稿時間の最適化で改善の余地があります。';
    } else {
      overallComment += '改善の余地が大きくあります。コンテンツ戦略の見直しを推奨します。';
    }
    
    const suggestions = [];
    if (avgSaves < 3.0) {
      suggestions.push('保存されやすい実用的なコンテンツを増やす');
    }
    if (avgHome < 50.0) {
      suggestions.push('フォロワーのアクティブ時間帯を分析し、投稿時間を最適化する');
    }
    if (parseFloat(averages.avg_profile_access_rate) < 3.0) {
      suggestions.push('投稿内でプロフィールへの誘導を強化する');
    }
    if (parseFloat(averages.avg_follower_conversion_rate) < 7.0) {
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

  // Instagram連携チェック
  useEffect(() => {
    const checkInstagramConnection = async () => {
      try {
        const res = await fetch('/api/instagram/user');
        if (res.ok) {
          const data = await res.json();
          setInstagramData(data);
          setShowSampleData(false);
        }
      } catch (error) {
        console.error('Instagram connection check failed:', error);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    checkInstagramConnection();
  }, []);

  // CSV出力機能
  const downloadCSV = () => {
    const headers = [
      '投稿日', '投稿内容',
      'リーチ数(7d)', 'いいね数(7d)', '保存数(7d)', 'プロフィール表示(7d)', 'フォロー数(7d)',
      '保存率', 'ホーム率', 'プロフィールアクセス率', 'フォロワー転換率'
    ];
    
    const rows = filteredPosts.map(post => {
      const metrics = calculateMetrics(post);
      const data7d = post.data_7d || post.insights || {};
      
      return [
        post.date || post.timestamp?.split('T')[0] || '',
        post.title || post.caption || '',
        data7d.reach || 0,
        data7d.likes || 0,
        data7d.saves || 0,
        data7d.profile_views || 0,
        data7d.follows || 0,
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
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <RefreshCw 
            size={48} 
            style={{ 
              color: '#1890ff',
              marginBottom: '24px',
              animation: 'spin 1s linear infinite'
            }} 
          />
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            データを読み込み中
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

  // 期間テキスト
  const dateRangeText = filterPeriod === '7' ? '過去7日間' :
                       filterPeriod === '28' ? '過去28日間' :
                       filterPeriod === '90' ? '過去90日間' : '全期間';

  // メインUI
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px 32px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#1890ff';
                e.currentTarget.style.color = '#1890ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#d9d9d9';
                e.currentTarget.style.color = '#333';
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                margin: 0,
                color: '#333'
              }}>
                Instagram分析ダッシュボード
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#666', 
                margin: '4px 0 0 0' 
              }}>
                @{hasRealData ? instagramData.profile?.username : 'your_account'} • {dateRangeText} • {filteredPosts.length}件の投稿を分析
              </p>
            </div>
          </div>
          
          {!hasRealData && (
            <button 
              onClick={() => window.location.href = '/api/instagram/connect'}
              style={{
                background: '#1890ff',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#40a9ff'}
              onMouseOut={(e) => e.currentTarget.style.background = '#1890ff'}
            >
              Instagram連携
            </button>
          )}
        </div>

        {/* フォロワー推移 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '20px', 
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Users size={20} />
            フォロワー推移
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>現在のフォロワー</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>{currentFollowers.toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>28日間増減</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: '#52c41a' }}>+{(currentFollowers - 8234).toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>1日平均増減</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: '#52c41a' }}>+{Math.round((currentFollowers - 8234) / 28)}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>成長率</p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: '#52c41a' }}>
                {(((currentFollowers - 8234) / 8234) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          {followerData && (
            <div style={{ height: '200px', background: '#fafafa', borderRadius: '8px', padding: '16px' }}>
              <svg viewBox="0 0 800 180" style={{ width: '100%', height: '100%' }}>
                <polyline
                  points={followerData.data.map((val, i) => 
                    `${(i / (followerData.data.length - 1)) * 760 + 20},${170 - ((val - 8200) / 450) * 150}`
                  ).join(' ')}
                  fill="none"
                  stroke="#1890ff"
                  strokeWidth="2"
                />
                {followerData.data.map((val, i) => (
                  <circle
                    key={i}
                    cx={(i / (followerData.data.length - 1)) * 760 + 20}
                    cy={170 - ((val - 8200) / 450) * 150}
                    r="4"
                    fill="#1890ff"
                  />
                ))}
                {followerData.labels.map((label, i) => (
                  <text
                    key={i}
                    x={(i / (followerData.labels.length - 1)) * 760 + 20}
                    y="180"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#999"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>
          )}
        </div>

        {/* 重要4指標スコア */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '20px', 
            color: '#333'
          }}>
            重要4指標スコア
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#333', margin: 0 }}>
                  保存率
                </h3>
                <span style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
                  {averages.avg_saves_rate}%
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                計算式: 保存数 ÷ リーチ数
              </p>
              <p style={{ fontSize: '11px', color: parseFloat(averages.avg_saves_rate) >= 3.0 ? '#52c41a' : '#ff4d4f' }}>
                目標: 3.0%以上
              </p>
            </div>
            
            <div style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#333', margin: 0 }}>
                  ホーム率
                </h3>
                <span style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
                  {averages.avg_home_rate}%
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                計算式: リーチ数 ÷ フォロワー数
              </p>
              <p style={{ fontSize: '11px', color: parseFloat(averages.avg_home_rate) >= 50.0 ? '#52c41a' : '#ff4d4f' }}>
                目標: 50.0%以上
              </p>
            </div>
            
            <div style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#333', margin: 0 }}>
                  プロフィールアクセス率
                </h3>
                <span style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
                  {averages.avg_profile_access_rate}%
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                計算式: プロフィール表示 ÷ リーチ数
              </p>
              <p style={{ fontSize: '11px', color: parseFloat(averages.avg_profile_access_rate) >= 3.0 ? '#52c41a' : '#ff4d4f' }}>
                目標: 3.0%以上
              </p>
            </div>
            
            <div style={{
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#333', margin: 0 }}>
                  フォロワー転換率
                </h3>
                <span style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
                  {averages.avg_follower_conversion_rate}%
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                計算式: フォロー数 ÷ プロフィール表示
              </p>
              <p style={{ fontSize: '11px', color: parseFloat(averages.avg_follower_conversion_rate) >= 7.0 ? '#52c41a' : '#ff4d4f' }}>
                目標: 7.0%以上
              </p>
            </div>
          </div>
        </div>

        {/* 投稿別詳細分析 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              margin: 0, 
              color: '#333'
            }}>
              投稿別詳細分析
            </h2>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d9d9d9',
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
                  background: '#1890ff',
                  color: 'white',
                  padding: '6px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#40a9ff'}
                onMouseOut={(e) => e.currentTarget.style.background = '#1890ff'}
              >
                <Download size={14} />
                CSV出力
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', color: '#666' }}>
                    投稿日
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', color: '#666' }}>
                    投稿内容
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', color: '#666' }}>
                    保存率
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', color: '#666' }}>
                    ホーム率
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', color: '#666' }}>
                    プロフィール<br/>アクセス率
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', color: '#666' }}>
                    フォロワー<br/>転換率
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? filteredPosts.map((post, index) => {
                  const metrics = calculateMetrics(post);
                  const isTop25 = post.rankings && (
                    post.rankings.saves_rate <= Math.ceil(filteredPosts.length * 0.25) ||
                    post.rankings.home_rate <= Math.ceil(filteredPosts.length * 0.25) ||
                    post.rankings.profile_access_rate <= Math.ceil(filteredPosts.length * 0.25) ||
                    post.rankings.follower_conversion_rate <= Math.ceil(filteredPosts.length * 0.25)
                  );
                  
                  return (
                    <tr key={post.id} style={{ 
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <td style={{ padding: '12px 8px', color: '#666' }}>
                        {post.date || post.timestamp?.split('T')[0]}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isTop25 && (
                            <span style={{
                              background: '#fff1b8',
                              color: '#d48806',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '500'
                            }}>
                              TOP 25%
                            </span>
                          )}
                          <span style={{ 
                            color: '#333',
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {post.title || post.caption || '投稿内容なし'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: parseFloat(metrics.saves_rate) >= 3.0 ? '#52c41a' : '#333' 
                          }}>
                            {metrics.saves_rate}%
                          </span>
                          <br />
                          <span style={{ fontSize: '10px', color: '#999' }}>
                            {post.rankings?.saves_rate}位/{filteredPosts.length}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: parseFloat(metrics.home_rate) >= 50.0 ? '#52c41a' : '#333' 
                          }}>
                            {metrics.home_rate}%
                          </span>
                          <br />
                          <span style={{ fontSize: '10px', color: '#999' }}>
                            {post.rankings?.home_rate}位/{filteredPosts.length}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: parseFloat(metrics.profile_access_rate) >= 3.0 ? '#52c41a' : '#333' 
                          }}>
                            {metrics.profile_access_rate}%
                          </span>
                          <br />
                          <span style={{ fontSize: '10px', color: '#999' }}>
                            {post.rankings?.profile_access_rate}位/{filteredPosts.length}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: parseFloat(metrics.follower_conversion_rate) >= 7.0 ? '#52c41a' : '#333' 
                          }}>
                            {metrics.follower_conversion_rate}%
                          </span>
                          <br />
                          <span style={{ fontSize: '10px', color: '#999' }}>
                            {post.rankings?.follower_conversion_rate}位/{filteredPosts.length}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <MessageSquare size={32} style={{ margin: '0 auto 12px', color: '#d9d9d9' }} />
                      <p>表示する投稿データがありません</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI総合評価と改善提案 */}
        {filteredPosts.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '20px', 
              color: '#333'
            }}>
              AI総合評価と改善提案
            </h2>
            
            <div style={{
              background: '#f5f5f5',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                総合評価
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#666', margin: 0 }}>
                {aiComments.overall?.comment}
              </p>
            </div>
            
            <div style={{
              background: '#f5f5f5',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                改善提案
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {aiComments.overall?.suggestions?.map((suggestion, index) => (
                  <li key={index} style={{ 
                    fontSize: '13px', 
                    lineHeight: '1.6', 
                    color: '#666',
                    marginBottom: '4px'
                  }}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}