import { redis } from "@/lib/redis"

export async function GET() {
  const count = await redis.incr("visitors")
  return Response.json({ count })
}