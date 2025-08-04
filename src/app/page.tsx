export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
      color: '#282828',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #c79a42, #b8873b)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 20px rgba(199, 154, 66, 0.3)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #fcfbf8',
            borderRadius: '8px'
          }} />
        </div>
        
        <h1 style={{
          fontSize: '48px',
          fontWeight: '900',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #c79a42, #b8873b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-1px'
        }}>
          InstaSimple Analytics
        </h1>
        
        <p style={{
          fontSize: '24px',
          color: '#666',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Instagram分析をシンプルに、効果的に
        </p>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.1) 0%, rgba(199, 154, 66, 0.05) 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          marginBottom: '32px'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#c79a42',
            marginBottom: '8px'
          }}>
            🔧 システムメンテナンス中
          </h2>
          <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
            現在、認証システムの調整を行っております。<br />
            しばらくお待ちください。
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#282828', marginBottom: '4px' }}>
              保存率分析
            </h3>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              目標3.0%以上
            </p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👁️</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#282828', marginBottom: '4px' }}>
              ホーム率分析
            </h3>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              目標50.0%以上
            </p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.9) 0%, rgba(231, 230, 228, 0.8) 100%)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#282828', marginBottom: '4px' }}>
              フォロワー転換率
            </h3>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              目標8.0%以上
            </p>
          </div>
        </div>
        
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <p style={{ fontSize: '14px', color: '#22c55e', margin: 0 }}>
            ✅ サイトの基本構造は正常に動作しています
          </p>
        </div>
      </div>
    </div>
  );
}