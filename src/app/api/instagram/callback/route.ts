import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    
    if (error) {
      console.error('Instagram OAuth error:', error)
      return NextResponse.redirect(new URL('/dashboard?error=instagram_denied', request.url))
    }
    
    if (!code) {
      return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url))
    }

    // セッション確認
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.redirect(new URL('/api/auth/signin', request.url))
    }

    // アクセストークンを取得
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID || '',
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET || '',
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/instagram/callback`,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(new URL('/dashboard?error=token_failed', request.url))
    }

    const tokenData = await tokenResponse.json()
    
    // Long-lived tokenを取得
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`
    )

    if (longLivedTokenResponse.ok) {
      const longLivedData = await longLivedTokenResponse.json()
      
      // ダッシュボードにアクセストークン付きでリダイレクト
      return NextResponse.redirect(
        new URL(`/dashboard?access_token=${longLivedData.access_token}&instagram_connected=true`, request.url)
      )
    } else {
      // Short-lived tokenでもとりあえずリダイレクト
      return NextResponse.redirect(
        new URL(`/dashboard?access_token=${tokenData.access_token}&instagram_connected=true`, request.url)
      )
    }

  } catch (error) {
    console.error('Instagram callback error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=callback_failed', request.url))
  }
}