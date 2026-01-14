import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { createHash } from "crypto";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function generateHash(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 32);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    let endpoint = "/api/visitors/count";
    if (type === "total") {
      endpoint = "/api/visitors/total";
    }

    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error("Failed to fetch visitor count");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Visitor count error:", error);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();

    // body에서 pagePath 가져오기 (없으면 "/" 기본값)
    let pagePath = "/";
    try {
      const body = await request.json();
      pagePath = body.pagePath || "/";
    } catch {
      // empty body is ok
    }

    // IP 주소 추출
    const forwarded = headersList.get("x-forwarded-for");
    const ipAddress = forwarded?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    // User-Agent 추출
    const userAgent = headersList.get("user-agent") || "unknown";

    // 쿠키에서 세션/방문자 ID 가져오거나 생성
    let cookieId = cookieStore.get("visitor_id")?.value;
    if (!cookieId) {
      cookieId = generateHash(`${Date.now()}-${Math.random()}`);
    }

    let sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) {
      sessionId = generateHash(`${Date.now()}-${Math.random()}-session`);
    }

    // visitorHash 생성 (cookieId + IP + UA 조합으로 더 정확한 식별)
    const visitorHash = generateHash(`${cookieId}-${ipAddress}-${userAgent}`);

    const visitorData = {
      visitorHash,
      sessionId,
      cookieId,
      ipAddress,
      userAgent,
      pagePath,
    };

    const response = await fetch(`${API_URL}/api/visitors/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error("Failed to log visitor");
    }

    const data = await response.json();

    // 쿠키 설정이 포함된 응답 생성
    const res = NextResponse.json(data);

    // visitor_id 쿠키 설정 (1년)
    res.cookies.set("visitor_id", cookieId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    // session_id 쿠키 설정 (세션)
    res.cookies.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error("Visitor log error:", error);
    return NextResponse.json({ error: "Failed to log visitor" }, { status: 500 });
  }
}
