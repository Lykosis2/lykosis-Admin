import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import { ofetch } from 'ofetch'
export const adminOpts = {
  providers: [
    CredentialsProvider({
      id: 'admin',
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        token2FA: { label: '2FA Token', type: 'text' }, // 2FA input field
      },
      async authorize(credentials) {
        const user = await ofetch(`${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/finalEndPoints/login/admin`, {
          method: 'POST',
          body: {
            email: credentials?.email,
            password: credentials?.password,
            token2FA: credentials?.token2FA,
          },
        })

        if (user) {
          return user
        }
        return null
      },
    }),
  ],
  //  adapter:SequelizeAdapter(sequelize),
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ user, token }) {
      if (user) { // Note that this if condition is needed
        token.user = { ...user }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.user) { // Note that this if condition is needed
        session.user = token.user
      }
      return session
    },
  },

}

const handler = NextAuth(adminOpts)

export default handler