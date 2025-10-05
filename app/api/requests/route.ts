import { NextResponse, NextRequest } from "next/server"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0
import { listRequests, createRequest } from "@/app/api/_db"
import { getUserFromHeaders } from "@/app/api/_auth"

export async function GET(req: NextRequest) {
  const user = getUserFromHeaders(req)
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const all = listRequests()
  const visible = user.role === "admin" ? all : all.filter((r) => r.userId === user.id)

  const { searchParams } = new URL(req.url)
  const pageParam = Number(searchParams.get("page") ?? "1")
  const limitParam = Number(searchParams.get("limit") ?? "8")
  const offsetParam = searchParams.get("offset")

  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1
  const pageSize = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 8
  const offset = offsetParam !== null ? Math.max(0, Number(offsetParam) || 0) : (page - 1) * pageSize

  const start = offset
  const end = start + pageSize
  const items = visible.slice(start, end)
  const total = visible.length
  const hasPrevious = start > 0
  const hasNext = end < total

  return NextResponse.json({ items, total, page, pageSize, offset, hasPrevious, hasNext })
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromHeaders(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const body = await request.json()
    const { title, description, category } = body ?? {}

    if (!title || !description || !category) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
    }

    const created = createRequest({
      title,
      description,
      category,
      status: "open",
      userId: user.id,
      username: user.username,
    })

    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}


