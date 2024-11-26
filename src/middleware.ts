import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const session = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });


  const cookie = cookies().get(COOKIE_NAME);

  if (!session && path !== `/auth` && path !== `/reset-password`) {
    return NextResponse.redirect(new URL(`/auth`, req.url));
  } else if (session && path === `/auth`) {
    return NextResponse.redirect(new URL(`/`, req.url));
  }

  if (!cookie) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, defaultLocale);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
