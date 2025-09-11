'use client';

import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

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

        .btn-secondary {
          background: transparent;
          color: #666;
          border: 2px solid rgba(199, 154, 66, 0.3);
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover {
          background: rgba(199, 154, 66, 0.1);
          color: #c79a42;
          border-color: rgba(199, 154, 66, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(199, 154, 66, 0.2);
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          <nav style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div 
              onClick={() => router.push('/')}
              style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #c79a42, #b8873b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                cursor: 'pointer'
              }}
            >
              InstaSimple
            </div>
            <button
              onClick={() => router.push('/')}
              className="btn-secondary"
            >
              トップに戻る
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main style={{ 
          flex: 1, 
          paddingTop: '120px', 
          paddingBottom: '80px',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '120px 20px 80px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '40px',
            color: '#282828',
            textAlign: 'center'
          }}>
            プライバシーポリシー
          </h1>

          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(199, 154, 66, 0.2)',
            boxShadow: '0 12px 30px rgba(199, 154, 66, 0.1)'
          }}>
            <p style={{ marginBottom: '24px', color: '#666' }}>
              最終更新日: 2025年1月11日
            </p>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                1. はじめに
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                InstaSimple Analytics（以下「当社」といいます）は、お客様のプライバシーを尊重し、個人情報の保護に努めています。
                本プライバシーポリシーは、当社が提供するInstagram分析サービス「InstaSimple」（以下「本サービス」といいます）において、
                お客様の個人情報をどのように収集、使用、保護するかについて説明します。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                2. 収集する情報
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '12px' }}>
                当社は、本サービスの提供にあたり、以下の情報を収集いたします：
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>アカウント情報：</strong>Googleアカウント認証情報（メールアドレス、氏名、プロフィール画像）
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Instagram情報：</strong>公開プロフィール情報、投稿データ、インサイトデータ（リーチ、インプレッション、エンゲージメント等）
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>利用情報：</strong>アクセスログ、IPアドレス、ブラウザ情報、デバイス情報
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>決済情報：</strong>Stripe経由で処理される決済情報（当社はクレジットカード番号を直接保存しません）
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                3. 情報の利用目的
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '12px' }}>
                収集した情報は以下の目的で利用いたします：
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li>Instagram投稿の分析レポート作成および提供</li>
                <li>本サービスの提供、維持、改善</li>
                <li>カスタマーサポートの提供</li>
                <li>サービスに関する重要な通知の送信</li>
                <li>利用統計の分析とサービス改善</li>
                <li>不正利用の防止とセキュリティの確保</li>
                <li>法的要求への対応</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                4. 情報の共有と開示
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '12px' }}>
                当社は、以下の場合を除き、お客様の個人情報を第三者に販売、貸与、または開示することはありません：
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>お客様の同意がある場合：</strong>お客様の明示的な同意を得た場合
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>サービス提供者：</strong>本サービスの運営に必要な業務委託先（ホスティング、分析ツール等）と共有する場合。
                  これらの提供者は、当社の指示に従い、本プライバシーポリシーに準じて情報を取り扱います
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>法的要求：</strong>法令、規制、法的手続き、政府機関の要求に応じる場合
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>権利の保護：</strong>当社、お客様、または公衆の権利、財産、安全を保護するために必要な場合
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                5. データセキュリティ
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                当社は、お客様の個人情報を不正アクセス、改ざん、開示、破壊から保護するため、以下のセキュリティ対策を実施しています：
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8', marginTop: '12px' }}>
                <li>SSL/TLS暗号化による通信の保護</li>
                <li>アクセス制御と認証システムの実装</li>
                <li>定期的なセキュリティ監査と脆弱性テスト</li>
                <li>従業員への情報セキュリティ教育</li>
              </ul>
              <p style={{ color: '#555', lineHeight: '1.8', marginTop: '12px' }}>
                ただし、インターネット上の通信は100%安全ではないため、絶対的なセキュリティを保証することはできません。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                6. データの保存期間
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                当社は、以下の基準に従って個人情報を保存します：
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8', marginTop: '12px' }}>
                <li>アカウントが有効な期間中は継続して保存</li>
                <li>サービス退会後は、法的義務がない限り90日以内に削除</li>
                <li>法令で定められた期間がある場合は、その期間保存</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                7. お客様の権利
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '12px' }}>
                お客様は、ご自身の個人情報に関して以下の権利を有します：
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>アクセス権：</strong>保有する個人情報へのアクセスと複製の要求
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>訂正権：</strong>不正確または不完全な個人情報の訂正要求
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>削除権：</strong>個人情報の削除要求（忘れられる権利）
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>処理制限権：</strong>個人情報の処理制限要求
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>データポータビリティ権：</strong>構造化された機械可読形式でのデータ受領
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>異議申立権：</strong>個人情報の処理に対する異議申立
                </li>
              </ul>
              <p style={{ color: '#555', lineHeight: '1.8', marginTop: '12px' }}>
                これらの権利を行使する場合は、下記のお問い合わせ先までご連絡ください。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                8. Cookieとトラッキング技術
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                当社は、サービスの改善とユーザー体験の向上のため、Cookie及び類似の技術を使用しています：
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8', marginTop: '12px' }}>
                <li>
                  <strong>必須Cookie：</strong>サービスの基本機能とセキュリティに必要
                </li>
                <li>
                  <strong>分析Cookie：</strong>サービスの利用状況を分析し改善するため
                </li>
                <li>
                  <strong>機能Cookie：</strong>ユーザー設定を記憶するため
                </li>
              </ul>
              <p style={{ color: '#555', lineHeight: '1.8', marginTop: '12px' }}>
                ブラウザの設定によりCookieを無効にすることができますが、一部の機能が利用できなくなる場合があります。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                9. 第三者サービスとの連携
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                本サービスは以下の第三者サービスと連携しています：
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8', marginTop: '12px' }}>
                <li>
                  <strong>Google認証：</strong>ログイン認証のため
                </li>
                <li>
                  <strong>Instagram API：</strong>投稿データとインサイトの取得のため
                </li>
                <li>
                  <strong>Stripe：</strong>決済処理のため
                </li>
              </ul>
              <p style={{ color: '#555', lineHeight: '1.8', marginTop: '12px' }}>
                これらのサービスには、それぞれのプライバシーポリシーが適用されます。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                10. 児童のプライバシー
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                本サービスは13歳未満の児童を対象としていません。13歳未満の方から意図的に個人情報を収集することはありません。
                13歳未満の方が個人情報を提供したことが判明した場合、速やかに削除いたします。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                11. 国際データ転送
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                お客様の情報は、日本国内のサーバーで処理・保存されます。サービス提供のため、
                お客様の居住国とは異なる国で情報が処理される場合がありますが、
                その場合も本プライバシーポリシーに従って適切に保護されます。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                12. プライバシーポリシーの変更
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                当社は、法令の変更、サービスの変更、その他の理由により、本プライバシーポリシーを変更することがあります。
                重要な変更がある場合は、サービス内での通知またはメールでお知らせいたします。
                変更後も継続してサービスをご利用いただく場合は、変更後のプライバシーポリシーに同意したものとみなされます。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                13. お問い合わせ
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                本プライバシーポリシーに関するご質問、ご意見、または個人情報に関するお問い合わせは、以下までご連絡ください：
              </p>
              <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(199, 154, 66, 0.1)', borderRadius: '8px' }}>
                <p style={{ color: '#555', lineHeight: '1.8' }}>
                  <strong>InstaSimple Analytics</strong><br />
                  メール: privacy@instasimple.com<br />
                  所在地: 日本
                </p>
              </div>
            </section>

            <div style={{
              marginTop: '48px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(199, 154, 66, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', fontSize: '14px' }}>
                発効日: 2025年1月11日<br />
                最終更新日: 2025年1月11日
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ 
          background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.8) 0%, rgba(40, 40, 40, 0.9) 100%)', 
          color: '#fcfbf8', 
          padding: '40px 20px', 
          textAlign: 'center',
          borderTop: '1px solid rgba(199, 154, 66, 0.2)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p style={{ color: 'rgba(252, 251, 248, 0.6)', fontSize: '14px' }}>
              © 2025 InstaSimple Analytics. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}