import { NextRequest } from 'next/server';
import { rateLimiter } from '@/utils/rateLimiter';
import { getClientIP } from '@/utils/getClientIP';

export async function GET(request: NextRequest) {
  try {
    // 🚨 レート制限チェック（connectは厳しめに制限）
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiter.isRateLimited(`connect_${clientIP}`);

    if (rateLimitResult.limited) {
      const resetTime = rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime) : new Date();
      
      return Response.json(
        { 
          error: 'API rate limit exceeded',
          message: 'Too many connection attempts. Please try again later.',
          resetTime: resetTime.toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.getTime().toString(),
            'Retry-After': Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/instagram/callback`;

    console.log('=== Instagram Graph API Connect (New API) ===');
    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);
    console.log('Client IP:', clientIP);
    console.log('Rate limit remaining:', rateLimitResult.remainingRequests);

    // 新しいInstagram Graph API エンドポイント（2024年12月4日以降）
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,pages_show_list&response_type=code&state=instagram`;

    console.log('Auth URL:', authUrl);
    return Response.redirect(authUrl);

  } catch (error) {
    console.error('Instagram Connect Error:', error);
    return Response.json(
      { error: 'Failed to initiate Instagram connection' },
      { 
        status: 500,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': '0'
        }
      }
    );
  }
}