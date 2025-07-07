import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const jwtToken = req.cookies.get("jwtToken");
  const token = jwtToken?.value as string;

  if (!token) {
    if (req.nextUrl.pathname.startsWith("/api/users/profile/")) {
      return NextResponse.json(
        { mesage: "No Token Provided" },
        { status: 401 } // Unauthorized
      );
    }
  } else {
    if (
      req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/register"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: ["/api/users/profile/:path*", "/login", "/register"],
};
