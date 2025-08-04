import { NextRequest, NextResponse } from 'next/server'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Instagram deauthorization webhookの処理
    console.log('Instagram deauthorization webhook received:', body)
    
    // 実際の実装では、ユーザーのアクセストークンを削除する処理を行う
    // 例: データベースからユーザーのInstagramトークンを削除
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Deauthorization processed' 
    })
    
  } catch (error) {
    console.error('Deauthorization webhook error:', error)
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