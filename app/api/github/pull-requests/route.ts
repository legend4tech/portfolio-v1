import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const username = process.env.GH_USERNAME!;

    const cached = await redis.get(`prs:${username}`);

    if (!cached) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        warming: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: cached,
      count: (cached as unknown[]).length,
      cached: true,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
