import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              ホームに戻る
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">プライバシーポリシー</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose max-w-none">
          
          {/* Introduction */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">お客様の個人情報保護について</h2>
            </div>
            <p className="text-gray-700">
              InstaSimpleは、お客様の個人情報の保護を重要な責務と考え、個人情報保護法及び関連法令を遵守し、
              お客様の個人情報を適切に取り扱います。
            </p>
          </div>

          {/* 収集する情報 */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Database className="h-5 w-5 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">1. 収集する個人情報</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="mb-4 text-gray-700">当サービスでは、以下の個人情報を収集する場合があります：</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>氏名、メールアドレス、電話番号</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Instagramアカウント情報（公開情報のみ）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>決済に関する情報（クレジットカード情報は第三者決済会社で管理）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>サービス利用状況（アクセスログ、IPアドレス等）</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 利用目的 */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Eye className="h-5 w-5 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">2. 個人情報の利用目的</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="mb-4 text-gray-700">収集した個人情報は、以下の目的で利用いたします：</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>サービスの提供・運営</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>お客様サポート・お問い合わせへの対応</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>サービス改善のための分析</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>重要なお知らせの通信</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>利用規約違反の調査・対応</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 第三者提供 */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Lock className="h-5 w-5 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">3. 第三者への提供</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="mb-4 text-gray-700">
                当社は、以下の場合を除き、お客様の同意なく個人情報を第三者に提供することはありません：
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>法令に基づく場合</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>人の生命、身体又は財産の保護のために必要がある場合</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>国の機関若しくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</span>
                </li>
              </ul>
            </div>
          </section>

          {/* セキュリティ */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">4. 個人情報のセキュリティ</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                当社は、個人情報の漏洩、滅失、毀損を防止するため、適切な安全管理措置を講じます。
                また、個人情報を取り扱う従業者に対して、必要かつ適切な監督を行います。
              </p>
            </div>
          </section>

          {/* Cookie */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Cookieについて</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                当サービスでは、サービスの向上のためCookieを使用する場合があります。
                Cookieは、お客様のブラウザに保存される小さなデータファイルです。
              </p>
              <p className="text-gray-700">
                お客様はブラウザの設定によりCookieの受け取りを拒否することができますが、
                その場合はサービスの一部機能が利用できない可能性があります。
              </p>
            </div>
          </section>

          {/* 開示・訂正・削除 */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6. 個人情報の開示・訂正・削除</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                お客様は、当社が保有するお客様の個人情報について、開示、訂正、利用停止、削除を求めることができます。
              </p>
              <p className="text-gray-700">
                ご請求の際は、本人確認のための書類の提示をお願いする場合があります。
                お問い合わせは、下記連絡先までご連絡ください。
              </p>
            </div>
          </section>

          {/* 連絡先 */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">7. お問い合わせ先</h3>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>メール：</strong> info@thorsync.com
              </p>
              <p className="text-gray-700">
                <strong>受付時間：</strong> 平日 9:00-18:00
              </p>
            </div>
          </section>

          {/* 改定 */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">8. プライバシーポリシーの改定</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                当社は、法令の変更やサービス内容の変更等に伴い、本プライバシーポリシーを改定する場合があります。
                改定した場合は、当サービス上で通知いたします。
              </p>
            </div>
          </section>

          {/* 施行日 */}
          <div className="text-center text-gray-600 text-sm mt-12 pt-8 border-t">
            <p>制定日：2025年1月15日</p>
            <p>最終更新日：2025年1月15日</p>
          </div>

        </div>
      </div>
    </div>
  );
}