import { NextRequest, NextResponse } from 'next/server';
import { supabase, savePostData } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('📅 Starting 7-day data collection cron job...');

    // 認証確認
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 7日前に投稿された投稿を検索
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

    console.log('🔍 Looking for posts between:', sevenDaysAgo.toISOString(), 'and', sixDaysAgo.toISOString());

    if (!supabase) {
      console.log('📊 Supabase not configured, using mock data collection');
      return NextResponse.json({
        success: true,
        message: 'Mock data collection completed',
        processed: 0
      });
    }

    // 7日前の投稿でdata_7dがnullのものを検索
    const { data: postsToUpdate, error: postsError } = await supabase
      .from('posts_data')
      .select('*, instagram_connections!inner(*)')
      .gte('timestamp', sevenDaysAgo.toISOString())
      .lte('timestamp', sixDaysAgo.toISOString())
      .is('data_7d', null);

    if (postsError) {
      console.error('Error fetching posts to update:', postsError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    console.log(`📝 Found ${postsToUpdate?.length || 0} posts to update with 7-day data`);

    let processedCount = 0;
    const errors: string[] = [];

    // 各投稿について7日後のインサイトを取得
    for (const postRecord of postsToUpdate || []) {
      try {
        console.log(`📊 Processing 7-day data for post: ${postRecord.post_id}`);

        // Instagram Business Accountからインサイトを取得（実際のメトリクスのみ）
        const insightsResponse = await fetch(
          `https://graph.facebook.com/v21.0/${postRecord.post_id}/insights?metric=reach,impressions,saved,engagement&access_token=${postRecord.instagram_connections.access_token}`
        );

        if (!insightsResponse.ok) {
          throw new Error(`Instagram API error: ${insightsResponse.status}`);
        }

        const insightsData = await insightsResponse.json();

        if (insightsData.error) {
          throw new Error(`Instagram API error: ${insightsData.error.message}`);
        }

        // インサイトデータを整形
        const insights: any = {};
        insightsData.data?.forEach((metric: any) => {
          insights[metric.name] = metric.values?.[0]?.value || 0;
        });

        // data_7dを更新（実際のデータのみ）
        const data7d = {
          reach: insights.reach || 0,
          impressions: insights.impressions || 0,
          saved: insights.saved || 0,
          engagement: insights.engagement || 0,
          collected_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('posts_data')
          .update({ data_7d: data7d })
          .eq('id', postRecord.id);

        if (updateError) {
          console.error(`Error updating post ${postRecord.post_id}:`, updateError);
          errors.push(`Post ${postRecord.post_id}: ${updateError.message}`);
        } else {
          processedCount++;
          console.log(`✅ Updated 7d data for post: ${postRecord.post_id}`);
        }

      } catch (postError) {
        console.error(`Error processing post ${postRecord.post_id}:`, postError);
        errors.push(`Post ${postRecord.post_id}: ${postError.message}`);
      }
    }

    console.log(`✅ 7-day collection completed. Processed: ${processedCount} posts`);

    return NextResponse.json({
      success: true,
      message: '7-day data collection completed',
      processed: processedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ 7-day collection cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}