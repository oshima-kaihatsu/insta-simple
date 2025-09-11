import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';
import { getSubscription } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ユーザーのサブスクリプション情報を取得
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, current_plan, subscription_status, stripe_customer_id, stripe_subscription_id, trial_ends_at')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      console.error('User fetch error:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let stripeSubscription = null;
    let nextBillingDate = null;
    let cancelAtPeriodEnd = false;

    // Stripe Subscriptionがある場合は詳細を取得
    if (user.stripe_subscription_id) {
      const { subscription, error: stripeError } = await getSubscription(user.stripe_subscription_id);
      
      if (!stripeError && subscription) {
        stripeSubscription = subscription;
        nextBillingDate = subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null;
        cancelAtPeriodEnd = subscription.cancel_at_period_end;
      } else {
        console.warn('Failed to retrieve Stripe subscription:', stripeError);
      }
    }

    // トライアル期間の計算
    let trialDaysRemaining = null;
    if (user.subscription_status === 'trial' && user.trial_ends_at) {
      const trialEndDate = new Date(user.trial_ends_at);
      const now = new Date();
      const diffTime = trialEndDate.getTime() - now.getTime();
      trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const subscriptionInfo = {
      current_plan: user.current_plan,
      subscription_status: user.subscription_status,
      trial_ends_at: user.trial_ends_at,
      trial_days_remaining: trialDaysRemaining,
      next_billing_date: nextBillingDate,
      cancel_at_period_end: cancelAtPeriodEnd,
      can_cancel: user.subscription_status && user.subscription_status !== 'canceled' && user.subscription_status !== 'expired',
      stripe_subscription_id: user.stripe_subscription_id ? 'present' : null // セキュリティのため実際のIDは返さない
    };

    return NextResponse.json(subscriptionInfo);

  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}