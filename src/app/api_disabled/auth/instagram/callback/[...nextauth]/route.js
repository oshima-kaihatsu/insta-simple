import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // ユーザーがサインインした時の処理
      console.log('Sign in:', { user, account, profile });
      return true;
    },
    async session({ session, token }) {
      // セッション情報をカスタマイズ
      if (token.sub) {
        session.user.id = token.sub;
      }
      
      // トライアル情報を追加（後で実装）
      session.user.trialStatus = 'active'; // temporary
      session.user.trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14日後
      
      return session;
    },
    async jwt({ token, user, account }) {
      // JWTトークンをカスタマイズ
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin', // カスタムサインインページ
    error: '/auth/error',   // エラーページ
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };