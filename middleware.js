import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');
  
  const subdomain = hostname?.split('.')[0];
  
  if (subdomain === 'www' || subdomain === 'localhost' || hostname?.includes('localhost')) {
    return NextResponse.next();
  }
  
  if (subdomain) {
    url.pathname = `/store/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};