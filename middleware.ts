import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { publicRoutes } from "./routes";

export default auth((req) => {
  console.log("Middleware invoked for", req.nextUrl.pathname);

  const isLoggedIn = !!req.auth;
  console.log("User isLoggedIn status: ", isLoggedIn);
  console.log("User auth data: ", req.auth?.user);

  // Skip auth check for public routes
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  if (isPublicRoute) {
    return;
  }

  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  if (isAuthRoute) {
    return;
  }

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (isAdminRoute && req.auth?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin)); // Redirect non-admin users to the home page
  }

  if (!isLoggedIn && req.nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
  }
  if (isLoggedIn && req.nextUrl.pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // Adding role-based access control for admin routes
  // const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  // if (isAdminRoute && req.auth?.user?.role !== "admin") {
  //   return NextResponse.redirect(new URL("/", req.nextUrl.origin)); // Redirect non-admin users to the home page
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)",
  ],
};
