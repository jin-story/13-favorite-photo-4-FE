import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { exp } = jwtDecode(token);
  const maxAge = Math.max(0, exp - Math.floor(Date.now() / 1000));

  const response = NextResponse.redirect(
    new URL("/market-posting", request.url),
  );

  response.cookies.set("accessToken", token, {
    path: "/",
    maxAge,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  return response;
}
