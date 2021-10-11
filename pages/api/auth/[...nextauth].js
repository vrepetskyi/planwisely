import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { redirect } from 'next/dist/server/api-utils'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl
    }
  }
})