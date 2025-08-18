'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const pricingRef = useRef<HTMLElement>(null);

  // スクロールアニメーション
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .scale-in').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // プランセクションへスクロール
  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // ダッシュボードへの移動
  const handleDashboard = async () => {
    if (!session) {
      await signIn('google');
      return;
    }
    router.push('/dashboard');
  };

  // Stripe決済処理
  const handleStartTrial = async (priceId: string, planName: string) => {
    setLoading(priceId);
    
    try {
      console.log('決済開始:', priceId, planName);
      
      // まず認証確認
      if (!session) {
        console.log('未認証のため認証開始');
        await signIn('google');
        setLoading(null);
        return;
      }

      console.log('認証済み、決済API呼び出し');
      
      // 決済API呼び出し
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          planName: planName,
          userId: session.user?.id || session.user?.email,
          userEmail: session.user?.email,
          trialDays: 14
        }),
      });

      console.log('APIレスポンス:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`決済API呼び出しに失敗しました: ${response.status}`);
      }

      const data = await response.json();
      console.log('決済データ:', data);

      if (data.url) {
        console.log('Stripeへリダイレクト:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('決済URLが取得できませんでした');
      }

    } catch (error) {
      console.error('決済エラー:', error);
      alert(`無料トライアル開始中にエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans CJK JP', sans-serif;
          background: linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%);
          color: #282828;
          line-height: 1.6;
        }

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .scale-in {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.6s ease;
        }

        .scale-in.visible {
          opacity: 1;
          transform: scale(1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #c79a42 0%, #b8873b 100%);
          color: #fcfbf8;
          border: none;
          padding: 18px 36px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(199, 154, 66, 0.3);
          position: relative;
          overflow: hidden;
          min-width: 200px;
          text-align: center;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 40px rgba(199, 154, 66, 0.4);
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:active {
          transform: translateY(-1px) scale(0.98);
        }

        .btn-primary:disabled {
          background: #666 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }

        .btn-secondary {
          background: transparent;
          color: #666;
          border: 2px solid rgba(199, 154, 66, 0.3);
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 180px;
          text-align: center;
        }

        .btn-secondary:hover {
          background: rgba(199, 154, 66, 0.1);
          color: #c79a42;
          border-color: rgba(199, 154, 66, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(199, 154, 66, 0.2);
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 36px !important;
          }
          .hero-body {
            font-size: 16px !important;
          }
          .btn-primary {
            width: 100%;
            max-width: 300px;
            padding: 14px 28px;
            font-size: 16px;
          }
          .btn-secondary {
            padding: 12px 24px;
            font-size: 14px;
          }
          .grid-responsive {
            grid-template-columns: 1fr;
          }
          
          /* ヘッダー専用のモバイル対応 */
          .header-nav {
            flex-direction: column !important;
            gap: 16px !important;
            align-items: center !important;
          }
          
          .header-logo {
            font-size: 24px !important;
          }
          
          .header-buttons {
            width: 100% !important;
            justify-content: center !important;
            gap: 12px !important;
          }
          
          .header-buttons button,
          .header-buttons a {
            padding: 10px 20px !important;
            font-size: 14px !important;
          }
        }
      `}</style>

      <div>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.95) 100%)',
          padding: '20px 0',
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          backdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(199, 154, 66, 0.2)',
          boxShadow: '0 4px 20px rgba(199, 154, 66, 0.1)'
        }}>
          <nav className="header-nav" style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="header-logo" style={{
              fontSize: '32px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #c79a42, #b8873b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              InstaSimple Analytics
            </div>
            <div className="header-buttons" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={scrollToPricing}
                disabled={!!loading}
                className="btn-primary"
                style={{ 
                  padding: '12px 24px', 
                  fontSize: '15px',
                  minWidth: '160px'
                }}
              >
                {loading ? '処理中...' : '14日間無料体験'}
              </button>
              <button
                onClick={handleDashboard}
                className="btn-secondary"
                style={{ 
                  padding: '12px 20px', 
                  fontSize: '15px',
                  minWidth: '120px'
                }}
              >
                ダッシュボード
              </button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero" style={{
          background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
          padding: '140px 20px 120px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(199, 154, 66, 0.1) 0%, transparent 50%)',
            zIndex: 0
          }}></div>
          
          <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.15), rgba(199, 154, 66, 0.08))',
              color: '#c79a42',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '40px',
              letterSpacing: '1px',
              border: '1px solid rgba(199, 154, 66, 0.3)'
            }}>
              Instagram自動レポートツール
            </div>

            <h1 style={{
              fontSize: '84px',
              marginBottom: '40px',
              lineHeight: '1.0',
              fontWeight: '900',
              color: '#282828',
              letterSpacing: '-3px'
            }}>
              あなたの投稿、<br />
              成功パターンが<br />
              見えてますか？
            </h1>

            <p className="hero-body" style={{
              fontSize: '22px',
              marginBottom: '60px',
              color: '#555',
              fontWeight: '400',
              lineHeight: '1.7',
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              すぐ伸びる投稿、じわじわ伸びる投稿、<br />
              フォロワーにハマる投稿、新規にハマる投稿。<br />
              あなたのアカウントにはいろんな勝ちパターンがある。<br />
              投稿24時間後<span style={{ color: '#282828' }}>と</span>1週間後の自動レポートで、次の戦略がまるわかり。
            </p>

            <div style={{ marginTop: '60px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={scrollToPricing}
                disabled={!!loading}
                className="btn-primary"
              >
                {loading ? '処理中...' : '14日間無料で体験する'}
              </button>
              <button
                onClick={handleDashboard}
                className="btn-secondary"
              >
                ダッシュボードサンプル
              </button>
            </div>

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              ✓ クレジットカード不要　✓ 即日利用開始　✓ いつでも解約OK
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section style={{ 
          padding: '80px 20px',
          background: 'rgba(252, 251, 248, 1)',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <h2 className="fade-in" style={{
              fontSize: '48px',
              marginBottom: '24px',
              color: '#282828',
              fontWeight: '800',
              textAlign: 'center',
              letterSpacing: '-1px',
              lineHeight: '1.1'
            }}>
              見るべきインサイトは４つだけ
            </h2>
            <p className="fade-in" style={{
              fontSize: '20px',
              marginBottom: '80px',
              color: '#666',
              textAlign: 'center',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}>
              Instagram分析の専門家が「見るべきはこの4つの指標だけ」と断言する指標を完全自動で収集・計算・可視化
            </p>

            <div className="grid-responsive" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px',
              marginTop: '80px'
            }}>
              {[
                { title: '保存率', description: '投稿の質・有益度を測る最重要指標', target: '2-3%' },
                { title: 'フォロワー閲覧率', description: '既存フォロワーとの親密度を測定', target: '40-50%' },
                { title: 'プロフィール<br />アクセス率', description: '新規フォロワー獲得の入り口', target: '2-3%' },
                { title: 'フォロワー転換率', description: 'プロフィール訪問者のフォロー率', target: '5-8%' }
              ].map((metric, index) => (
                <div key={index} className="scale-in" style={{
                  background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(199, 154, 66, 0.2)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '0 12px 30px rgba(199, 154, 66, 0.1)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #c79a42, #d87171)',
                    borderRadius: '20px 20px 0 0'
                  }}></div>
                  <h3 style={{ fontWeight: '700', fontSize: '20px', marginBottom: '12px', color: '#282828' }}>
                    <span dangerouslySetInnerHTML={{ __html: metric.title }}></span>
                  </h3>
                  <p style={{ fontSize: '14px', marginBottom: '20px', color: '#666', lineHeight: '1.5' }}>
                    {metric.description}
                  </p>
                  <span style={{
                    background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                    color: '#fcfbf8',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'inline-block',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    目標値: {metric.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} style={{ 
          padding: '80px 20px', 
          background: 'linear-gradient(180deg, rgba(252, 251, 248, 1) 0%, rgba(249, 248, 246, 0.95) 50%, rgba(252, 251, 248, 1) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <h2 className="fade-in" style={{
              fontSize: '48px',
              marginBottom: '24px',
              color: '#282828',
              fontWeight: '800',
              textAlign: 'center',
              letterSpacing: '-1px',
              lineHeight: '1.1'
            }}>
              アカウントを伸ばす戦略的投資
            </h2>
            <p className="fade-in" style={{
              fontSize: '20px',
              marginBottom: '80px',
              color: '#666',
              textAlign: 'center',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}>
              毎日の工数削減で、投稿クオリティとマネタイズに集中
            </p>

            <div className="grid-responsive" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              marginTop: '80px'
            }}>
              {[
                {
                  name: 'Basic',
                  price: '¥980',
                  description: '1アカウントで始める',
                  features: ['投稿24時間後レポート', '1週間後レポート', '4つの重要指標追跡', '成功パターン分析', '1アカウント対応'],
                  priceId: 'price_1Ro236GPR4IMU9K8fqduI2A8'
                },
                {
                  name: 'Pro',
                  price: '¥1,580',
                  description: '複数アカウントで効率化',
                  features: ['投稿24時間後レポート', '1週間後レポート', '4つの重要指標追跡', '成功パターン分析', '5アカウント対応'],
                  priceId: 'price_1Ro23wGPR4IMU9K8eNBvLeET',
                  popular: true
                },
                {
                  name: 'Enterprise',
                  price: '¥2,980',
                  description: 'チーム・代理店向け',
                  features: ['投稿24時間後レポート', '1週間後レポート', '4つの重要指標追跡', '成功パターン分析', '無制限アカウント'],
                  priceId: 'price_1Ro24CGPR4IMU9K8sxtUnykh'
                }
              ].map((plan, index) => (
                <div key={index} className="scale-in" style={{
                  background: plan.popular 
                    ? 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(199, 154, 66, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: plan.popular ? '2px solid #c79a42' : '1px solid rgba(199, 154, 66, 0.2)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: plan.popular 
                    ? '0 20px 40px rgba(199, 154, 66, 0.2)' 
                    : '0 12px 30px rgba(199, 154, 66, 0.1)',
                  position: 'relative'
                }}>
                  {plan.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                      color: '#fcfbf8',
                      padding: '6px 20px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      人気No.1
                    </div>
                  )}
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                    {plan.name}
                  </h3>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {plan.price}<span style={{ fontSize: '18px', color: '#666' }}>/月</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#c79a42', marginBottom: '24px', fontWeight: '600' }}>
                    {plan.description}
                  </div>
                  <ul style={{ textAlign: 'left', marginBottom: '32px', listStyle: 'none', padding: 0 }}>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{
                        padding: '8px 0',
                        color: '#666',
                        position: 'relative',
                        paddingLeft: '24px',
                        fontSize: '16px'
                      }}>
                        <span style={{
                          color: '#c79a42',
                          fontWeight: '600',
                          position: 'absolute',
                          left: '0'
                        }}>
                          ✓
                        </span>
                        <span dangerouslySetInnerHTML={{ 
                          __html: feature.includes('アカウント対応') || feature.includes('無制限アカウント')
                            ? feature.replace(/(1アカウント対応|5アカウント対応|無制限アカウント)/, '<strong>$1</strong>')
                            : feature
                        }}></span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handleStartTrial(plan.priceId, plan.name)} 
                    disabled={loading === plan.priceId} 
                    className="btn-primary"
                    style={{
                      width: '100%',
                      fontSize: '16px'
                    }}
                  >
                    {loading === plan.priceId ? '処理中...' : '14日間無料で始める'}
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <button
                onClick={handleDashboard}
                className="btn-secondary"
              >
                ダッシュボードサンプル
              </button>
              <p style={{ fontSize: '14px', color: '#999', marginTop: '16px' }}>
                実際の分析画面をご覧いただけます
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '100px 20px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(252, 251, 248, 1) 0%, rgba(249, 248, 246, 0.95) 50%, rgba(252, 251, 248, 1) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <h2 className="fade-in" style={{
              fontSize: '48px',
              fontWeight: '800',
              marginBottom: '24px',
              color: '#282828',
              lineHeight: '1.2'
            }}>
              あなたの勝ちパターンを<br />見つけませんか？
            </h2>
            <p className="fade-in" style={{
              fontSize: '20px',
              color: '#666',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              14日間の無料体験で、投稿の成功パターンが見える快感を体験してください。
            </p>
            <div style={{ marginTop: '48px' }}>
              <button
                onClick={scrollToPricing}
                className="btn-primary"
              >
                14日間無料で体験する
              </button>
            </div>
            <div className="fade-in" style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
              ✓ クレジットカード不要　✓ 即日利用開始　✓ いつでも解約OK
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ 
          background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.8) 0%, rgba(40, 40, 40, 0.9) 100%)', 
          color: '#fcfbf8', 
          padding: '80px 20px 40px', 
          textAlign: 'center',
          borderTop: '1px solid rgba(199, 154, 66, 0.2)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginBottom: '32px',
              flexWrap: 'wrap'
            }}>
              {['ダッシュボード', '利用規約', 'プライバシーポリシー', 'サポート', '会社概要'].map((link, index) => (
                <a key={index} href={link === 'ダッシュボード' ? '/dashboard' : '#'} style={{
                  color: 'rgba(252, 251, 248, 0.8)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s'
                }}>
                  {link}
                </a>
              ))}
            </div>
            <p style={{ color: 'rgba(252, 251, 248, 0.6)', fontSize: '14px' }}>
              © 2025 InstaSimple Analytics. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}