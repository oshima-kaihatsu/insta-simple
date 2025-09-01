import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    console.log('🧪 Testing token with different endpoints...');
    
    // Test 1: Instagram Graph API (what we're trying)
    console.log('🔍 Testing Instagram Graph API...');
    const instagramResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption&access_token=${token}`
    );
    const instagramResult = {
      status: instagramResponse.status,
      statusText: instagramResponse.statusText,
      data: instagramResponse.ok ? await instagramResponse.json() : await instagramResponse.text()
    };
    
    // Test 2: Facebook Graph API (what the token is actually for)
    console.log('🔍 Testing Facebook Graph API...');
    const facebookResponse = await fetch(
      `https://graph.facebook.com/v23.0/me?fields=id,name&access_token=${token}`
    );
    const facebookResult = {
      status: facebookResponse.status,
      statusText: facebookResponse.statusText,
      data: facebookResponse.ok ? await facebookResponse.json() : await facebookResponse.text()
    };
    
    // Test 3: Token debugging
    console.log('🔍 Testing token debug...');
    const debugResponse = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`
    );
    const debugResult = {
      status: debugResponse.status,
      statusText: debugResponse.statusText,
      data: debugResponse.ok ? await debugResponse.json() : await debugResponse.text()
    };
    
    return NextResponse.json({
      instagram: instagramResult,
      facebook: facebookResult,
      debug: debugResult,
      tokenPreview: `${token.substring(0, 20)}...`
    });
    
  } catch (error) {
    console.error('❌ Token test error:', error);
    return NextResponse.json({
      error: 'Failed to test token',
      message: error.message
    }, { status: 500 });
  }
}