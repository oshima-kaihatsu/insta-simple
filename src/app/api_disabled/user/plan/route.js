import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'

// プラン別の制限設定
const PLAN_LIMITS = {
  basic: { analyses: 3, name: 'Basic' },
  pro: { analyses: 50, name: 'Pro' },
  enterprise: { analyses: 999999, name: 'Enterprise' }
}

// ユーザープラン情報取得
export async function GET(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Supabaseからユーザー情報取得
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const planLimits = PLAN_LIMITS[user.current_plan || 'basic']

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        current_plan: user.current_plan || 'basic',
        plan_name: planLimits.name,
        analyses_count: user.analyses_count || 0,
        analyses_limit: planLimits.analyses,
        remaining_analyses: Math.max(0, planLimits.analyses - (user.analyses_count || 0)),
        subscription_status: user.subscription_status || 'trial',
        trial_ends_at: user.trial_ends_at
      }
    })

  } catch (error) {
    console.error('Plan API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 分析回数更新
export async function POST(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { action } = await request.json()

    if (action === 'increment_analysis') {
      // ユーザー情報取得
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (userError || !user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const planLimits = PLAN_LIMITS[user.current_plan || 'basic']
      const currentCount = user.analyses_count || 0

      // 制限チェック
      if (currentCount >= planLimits.analyses) {
        return NextResponse.json({
          error: 'Analysis limit reached',
          message: `${planLimits.name}プランの月間分析制限(${planLimits.analyses}回)に達しました。`,
          current_count: currentCount,
          limit: planLimits.analyses,
          upgrade_required: true
        }, { status: 403 })
      }

      // 分析回数を増加
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({ 
          analyses_count: currentCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('email', session.user.email)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update analysis count' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        analyses_count: data.analyses_count,
        remaining_analyses: Math.max(0, planLimits.analyses - data.analyses_count)
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Plan update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}