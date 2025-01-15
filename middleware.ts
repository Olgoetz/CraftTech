import { auth } from "@/auth";

export default auth((req) => {
  console.log("Middleware invoked for", req.nextUrl.pathname);
  const isLoggedIn = !!req.auth;
  console.log("User isLoggedIn status: ", isLoggedIn);
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  if (isAuthRoute) {
    return;
  }
  if (!isLoggedIn && req.nextUrl.pathname !== "/sign-in") {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (isLoggedIn && req.nextUrl.pathname === "/sign-in") {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
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
