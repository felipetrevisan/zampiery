import { auth as firebaseApp } from '@nathy/web/config/firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import type { NextAuthOptions, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const auth = getAuth(firebaseApp.app)
          const email = credentials?.email as string
          const password = credentials?.password as string
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const user = userCredential.user
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV !== 'production' ? 'dev-secret' : undefined),
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT
      user?: { id: string; name?: string | null; email?: string | null; image?: string | null }
    }) {
      if (user) {
        ;(token as JWT & { id?: string }).id = user.id
        token.name = user.name ?? undefined
        token.email = user.email ?? undefined
        token.picture = user.image ?? undefined
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        ;(session.user as Session['user'] & { id?: string }).id = (
          token as JWT & { id?: string }
        ).id
        session.user.name = token.name ?? null
        session.user.email = token.email ?? null
        session.user.image = token.picture ?? null
      }
      return session
    },
  },
  events: {
    async signIn(message: { user?: { email?: string | null } }) {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[NextAuth] signIn', { user: message.user?.email })
      }
    },
  },
  debug: process.env.NODE_ENV !== 'production',
}
