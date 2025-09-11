'use client';

import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
            利用規約
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
                第1条（適用）
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                本規約は、InstaSimple Analytics（以下「当社」といいます）が提供するInstagram分析サービス「InstaSimple」（以下「本サービス」といいます）の利用条件を定めるものです。登録ユーザーの皆さま（以下「ユーザー」といいます）には、本規約に従って本サービスをご利用いただきます。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第2条（利用登録）
              </h2>
              <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>
                  本サービスの利用を希望する方は、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
                </li>
                <li style={{ marginBottom: '12px' }}>
                  当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当社が利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第3条（ユーザーIDおよびパスワードの管理）
              </h2>
              <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>
                  ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
                </li>
                <li style={{ marginBottom: '12px' }}>
                  ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
                </li>
              </ol>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第4条（利用料金および支払方法）
              </h2>
              <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>
                  ユーザーは、本サービスの利用にあたり、当社が別途定め、本サービス内に表示する利用料金を、当社が指定する方法により支払うものとします。
                </li>
                <li style={{ marginBottom: '12px' }}>
                  14日間の無料トライアル期間終了後、自動的に有料プランに移行します。
                </li>
                <li style={{ marginBottom: '12px' }}>
                  ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14.6％の割合による遅延損害金を支払うものとします。
                </li>
              </ol>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第5条（禁止事項）
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '12px' }}>
                ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
                <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>本サービスによって得られた情報を商業的に利用する行為</li>
                <li>当社のサービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正な目的を持って本サービスを利用する行為</li>
                <li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第6条（本サービスの提供の停止等）
              </h2>
              <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>
                  当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                    <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                    <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                    <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                  </ul>
                </li>
                <li>
                  当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
                </li>
              </ol>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第7条（利用制限および登録抹消）
              </h2>
              <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>
                  当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    <li>本規約のいずれかの条項に違反した場合</li>
                    <li>登録事項に虚偽の事実があることが判明した場合</li>
                    <li>料金等の支払債務の不履行があった場合</li>
                    <li>当社からの連絡に対し、一定期間返答がない場合</li>
                    <li>本サービスについて、最終の利用から一定期間利用がない場合</li>
                    <li>その他、当社が本サービスの利用を適当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第8条（退会）
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第9条（保証の否認および免責事項）
              </h2>
              <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>
                  当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                </li>
                <li style={{ marginBottom: '12px' }}>
                  当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。
                </li>
                <li style={{ marginBottom: '12px' }}>
                  当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
                </li>
              </ol>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第10条（サービス内容の変更等）
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                当社は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第11条（利用規約の変更）
              </h2>
              <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>
                  当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    <li>本規約の変更がユーザーの一般の利益に適合するとき</li>
                    <li>本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき</li>
                  </ul>
                </li>
                <li>
                  当社はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨および変更後の本規約の内容並びにその効力発生時期を通知します。
                </li>
              </ol>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第12条（個人情報の取扱い）
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第13条（通知または連絡）
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第14条（権利義務の譲渡の禁止）
              </h2>
              <p style={{ color: '#555', lineHeight: '1.8' }}>
                ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#282828' }}>
                第15条（準拠法・裁判管轄）
              </h2>
              <ol style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '12px' }}>
                  本規約の解釈にあたっては、日本法を準拠法とします。
                </li>
                <li>
                  本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                </li>
              </ol>
            </section>

            <div style={{
              marginTop: '48px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(199, 154, 66, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', fontSize: '14px' }}>
                以上
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