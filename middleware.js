import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Get pathname for easier manipulation
  const path = url.pathname;
  
  // Handle different environments
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const isVercelPreview = hostname.includes('vercel.app');
  
  // Extract subdomain more reliably
  let subdomain = '';
  
  if (isLocalhost) {
    // For localhost, you can simulate subdomains or use query params
    // Example: localhost:3000?store=pizza-palace
    const storeParam = url.searchParams.get('store');
    if (storeParam) {
      url.pathname = `/store/${storeParam}${path}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }
  
  if (isVercelPreview) {
    // Handle Vercel preview deployments
    // Format: your-app-git-branch-username.vercel.app
    const parts = hostname.split('.');
    if (parts.length > 3) {
      // This might be a preview with subdomain simulation
      // You'd need to customize based on your preview setup
      return NextResponse.next();
    }
  }
  
  // Production/staging domain handling
  const parts = hostname.split('.');
  
  // Skip if www or if it's your main domain
  if (parts[0] === 'www' || parts.length < 3) {
    return NextResponse.next();
  }
  
  // Extract subdomain (first part)
  subdomain = parts[0];
  
  // List of reserved subdomains to avoid conflicts
  const reservedSubdomains = [
    'www', 'api', 'admin', 'mail', 'ftp', 'blog', 
    'shop', 'store', 'app', 'dashboard', 'help',
    'support', 'docs', 'cdn', 'static', 'assets'
  ];
  
  if (reservedSubdomains.includes(subdomain)) {
    return NextResponse.next();
  }
  
  // Handle different routes
  if (path.startsWith('/api/') || 
      path.startsWith('/_next/') || 
      path.startsWith('/favicon.ico') ||
      path.startsWith('/robots.txt') ||
      path.startsWith('/sitemap.xml')) {
    return NextResponse.next();
  }
  
  // Rewrite to the store page with subdomain
  url.pathname = `/store/${subdomain}${path}`;
  
  // Add custom headers for debugging (optional)
  const response = NextResponse.rewrite(url);
  response.headers.set('x-subdomain', subdomain);
  response.headers.set('x-original-host', hostname);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};