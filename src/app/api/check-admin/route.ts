import { NextResponse } from "next/server";

// 허용된 관리자 IP 목록
const ADMIN_IPS = ["127.0.0.1", "::1", process.env.NEXT_PUBLIC_HOME_IP!];

export async function GET(request: Request) {
  // X-Forwarded-For 헤더에서 IP 가져오기
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

  // IP가 관리자 IP 목록에 있는지 확인
  const isAdmin = ADMIN_IPS.includes(ip);

  return NextResponse.json({ isAdmin });
}
