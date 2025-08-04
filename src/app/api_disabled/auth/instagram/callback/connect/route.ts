import { NextRequest, NextResponse } from 'next/server';

// Instagram OAuth認証URL生成
export async function GET(request: NextRequest) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/instagram/callback`;
  
  // Instagram認証に必要なスコープ
  const scope = [
    'email'
  ].join(',');

  const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  authUrl.searchParams.set('client_id', clientId!);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', 'instagram_auth');

  return NextResponse.json({ 
    authUrl: authUrl.toString(),
    message: 'Instagram認証URLを生成しました' 
  });
}