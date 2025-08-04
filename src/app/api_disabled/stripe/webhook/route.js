// src/app/api/stripe/webhook/route.js
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      // サブスクリプション作成（トライアル開始） - 1日前通知スケジュール
      case 'customer.subscription.created':
        const newSubscription = event.data.object
        if (newSubscription.status === 'trialing') {
          await handleTrialStarted(newSubscription)
          await scheduleTrialEndingNotification(newSubscription)
        }
        break

      // トライアル終了→有料プラン開始
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object
        if (updatedSubscription.status === 'active' && 
            event.data.previous_attributes?.status === 'trialing') {
          await handleTrialEnded(updatedSubscription)
        }
        break

      // 支払い失敗
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        await handlePaymentFailed(failedInvoice)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handling error:', error)
    return NextResponse.json(
      { error: 'Webhook handling failed' },
      { status: 500 }
    )
  }
}

// トライアル終了1日前の通知をスケジュール
async function scheduleTrialEndingNotification(subscription) {
  const trialEndDate = new Date(subscription.trial_end * 1000)
  const oneDayBefore = new Date(trialEndDate.getTime() - 24 * 60 * 60 * 1000)
  
  // データベースに通知スケジュールを保存
  await supabase
    .from('notification_schedule')
    .insert({
      subscription_id: subscription.id,
      customer_email: subscription.customer,
      notification_type: 'trial_ending',
      scheduled_date: oneDayBefore.toISOString(),
      executed: false
    })
}

// 定期実行: 1日前通知チェック（cron jobまたはVercel関数で実行）
async function checkAndSendTrialEndingNotifications() {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  
  // 明日終了するトライアルを検索
  const { data: notifications } = await supabase
    .from('notification_schedule')
    .select('*')
    .eq('executed', false)
    .eq('notification_type', 'trial_ending')
    .lte('scheduled_date', now.toISOString())

  for (const notification of notifications || []) {
    try {
      const subscription = await stripe.subscriptions.retrieve(notification.subscription_id)
      const customer = await stripe.customers.retrieve(subscription.customer)
      
      if (subscription.status === 'trialing') {
        await sendTrialEndingEmail({
          email: customer.email,
          trialEndDate: new Date(subscription.trial_end * 1000),
          planName: subscription.metadata.planName,
          customerPortalUrl: await createCustomerPortalSession(customer.id)
        })

        // 通知済みマーク
        await supabase
          .from('notification_schedule')
          .update({ executed: true })
          .eq('id', notification.id)
      }
    } catch (error) {
      console.error('Notification error:', error)
    }
  }
}

// カスタマーポータルセッション作成
async function createCustomerPortalSession(customerId) {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  })
  return portalSession.url
}

// トライアル終了1日前の通知（旧関数名変更）
async function handleTrialWillEnd(subscription) {
  // この関数は使用しない（1日前通知は独自実装）
}

// トライアル開始時の処理
async function handleTrialStarted(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer)
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'trialing',
      trial_end_date: new Date(subscription.trial_end * 1000).toISOString(),
      plan_name: subscription.metadata.planName
    })
    .eq('email', customer.email)
}

// トライアル終了→有料プラン移行
async function handleTrialEnded(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer)
  
  await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      plan_name: subscription.metadata.planName,
      billing_cycle_start: new Date().toISOString()
    })
    .eq('email', customer.email)
}

// 支払い失敗時の処理
async function handlePaymentFailed(invoice) {
  const customer = await stripe.customers.retrieve(invoice.customer)
  
  // 支払い失敗通知
  await sendPaymentFailedEmail({
    email: customer.email,
    amount: invoice.amount_due / 100,
    currency: invoice.currency
  })
}

// メール送信関数（1日前通知）
async function sendTrialEndingEmail({ email, trialEndDate, planName, customerPortalUrl }) {
  // SendGridやResendなどのメールサービスを使用
  const emailContent = {
    to: email,
    subject: `【InstaSimple】無料トライアル終了のお知らせ（明日 ${trialEndDate.toLocaleDateString('ja-JP')}）`,
    html: `
      <h2>InstaSimple Analytics 無料トライアル終了のお知らせ</h2>
      <p>いつもInstaSimple Analyticsをご利用いただき、ありがとうございます。</p>
      
      <p><strong>${planName}プラン</strong>の14日間無料トライアルが<strong>明日 ${trialEndDate.toLocaleDateString('ja-JP')}</strong>に終了いたします。</p>
      
      <h3>継続をご希望の場合</h3>
      <p>サービスを継続してご利用いただくには、お支払い方法の登録が必要です。</p>
      <a href="${customerPortalUrl}" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
        お支払い方法を登録する
      </a>
      
      <h3>何もされない場合</h3>
      <p>お支払い方法が登録されていない場合、サブスクリプションは一時停止となり、分析機能がご利用いただけなくなります。</p>
      
      <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
      
      <p>InstaSimple Analyticsチーム</p>
    `
  }
  
  console.log(`トライアル終了1日前通知: ${email} - ${planName} - ${trialEndDate}`)
  // 実際のメール送信処理をここに実装
}

async function sendPaymentFailedEmail({ email, amount, currency }) {
  console.log(`支払い失敗通知: ${email} - ${amount} ${currency}`)
}