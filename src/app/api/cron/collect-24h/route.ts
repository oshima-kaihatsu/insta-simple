import { NextRequest, NextResponse } from 'next/server';
import { supabase, getInstagramConnection, savePostData } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🕐 Starting 24-hour data collection cron job...');

    // 認証確認（CronからのリクエストかVerifyするHeader/Token実装推奨）
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 24時間前に投稿された投稿を検索
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60 * 1000);

    console.log('🔍 Looking for posts between:', twentyFourHoursAgo.toISOString(), 'and', twentyThreeHoursAgo.toISOString());

    if (!supabase) {
      console.log('📊 Supabase not configured, using mock data collection');
      return NextResponse.json({
        success: true,
        message: 'Mock data collection completed',
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

    // 各接続について投稿データを収集
    for (const connection of connections || []) {
      try {
        console.log(`📊 Processing Instagram user: ${connection.username}`);

        // Facebook Pages APIを使用してInstagram Business Accountのメディアを取得
        const mediaResponse = await fetch(
          `https://graph.facebook.com/v23.0/${connection.instagram_user_id}/media?fields=id,caption,timestamp,media_type&limit=50&access_token=${connection.access_token}`
        );

        if (!mediaResponse.ok) {
          throw new Error(`Instagram API error: ${mediaResponse.status}`);
        }

        const mediaData = await mediaResponse.json();

        if (mediaData.error) {
          throw new Error(`Instagram API error: ${mediaData.error.message}`);
        }

        // 24時間前の投稿をフィルター
        const targetPosts = (mediaData.data || []).filter((post: any) => {
          const postTime = new Date(post.timestamp);
          return postTime >= twentyFourHoursAgo && postTime <= twentyThreeHoursAgo;
        });

        console.log(`📝 Found ${targetPosts.length} posts from 24 hours ago`);

        // 各投稿のインサイトを取得
        for (const post of targetPosts) {
          try {
            // Instagram Business Accountのインサイト取得（実際のメトリクスのみ）
            const insightsResponse = await fetch(
              `https://graph.facebook.com/v23.0/${post.id}/insights?metric=reach,impressions,saved,engagement&access_token=${connection.access_token}`
            );

            let insights: any = {};
            if (insightsResponse.ok) {
              const insightsData = await insightsResponse.json();
              if (!insightsData.error) {
                // インサイトデータを整形
                insightsData.data?.forEach((metric: any) => {
                  insights[metric.name] = metric.values?.[0]?.value || 0;
                });
              }
            }

            // データベースに保存
            const postData = {
              instagram_user_id: connection.instagram_user_id,
              post_id: post.id,
              caption: post.caption || '',
              media_type: post.media_type,
              timestamp: post.timestamp,
              data_24h: {
                reach: insights.reach || 0,
                impressions: insights.impressions || 0,
                saved: insights.saved || 0,
                engagement: insights.engagement || 0,
                collected_at: new Date().toISOString()
              },
              data_7d: null // 7日後に更新
            };

            const { error: saveError } = await savePostData(postData);
            if (saveError) {
              console.error(`Error saving post data for ${post.id}:`, saveError);
              errors.push(`Post ${post.id}: ${saveError}`);
            } else {
              processedCount++;
              console.log(`✅ Saved 24h data for post: ${post.id}`);
            }

          } catch (postError) {
            console.error(`Error processing post ${post.id}:`, postError);
            errors.push(`Post ${post.id}: ${postError.message}`);
          }
        }

      } catch (connectionError) {
        console.error(`Error processing connection ${connection.username}:`, connectionError);
        errors.push(`Connection ${connection.username}: ${connectionError.message}`);
      }
    }

    console.log(`✅ 24-hour collection completed. Processed: ${processedCount} posts`);

    return NextResponse.json({
      success: true,
      message: '24-hour data collection completed',
      processed: processedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ 24-hour collection cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}