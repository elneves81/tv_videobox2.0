import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Se usuário está logado e tenta acessar signin, redireciona para dashboard
    if (token && pathname === '/auth/signin') {
      console.log('User authenticated, redirecting from signin to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    console.log('Middleware: path =', pathname, ', has token =', !!token);
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Lista de páginas públicas que não precisam de autenticação
        const publicPaths = [
          '/',
          '/auth/signin',
          '/register',
          '/test-login',
          '/debug-session'
        ];
        
        // Permitir API routes
        if (pathname.startsWith('/api/')) {
          return true;
        }
        
        // Permitir páginas públicas
        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true;
        }
        
        // Para todas as outras páginas, verificar se há token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
