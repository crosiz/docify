import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for a protected route
  const protectedRoutes = ["/dashboard", "/upload", "/email", "/settings", "/insights"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Check for session token in cookies
    const token =
      request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token")

    if (!token) {
      // Redirect to sign-in page if no token found
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*", "/email/:path*", "/settings/:path*", "/insights/:path*"],
}
