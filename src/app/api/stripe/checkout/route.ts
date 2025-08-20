import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createCustomer, createCheckoutSession } from '@/lib/stripe';
import { getUserByEmail, updateUser } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // セッション確認
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, planName, trialDays = 14 } = await request.json();

    if (!priceId || !planName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating checkout session for:', session.user.email, 'Plan:', planName);

    // ユーザー情報取得
    const { data: user, error: userError } = await getUserByEmail(session.user.email);
    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Stripe Customer作成または取得
    let customerId = user.stripe_customer_id;
    
    if (!customerId) {
      console.log('Creating new Stripe customer for:', session.user.email);
      const { customer, error: customerError } = await createCustomer(
        session.user.email,
        session.user.name || 'Instagram User'
      );

      if (customerError || !customer) {
        console.error('Failed to create Stripe customer:', customerError);
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
      }

      customerId = customer.id;

      // ユーザーレコードにCustomer IDを保存
      await updateUser(user.id, {
        stripe_customer_id: customerId
      });

      console.log('Created Stripe customer:', customerId);
    }

    // チェックアウトセッション作成
    const { session: checkoutSession, error: sessionError } = await createCheckoutSession({
      priceId,
      planName,
      userEmail: session.user.email,
      userId: user.id,
      customerId,
      trialDays
    });

    if (sessionError || !checkoutSession) {
      console.error('Failed to create checkout session:', sessionError);
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    console.log('Created checkout session:', checkoutSession.id);

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}