import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            candidateProfile: true,
            recruiterProfile: true,
            instituteProfile: true,
          },
        })

        if (!user || !user.isActive) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.candidateProfile?.fullName ||
                user.recruiterProfile?.fullName ||
                user.instituteProfile?.fullName ||
                user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
}

declare module 'next-auth' {
  interface User {
    role: Role
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: Role
    }
  }

  interface JWT {
    id: string
    role: Role
  }
}
