'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SignInContent() {
  const [providers, setProviders] = useState<any>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/insta-simple/dashboard';
  const error = searchParams.get('error');

  useEffect(() => {
    const getAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    getAuthProviders();
  }, []);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.95) 100%)',
        padding: '20px 0',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(199, 154, 66, 0.2)',
        boxShadow: '0 4px 20px rgba(199, 154, 66, 0.1)'
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="/insta-simple" style={{
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #c79a42, #b8873b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none'
          }}>
            InstaSimple
          </a>
          <a href="/insta-simple" className="btn-secondary" style={{ 
            padding: '12px 20px', 
            fontSize: '15px',
            minWidth: '120px'
          }}>
            ホームに戻る
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(199, 154, 66, 0.04) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(199, 154, 66, 0.06) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
          padding: '60px',
          borderRadius: '24px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 20px 40px rgba(199, 154, 66, 0.15)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.15), rgba(199, 154, 66, 0.08))',
            color: '#c79a42',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '32px',
            letterSpacing: '1px',
            border: '1px solid rgba(199, 154, 66, 0.3)'
          }}>
            ログインしてご利用開始
          </div>

          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            marginBottom: '24px',
            color: '#282828',
            lineHeight: '1.2'
          }}>
            InstaSimpleへ<br />ようこそ
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Googleアカウントでかんたんログイン<br />
            14日間無料でお試しいただけます
          </p>

          {error && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(216, 113, 113, 0.15) 0%, rgba(216, 113, 113, 0.05) 100%)',
              color: '#d87171',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '32px',
              fontSize: '14px',
              border: '1px solid rgba(216, 113, 113, 0.2)'
            }}>
              ログインに失敗しました。もう一度お試しください。
            </div>
          )}

          <button 
            onClick={handleGoogleSignIn}
            className="btn-primary"
            style={{
              width: '100%',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
            </svg>
            Googleでログイン
          </button>

          <div style={{ marginTop: '24px', fontSize: '14px', color: '#666' }}>
            ✓ クレジットカード不要　✓ 即日利用開始　✓ いつでも解約OK
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignIn() {
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

        .btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 40px rgba(199, 154, 66, 0.4);
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
      `}</style>

      <Suspense fallback={<div>Loading...</div>}>
        <SignInContent />
      </Suspense>
    </>
  );
}