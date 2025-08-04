'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get('session_id');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/stripe/session?session_id=${session_id}`)
        .then(res => res.json())
        .then(data => {
          setSession(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session_id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          textAlign: 'center',
          boxShadow: '0 12px 30px rgba(199, 154, 66, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #c79a42',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>決済情報を確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
          padding: '60px',
          borderRadius: '24px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(199, 154, 66, 0.15)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #c79a42, #b8873b)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            boxShadow: '0 8px 25px rgba(199, 154, 66, 0.3)'
          }}>
            <span style={{ fontSize: '40px' }}>✅</span>
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '16px',
            color: '#282828',
            letterSpacing: '-1px'
          }}>
            決済が完了しました！
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            InstaSimpleへようこそ！<br />
            14日間の無料トライアルが開始されました。
          </p>

          {session && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(199, 154, 66, 0.05) 100%)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px',
              border: '1px solid rgba(199, 154, 66, 0.2)'
            }}>
              <h3 style={{ color: '#c79a42', marginBottom: '10px', fontSize: '16px' }}>
                ご契約プラン
              </h3>
              <p style={{ color: '#282828', fontWeight: '600', fontSize: '18px', margin: 0 }}>
                {session.metadata?.plan || 'Basic'} プラン
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)',
                color: '#fcfbf8',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(199, 154, 66, 0.3)'
              }}
            >
              ダッシュボードへ
            </button>

            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#666',
                border: '2px solid rgba(199, 154, 66, 0.3)',
                padding: '14px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ホームに戻る
            </button>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#999',
            marginTop: '30px',
            lineHeight: '1.5'
          }}>
            ご不明な点がございましたら、<br />
            サポートまでお気軽にお問い合わせください。
          </p>
        </div>
      </div>
    </>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)'
      }}>
        <div>Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}