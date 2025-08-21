// src/lib/dataHistory.ts - 実データ管理システム
import { supabaseAdmin } from './supabase';

export class RealDataManager {
  
  // 実データのフォロワー履歴を取得（推定なし）
  static async getFollowerHistory(instagramUserId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('follower_history')
        .select('followers_count, recorded_at')
        .eq('instagram_user_id', instagramUserId)
        .order('recorded_at', { ascending: true });

      if (error) {
        console.error('Failed to fetch follower history:', error);
        return { hasData: false, data: [] };
      }

      // 実データがある場合のみ返す
      if (data && data.length > 0) {
        const formattedData = data.map(point => ({
          date: new Date(point.recorded_at).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
          followers: point.followers_count,
          recorded_at: point.recorded_at
        }));

        return { 
          hasData: true, 
          data: formattedData,
          dataPoints: data.length,
          startDate: new Date(data[0].recorded_at).toLocaleDateString('ja-JP'),
          endDate: new Date(data[data.length - 1].recorded_at).toLocaleDateString('ja-JP')
        };
      }

      return { hasData: false, data: [] };
      
    } catch (error) {
      console.error('Error fetching follower history:', error);
      return { hasData: false, data: [] };
    }
  }

  // 初回連携時にデータ記録を開始
  static async recordInitialData(instagramUserId: string, followerData: any) {
    try {
      // 今日のデータが既に存在するかチェック
      const { data: existingData } = await supabaseAdmin
        .from('follower_history')
        .select('id')
        .eq('instagram_user_id', instagramUserId)
        .gte('recorded_at', new Date().toISOString().split('T')[0])
        .limit(1);

      // 既に今日のデータがある場合はスキップ
      if (existingData && existingData.length > 0) {
        console.log(`📊 Data already recorded today for ${instagramUserId}`);
        return true;
      }

      const { error } = await supabaseAdmin
        .from('follower_history')
        .insert({
          instagram_user_id: instagramUserId,
          followers_count: followerData.followers_count,
          media_count: followerData.media_count,
          recorded_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to record initial data:', error);
        return false;
      }

      console.log(`📊 Recorded initial data for ${instagramUserId}: ${followerData.followers_count} followers`);
      return true;
      
    } catch (error) {
      console.error('Error recording initial data:', error);
      return false;
    }
  }

  // データ収集状況を取得
  static async getDataCollectionStatus(instagramUserId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('follower_history')
        .select('recorded_at, followers_count')
        .eq('instagram_user_id', instagramUserId)
        .order('recorded_at', { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) {
        return {
          isCollecting: false,
          lastRecorded: null,
          daysCollected: 0,
          currentFollowers: null
        };
      }

      const lastRecorded = new Date(data[0].recorded_at);
      const today = new Date();
      const daysSinceStart = Math.floor((today.getTime() - lastRecorded.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isCollecting: true,
        lastRecorded: lastRecorded.toLocaleDateString('ja-JP'),
        daysCollected: Math.max(1, Math.abs(daysSinceStart) + 1),
        currentFollowers: data[0].followers_count
      };
      
    } catch (error) {
      console.error('Error getting data collection status:', error);
      return {
        isCollecting: false,
        lastRecorded: null,
        daysCollected: 0,
        currentFollowers: null
      };
    }
  }
}