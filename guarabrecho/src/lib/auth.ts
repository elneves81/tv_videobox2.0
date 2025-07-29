import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Buscar usuário no banco de dados
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user || !user.password) {
            return null;
          }

          // Verificar senha
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }: any) {
      console.log('NextAuth redirect called:', { url, baseUrl });
      
      // Prevent redirect loops by checking if we're already at signin
      if (url.includes('/auth/signin') && url.includes('callbackUrl')) {
        console.log('Preventing signin redirect loop');
        return `${baseUrl}/dashboard`;
      }
      
      // Se é uma URL absoluta que pertence ao nosso domínio
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Se é uma URL relativa
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Por padrão, sempre redirecionar para dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
