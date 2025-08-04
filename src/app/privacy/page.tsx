export default function PrivacyPage() {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
        color: '#282828',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#282828',
              marginBottom: '16px'
            }}>
              プライバシーポリシー
            </h1>
            <p style={{ fontSize: '16px', color: '#666' }}>
              InstaSimple Analytics
            </p>
          </header>
  
          <div style={{
            background: 'rgba(252, 251, 248, 0.9)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            lineHeight: '1.8'
          }}>
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
                収集する情報
              </h2>
              <p style={{ marginBottom: '16px' }}>
                当サービスでは、以下の情報を収集いたします：
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Googleアカウント情報（認証のため）</li>
                <li>Instagram公開プロフィール情報</li>
                <li>Instagram投稿のインサイトデータ</li>
                <li>サービス利用状況の分析データ</li>
              </ul>
            </section>
  
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
                情報の利用目的
              </h2>
              <p style={{ marginBottom: '16px' }}>
                収集した情報は以下の目的で利用いたします：
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Instagram分析レポートの提供</li>
                <li>サービスの改善・最適化</li>
                <li>ユーザーサポート</li>
                <li>利用規約違反の防止</li>
              </ul>
            </section>
  
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
                情報の共有
              </h2>
              <p>
                当サービスは、法的要請がある場合を除き、お客様の個人情報を第三者と共有することはありません。
              </p>
            </section>
  
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
                データの保護
              </h2>
              <p>
                お客様のデータは、業界標準のセキュリティ対策により保護されています。
                不正アクセス、改ざん、漏洩を防ぐため、適切な技術的・組織的措置を講じています。
              </p>
            </section>
  
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
                お問い合わせ
              </h2>
              <p>
                プライバシーポリシーに関するご質問は、以下までお問い合わせください：<br />
                Email: support@thorsync.com
              </p>
            </section>
  
            <footer style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(199, 154, 66, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#666' }}>
                最終更新日: 2025年8月4日
              </p>
            </footer>
          </div>
        </div>
      </div>
    );
  }