import { NextRequest, NextResponse } from 'next/server'

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  
  console.log('=== Facebook Graph API Callback ===')
  console.log('URL:', request.url)
  console.log('All params:', Object.fromEntries(searchParams.entries()))
  
  // Webhook認証処理（既存）
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  
  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verified')
    return new Response(challenge, { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
  
  // OAuth処理（Graph API用）
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  
  console.log('OAuth params:', { code, error })
  
  // NEXTAUTH_URLの確認とフォールバック
  const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin
  console.log('Base URL:', baseUrl)
  
  if (error) {
    console.error('Facebook OAuth error:', error)
    return NextResponse.redirect(new URL(`${baseUrl}/dashboard?error=auth_failed`))
  }
  
  if (!code) {
    console.error('No authorization code received')
    return NextResponse.redirect(new URL(`${baseUrl}/dashboard?error=no_code`))
  }
  
  try {
    console.log('Exchanging code for access token...')
    
    // redirect_uriを絶対URLで指定
    const redirectUri = `${baseUrl}/api/instagram/callback`
    console.log('Using redirect_uri:', redirectUri)
    
    // Step 1: Exchange code for access token (Graph API用)
    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        redirect_uri: redirectUri,
        code: code,
      }),
    })
    
    const tokenData = await tokenResponse.json()
    console.log('Token response:', tokenData)
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(new URL(`${baseUrl}/dashboard?error=token_failed`))
    }
    
    // Step 2: Get user pages (Instagram Business accounts)
    const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`)
    const pagesData = await pagesResponse.json()
    console.log('Pages data:', pagesData)
    
    // 成功時のリダイレクト
    const redirectUrl = new URL(`${baseUrl}/dashboard`)
    redirectUrl.searchParams.set('access_token', tokenData.access_token)
    redirectUrl.searchParams.set('success', 'true')
    
    console.log('Redirecting to dashboard with token:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
    
  } catch (error) {
    console.error('Facebook OAuth process error:', error)
    return NextResponse.redirect(new URL(`${baseUrl}/dashboard?error=process_failed`))
  }
}