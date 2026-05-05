// proxy.ts (или middleware.ts в Next.js)

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session"; // твоя функция

export async function proxy(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/player/:name*", "/me"],
};
