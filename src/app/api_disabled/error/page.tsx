'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'サーバーの設定に問題があります。';
      case 'AccessDenied':
        return 'アクセスが拒否されました。';
      case 'Verification':
        return 'トークンの有効期限が切れているか無効です。';
      default:
        return 'ログイン中にエラーが発生しました。';
    }
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
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
          padding: '60px',
          borderRadius: '24px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 20px 40px rgba(199, 154, 66, 0.15)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(216, 113, 113, 0.2), rgba(216, 113, 113, 0.1))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            fontSize: '32px'
          }}>
            ⚠️
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '16px',
            color: '#282828'
          }}>
            ログインエラー
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            {getErrorMessage(error)}
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/insta-simple/auth/signin" className="btn-primary">
              ログインをやり直す
            </a>
            <a href="/insta-simple" className="btn-secondary">
              ホームに戻る
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthError() {
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
        <ErrorContent />
      </Suspense>
    </>
  );
}