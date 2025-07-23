import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Middleware personnalisé si nécessaire
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protéger les routes admin
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        
        // Protéger les routes dashboard
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }
        
        // Protéger les API routes sensibles
        if (req.nextUrl.pathname.startsWith('/api/admin')) {
          return token?.role === 'admin';
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/products/:path*',
    '/api/orders/:path*',
    '/api/upload/:path*'
  ]
};
