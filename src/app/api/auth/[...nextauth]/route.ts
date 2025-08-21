import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createUser, getUserByEmail, updateUser } from '@/lib/supabase'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // ユーザーが既に存在するかチェック
          const { data: existingUser } = await getUserByEmail(user.email)
          
          if (!existingUser) {
            // 新規ユーザーを作成
            console.log('Creating new user:', user.email)
            const { data: newUser, error } = await createUser({
              email: user.email,
              name: user.name || '',
              google_id: user.id
            })
            
            if (error) {
              console.error('Error creating user:', error)
              return false
            }
            
            console.log('New user created:', newUser?.id)
          } else {
            // 既存ユーザーの情報を更新
            console.log('Updating existing user:', existingUser.id)
            await updateUser(existingUser.id, {
              name: user.name || existingUser.name,
              google_id: user.id
            })
          }
          
          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      return true
    },
    
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const { data: user } = await getUserByEmail(session.user.email)
          if (user) {
            session.user.id = user.id
            session.user.current_plan = user.current_plan
            session.user.subscription_status = user.subscription_status
            session.user.stripe_customer_id = user.stripe_customer_id
          }
        } catch (error) {
          console.error('Session callback error:', error)
        }
      }
      return session
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    
    async redirect({ url, baseUrl }) {
      // ログイン後はダッシュボードへ
      if (url.startsWith('/') || url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`
      }
      return baseUrl
    },
  },
  // NextAuth設定
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }