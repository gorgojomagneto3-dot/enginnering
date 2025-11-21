import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  
  if (!token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/tasks/:path*', '/subjects/:path*', '/notes/:path*', '/pomodoro/:path*', '/progress/:path*', '/settings/:path*'],
};
