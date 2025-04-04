import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/';

  // Get the token from localStorage (this won't work in middleware, but we'll simulate it)
  // In a real app, you would use cookies or JWT tokens
  const isAuthenticated = false; // This would be determined by checking for a valid token

  // If the path is dashboard and the user is not authenticated, redirect to login
  if (path.startsWith('/dashboard') && !isAuthenticated) {
    // In a real app with proper auth, this would check for a valid token
    // For our demo, we'll let client-side auth handle this
    return NextResponse.next();
  }

  // If the user is authenticated and trying to access login/register, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};