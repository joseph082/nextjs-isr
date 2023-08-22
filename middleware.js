// export { default } from 'next-auth/middleware'; // locks down whole site
// export default function () {}
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

function parseUrl(url) {
  const defaultUrl = new URL('http://localhost:3000/api/auth');

  if (url && !url.startsWith('http')) {
    url = `https://${url}`;
  }

  const _url = new URL(url ?? defaultUrl);
  const path = (_url.pathname === '/' ? defaultUrl.pathname : _url.pathname)
    // Remove trailing slash
    .replace(/\/$/, '');

  const base = `${_url.origin}${path}`;

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  };
}

export async function middleware(req, options, onSuccess) {
  const { pathname, search, origin, basePath } = req.nextUrl;

  const cronJobPaths = ['/api/supabase-edge', '/api/supabase-edge-west'];
  if (cronJobPaths.includes(pathname)) {
    // https://github.com/orgs/vercel/discussions/1734
    const requestHeaders = new Headers(req.headers);
    if (requestHeaders.get('Authorization') === `Bearer ${process.env.CRON_SECRET}`) {
      return; // Vercel cron job
    }
  }

  const signInPage = options?.pages?.signIn ?? '/api/auth/signin';
  const errorPage = options?.pages?.error ?? '/api/auth/error';
  const authPath = parseUrl(process.env.NEXTAUTH_URL).path;
  const publicPaths = ['/_next', '/favicon.ico'];

  // Avoid infinite redirects/invalid response
  // on paths that never require authentication
  if (
    `${basePath}${pathname}`.startsWith(authPath) ||
    [signInPage, errorPage].includes(pathname) ||
    publicPaths.some((p) => pathname.startsWith(p))
  ) {
    return;
  }

  const secret = options?.secret ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error(`[next-auth][error][NO_SECRET]`, `\nhttps://next-auth.js.org/errors#no_secret`);

    const errorUrl = new URL(`${basePath}${errorPage}`, origin);
    errorUrl.searchParams.append('error', 'Configuration');

    return NextResponse.redirect(errorUrl);
  }

  const token = await getToken({
    req,
    decode: options?.jwt?.decode,
    cookieName: options?.cookies?.sessionToken?.name,
    secret,
  });

  const isAuthorized = (await options?.callbacks?.authorized?.({ req, token })) ?? !!token;

  // the user is authorized, let the middleware handle the rest
  if (isAuthorized) return await onSuccess?.(token);

  // the user is not logged in, redirect to the sign-in page
  const signInUrl = new URL(`${basePath}${signInPage}`, origin);
  signInUrl.searchParams.append('callbackUrl', `${basePath}${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
}
