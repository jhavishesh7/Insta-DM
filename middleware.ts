import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/payment(.*)",
  "/callback(.*)",
]);

const isPreLaunchPage = createRouteMatcher(["/pre-launch(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const isPrelaunchMode = process.env.PRELAUNCH === "true";

  if (isPrelaunchMode && req.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/pre-launch", req.url));
  }

  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
