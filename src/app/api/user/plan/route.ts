import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserByEmail } from '@/lib/supabase';
import { PLANS } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // セッション確認
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ユーザー情報取得
    const { data: user, error } = await getUserByEmail(session.user.email);
    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // プラン情報の構築
    const currentPlan = user.current_plan || 'basic';
    const planDetails = PLANS[currentPlan] || PLANS.basic;

    // トライアル期間の計算
    const trialEndsAt = user.trial_ends_at ? new Date(user.trial_ends_at) : null;
    const isTrialActive = trialEndsAt && trialEndsAt > new Date();
    const trialDaysLeft = isTrialActive 
      ? Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;

    // サブスクリプション状態の判定
    let effectiveStatus = user.subscription_status || 'none';
    if (isTrialActive) {
      effectiveStatus = 'trial';
    }

    const planInfo = {
      user_id: user.id,
      email: user.email,
      name: user.name,
      current_plan: currentPlan,
      subscription_status: effectiveStatus,
      trial_ends_at: trialEndsAt?.toISOString(),
      trial_days_left: trialDaysLeft,
      is_trial_active: isTrialActive,
      stripe_customer_id: user.stripe_customer_id,
      plan_details: {
        ...planDetails,
        is_active: ['active', 'trial'].includes(effectiveStatus)
      },
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    return NextResponse.json(planInfo);

  } catch (error) {
    console.error('Get user plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}