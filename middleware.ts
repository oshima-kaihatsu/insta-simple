import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware intercepted:', pathname);
  
  // /api/auth/* を /insta-simple/api/auth/* にリダイレクト
  if (pathname.startsWith('/api/auth/')) {
    const newUrl = new URL(request.url);
    newUrl.pathname = pathname.replace('/api/auth/', '/insta-simple/api/auth/');
    
    console.log(`Middleware redirect: ${pathname} → ${newUrl.pathname}`);
    return NextResponse.redirect(newUrl, 301);
  }
  
  // /api/instagram/* を /insta-simple/api/instagram/* にリダイレクト
  if (pathname.startsWith('/api/instagram/')) {
    const newUrl = new URL(request.url);
    newUrl.pathname = pathname.replace('/api/instagram/', '/insta-simple/api/instagram/');
    
    console.log(`Middleware redirect: ${pathname} → ${newUrl.pathname}`);
    return NextResponse.redirect(newUrl, 301);
  }
  
  // /api/stripe/* を /insta-simple/api/stripe/* にリダイレクト
  if (pathname.startsWith('/api/stripe/')) {
    const newUrl = new URL(request.url);
    newUrl.pathname = pathname.replace('/api/stripe/', '/insta-simple/api/stripe/');
    
    console.log(`Middleware redirect: ${pathname} → ${newUrl.pathname}`);
    return NextResponse.redirect(newUrl, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/instagram/:path*',
    '/api/stripe/:path*'
  ],
};