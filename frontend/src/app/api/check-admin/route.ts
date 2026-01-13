import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const homeIPv4 = process.env.NEXT_PUBLIC_HOME_IP;
  const homeIPv6 = process.env.NEXT_PUBLIC_HOME_IP_V6;

  // X-Forwarded-For 또는 실제 IP 가져오기
  const forwarded = request.headers.get("x-forwarded-for");
  const cfIP = request.headers.get("cf-connecting-ip");
  const realIP = request.headers.get("x-real-ip");

  const clientIP = cfIP || forwarded?.split(",")[0]?.trim() || realIP || "unknown";

  const isAdmin = clientIP === homeIPv4 || clientIP === homeIPv6;

  return NextResponse.json({ isAdmin });
}
