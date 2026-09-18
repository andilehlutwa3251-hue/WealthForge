import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
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
    '/api/assets/:path*',
    '/api/wealth-score/:path*',
    '/api/subscription/:path*',
    '/api/stripe/:path*',
    '/api/academy/:path*',
    '/api/ai-coach/:path*',
  ],
};
