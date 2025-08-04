import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/insta-simple/auth/signin',
    error: '/insta-simple/auth/error',
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect() {
      // 常にダッシュボードにリダイレクト
      return 'https://thorsync.com/insta-simple/dashboard';
    },
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
});

export { handler as GET, handler as POST };