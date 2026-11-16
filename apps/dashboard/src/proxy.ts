import { NextResponse, type NextRequest } from "next/server";

// OAuth callbacks, API CORS, and session cookies must use the same local host.
export function proxy(request: NextRequest) {
  const api = new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3051");
  const hostname = request.headers.get("host")?.split(":")[0];
  if (hostname === "127.0.0.1" && api.hostname === "localhost") {
    const url = request.nextUrl.clone();
    url.hostname = "localhost";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
