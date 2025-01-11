import prisma from '@/db'
import GoogleProvider from 'next-auth/providers/google'

export const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, profile }: any) {
      if (!profile || !profile.sub) {
        console.error('Missing Google profile or sub')
        return false
      }

      const googleId = profile.sub

      try {
        const existingUser = await prisma.user.findUnique({
          where: { id: googleId },
        })

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: googleId,
              name: user.name || 'Unknown User',
              email: user.email || `user@example.com`,
              image: user.image,
            },
          })
        }
      } catch (error) {
        console.error('Error saving user to database:', error)
        return false
      }

      return true
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub
      }

      return session
    },
  },
}
