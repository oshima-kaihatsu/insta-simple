'use client';

import { useEffect } from 'react';

export default function ApiAuthError() {
  useEffect(() => {
    // 即座に正しいエラーページにリダイレクト
    window.location.href = 'https://thorsync.com/insta-simple/auth/error';
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'system-ui',
      background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '16px', fontSize: '24px' }}>🔄</div>
        <div style={{ color: '#666' }}>リダイレクトしています...</div>
      </div>
    </div>
  );
}