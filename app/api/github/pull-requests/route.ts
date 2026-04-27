// app/api/github/pull-requests/route.ts
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const username = process.env.GH_USERNAME!;
    const cached = await redis.get(username);

    if (!cached) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        warming: true, // tell your UI cache is cold
      });
    }

    return NextResponse.json({
      success: true,
      data: cached,
      count: (cached as any[]).length,
      cached: true,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Cache bust endpoint — called by GitHub Actions after sync
export async function POST(request: Request) {
  const { secret } = await request.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // optionally trigger any post-sync logic here
  return NextResponse.json({ success: true });
}
