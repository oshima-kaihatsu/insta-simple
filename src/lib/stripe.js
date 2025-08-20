import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null;

export const getStripe = () => {
  if (typeof window !== 'undefined') {
    return import('@stripe/stripe-js').then(({ loadStripe }) =>
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    );
  }
  return null;
};

// プラン設定
export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 980,
    priceId: process.env.STRIPE_PRICE_BASIC,
    features: ['月50投稿まで', 'CSV出力', '30日間データ保存', '基本分析'],
    limits: {
      posts_per_month: 50,
      data_retention_days: 30,
      export_formats: ['csv'],
      ai_analysis_level: 'basic'
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 1580,
    priceId: process.env.STRIPE_PRICE_PRO,
    features: ['月200投稿まで', 'CSV/Excel出力', '90日間データ保存', '詳細分析'],
    limits: {
      posts_per_month: 200,
      data_retention_days: 90,
      export_formats: ['csv', 'excel'],
      ai_analysis_level: 'detailed'
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2980,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE,
    features: ['無制限投稿', 'CSV/Excel/PDF出力', '無制限データ保存', '高度分析', '複数アカウント'],
    limits: {
      posts_per_month: -1, // unlimited
      data_retention_days: -1, // unlimited
      export_formats: ['csv', 'excel', 'pdf'],
      ai_analysis_level: 'advanced'
    }
  }
};

// ユーザーのプラン制限チェック
export function checkPlanLimits(userPlan, action, currentUsage = {}) {
  const plan = PLANS[userPlan] || PLANS.basic;
  
  switch (action) {
    case 'posts_per_month':
      if (plan.limits.posts_per_month === -1) return { allowed: true };
      return {
        allowed: currentUsage.posts_this_month < plan.limits.posts_per_month,
        limit: plan.limits.posts_per_month,
        current: currentUsage.posts_this_month
      };
      
    case 'export_format':
      return {
        allowed: plan.limits.export_formats.includes(currentUsage.format),
        formats: plan.limits.export_formats
      };
      
    case 'data_retention':
      if (plan.limits.data_retention_days === -1) return { allowed: true };
      const daysOld = Math.floor((Date.now() - new Date(currentUsage.date)) / (1000 * 60 * 60 * 24));
      return {
        allowed: daysOld <= plan.limits.data_retention_days,
        limit: plan.limits.data_retention_days
      };
      
    default:
      return { allowed: true };
  }
}

// Stripe Customer作成
export async function createCustomer(userEmail, userName) {
  if (!stripe) {
    console.error('Stripe is not configured');
    return { customer: null, error: 'Stripe not configured' };
  }
  try {
    const customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
      metadata: {
        source: 'InstaSimple Analytics'
      }
    });
    
    return { customer, error: null };
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    return { customer: null, error: error.message };
  }
}

// チェックアウトセッション作成
export async function createCheckoutSession({
  priceId,
  planName,
  userEmail,
  userId,
  customerId,
  trialDays = 14
}) {
  if (!stripe) {
    console.error('Stripe is not configured');
    return { session: null, error: 'Stripe not configured' };
  }
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
      subscription_data: {
        trial_period_days: trialDays,
        metadata: {
          user_id: userId,
          plan_name: planName
        }
      },
      metadata: {
        user_id: userId,
        plan_name: planName,
        user_email: userEmail
      }
    });
    
    return { session, error: null };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { session: null, error: error.message };
  }
}

// サブスクリプション情報取得
export async function getSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return { subscription, error: null };
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return { subscription: null, error: error.message };
  }
}

// サブスクリプションキャンセル
export async function cancelSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    return { subscription, error: null };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return { subscription: null, error: error.message };
  }
}

// Webhook署名検証
export function verifyWebhookSignature(payload, signature) {
  if (!stripe) {
    console.error('Stripe is not configured');
    return { event: null, error: 'Stripe not configured' };
  }
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return { event, error: null };
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return { event: null, error: error.message };
  }
}