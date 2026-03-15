import { redis } from "@/lib/redis"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const getOnly = searchParams.get("getOnly")

  if (getOnly) {
    // Just get the current count without incrementing
    const count = await redis.get("visitors")
    return Response.json({ count: count ? parseInt(count as string) : 0 })
  } else {
    // Increment and return the new count
    const count = await redis.incr("visitors")
    return Response.json({ count })
  }
}