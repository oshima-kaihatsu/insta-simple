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

export default function DashboardPage() {
  const [instagramData, setInstagramData] = useState(null);
  const [loading, setLoading] = useState(true);
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
            
            try {
              const errorData = JSON.parse(errorText);
              console.error('❌ Parsed error data:', errorData);
            } catch (e) {
              console.error('❌ Raw error text:', errorText);
            }
          }
        } else {
          console.log('📊 Using sample data - Instagram not connected');
          console.log('📋 Missing params:', { accessToken: !!accessToken, instagramUserId: !!instagramUserId, success: !!success });
        }
      } catch (error) {
        console.error('📊 Using sample data due to error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  // サンプルデータ（実データがない場合の表示用）
  const postsData = instagramData?.posts || [
    {
      id: '1',
      title: '保育園での楽しい一日',
      date: '2025-08-04',
      data_24h: { reach: 1250, likes: 89, saves: 67, profile_views: 34, follows: 12 },
      data_7d: { reach: 1480, likes: 112, saves: 89, profile_views: 45, follows: 18 },
      rankings: { saves_rate: 1, home_rate: 2, profile_access_rate: 1, follower_conversion_rate: 1 }
    },
    {
      id: '2',
      title: 'AIで保育をもっと楽しく',
      date: '2025-08-03',
      data_24h: { reach: 980, likes: 78, saves: 34, profile_views: 28, follows: 8 },
      data_7d: { reach: 1250, likes: 98, saves: 45, profile_views: 35, follows: 12 },
      rankings: { saves_rate: 5, home_rate: 4, profile_access_rate: 3, follower_conversion_rate: 4 }
    },
    {
      id: '3',
      title: '夏の水遊び大会開催中',
      date: '2025-08-02',
      data_24h: { reach: 1580, likes: 124, saves: 89, profile_views: 45, follows: 15 },
      data_7d: { reach: 1890, likes: 156, saves: 112, profile_views: 67, follows: 21 },
      rankings: { saves_rate: 2, home_rate: 1, profile_access_rate: 2, follower_conversion_rate: 2 }
    },
    {
      id: '4',
      title: '子どもたちの成長記録',
      date: '2025-08-01',
      data_24h: { reach: 890, likes: 67, saves: 23, profile_views: 18, follows: 4 },
      data_7d: { reach: 1120, likes: 89, saves: 34, profile_views: 28, follows: 7 },
      rankings: { saves_rate: 8, home_rate: 6, profile_access_rate: 5, follower_conversion_rate: 8 }
    },
    {
      id: '5',
      title: '保育士の一日密着',
      date: '2025-07-31',
      data_24h: { reach: 1340, likes: 98, saves: 56, profile_views: 34, follows: 11 },
      data_7d: { reach: 1680, likes: 134, saves: 78, profile_views: 45, follows: 16 },
      rankings: { saves_rate: 3, home_rate: 3, profile_access_rate: 4, follower_conversion_rate: 3 }
    },
    {
      id: '6',
      title: '手作りおもちゃの作り方',
      date: '2025-07-30',
      data_24h: { reach: 750, likes: 45, saves: 18, profile_views: 12, follows: 2 },
      data_7d: { reach: 980, likes: 67, saves: 28, profile_views: 18, follows: 4 },
      rankings: { saves_rate: 12, home_rate: 11, profile_access_rate: 9, follower_conversion_rate: 12 }
    },
    {
      id: '7',
      title: '季節の制作活動',
      date: '2025-07-29',
      data_24h: { reach: 1180, likes: 78, saves: 45, profile_views: 25, follows: 7 },
      data_7d: { reach: 1450, likes: 102, saves: 67, profile_views: 34, follows: 11 },
      rankings: { saves_rate: 6, home_rate: 7, profile_access_rate: 6, follower_conversion_rate: 6 }
    },
    {
      id: '8',
      title: '給食の時間の様子',
      date: '2025-07-28',
      data_24h: { reach: 920, likes: 56, saves: 23, profile_views: 15, follows: 3 },
      data_7d: { reach: 1200, likes: 78, saves: 34, profile_views: 22, follows: 6 },
      rankings: { saves_rate: 9, home_rate: 9, profile_access_rate: 8, follower_conversion_rate: 9 }
    },
    {
      id: '9',
      title: '園庭での外遊び',
      date: '2025-07-27',
      data_24h: { reach: 1450, likes: 89, saves: 56, profile_views: 32, follows: 9 },
      data_7d: { reach: 1780, likes: 124, saves: 78, profile_views: 42, follows: 14 },
      rankings: { saves_rate: 7, home_rate: 5, profile_access_rate: 7, follower_conversion_rate: 5 }
    },
    {
      id: '10',
      title: '親子参観日の準備',
      date: '2025-07-26',
      data_24h: { reach: 1250, likes: 78, saves: 34, profile_views: 23, follows: 6 },
      data_7d: { reach: 1520, likes: 103, saves: 45, profile_views: 31, follows: 9 },
      rankings: { saves_rate: 10, home_rate: 8, profile_access_rate: 10, follower_conversion_rate: 7 }
    },
    {
      id: '11',
      title: '読み聞かせの時間',
      date: '2025-07-25',
      data_24h: { reach: 890, likes: 56, saves: 18, profile_views: 14, follows: 2 },
      data_7d: { reach: 1150, likes: 78, saves: 28, profile_views: 19, follows: 5 },
      rankings: { saves_rate: 13, home_rate: 12, profile_access_rate: 11, follower_conversion_rate: 11 }
    },
    {
      id: '12',
      title: '避難訓練の実施',
      date: '2025-07-24',
      data_24h: { reach: 1080, likes: 67, saves: 23, profile_views: 18, follows: 4 },
      data_7d: { reach: 1350, likes: 89, saves: 34, profile_views: 25, follows: 8 },
      rankings: { saves_rate: 11, home_rate: 10, profile_access_rate: 12, follower_conversion_rate: 10 }
    },
    {
      id: '13',
      title: '保護者との懇談会',
      date: '2025-07-23',
      data_24h: { reach: 780, likes: 45, saves: 12, profile_views: 9, follows: 1 },
      data_7d: { reach: 1020, likes: 67, saves: 18, profile_views: 14, follows: 3 },
      rankings: { saves_rate: 14, home_rate: 13, profile_access_rate: 13, follower_conversion_rate: 13 }
    },
    {
      id: '14',
      title: '新しい遊具の紹介',
      date: '2025-07-22',
      data_24h: { reach: 980, likes: 67, saves: 28, profile_views: 16, follows: 3 },
      data_7d: { reach: 1250, likes: 89, saves: 38, profile_views: 23, follows: 6 },
      rankings: { saves_rate: 15, home_rate: 14, profile_access_rate: 14, follower_conversion_rate: 14 }
    },
    {
      id: '15',
      title: '七夕まつりの準備',
      date: '2025-07-21',
      data_24h: { reach: 680, likes: 34, saves: 15, profile_views: 8, follows: 1 },
      data_7d: { reach: 890, likes: 56, saves: 23, profile_views: 12, follows: 2 },
      rankings: { saves_rate: 4, home_rate: 15, profile_access_rate: 15, follower_conversion_rate: 15 }
    }
  ];

  const hasRealData = instagramData !== null;

  // フォロワー推移データ（実データ対応版）
  const followerHistory = instagramData?.follower_history || {};
  const hasFollowerData = followerHistory.hasData;
  const followerData = hasFollowerData ? followerHistory.data : null;
  const dataCollectionStatus = followerHistory.status || {};

  // 重要4指標の計算
  const calculateMetrics = (post) => {
    const data = post.data_7d;
    const saves_rate = ((data.saves / data.reach) * 100).toFixed(1);
    const home_rate = Math.min(((data.reach * 0.7) / 8634 * 100), 100).toFixed(1); // フォロワー数で割る
    const profile_access_rate = ((data.profile_views / data.reach) * 100).toFixed(1);
    const follower_conversion_rate = ((data.follows / data.profile_views) * 100).toFixed(1);
    
    return { saves_rate, home_rate, profile_access_rate, follower_conversion_rate };
  };

  // 平均値計算
  const calculateAverages = (posts) => {
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

  // AIコメント生成システム
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

  // 最高パフォーマンス投稿選定
  const findBestPost = (posts) => {
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

  // 改善提案生成
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
      suggestions.push("プロフィールページの魅力度向上とフォロー価値の明確化に取り組みましょう");
    }

    return suggestions;
  };

  // 総合コメント生成
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

    const bestMetrics = calculateMetrics(bestPost);
    const performanceDetails = ` 特に「${bestPost.title}」が最高のパフォーマンスを記録し、保存率${bestMetrics.saves_rate}%を達成しています。`;
    
    return selectedTemplate + performanceDetails;
  };

  // AIコメント生成
  const generateAIComments = () => {
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
    if (postsData.length > 0) {
      generateAIComments();
    }
  }, []); // 依存配列を空にして初回のみ実行

  const getGradeColor = (grade) => {
    if (!grade) return '#c79a42';
    if (grade.startsWith('A')) return '#22c55e';
    if (grade.startsWith('B')) return '#3b82f6';
    return '#f59e0b';
  };

  // 現在の日付範囲を計算
  const today = new Date();
  const days28Ago = new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000));
  const dateRangeText = `${days28Ago.toLocaleDateString('ja-JP')} - ${today.toLocaleDateString('ja-JP')}`;

  // 現在のフォロワー数（実データ優先、フォールバックでサンプル）
  const currentFollowers = instagramData?.profile?.followers_count || 8634;
  
  // 実データがない場合のフォロワー統計計算（既存ロジック保持）
  const followersIncrease = hasFollowerData && followerData && followerData.length > 1 ? 
    followerData[followerData.length - 1].followers - followerData[0].followers : 214;
  const dailyAverageIncrease = Math.round(followersIncrease / 28);
  
  // 成長率計算を修正（分母がマイナスになる場合の対処）
  const pastFollowers = currentFollowers - followersIncrease;
  const growthRate = pastFollowers > 0 ? 
    ((followersIncrease / pastFollowers) * 100).toFixed(1) : 
    '0.0';

  // SVGパス生成（実データ対応）
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

  // CSV出力関数
  const downloadCSV = () => {
    const headers = [
      'タイトル', '日付',
      '24h後_リーチ数', '24h後_いいね数', '24h後_保存数', '24h後_プロフィール表示数', '24h後_フォロー数',
      '24h後_保存率', '24h後_プロフィールアクセス率', '24h後_フォロワー転換率', '24h後_ホーム率',
      '1週間後_リーチ数', '1週間後_いいね数', '1週間後_保存数', '1週間後_プロフィール表示数', '1週間後_フォロー数',
      '1週間後_保存率', '1週間後_プロフィールアクセス率', '1週間後_フォロワー転換率', '1週間後_ホーム率',
      '保存率ランキング', 'ホーム率ランキング', 'プロフィールアクセス率ランキング', 'フォロワー転換率ランキング'
    ].join(',');

    const rows = postsData.map(post => {
      const metrics24h = calculateMetrics({ data_7d: post.data_24h });
      const metrics7d = calculateMetrics(post);
      
      return [
        `"${post.title}"`, post.date,
        post.data_24h.reach, post.data_24h.likes, post.data_24h.saves, post.data_24h.profile_views, post.data_24h.follows,
        metrics24h.saves_rate, metrics24h.profile_access_rate, metrics24h.follower_conversion_rate, metrics24h.home_rate,
        post.data_7d.reach, post.data_7d.likes, post.data_7d.saves, post.data_7d.profile_views, post.data_7d.follows,
        metrics7d.saves_rate, metrics7d.profile_access_rate, metrics7d.follower_conversion_rate, metrics7d.home_rate,
        `${post.rankings.saves_rate}位/${postsData.length}投稿`,
        `${post.rankings.home_rate}位/${postsData.length}投稿`,
        `${post.rankings.profile_access_rate}位/${postsData.length}投稿`,
        `${post.rankings.follower_conversion_rate}位/${postsData.length}投稿`
      ].join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'instagram_analytics.csv';
    link.click();
  };

  // Excel出力関数
  const downloadExcel = () => {
    const headers = [
      'タイトル', '日付',
      '24h後_リーチ数', '24h後_いいね数', '24h後_保存数', '24h後_プロフィール表示数', '24h後_フォロー数',
      '24h後_保存率', '24h後_プロフィールアクセス率', '24h後_フォロワー転換率', '24h後_ホーム率',
      '1週間後_リーチ数', '1週間後_いいね数', '1週間後_保存数', '1週間後_プロフィール表示数', '1週間後_フォロー数',
      '1週間後_保存率', '1週間後_プロフィールアクセス率', '1週間後_フォロワー転換率', '1週間後_ホーム率',
      '保存率ランキング', 'ホーム率ランキング', 'プロフィールアクセス率ランキング', 'フォロワー転換率ランキング'
    ];

    const data = postsData.map(post => {
      const metrics24h = calculateMetrics({ data_7d: post.data_24h });
      const metrics7d = calculateMetrics(post);
      
      return [
        post.title, post.date,
        post.data_24h.reach, post.data_24h.likes, post.data_24h.saves, post.data_24h.profile_views, post.data_24h.follows,
        parseFloat(metrics24h.saves_rate), parseFloat(metrics24h.profile_access_rate), parseFloat(metrics24h.follower_conversion_rate), parseFloat(metrics24h.home_rate),
        post.data_7d.reach, post.data_7d.likes, post.data_7d.saves, post.data_7d.profile_views, post.data_7d.follows,
        parseFloat(metrics7d.saves_rate), parseFloat(metrics7d.profile_access_rate), parseFloat(metrics7d.follower_conversion_rate), parseFloat(metrics7d.home_rate),
        `${post.rankings.saves_rate}位/${postsData.length}投稿`,
        `${post.rankings.home_rate}位/${postsData.length}投稿`,
        `${post.rankings.profile_access_rate}位/${postsData.length}投稿`,
        `${post.rankings.follower_conversion_rate}位/${postsData.length}投稿`
      ];
    });

    // Simple Excel format (Tab-separated values with .xls extension)
    const excelContent = [headers.join('\t'), ...data.map(row => row.join('\t'))].join('\n');
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'instagram_analytics.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <button style={{
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
            }}>
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
                    @{instagramData?.profile?.username || 'sample_account'} • {dateRangeText} • {postsData.length}件の投稿を分析
                    {hasRealData && <span style={{ 
                      color: '#22c55e', 
                      fontSize: '14px', 
                      marginLeft: '8px',
                      fontWeight: '600'
                    }}>
                      ✅ リアルデータ
                    </span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* フォロワー推移（実データ対応版） */}
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
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e', marginBottom: '4px' }}>
                    {followersIncrease >= 0 ? '+' : ''}{followersIncrease}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{followerHistory.dataPoints}日間増減</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#c79a42', marginBottom: '4px' }}>
                    {followersIncrease >= 0 ? '+' : ''}{dailyAverageIncrease}
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
                  <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>24時間後</th>
                  <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>1週間後</th>
                  <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#5d4e37', borderBottom: '2px solid #c79a42' }}>重要4指標ランキング（28日間中）</th>
                </tr>
              </thead>
              <tbody>
                {postsData.map((post, index) => {
                  const metrics24h = calculateMetrics({ data_7d: post.data_24h });
                  const metrics7d = calculateMetrics(post);
                  
                  return (
                    <tr key={post.id} style={{ 
                      borderBottom: '1px solid rgba(199, 154, 66, 0.1)',
                      background: index % 2 === 0 ? 'rgba(252, 251, 248, 0.3)' : 'transparent'
                    }}>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ fontWeight: '600', color: '#5d4e37', marginBottom: '4px' }}>{post.title}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{post.date}</div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                          <div>リーチ: {post.data_24h.reach.toLocaleString()}</div>
                          <div>いいね: {post.data_24h.likes}</div>
                          <div>保存: {post.data_24h.saves}</div>
                          <div>プロフ: {post.data_24h.profile_views}</div>
                          <div>フォロー: {post.data_24h.follows}</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          <div style={{ color: parseFloat(metrics24h.saves_rate) >= 3.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>保存率: {metrics24h.saves_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.home_rate) >= 50.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>ホーム率: {metrics24h.home_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.profile_access_rate) >= 5.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>프ロ필アクセス率: {metrics24h.profile_access_rate}%</div>
                          <div style={{ color: parseFloat(metrics24h.follower_conversion_rate) >= 8.0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>フォロワー転換率: {metrics24h.follower_conversion_rate}%</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                          <div>リーチ: {post.data_7d.reach.toLocaleString()}</div>
                          <div>いいね: {post.data_7d.likes}</div>
                          <div>保存: {post.data_7d.saves}</div>
                          <div>プロフ: {post.data_7d.profile_views}</div>
                          <div>フォロー: {post.data_7d.follows}</div>
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
                            background: post.rankings.saves_rate <= Math.ceil(postsData.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings.saves_rate > Math.ceil(postsData.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings.saves_rate <= Math.ceil(postsData.length * 0.25) ? '#16a34a' : 
                                   post.rankings.saves_rate > Math.ceil(postsData.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            保存率: {post.rankings.saves_rate}位/{postsData.length}投稿
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: post.rankings.home_rate <= Math.ceil(postsData.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings.home_rate > Math.ceil(postsData.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings.home_rate <= Math.ceil(postsData.length * 0.25) ? '#16a34a' : 
                                   post.rankings.home_rate > Math.ceil(postsData.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            ホーム率: {post.rankings.home_rate}位/{postsData.length}投稿
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: post.rankings.profile_access_rate <= Math.ceil(postsData.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings.profile_access_rate > Math.ceil(postsData.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings.profile_access_rate <= Math.ceil(postsData.length * 0.25) ? '#16a34a' : 
                                   post.rankings.profile_access_rate > Math.ceil(postsData.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            プロフ率: {post.rankings.profile_access_rate}位/{postsData.length}投稿
                          </div>
                          <div style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: post.rankings.follower_conversion_rate <= Math.ceil(postsData.length * 0.25) ? 'rgba(34, 197, 94, 0.2)' : 
                                       post.rankings.follower_conversion_rate > Math.ceil(postsData.length * 0.75) ? 'rgba(239, 68, 68, 0.2)' : 
                                       'rgba(199, 154, 66, 0.1)',
                            color: post.rankings.follower_conversion_rate <= Math.ceil(postsData.length * 0.25) ? '#16a34a' : 
                                   post.rankings.follower_conversion_rate > Math.ceil(postsData.length * 0.75) ? '#dc2626' : 
                                   '#b8873b',
                            fontWeight: '600'
                          }}>
                            転換率: {post.rankings.follower_conversion_rate}位/{postsData.length}投稿
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

          {/* 最高パフォーマンス投稿 */}
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
                「{aiComments.bestPost.title}」
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
          )}

          {/* 改善提案 */}
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

        {/* Instagram連携CTA（実データがない場合のみ表示） */}
        {!hasRealData && (
          <div style={{
            background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            color: '#fcfbf8',
            boxShadow: '0 8px 32px rgba(199, 154, 66, 0.3)'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', margin: 0 }}>
              実際のデータで分析を開始しませんか？
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.9 }}>
              Instagramアカウントを連携して、リアルタイムデータでより精密な分析を体験しましょう
            </p>
            <button 
              onClick={() => {
                window.location.href = '/api/instagram/connect';
              }}
              style={{
                background: '#fcfbf8',
                color: '#5d4e37',
                padding: '16px 32px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              Instagram連携を開始
            </button>
          </div>
        )}
      </div>
    </div>
  );
}