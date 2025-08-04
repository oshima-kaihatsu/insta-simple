 
import React from 'react';
import { Instagram, Phone, MapPin, Mail, Shield, BarChart3, Users, TrendingUp, CheckCircle } from 'lucide-react';

export default function BusinessLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Instagram className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">InstaSimple</h1>
                <p className="text-sm text-gray-600">Instagram分析ツール</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">お問い合わせ</p>
              <p className="font-semibold text-gray-900">06-6905-6005</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Instagram分析を<br />
              <span className="text-purple-600">シンプルに</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              InstaSimpleは、Instagram運用を効率化する分析ツールです。<br />
              複雑な設定は不要。誰でも簡単に始められます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
                無料で始める
              </button>
              <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold">
                機能を見る
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">主な機能</h3>
            <p className="text-xl text-gray-600">Instagram運用に必要な機能をすべて提供</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">詳細分析</h4>
              <p className="text-gray-600">フォロワー数、エンゲージメント率、投稿パフォーマンスを詳細に分析</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">成長追跡</h4>
              <p className="text-gray-600">アカウントの成長傾向をグラフで可視化し、改善点を特定</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">フォロワー分析</h4>
              <p className="text-gray-600">フォロワーの属性や行動パターンを分析し、効果的な投稿戦略を提案</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">料金プラン</h3>
            <p className="text-xl text-gray-600">あなたに最適なプランをお選びください</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Basic</h4>
              <div className="text-3xl font-bold text-gray-900 mb-4">¥980<span className="text-lg text-gray-600">/月</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />基本分析</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />月次レポート</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />3アカウントまで</li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold">
                Basicを選択
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  人気
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Pro</h4>
              <div className="text-3xl font-bold text-gray-900 mb-4">¥2,980<span className="text-lg text-gray-600">/月</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />詳細分析</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />日次レポート</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />無制限アカウント</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />AIアドバイス</li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold">
                Proを選択
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h4>
              <div className="text-3xl font-bold text-gray-900 mb-4">¥9,800<span className="text-lg text-gray-600">/月</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />すべてのPro機能</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />カスタムレポート</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />API アクセス</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />専用サポート</li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold">
                Enterpriseを選択
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">会社情報</h3>
            <p className="text-xl text-gray-600">安心してご利用いただくための企業情報</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">事業者情報</h4>
                <div className="space-y-3">
                <div className="flex items-start">
  <Shield className="h-5 w-5 text-gray-600 mr-3 mt-1" />
  <div>
    <p className="font-medium text-gray-900">事業内容</p>
    <p className="text-gray-600">フリーランス（ライティング・ソフトウェア開発）</p>
  </div>
</div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">所在地</p>
                      <p className="text-gray-600">〒570-0016<br />大阪府守口市大日東町</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">電話番号</p>
                      <p className="text-gray-600">06-6905-6005</p>
                      <p className="text-sm text-gray-500">営業時間：平日 9:00-18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">メール</p>
                      <p className="text-gray-600">info@thorsync.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">サービス概要</h4>
                <div className="space-y-4">
                <div>
  <p className="font-medium text-gray-900">主要事業</p>
  <p className="text-gray-600">
    フリーランス事業（ライティング・ソフトウェア開発）<br />
    Instagram分析ツール「InstaSimple」の開発・運営<br />
    SNSマーケティング支援サービス
  </p>
</div>
                  
                  <div>
                    <p className="font-medium text-gray-900">サービス開始</p>
                    <p className="text-gray-600">2025年1月</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900">対象ユーザー</p>
                    <p className="text-gray-600">
                      個人事業主、中小企業、マーケティング担当者<br />
                      Instagram運用に関わるすべての方
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Terms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">プライバシーポリシー</h4>
              <p className="text-gray-600 mb-4">
                InstaSimpleは、お客様の個人情報を適切に管理し、以下の目的でのみ使用いたします：
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• サービスの提供・運営</li>
                <li>• お客様サポート</li>
                <li>• サービス改善のための分析</li>
                <li>• 重要なお知らせの配信</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">利用規約</h4>
              <p className="text-gray-600 mb-4">
                InstaSimpleをご利用いただく際の基本的な規約：
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 商用利用可能</li>
                <li>• データの適切な使用</li>
                <li>• 月額制サブスクリプション</li>
                <li>• いつでもキャンセル可能</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">お問い合わせ</h3>
            <p className="text-xl text-gray-600">ご質問やご相談がございましたら、お気軽にお問い合わせください</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-8 text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Phone className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">電話</h4>
                <p className="text-gray-600">06-6905-6005</p>
                <p className="text-sm text-gray-500">平日 9:00-18:00</p>
              </div>
              
              <div>
                <Mail className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">メール</h4>
                <p className="text-gray-600">info@thorsync.com</p>
                <p className="text-sm text-gray-500">24時間受付</p>
              </div>
              
              <div>
                <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">所在地</h4>
                <p className="text-gray-600">大阪府守口市大日東町</p>
                <p className="text-sm text-gray-500">郵便番号：570-0016</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Instagram className="h-8 w-8 text-purple-500 mr-3" />
                <span className="text-2xl font-bold">InstaSimple</span>
              </div>
              <p className="text-gray-400 mb-4">
                Instagram分析をシンプルに。誰でも簡単に始められる分析ツールです。
              </p>
              <div className="space-y-2 text-sm text-gray-400">
  <p>事業内容:フリーランス（ライティング・ソフトウェア開発）</p>
  <p>所在地:大阪府守口市大日東町</p>
                <p>電話：06-6905-6005</p>
                <p>メール：info@thorsync.com</p>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">サービス</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Instagram分析</li>
                <li>レポート作成</li>
                <li>AIアドバイス</li>
                <li>成長追跡</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">サポート</h5>
              <ul className="space-y-2 text-gray-400">
                <li>お問い合わせ</li>
                <li>利用規約</li>
                <li>プライバシーポリシー</li>
                <li>よくある質問</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 InstaSimple. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}