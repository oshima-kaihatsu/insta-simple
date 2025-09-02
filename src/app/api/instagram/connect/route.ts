import { NextRequest } from 'next/server';
import { rateLimiter } from '@/utils/rateLimiter';
import { getClientIP } from '@/utils/getClientIP';

// Dynamic routeに設定
export const dynamic = 'force-dynamic';

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

    // 本番環境で確実にHTTPSのURLを使用
    // Facebook App IDを使用（Instagram Graph API v23では Facebook App IDが必要）
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || process.env.INSTAGRAM_CLIENT_ID || '1776291423096614';
    const baseUrl = process.env.NEXTAUTH_URL || 'https://insta-simple.thorsync.com';
    const redirectUri = `${baseUrl}/api/instagram/callback`;

    console.log('=== Instagram Graph API Connect (New API) ===');
    console.log('Client ID:', clientId);
    console.log('Environment variable exists:', !!process.env.INSTAGRAM_CLIENT_ID);
    console.log('Redirect URI:', redirectUri);
    console.log('Client IP:', clientIP);
    console.log('Rate limit remaining:', rateLimitResult.remainingRequests);

    // Instagram Graph API v23の必須権限（2024年以降のbusiness_management含む）
    const scope = 'business_management,pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,instagram_manage_insights';
    
    // Instagram連携のための特別なextrasパラメータ
    const extras = JSON.stringify({
      setup: {
        channel: 'IG_API_ONBOARDING'
      }
    });
    
    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: 'code',
      state: 'instagram',
      extras: extras
    });
    
    const authUrl = `https://www.facebook.com/v23.0/dialog/oauth?${authParams.toString()}`;
    
    console.log('Scope used:', scope);

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