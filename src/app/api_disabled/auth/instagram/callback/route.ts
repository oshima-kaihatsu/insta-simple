import { NextRequest, NextResponse } from 'next/server'

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  
  console.log('Instagram callback:', { code, error })
  
  if (error) {
    console.error('Instagram OAuth error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=auth_failed', request.url))
  }
  
  if (!code) {
    console.error('No authorization code received')
    return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url))
  }
  
  try {
    console.log('Exchanging code for access token...')
    
    // Step 1: Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: `${request.nextUrl.origin}/api/instagram/callback`,
        code: code,
      }),
    })
    
    const tokenData = await tokenResponse.json()
    console.log('Token response:', tokenData)
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(new URL('/dashboard?error=token_failed', request.url))
    }
    
    // Step 2: Try to get long-lived access token
    let finalAccessToken = tokenData.access_token
    
    try {
      const longTokenResponse = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`
      )
      
      if (longTokenResponse.ok) {
        const longTokenData = await longTokenResponse.json()
        console.log('Long-lived token obtained:', longTokenData)
        finalAccessToken = longTokenData.access_token
      } else {
        console.log('Long-lived token failed, using short-lived token')
      }
    } catch (error) {
      console.log('Long-lived token error, using short-lived token:', error)
    }
    
    // Redirect to dashboard with access token
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('access_token', finalAccessToken)
    redirectUrl.searchParams.set('user_id', tokenData.user_id)
    redirectUrl.searchParams.set('success', 'true')
    
    console.log('Redirecting to dashboard with token')
    return NextResponse.redirect(redirectUrl)
    
  } catch (error) {
    console.error('Instagram OAuth process error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=process_failed', request.url))
  }
}