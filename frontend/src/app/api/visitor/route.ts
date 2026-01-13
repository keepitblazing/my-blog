import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  try {
    let endpoint = "/visitors/count";
    if (type === "total") {
      endpoint = "/visitors/total";
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
