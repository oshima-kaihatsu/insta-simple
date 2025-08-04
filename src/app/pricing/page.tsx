'use client';

import { useState } from 'react';
import { Check, Loader2, Instagram, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// 一時的にPRICING_PLANSを直接定義
const PRICING_PLANS = {
  basic: {
    name: 'Basic',
    price: 980,
    priceDisplay: '¥980',
    features: [
      '基本的な分析データ',
      '週次レポート',
      '3アカウントまで',
      'メールサポート'
    ]
  },
  pro: {
    name: 'Pro',
    price: 2980,
    priceDisplay: '¥2,980',
    features: [
      '詳細な分析データ',
      '日次レポート',
      '無制限アカウント',
      'AIアドバイス',
      'リアルタイム通知',
      '優先サポート'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 9800,
    priceDisplay: '¥9,800',
    features: [
      'すべてのPro機能',
      'カスタムレポート',
      'API アクセス',
      '専用アカウントマネージャー',
      'カスタム統合'
    ]
  }
} as const;

// 簡易ボタンコンポーネント
function Button({ 
  children, 
  onClick, 
  disabled, 
  className 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  disabled?: boolean; 
  className?: string; 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
        disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'hover:opacity-90'
      } ${className}`}
    >
      {children}
    </button>
  );
}

// 簡易カードコンポーネント
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>;
}

function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pb-2 ${className}`}>{children}</div>;
}

function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-2xl font-bold ${className}`}>{children}</h3>;
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pt-4 ${className}`}>{children}</div>;
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Stripe設定が完了していません。開発中です。');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Stripe設定が完了していません。開発中です。');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* ナビゲーション */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Instagram className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">InstaSimple</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
              <ArrowLeft className="h-4 w-4" />
              <span>ホームに戻る</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            シンプルで透明性のある
            <span className="text-purple-600">料金プラン</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            あなたのビジネスに最適なプランを選んでください。
            <br />
            すべてのプランで14日間の無料トライアル付き、いつでもプラン変更が可能です。
          </p>
        </div>

        {/* 料金プラン */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {Object.entries(PRICING_PLANS).map(([key, plan]) => (
            <Card 
              key={key} 
              className={`relative transform transition-all duration-300 hover:scale-105 ${
                key === 'pro' 
                  ? 'border-purple-500 shadow-xl ring-2 ring-purple-200' 
                  : 'border-gray-200 hover:shadow-lg'
              }`}
            >
{key === 'pro' && (
  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
      人気プラン
    </span>
  </div>
)}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.priceDisplay}
                  </span>
                  <span className="text-gray-600 ml-2">/月</span>
                </div>
                <div className="text-sm text-gray-500">
                  税込み価格
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(key)}
                  disabled={loading === key}
                  className={`w-full h-12 text-base font-semibold text-white ${
                    key === 'pro' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {loading === key ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      処理中...
                    </>
                  ) : (
                    `${plan.name}で始める`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 特典・保証 */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              すべてのプランに含まれる特典
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">14日間無料トライアル</h4>
                <p className="text-gray-600 text-sm">クレジットカード不要</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">いつでもキャンセル</h4>
                <p className="text-gray-600 text-sm">縛りなし、違約金なし</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">24時間サポート</h4>
                <p className="text-gray-600 text-sm">迅速で丁寧な対応</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}