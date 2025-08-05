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

        if (success && accessToken && instagramUserId) {
          console.log('🚀 Calling Instagram API...');
          console.log('📋 API URL:', `/api/instagram-data?access_token=${accessToken.substring(0, 20)}...&instagram_user_id=${instagramUserId}`);
          
          // 実データを取得
          const response = await fetch(`/api/instagram-data?access_token=${accessToken}&instagram_user_id=${instagramUserId}`);
          
          console.log('📡 API Response Status:', response.status);
          console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));
          
          if (response.ok) {
            const data = await response.json();
            setInstagramData(data);
            console.log('✅ Real Instagram data loaded:', data);
            
            // 成功後にURLパラメータをクリア
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            const errorText = await response.text();
            console.error('❌ Failed to fetch Instagram data - Status:', response.status);
            console.error('❌ Error response body:', errorText);
            setError('Instagram データの取得に失敗しました');
          }
        } else {
          console.log('📊 No Instagram connection - redirecting to home');
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
    router.push('/');
  };

  // 実データのみ使用（サンプルデータは連携前のみ）
  const postsData = instagramData?.posts || [];
  const hasRealData = instagramData !== null;

  // フォロワー推移データ（実データのみ）
  const followerHistory = instagramData?.follower_history || {};
  const hasFollowerData = followerHistory.hasData;
  const followerData = hasFollowerData ? followerHistory.data : null;
  const dataCollectionStatus = followerHistory.status || {};

  // 重要4指標の計算（実データ対応）
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

  // 平均値計算（実データ対応）
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

  // AIコメント生成システム（実データベース）
  const calculateGrade = (averages) => {
    let score = 0;
    let achievements = 0;

    // 各指標の評価（業界ベンチマーク基準）
    const benchmarks = {
      saves_rate: { excellent: 8, good: 4, target: 3 },
      home_rate: { excellent: 70, good: 50, target: 50 },
      profile_access_rate: { excellent: 12, good: 7, target: 5 },
      follower_conversion_rate: { excellent: 15, good: 10, target: 8 }
    };

    Object.entries(benchmarks).forEach(([metric, bench]) => {
      const value = parseFloat(averages[metric]);
      if (value >= bench.excellent) {
        score += 25;
        achievements++;
      } else if (value >= bench.good) {
        score += 20;
        achievements++;
      } else if (value >= bench.target) {
        score += 15;
        achievements++;
      } else {
        score += 10;
      }
    });

    // スコアからグレード算出
    let grade;
    if (score >= 90) grade = "A+";
    else if (score >= 85) grade = "A";
    else if (score >= 80) grade = "A-";
    else if (score >= 75) grade = "B+";
    else if (score >= 70) grade = "B";
    else if (score >= 65) grade = "B-";
    else if (score >= 60) grade = "C+";
    else if (score >= 55) grade = "C";
    else grade = "C-";

    return { grade, score, achievements };
  };

  // 最高パフォーマンス投稿選定（実データベース）
  const findBestPost = (posts) => {
    if (!posts || posts.length === 0) return null;
    
    return posts.reduce((best, current) => {
      const currentMetrics = calculateMetrics(current);
      const bestMetrics = calculateMetrics(best);
      const currentScore = parseFloat(currentMetrics.saves_rate) * 0.4 + 
                          parseFloat(currentMetrics.profile_access_rate) * 0.3 + 
                          parseFloat(currentMetrics.follower_conversion_rate) * 0.3;
      const bestScore = parseFloat(bestMetrics.saves_rate) * 0.4 + 
                       parseFloat(bestMetrics.profile_access_rate) * 0.3 + 
                       parseFloat(bestMetrics.follower_conversion_rate) * 0.3;
      return currentScore > bestScore ? current : best;
    });
  };

  // 改善提案生成（実データベース）
  const generateImprovementSuggestions = (averages) => {
    const suggestions = [];
    
    if (parseFloat(averages.saves_rate) < 3) {
      suggestions.push("保存率向上のため、実用的なカルーセル投稿を週2回投稿することをお勧めします");
    }
    if (parseFloat(averages.home_rate) < 50) {
      suggestions.push("ホーム率改善には、ストーリーズでの積極的な交流とコメント返信の強化が効果的です");
    }
    if (parseFloat(averages.profile_access_rate) < 5) {
      suggestions.push("プロフィールアクセス率を高めるため、キャプションでプロフィールリンクへの誘導を強化しましょう");
    }
    if (parseFloat(averages.follower_conversion_rate) < 8) {
      suggestions.push("ウェブサイトクリック率向上のため、プロフィールページの魅力度向上に取り組みましょう");
    }

    return suggestions;
  };

  // 総合コメント生成（実データベース）
  const generateOverallComment = (averages, gradeInfo, bestPost) => {
    const templates = {
      "A+": [
        "驚異的なパフォーマンスです！全ての指標が業界トップクラスで、Instagram運用の理想的なモデルケースと言えます。",
        "卓越した成果を達成されています。特に保存率とエンゲージメントの両立は多くのアカウントが目指すレベルです。"
      ],
      "A": [
        "非常に優秀な成果です。多くの指標で業界平均を大きく上回っており、効果的な戦略が功を奏しています。",
        "素晴らしいパフォーマンスです。継続的な成長を維持できている点が特に評価できます。"
      ],
      "A-": [
        "優秀な結果を示しています。いくつかの指標で改善の余地はありますが、全体的に高いレベルを維持しています。",
        "良好な成長を続けています。現在の戦略を基盤に、さらなる向上を目指しましょう。"
      ],
      "B+": [
        "安定した成長軌道にあります。いくつかの指標で優秀な成績を示しており、戦略的な調整で更なる向上が期待できます。",
        "順調な成長を示しています。強みを活かしながら、弱点を補強することで次のレベルに到達できるでしょう。"
      ],
      "B": [
        "着実な成長を続けています。基本的な指標は安定しており、重点的な改善で大きな飛躍が可能です。",
        "バランスの取れた成長をしています。特定領域での集中的な改善により、より高い成果が期待できます。"
      ],
      "B-": [
        "成長の基盤は整っています。いくつかの課題はありますが、適切な対策により改善が見込めます。",
        "発展途上の段階にあります。戦略的なアプローチにより、確実な向上が可能です。"
      ],
      "C+": [
        "改善の余地が多く見られます。基本的な投稿戦略の見直しから始めることをお勧めします。",
        "現在は課題が多い状況ですが、適切な改善により大きな成長が期待できます。"
      ],
      "C": [
        "抜本的な戦略見直しが必要です。コンテンツの質向上とエンゲージメント強化に集中しましょう。",
        "基本的な運用方針の改善が急務です。一つずつ確実に改善していきましょう。"
      ]
    };

    const baseTemplate = templates[gradeInfo.grade] || templates["C"];
    const selectedTemplate = baseTemplate[Math.floor(Math.random() * baseTemplate.length)];

    if (bestPost) {
      const bestMetrics = calculateMetrics(bestPost);
      const bestPostTitle = bestPost.caption ? bestPost.caption.substring(0, 30) + '...' : '投稿';
      const performanceDetails = ` 特に「${bestPostTitle}」が最高のパフォーマンスを記録し、保存率${bestMetrics.saves_rate}%を達成しています。`;
      return selectedTemplate + performanceDetails;
    }
    
    return selectedTemplate;
  };

  // AIコメント生成（実データベース）
  const generateAIComments = () => {
    if (postsData.length === 0) {
      setAiComments({
        grade: 'N/A',
        score: 0,
        achievements: 0,
        bestPost: null,
        overallComment: '投稿データが不足しているため、総合評価を生成できません。投稿を増やしてから再度分析してください。',
        suggestions: ['まずは定期的な投稿を開始し、コンテンツの蓄積を行いましょう']
      });
      return;
    }

    const gradeInfo = calculateGrade(averages);
    const bestPost = findBestPost(postsData);
    const suggestions = generateImprovementSuggestions(averages);
    const overallComment = generateOverallComment(averages, gradeInfo, bestPost);

    setAiComments({
      grade: gradeInfo.grade,
      score: gradeInfo.score,
      achievements: gradeInfo.achievements,
      bestPost: bestPost,
      overallComment: overallComment,
      suggestions: suggestions
    });
  };

  useEffect(() => {
    if (instagramData) {
      generateAIComments();
    }
  }, [instagramData, postsData]);

  const getGradeColor = (grade) => {
    if (!grade || grade === 'N/A') return '#c79a42';
    if (grade.startsWith('A')) return '#22c55e';
    if (grade.startsWith('B')) return '#3b82f6';
    return '#f59e0b';
  };

  // 現在の日付範囲を計算
  const today = new Date();
  const days28Ago = new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000));
  const dateRangeText = `${days28Ago.toLocaleDateString('ja-JP')} - ${today.toLocaleDateString('ja-JP')}`;

  // 現在のフォロワー数（実データのみ）
  const currentFollowers = instagramData?.profile?.followers_count || 0;
  
  // フォロワー統計計算（実データのみ）
  const followersIncrease = hasFollowerData && followerData && followerData.length > 1 ? 
    followerData[followerData.length - 1].followers - followerData[0].followers : 0;
  const dailyAverageIncrease = followersIncrease !== 0 ? Math.round(followersIncrease / (followerHistory.dataPoints || 28)) : 0;
  
  // 成長率計算
  const pastFollowers = currentFollowers - followersIncrease;
  const growthRate = pastFollowers > 0 ? 
    ((followersIncrease / pastFollowers) * 100).toFixed(1) : 
    '0.0';

  // SVGパス生成（実データのみ）
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

  // ランキング計算（実データ用）
  const calculateRankings = (posts) => {
    if (!posts || posts.length === 0) return posts;

    const postsWithMetrics = posts.map(post => ({
      ...post,
      metrics: calculateMetrics(post)
    }));

    // 各指標でソート
    const savesSorted = [...postsWithMetrics].sort((a, b) => parseFloat(b.metrics.saves_rate) - parseFloat(a.metrics.saves_rate));
    const homeSorted = [...postsWithMetrics].sort((a, b) => parseFloat(b.metrics.home_rate) - parseFloat(a.metrics.home_rate));
    const profileSorted = [...postsWithMetrics].sort((a, b) => parseFloat(b.metrics.profile_access_rate) - parseFloat(a.metrics.profile_access_rate));
    const conversionSorted = [...postsWithMetrics].sort((a, b) => parseFloat(b.metrics.follower_conversion_rate) - parseFloat(a.metrics.follower_conversion_rate));

    // ランキングを付与
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

  // CSV出力関数（実データ用）
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

  // Excel出力関数（実データ用）
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

    // Excel format (Tab-separated values with .xls extension)
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
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RefreshCw size={24} style={{ color: '#c79a42', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '18px', color: '#5d4e37' }}>データを読み込み中...</span>
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
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                transition: 'background-color 0.2s'
              }}
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
        {/* フォロワー推移（実データのみ） */}
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
              {/* フォロワー統計（実データ版） */}
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

              {/* グラフ（実データ版） */}
              <div style={{ width: '100%', height: '200px', background: '#fafafa', borderRadius: '12px', padding: '20px' }}>
                <svg width="100%" height="200" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c79a42" />
                      <stop offset="100%" stopColor="#b8873b" />
                    </linearGradient>
                  </defs>
                  
                  {/* グリッドライン */}
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
                  
                  {/* 線グラフ */}
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* データポイント */}
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
            /* データ収集開始メッセージ */
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
              {/* 保存率 */}
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

              {/* ホーム率 */}
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

              {/* プロフィールアクセス率 */}
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

              {/* フォロワー転換率 */}
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
            総合評価と改善提案
          </h2>
          
          {/* スコア表示 */}
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

          {/* 最高パフォーマンス投稿（実データベース） */}
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

          {/* 総合コメント */}
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