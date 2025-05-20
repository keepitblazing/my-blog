// src/app/api/visitor/route.ts
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    const cookieStore = await cookies();

    // 현재 시간을 서울 시간으로 설정
    const now = dayjs().tz("Asia/Seoul");
    const today = now.format("YYYY-MM-DD");

    // 세션 ID 확인 또는 생성
    let sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) {
      sessionId = uuidv4();
      cookieStore.set("session_id", sessionId, {
        maxAge: 60 * 60,
        path: "/",
      });
    }

    // 쿠키 ID 확인 또는 생성
    let cookieId = cookieStore.get("visitor_id")?.value;
    if (!cookieId) {
      cookieId = uuidv4();
      cookieStore.set("visitor_id", cookieId, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    // 방문자 해시 생성
    const visitorHash = createHash("sha256")
      .update(`${ip}${userAgent}`)
      .digest("hex");

    // 중복 방문 체크
    const { data: existingVisit } = await supabase
      .from("visitor_logs")
      .select("*")
      .eq("visitor_hash", visitorHash)
      .eq("session_id", sessionId)
      .gte("visited_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .single();

    if (!existingVisit) {
      // 새로운 방문 로그 저장
      await supabase.from("visitor_logs").insert({
        visitor_hash: visitorHash,
        session_id: sessionId,
        cookie_id: cookieId,
        ip_address: ip,
        user_agent: userAgent,
        page_path: new URL(req.url).pathname,
        is_new_visitor: true,
        visited_at: now.toISOString(),
      });

      // 일별 방문자 수 업데이트
      const { data: existingDaily } = await supabase
        .from("daily_visitors")
        .select("count")
        .eq("date", today)
        .single();

      if (!existingDaily) {
        // 새로운 날짜의 레코드 생성
        await supabase.from("daily_visitors").insert({
          date: today,
          count: 1,
        });
      } else {
        // 기존 날짜의 카운트 증가
        await supabase
          .from("daily_visitors")
          .update({ count: existingDaily.count + 1 })
          .eq("date", today);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visitor counting error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "daily";

  try {
    if (type === "total") {
      // 가장 최근 visitor_logs 레코드 조회
      const { data: latestVisitor, error: visitorError } = await supabase
        .from("visitor_logs")
        .select("id")
        .order("visited_at", { ascending: false })
        .limit(1)
        .single();

      if (visitorError) throw visitorError;

      return NextResponse.json({
        count: latestVisitor?.id || 0,
        type: "total",
      });
    } else {
      // 가장 최근 daily_visitors 레코드 조회
      const { data: latestDaily, error: dailyError } = await supabase
        .from("daily_visitors")
        .select("count")
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (dailyError) throw dailyError;

      return NextResponse.json({
        count: latestDaily?.count || 0,
        type: "daily",
      });
    }
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json(
      {
        count: 0,
        error: "Internal Server Error",
        type: type,
      },
      { status: 500 }
    );
  }
}
