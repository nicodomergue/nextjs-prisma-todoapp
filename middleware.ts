import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isNavigatingToAuthRoutes =
    request.nextUrl.pathname === "/sign-in" ||
    request.nextUrl.pathname === "/log-in";

  if (!token) {
    if (isNavigatingToAuthRoutes) return NextResponse.next();
    return NextResponse.redirect(new URL("/log-in", request.url));
  } else {
    if (isNavigatingToAuthRoutes)
      return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();

  // if (!token && isNavigatingToAuthRoutes) {
  //   return NextResponse.next()
  // }

  // if(!token && !isNavigatingToAuthRoutes) {
  //   return NextResponse.redirect(new URL("/log-in", request.url))
  // }

  // if (isNavigatingToAuthRoutes) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/sign-in", "/log-in"],
};
