import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // 認証が必要なページへのアクセス時の処理
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // /dashboard にアクセスする場合は認証が必要
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*']
}