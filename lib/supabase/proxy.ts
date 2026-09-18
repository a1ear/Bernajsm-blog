import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Unlike an internal business app, this site is public by default — only
 * `/bjsm-write/**` needs a session. `/bjsm-write/login` is the one exception inside
 * that prefix.
 */
const ADMIN_PREFIX = "/bjsm-write";
const ADMIN_LOGIN_PATH = "/bjsm-write/login";

function isProtectedPath(pathname: string) {
  return (
    (pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)) &&
    pathname !== ADMIN_LOGIN_PATH
  );
}

/**
 * Refreshes the Supabase session cookie on every request and redirects
 * unauthenticated traffic away from `/bjsm-write/**`.
 *
 * This runs in `proxy.ts` (Next.js 16 renamed the `middleware` convention to
 * `proxy`). It is the outer gate; every mutating Server Action still
 * re-checks the session itself — see `lib/auth.ts`.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without credentials there is no session to read. Fail closed: send
  // admin traffic to /bjsm-write/login rather than silently letting it through.
  if (!url || !anonKey) {
    if (!isProtectedPath(request.nextUrl.pathname)) {
      return supabaseResponse;
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN_PATH;
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // Do not run code between createServerClient and getUser() — it is what
  // refreshes the auth token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === ADMIN_LOGIN_PATH) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = ADMIN_PREFIX;
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}
