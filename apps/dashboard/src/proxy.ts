import { NextResponse, type NextRequest } from "next/server";

// OAuth callbacks, API CORS, and session cookies must use the same local host.
export function proxy(request: NextRequest) {
  const api = new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3051");
  const hostname = request.headers.get("host")?.split(":")[0];
  const localHosts = ["localhost", "127.0.0.1"];
  if (hostname && localHosts.includes(hostname) && localHosts.includes(api.hostname) && hostname !== api.hostname) {
    const url = request.nextUrl.clone();
    url.hostname = api.hostname;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
