import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Vercel Cronからのアクセスかチェック
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Checking for ending trials...');

    // 3日後に終了するトライアルユーザーを取得
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const threeDaysFromNowISO = threeDaysFromNow.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];

    // 3日前通知対象のユーザー取得
    const { data: threeDayUsers, error: threeDayError } = await supabase
      .from('users')
      .select('email, name, trial_end')
      .eq('subscription_status', 'trial')
      .gte('trial_end', threeDaysFromNowISO + 'T00:00:00')
      .lte('trial_end', threeDaysFromNowISO + 'T23:59:59')
      .is('trial_3day_notice_sent', null);

    if (threeDayError) {
      console.error('Error fetching 3-day users:', threeDayError);
    } else if (threeDayUsers && threeDayUsers.length > 0) {
      console.log(`Found ${threeDayUsers.length} users with trials ending in 3 days`);
      
      for (const user of threeDayUsers) {
        // メール送信処理（実装が必要）
        await sendTrialEndingEmail(user.email, user.name, 3);
        
        // 通知済みフラグを更新
        await supabase
          .from('users')
          .update({ trial_3day_notice_sent: new Date().toISOString() })
          .eq('email', user.email);
      }
    }

    // 明日終了するトライアルユーザーを取得
    const { data: oneDayUsers, error: oneDayError } = await supabase
      .from('users')
      .select('email, name, trial_end')
      .eq('subscription_status', 'trial')
      .gte('trial_end', tomorrowISO + 'T00:00:00')
      .lte('trial_end', tomorrowISO + 'T23:59:59')
      .is('trial_1day_notice_sent', null);

    if (oneDayError) {
      console.error('Error fetching 1-day users:', oneDayError);
    } else if (oneDayUsers && oneDayUsers.length > 0) {
      console.log(`Found ${oneDayUsers.length} users with trials ending tomorrow`);
      
      for (const user of oneDayUsers) {
        // メール送信処理（実装が必要）
        await sendTrialEndingEmail(user.email, user.name, 1);
        
        // 通知済みフラグを更新
        await supabase
          .from('users')
          .update({ trial_1day_notice_sent: new Date().toISOString() })
          .eq('email', user.email);
      }
    }

    // 今日終了したトライアルユーザーを取得して無効化
    const today = new Date().toISOString().split('T')[0];
    const { data: expiredUsers, error: expiredError } = await supabase
      .from('users')
      .select('email, name')
      .eq('subscription_status', 'trial')
      .lte('trial_end', today + 'T23:59:59');

    if (expiredError) {
      console.error('Error fetching expired users:', expiredError);
    } else if (expiredUsers && expiredUsers.length > 0) {
      console.log(`Found ${expiredUsers.length} expired trials`);
      
      for (const user of expiredUsers) {
        // トライアル終了メール送信
        await sendTrialExpiredEmail(user.email, user.name);
        
        // ステータスを更新
        await supabase
          .from('users')
          .update({ 
            subscription_status: 'expired',
            subscription_plan: null 
          })
          .eq('email', user.email);
      }
    }

    return NextResponse.json({ 
      success: true,
      threeDayNotifications: threeDayUsers?.length || 0,
      oneDayNotifications: oneDayUsers?.length || 0,
      expiredTrials: expiredUsers?.length || 0
    });

  } catch (error) {
    console.error('Trial notification cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// メール送信関数（実装が必要）
async function sendTrialEndingEmail(email: string, name: string, daysRemaining: number) {
  // TODO: SendGridやその他のメールサービスを使用して実装
  console.log(`Sending trial ending email to ${email} (${daysRemaining} days remaining)`);
  
  // メール内容の例
  const subject = `InstaSimple無料トライアル終了まであと${daysRemaining}日`;
  const body = `
    ${name}様

    InstaSimpleの無料トライアルが${daysRemaining}日後に終了します。

    引き続きサービスをご利用いただく場合は、以下のリンクから有料プランをお選びください：
    ${process.env.NEXTAUTH_URL}/dashboard

    プランを選択しない場合、トライアル終了後はサービスが自動的に停止されます。
    クレジットカードの自動課金はありませんのでご安心ください。

    ご不明な点がございましたら、お気軽にお問い合わせください。

    InstaSimple Analytics
  `;
  
  // 実際のメール送信処理をここに実装
}

async function sendTrialExpiredEmail(email: string, name: string) {
  console.log(`Sending trial expired email to ${email}`);
  
  const subject = 'InstaSimple無料トライアルが終了しました';
  const body = `
    ${name}様

    InstaSimpleの14日間無料トライアルが終了しました。

    引き続きサービスをご利用いただく場合は、以下のリンクから有料プランをお選びください：
    ${process.env.NEXTAUTH_URL}

    ご利用ありがとうございました。

    InstaSimple Analytics
  `;
  
  // 実際のメール送信処理をここに実装
}