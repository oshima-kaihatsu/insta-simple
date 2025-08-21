import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/stripe';
import { getUserByEmail, updateUser } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Webhook署名検証
    const { event, error } = verifyWebhookSignature(body, signature);
    if (error || !event) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Stripe webhook event:', event.type, event.id);

    // イベント処理
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// チェックアウト完了処理
async function handleCheckoutCompleted(session: any) {
  try {
    console.log('Checkout completed:', session.id);
    
    const userEmail = session.metadata?.user_email;
    const planName = session.metadata?.plan_name;
    
    if (!userEmail || !planName) {
      console.error('Missing metadata in checkout session');
      return;
    }

    const { data: user } = await getUserByEmail(userEmail);
    if (!user) {
      console.error('User not found:', userEmail);
      return;
    }

    // ユーザーのプラン情報を更新
    await updateUser(user.id, {
      current_plan: planName.toLowerCase(),
      subscription_status: 'trial',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14日後
    });

    console.log('Updated user plan:', userEmail, 'to', planName);

  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

// サブスクリプション作成処理
async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log('Subscription created:', subscription.id);
    
    const userEmail = subscription.metadata?.user_email;
    if (!userEmail) {
      console.error('Missing user_email in subscription metadata');
      return;
    }

    const { data: user } = await getUserByEmail(userEmail);
    if (!user) {
      console.error('User not found:', userEmail);
      return;
    }

    const planName = subscription.metadata?.plan_name || 'basic';
    
    await updateUser(user.id, {
      current_plan: planName.toLowerCase(),
      subscription_status: subscription.status === 'trialing' ? 'trial' : 'active',
      trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
    });

    console.log('Updated subscription for user:', userEmail);

  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// サブスクリプション更新処理
async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log('Subscription updated:', subscription.id);
    
    const userEmail = subscription.metadata?.user_email;
    if (!userEmail) {
      console.error('Missing user_email in subscription metadata');
      return;
    }

    const { data: user } = await getUserByEmail(userEmail);
    if (!user) {
      console.error('User not found:', userEmail);
      return;
    }

    let status = 'active';
    if (subscription.status === 'trialing') status = 'trial';
    else if (subscription.status === 'canceled') status = 'canceled';
    else if (subscription.status === 'past_due') status = 'past_due';

    await updateUser(user.id, {
      subscription_status: status,
      trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
    });

    console.log('Updated subscription status for user:', userEmail, 'to', status);

  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

// サブスクリプション削除処理
async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log('Subscription deleted:', subscription.id);
    
    const userEmail = subscription.metadata?.user_email;
    if (!userEmail) {
      console.error('Missing user_email in subscription metadata');
      return;
    }

    const { data: user } = await getUserByEmail(userEmail);
    if (!user) {
      console.error('User not found:', userEmail);
      return;
    }

    await updateUser(user.id, {
      current_plan: null,
      subscription_status: 'canceled',
      trial_ends_at: null
    });

    console.log('Canceled subscription for user:', userEmail);

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// 支払い成功処理
async function handlePaymentSucceeded(invoice: any) {
  try {
    console.log('Payment succeeded:', invoice.id);
    
    if (invoice.subscription) {
      // サブスクリプション支払いの場合
      // 必要に応じて追加処理
    }

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// 支払い失敗処理
async function handlePaymentFailed(invoice: any) {
  try {
    console.log('Payment failed:', invoice.id);
    
    // 支払い失敗時の処理（メール通知など）
    // 必要に応じて実装

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}