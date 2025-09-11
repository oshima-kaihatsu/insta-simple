import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';
import { cancelSubscription } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ユーザーの現在のサブスクリプション情報を取得
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, current_plan, subscription_status, stripe_customer_id, stripe_subscription_id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      console.error('User fetch error:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 既にキャンセル済みの場合
    if (user.subscription_status === 'canceled' || user.subscription_status === 'expired') {
      return NextResponse.json(
        { error: 'Subscription already canceled' },
        { status: 400 }
      );
    }

    // 無料プランまたはトライアル中の場合
    if (!user.current_plan || user.current_plan === 'basic' || user.subscription_status === 'trial') {
      // データベース上でキャンセル状態に更新
      const { error: updateError } = await supabase
        .from('users')
        .update({
          current_plan: null,
          subscription_status: 'canceled',
          trial_ends_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to cancel subscription' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Subscription canceled successfully',
        immediate: true
      });
    }

    // 有料プランの場合はStripeでキャンセル処理
    if (user.stripe_subscription_id) {
      const { subscription, error: stripeError } = await cancelSubscription(user.stripe_subscription_id);

      if (stripeError || !subscription) {
        console.error('Stripe cancellation error:', stripeError);
        return NextResponse.json(
          { error: 'Failed to cancel Stripe subscription' },
          { status: 500 }
        );
      }

      // データベース上でキャンセル予定状態に更新
      const { error: updateError } = await supabase
        .from('users')
        .update({
          subscription_status: 'cancel_at_period_end',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        // Stripe側はキャンセルされているが、DBの更新に失敗した場合の警告
        console.warn('Stripe subscription canceled but database update failed for user:', user.email);
      }

      return NextResponse.json({
        success: true,
        message: 'Subscription will be canceled at the end of the current billing period',
        immediate: false,
        period_end: subscription.current_period_end
      });
    }

    // Stripe Subscription IDがない場合
    return NextResponse.json(
      { error: 'No active subscription found' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}