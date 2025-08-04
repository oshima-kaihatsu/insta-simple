import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    // セッション確認
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/api/auth/signin', request.url))
    }

    // Instagram Basic Display API の設定
    const clientId = process.env.INSTAGRAM_CLIENT_ID
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/instagram/callback`
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Instagram Client ID not configured' },
        { status: 500 }
      )
    }

    // Instagram認証URLを生成
    const instagramAuthUrl = new URL('https://api.instagram.com/oauth/authorize')
    instagramAuthUrl.searchParams.set('client_id', clientId)
    instagramAuthUrl.searchParams.set('redirect_uri', redirectUri)
    instagramAuthUrl.searchParams.set('scope', 'user_profile,user_media')
    instagramAuthUrl.searchParams.set('response_type', 'code')
    instagramAuthUrl.searchParams.set('state', session.user.email || 'user')

    return NextResponse.redirect(instagramAuthUrl.toString())
    
  } catch (error) {
    console.error('Instagram connect error:', error)
    return NextResponse.json(
      { error: 'Instagram connection failed' },
      { status: 500 }
    )
  }
}