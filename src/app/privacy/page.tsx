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
            InstaSimple Analytics - 最終更新日: 2025年8月4日
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
              当サービスをご利用いただく際に、以下の情報を収集いたします：
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
              <li>ユーザーサポートの提供</li>
              <li>利用規約違反の防止</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              情報の共有と開示
            </h2>
            <p style={{ marginBottom: '16px' }}>
              当サービスは、以下の場合を除き、お客様の個人情報を第三者と共有することはありません：
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>法律または法的手続きにより要求された場合</li>
              <li>当社の権利、財産、安全を保護するため</li>
              <li>お客様の明示的な同意がある場合</li>
            </ul>
            <p>
              マーケティング目的で個人情報を第三者に販売、賃貸、取引することはありません。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              データセキュリティ
            </h2>
            <p>
              お客様のデータを不正アクセス、改ざん、開示、破壊から保護するため、業界標準のセキュリティ対策を実施しています。
              これには暗号化、セキュアサーバー、定期的なセキュリティ監査が含まれます。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              データ保持
            </h2>
            <p>
              サービス提供に必要な期間、または法律で要求される期間のみ、お客様の情報を保持いたします。
              いつでもデータの削除をご要求いただけます。お問い合わせください。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              お客様の権利
            </h2>
            <p style={{ marginBottom: '16px' }}>
              個人情報に関して、以下の権利をお持ちです：
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>アクセス権：個人データへのアクセス要求</li>
              <li>訂正権：不正確なデータの訂正要求</li>
              <li>削除権：データの削除要求</li>
              <li>データポータビリティ権：データの移転要求</li>
              <li>同意撤回権：データ処理の同意撤回</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Instagramデータの利用
            </h2>
            <p>
              本アプリケーションはInstagram APIを使用してお客様のInstagramコンテンツにアクセスします。
              お客様が明示的に許可した公開データとインサイトのみにアクセスします。
              Instagramアカウント設定からいつでもアクセスを取り消すことができます。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              ポリシーの変更
            </h2>
            <p>
              当プライバシーポリシーは随時更新される場合があります。変更がある場合は、
              このページに新しいプライバシーポリシーを掲載し、「最終更新日」を更新してお知らせいたします。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              お問い合わせ
            </h2>
            <p>
              このプライバシーポリシーについてご質問がございましたら、以下までお問い合わせください：<br />
              Email: info@thorsync.com<br />
              所在地: 日本
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