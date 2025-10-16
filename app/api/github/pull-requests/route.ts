import { fetchMergedPullRequests } from "@/lib/github"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] API Route: Fetching PRs...")

    const username = process.env.GITHUB_USERNAME

    if (!username) {
      console.error("[v0] GitHub username not configured")
      return NextResponse.json({ error: "GitHub username not configured" }, { status: 500 })
    }

    console.log("[v0] Fetching PRs for username:", username)
    const pullRequests = await fetchMergedPullRequests(username)
    console.log("[v0] Fetched", pullRequests.length, "pull requests")

    return NextResponse.json({
      success: true,
      data: pullRequests,
      count: pullRequests.length,
    })
  } catch (error) {
    console.error("[v0] Error in PR API route:", error)
    return NextResponse.json({ error: "Failed to fetch pull requests" }, { status: 500 })
  }
}
