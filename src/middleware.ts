import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { protectedRoutes } from "@/config/routes";
import { getAuth } from "@/actions/auth";
import { ADMIN } from "./constants/data";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let auth = await getAuth();

  // Redirect authenticated users away from /auth pages
  if (pathname.startsWith("/auth") && auth.isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access /dashboard or its subroutes
  if (pathname.startsWith("/dashboard") && !auth.isAuth) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // Allow admin users to access /app/admin
  if (pathname.startsWith("/admin") && auth.payload?.role === ADMIN) {
    return NextResponse.next();
  }

  // Redirect non-admin users from /app/admin
  if (pathname.startsWith("/admin") && auth.payload?.role !== ADMIN) {
    return NextResponse.redirect(new URL("/auth/logout", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
