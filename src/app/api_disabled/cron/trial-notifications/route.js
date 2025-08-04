// src/app/api/cron/trial-notifications/route.js
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  // Vercel Cronの認証
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    console.log(`Checking trial notifications for: ${now.toISOString()}`)

    // 明日終了するアクティブなトライアルを検索
    const subscriptions = await stripe.subscriptions.list({
      status: 'trialing',
      limit: 100
    })

    let notificationsSent = 0

    for (const subscription of subscriptions.data) {
      const trialEndDate = new Date(subscription.trial_end * 1000)
      const hoursUntilEnd = (trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      // 24時間以内に終了するトライアル（かつ通知未送信）
      if (hoursUntilEnd <= 24 && hoursUntilEnd > 0) {
        // 通知済みかチェック
        if (subscription.metadata.notificationSent !== 'true') {
          try {
            const customer = await stripe.customers.retrieve(subscription.customer)
            
            // カスタマーポータルURL生成
            const portalSession = await stripe.billingPortal.sessions.create({
              customer: customer.id,
              return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
            })

            // メール送信
            await sendTrialEndingEmail({
              email: customer.email,
              trialEndDate: trialEndDate,
              planName: subscription.metadata.planName || 'Standard',
              customerPortalUrl: portalSession.url
            })

            // 通知済みフラグを更新
            await stripe.subscriptions.update(subscription.id, {
              metadata: {
                ...subscription.metadata,
                notificationSent: 'true'
              }
            })

            notificationsSent++
            console.log(`Notification sent to: ${customer.email}`)
            
          } catch (error) {
            console.error(`Failed to notify ${subscription.id}:`, error)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
      checkedAt: now.toISOString()
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Failed to process notifications' },
      { status: 500 }
    )
  }
}

// メール送信関数
async function sendTrialEndingEmail({ email, trialEndDate, planName, customerPortalUrl }) {
  // 実際のメール送信処理
  console.log(`🔔 Trial ending notification sent to: ${email}`)
  console.log(`📅 Trial ends: ${trialEndDate.toLocaleDateString('ja-JP')}`)
  console.log(`💰 Plan: ${planName}`)
  console.log(`🔗 Portal: ${customerPortalUrl}`)
  
  // SendGridやResendなどのメールサービス実装をここに追加
}