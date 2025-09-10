import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, message: 'Database not configured' });
    }

    const { instagram_user_id } = await request.json();

    if (!instagram_user_id) {
      return NextResponse.json({ error: 'Instagram user ID required' }, { status: 400 });
    }

    // 接続情報を取得
    const { data: connection } = await supabase
      .from('instagram_connections')
      .select('*')
      .eq('instagram_user_id', instagram_user_id)
      .single();

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // 今日のデータが既に存在するかチェック
    const today = new Date().toISOString().split('T')[0];
    const { data: existingData } = await supabase
      .from('follower_history')
      .select('id')
      .eq('instagram_user_id', instagram_user_id)
      .gte('recorded_at', today)
      .limit(1);

    if (existingData && existingData.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Already recorded today',
        skipped: true 
      });
    }

    // Instagram APIでフォロワー数を取得
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${instagram_user_id}?fields=followers_count,media_count&access_token=${connection.access_token}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Instagram API error: ${data.error.message}`);
    }

    // データベースに保存
    const { error } = await supabase
      .from('follower_history')
      .insert({
        instagram_user_id,
        followers_count: data.followers_count,
        media_count: data.media_count,
        recorded_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Follower data recorded',
      followers_count: data.followers_count
    });

  } catch (error) {
    console.error('Record followers error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}