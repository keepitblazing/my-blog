import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
    let body = {};
    try {
      body = await request.json();
    } catch {
      // empty body is ok
    }

    const response = await fetch(`${API_URL}/api/visitors/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to log visitor");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Visitor log error:", error);
    return NextResponse.json({ error: "Failed to log visitor" }, { status: 500 });
  }
}
