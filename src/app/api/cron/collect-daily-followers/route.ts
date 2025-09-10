import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('📊 Starting daily follower data collection cron job...');

    // 認証確認
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabase) {
      console.log('📊 Supabase not configured, skipping data collection');
      return NextResponse.json({
        success: true,
        message: 'Supabase not configured',
        processed: 0
      });
    }

    // アクティブなInstagram接続を取得
    const { data: connections, error: connectionsError } = await supabase
      .from('instagram_connections')
      .select('*')
      .not('access_token', 'is', null);

    if (connectionsError) {
      console.error('Error fetching Instagram connections:', connectionsError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    console.log(`📱 Found ${connections?.length || 0} Instagram connections`);

    let processedCount = 0;
    const errors: string[] = [];

    // 各接続について今日のフォロワー数を記録
    for (const connection of connections || []) {
      try {
        console.log(`📊 Processing Instagram user: ${connection.username}`);

        // 今日のデータが既に存在するかチェック
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        const { data: existingData } = await supabase
          .from('follower_history')
          .select('id')
          .eq('instagram_user_id', connection.instagram_user_id)
          .gte('recorded_at', todayString)
          .limit(1);

        if (existingData && existingData.length > 0) {
          console.log(`📊 Data already recorded today for ${connection.username}`);
          continue;
        }

        // Instagram Business APIでフォロワー数を取得
        const accountResponse = await fetch(
          `https://graph.facebook.com/v23.0/${connection.instagram_user_id}?fields=followers_count,media_count&access_token=${connection.access_token}`
        );

        if (!accountResponse.ok) {
          throw new Error(`Instagram API error: ${accountResponse.status}`);
        }

        const accountData = await accountResponse.json();

        if (accountData.error) {
          throw new Error(`Instagram API error: ${accountData.error.message}`);
        }

        // フォロワー履歴をデータベースに保存
        const { error: insertError } = await supabase
          .from('follower_history')
          .insert({
            instagram_user_id: connection.instagram_user_id,
            followers_count: accountData.followers_count,
            media_count: accountData.media_count,
            recorded_at: new Date().toISOString()
          });

        if (insertError) {
          console.error(`Error saving follower data for ${connection.username}:`, insertError);
          errors.push(`${connection.username}: ${insertError.message}`);
        } else {
          processedCount++;
          console.log(`✅ Saved follower data for ${connection.username}: ${accountData.followers_count} followers`);
        }

      } catch (connectionError) {
        console.error(`Error processing connection ${connection.username}:`, connectionError);
        errors.push(`${connection.username}: ${connectionError.message}`);
      }
    }

    console.log(`✅ Daily follower collection completed. Processed: ${processedCount} accounts`);

    return NextResponse.json({
      success: true,
      message: 'Daily follower data collection completed',
      processed: processedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Daily follower collection cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}