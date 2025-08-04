import { NextRequest, NextResponse } from 'next/server'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Instagram data deletion webhookの処理
    console.log('Instagram data deletion webhook received:', body)
    
    const userId = body.user_id
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // 実際の実装では、指定されたユーザーのデータを削除する処理を行う
    // 例: データベースからユーザーのInstagramデータを完全削除
    
    // データ削除完了の確認URL（実際のURLに変更してください）
    const confirmationUrl = `https://insta-simple.thorsync.com/data-deletion-status?user_id=${userId}`
    
    return NextResponse.json({ 
      url: confirmationUrl,
      confirmation_code: `deletion_${userId}_${Date.now()}`
    })
    
  } catch (error) {
    console.error('Data deletion webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// GETリクエストも許可（Facebook検証用）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Facebook webhook verification
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  
  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge)
  }
  
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}