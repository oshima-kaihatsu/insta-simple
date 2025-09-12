'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Globe, Calendar, Users, Image, BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InstagramProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // LocalStorageからトークンとユーザーIDを取得
    const storedToken = localStorage.getItem('instagram_token');
    const storedUserId = localStorage.getItem('instagram_user_id');
    
    if (storedToken && storedUserId) {
      setAccessToken(storedToken);
      setUserId(storedUserId);
      fetchProfileData(storedToken, storedUserId);
    } else {
      setError('Instagram認証が必要です');
      setLoading(false);
    }
  }, []);

  const fetchProfileData = async (token: string, id: string) => {
    try {
      setLoading(true);
      
      // Instagram Business Accountの基本メタデータを取得
      const response = await fetch(
        `https://graph.facebook.com/v23.0/${id}?fields=id,username,account_type,media_count,followers_count,follows_count,name,biography,profile_picture_url,website&access_token=${token}`
      );
      
      if (!response.ok) {
        throw new Error('プロファイルデータの取得に失敗しました');
      }
      
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'プロファイルの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectInstagram = () => {
    window.location.href = '/api/instagram/connect';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                Instagram Business プロファイル管理
              </h1>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">プロファイルデータを読み込み中...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {error}
              </h3>
              <button
                onClick={handleConnectInstagram}
                className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Instagramアカウントを接続
              </button>
            </div>
          </div>
        ) : profileData ? (
          <div className="space-y-6">
            {/* プロファイル基本情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                基本メタデータ
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* プロファイル画像 */}
                {profileData.profile_picture_url && (
                  <div className="flex justify-center md:justify-start">
                    <img 
                      src={profileData.profile_picture_url} 
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-purple-100"
                    />
                  </div>
                )}
                
                {/* 基本情報 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">ID:</span>
                    <span className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">
                      {profileData.id || userId}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">ユーザー名:</span>
                    <span className="text-gray-800 font-semibold">
                      @{profileData.username || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">名前:</span>
                    <span className="text-gray-800">
                      {profileData.name || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">アカウントタイプ:</span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {profileData.account_type || 'BUSINESS'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* バイオグラフィー */}
              {profileData.biography && (
                <div className="mt-6">
                  <h3 className="text-gray-600 font-medium mb-2">プロフィール:</h3>
                  <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                    {profileData.biography}
                  </p>
                </div>
              )}
              
              {/* ウェブサイト */}
              {profileData.website && (
                <div className="mt-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <a 
                    href={profileData.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profileData.website}
                  </a>
                </div>
              )}
            </div>

            {/* 統計情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                アカウント統計
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-gray-600 text-sm">フォロワー</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {profileData.followers_count?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-pink-600" />
                    <div>
                      <p className="text-gray-600 text-sm">フォロー中</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {profileData.follows_count?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Image className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-gray-600 text-sm">投稿数</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {profileData.media_count?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* アクセストークン情報（デモ用） */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                認証情報（審査デモ用）
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">アクセストークン:</span>
                  <div className="mt-1 p-3 bg-gray-100 rounded-lg font-mono text-xs break-all">
                    {accessToken ? `${accessToken.substring(0, 20)}...` : 'N/A'}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">権限スコープ:</span>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    instagram_business_basic
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Instagramアカウントが接続されていません
              </p>
              <button
                onClick={handleConnectInstagram}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Instagramアカウントを接続
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}