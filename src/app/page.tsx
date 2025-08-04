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
      <div style={{ maxWidth: '800px' }}>
        <div style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #c79a42, #b8873b)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 12px 30px rgba(199, 154, 66, 0.3)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid #fcfbf8',
            borderRadius: '12px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '8px',
              width: '24px',
              height: '3px',
              background: '#fcfbf8',
              borderRadius: '2px'
            }} />
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '8px',
              width: '32px',
              height: '3px',
              background: '#fcfbf8',
              borderRadius: '2px'
            }} />
            <div style={{
              position: 'absolute',
              top: '28px',
              left: '8px',
              width: '20px',
              height: '3px',
              background: '#fcfbf8',
              borderRadius: '2px'
            }} />
          </div>
        </div>
        
        <h1 style={{
          fontSize: '56px',
          fontWeight: '900',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #c79a42, #b8873b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-2px',
          lineHeight: '1.1'
        }}>
          InstaSimple Analytics
        </h1>
        
        <p style={{
          fontSize: '28px',
          color: '#666',
          marginBottom: '48px',
          lineHeight: '1.4',
          fontWeight: '300'
        }}>
          Instagram分析を<br />シンプルに、効果的に
        </p>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(199, 154, 66, 0.15) 0%, rgba(199, 154, 66, 0.08) 100%)',
          padding: '32px',
          borderRadius: '20px',
          border: '1px solid rgba(199, 154, 66, 0.3)',
          marginBottom: '48px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#c79a42',
            marginBottom: '16px'
          }}>
            🚀 サイト復旧完了！
          </h2>
          <p style={{ fontSize: '18px', color: '#666', margin: 0, lineHeight: '1.6' }}>
            InstaSimple Analyticsが正常に動作しています。<br />
            認証機能とダッシュボード機能は現在調整中です。
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.85) 100%)',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(199, 154, 66, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#282828', marginBottom: '8px' }}>
              保存率分析
            </h3>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
              目標3.0%以上で<br />優良コンテンツを判定
            </p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.85) 100%)',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(199, 154, 66, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👁️</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#282828', marginBottom: '8px' }}>
              ホーム率分析
            </h3>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
              目標50.0%以上で<br />アクティブなフォロワー
            </p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(252, 251, 248, 0.95) 0%, rgba(231, 230, 228, 0.85) 100%)',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(199, 154, 66, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#282828', marginBottom: '8px' }}>
              フォロワー転換率
            </h3>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
              目標8.0%以上で<br />確実な成長を実現
            </p>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
          padding: '24px 32px',
          borderRadius: '16px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <p style={{ 
            fontSize: '18px', 
            color: '#22c55e', 
            margin: 0,
            fontWeight: '600'
          }}>
            ✅ Vercelデプロイ成功 | Next.js 15.4.1 | 本番環境稼働中
          </p>
        </div>
      </div>
    </div>
  );
}