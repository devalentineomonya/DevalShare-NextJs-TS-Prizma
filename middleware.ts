import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

// Paths that require authentication
const protectedPaths = ["/projects/new", "/projects/edit", "/messages", "/profile", "/settings"]

// Paths that should redirect to home if already authenticated
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const { pathname } = request.nextUrl

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Check if the path is an auth path
  const isAuthPath = authPaths.some((path) => pathname === path)

  // If the path requires authentication and the user is not authenticated
  if (isProtectedPath && !session) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // If the path is an auth path and the user is already authenticated
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}

