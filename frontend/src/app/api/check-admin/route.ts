import { NextResponse } from "next/server";

// 허용된 관리자 IP 목록
const ADMIN_IPS = ["127.0.0.1", "::1", process.env.NEXT_PUBLIC_HOME_IP!];

export async function GET(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

  const isAdmin = ADMIN_IPS.includes(ip);

  return NextResponse.json({ isAdmin });
}
