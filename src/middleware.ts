// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Redirection basée sur le rôle
    if (token?.role) {
      const role = token.role as string;

      // Protection des routes admin
      if (pathname.startsWith('/admin') && role !== 'admin') {
        console.log('❌ Non-admin trying to access admin area:', { role, pathname });
        // Rediriger vers le dashboard approprié selon le rôle
        if (role === 'vendor') {
          return NextResponse.redirect(new URL('/dashboard/vendor', req.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard/buyer', req.url));
        }
      }

      // Protection des routes vendor
      if (pathname.startsWith('/dashboard/vendor') && role !== 'vendor' && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/buyer', req.url));
      }

      // Protection des routes buyer  
      if (pathname.startsWith('/dashboard/buyer') && role === 'vendor') {
        return NextResponse.redirect(new URL('/dashboard/vendor', req.url));
      }

      if (pathname.startsWith('/dashboard/buyer') && role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }

      // Redirection depuis /dashboard vers le bon dashboard
      if (pathname === '/dashboard') {
        switch (role) {
          case 'admin':
            return NextResponse.redirect(new URL('/admin', req.url));
          case 'vendor':
            return NextResponse.redirect(new URL('/dashboard/vendor', req.url));
          case 'buyer':
            return NextResponse.redirect(new URL('/dashboard/buyer', req.url));
        }
      }

      // Redirection depuis /admin pour les non-admins
      if (pathname === '/admin' && role !== 'admin') {
        switch (role) {
          case 'vendor':
            return NextResponse.redirect(new URL('/dashboard/vendor', req.url));
          case 'buyer':
            return NextResponse.redirect(new URL('/dashboard/buyer', req.url));
          default:
            return NextResponse.redirect(new URL('/', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Permettre l'accès aux routes publiques
        if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/admin')) {
          return true;
        }
        
        // Exiger une authentification pour les routes protégées
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/user/:path*',
    '/api/vendor/:path*',
    '/api/admin/:path*'
  ]
};