import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest): string {
  // Vercel, Cloudflare, その他のプロキシ環境での IP 取得
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // フォールバック（開発環境用）
  return '127.0.0.1';
}