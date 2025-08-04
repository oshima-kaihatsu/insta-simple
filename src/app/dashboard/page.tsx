// src/app/dashboard/page.tsx の先頭に追加

'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, Calendar, TrendingUp, Bookmark, Eye, Users, UserPlus, Download } from 'lucide-react';

export default function Dashboard() {
  // useSessionの安全な取得
  const sessionResult = useSession();
  const session = sessionResult?.data || null;
  const status = sessionResult?.status || 'loading';
  const router = useRouter();
  
  const [instagramData, setInstagramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect実行:', { status, session: !!session });
    
    if (status === 'loading') {
      console.log('セッション読み込み中...');
      return;
    }
    
    if (!session) {
      console.log('未認証のため signin へ');
      router.push('/auth/signin');
      return;
    }

    console.log('認証済み、Instagram データ取得開始');
    // Instagram データの取得
    fetchInstagramData();
  }, [session, status, router]);

  const fetchInstagramData = async () => {
    try {
      console.log('Instagram API呼び出し開始');
      const response = await fetch('/api/instagram/insights');
      console.log('Instagram API レスポンス:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Instagram データ取得成功:', data);
        setInstagramData(data);
      } else {
        console.log('Instagram data not available, using sample data');
      }
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
    } finally {
      console.log('Instagram データ取得完了、loading を false に');
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  // CSV ダウンロード機能
  const downloadCSV = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'instagram_analytics.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel ダウンロード機能
  const downloadExcel = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'instagram_analytics.xlsx');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVContent = () => {
    const header = '投稿ID,日付,タイトル,保存率24h,ホーム率24h,プロフアクセス率24h,フォロワー転換率24h,保存率7d,ホーム率7d,プロフアクセス率7d,フォロワー転換率7d\n';
    const rows = postsData.map(post => 
      `${post.id},${post.date},${post.title},${post.data_24h.save_rate}%,${post.data_24h.home_rate}%,${post.data_24h.profile_access_rate}%,${post.data_24h.follower_conversion_rate}%,${post.data_7d.save_rate}%,${post.data_7d.home_rate}%,${post.data_7d.profile_access_rate}%,${post.data_7d.follower_conversion_rate}%`
    ).join('\n');
    return header + rows;
  };

  // セッション確認中のローディング
  if (status === 'loading') {
    console.log('セッション確認中...');
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#c79a42',
          fontWeight: '600'
        }}>
          セッション確認中...
        </div>
      </div>
    );
  }

  // データ読み込み中
  if (loading) {
    console.log('データ読み込み中...');
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#c79a42',
          fontWeight: '600'
        }}>
          Instagram データを読み込み中...
        </div>
      </div>
    );
  }

  // 認証されていない場合
  if (status === 'unauthenticated' || !session) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#c79a42', marginBottom: '16px' }}>認証が必要です</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>ダッシュボードにアクセスするにはログインしてください。</p>
          <button 
            onClick={() => router.push('/auth/signin')}
            style={{
              background: '#c79a42',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#ef4444'
        }}>
          <h2>エラーが発生しました</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{
            background: '#c79a42',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // サンプルデータ
  const hasRealData = instagramData && instagramData.posts && instagramData.posts.length > 0;
  const actualPosts = hasRealData ? instagramData.posts : [];

  // サンプル投稿データ
  const postsData = [
    {
      id: 1,
      date: '2025/01/28',
      title: 'Morning coffee ritual and productivity tips...',
      data_24h: {
        reach: 847,
        likes: 186,
        saves: 33,
        profile_visits: 27,
        follows: 6,
        save_rate: '3.9',
        profile_access_rate: '3.2',
        follower_conversion_rate: '22.2',
        home_rate: '32.4'
      },
      data_7d: {
        reach: 1101,
        likes: 242,
        saves: 43,
        profile_visits: 35,
        follows: 8,
        save_rate: '3.9',
        profile_access_rate: '3.2',
        follower_conversion_rate: '22.9',
        home_rate: '35.8'
      },
      rankings: {
        save_rate: 2,
        home_rate: 3,
        profile_access_rate: 3,
        follower_conversion_rate: 1
      }
    },
    {
      id: 2,
      date: '2025/01/25',
      title: 'Weekend adventures in the city...',
      data_24h: {
        reach: 1156,
        likes: 267,
        saves: 51,
        profile_visits: 44,
        follows: 9,
        save_rate: '4.4',
        profile_access_rate: '3.8',
        follower_conversion_rate: '20.5',
        home_rate: '28.9'
      },
      data_7d: {
        reach: 1503,
        likes: 347,
        saves: 66,
        profile_visits: 57,
        follows: 12,
        save_rate: '4.4',
        profile_access_rate: '3.8',
        follower_conversion_rate: '21.1',
        home_rate: '31.2'
      },
      rankings: {
        save_rate: 1,
        home_rate: 4,
        profile_access_rate: 1,
        follower_conversion_rate: 2
      }
    },
    {
      id: 3,
      date: '2025/01/22',
      title: 'Healthy meal prep for busy professionals...',
      data_24h: {
        reach: 693,
        likes: 143,
        saves: 19,
        profile_visits: 16,
        follows: 3,
        save_rate: '2.7',
        profile_access_rate: '2.3',
        follower_conversion_rate: '18.8',
        home_rate: '35.2'
      },
      data_7d: {
        reach: 901,
        likes: 186,
        saves: 25,
        profile_visits: 21,
        follows: 4,
        save_rate: '2.8',
        profile_access_rate: '2.3',
        follower_conversion_rate: '19.0',
        home_rate: '38.1'
      },
      rankings: {
        save_rate: 4,
        home_rate: 2,
        profile_access_rate: 5,
        follower_conversion_rate: 4
      }
    }
  ];

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
          onMouseEnter={(e) => { e.target.style.color = '#c79a42' }}
          onMouseLeave={(e) => { e.target.style.color = '#282828' }}
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
                    @{instagramData?.profile?.username || 'your_username'} • 2025/01/01 - 2025/01/28 • {actualPosts.length || 5}件の投稿を分析
                    {hasRealData && <span style={{ color: '#22c55e', marginLeft: '12px' }}>• リアルタイムデータ</span>}
                    {!hasRealData && <span style={{ color: '#c79a42', marginLeft: '12px' }}>• サンプルデータ</span>}
                  </p>
                </div>
              </div>

              <a
                href="/api/instagram/connect"
                style={{
                  background: 'linear-gradient(135deg, #E4405F, #C13584)',
                  color: '#ffffff',
                  padding: '14px 24px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(228, 64, 95, 0.3)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Users size={16} />
                Instagram連携
              </a>
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

          {/* CSV/Excel出力ボタン */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginTop: '40px' 
          }}>
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
            >
              <Download size={18} />
              Excel形式でダウンロード
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}