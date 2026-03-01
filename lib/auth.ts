// lib/auth.ts
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: "https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account&access_type=offline&response_type=code",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {}
        if (!email || !password) throw new Error("Please provide both email and password")

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) throw new Error("Invalid credentials")

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new Error("Invalid credentials")

        return user
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      const callback = url.startsWith("/") ? `${baseUrl}${url}` : url
      if (callback === baseUrl || callback === `${baseUrl}/`) return `${baseUrl}/dashboard`
      return callback
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.email = user.email
        token.name = user.name
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      session.accessToken = token.accessToken as string
      return session
    },
  },
  events: {},
}




