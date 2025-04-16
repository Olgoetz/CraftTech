import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { publicRoutes } from "./routes";

export default auth((req) => {
  console.log("Middleware invoked for", req.nextUrl.pathname);
  console.log(req);
  const isLoggedIn = !!req.auth;
  console.log("User isLoggedIn status: ", isLoggedIn);

  // Skip auth check for public routes
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  if (isPublicRoute) {
    return;
  }

  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  if (isAuthRoute) {
    return;
  }
  if (!isLoggedIn && req.nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
  }
  if (isLoggedIn && req.nextUrl.pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)",
  ],
};
