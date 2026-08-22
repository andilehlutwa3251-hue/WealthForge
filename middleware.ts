import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/academy/:path*',
    '/settings/:path*',
    '/api/user/:path*',
    '/api/wealth-score/:path*',
    '/api/academy/:path*',
    '/api/ai-coach/:path*',
  ],
};
