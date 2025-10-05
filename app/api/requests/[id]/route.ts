import { NextResponse, NextRequest } from "next/server"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0
import { getRequestById, updateRequestStatus, addMessageToRequest } from "@/app/api/_db"
import { getUserFromHeaders } from "@/app/api/_auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromHeaders(req)
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const ticket = getRequestById(params.id)
  if (!ticket) return NextResponse.json({ message: "Not found" }, { status: 404 })
  if (user.role !== "admin" && ticket.userId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }
  return NextResponse.json(ticket)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromHeaders(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const body = await request.json()
    if (body?.status) {
      if (user.role !== "admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
      }
      const updated = updateRequestStatus(params.id, body.status)
      if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 })
      return NextResponse.json(updated)
    }

    if (body?.message) {
      const { content } = body.message
      if (!content) {
        return NextResponse.json({ message: "Invalid message" }, { status: 400 })
      }
      const ticket = getRequestById(params.id)
      if (!ticket) return NextResponse.json({ message: "Not found" }, { status: 404 })
      if (user.role !== "admin" && ticket.userId !== user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
      }
      const updated = addMessageToRequest(params.id, { userId: user.id, username: user.username, content })
      if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 })
      return NextResponse.json(updated)
    }

    return NextResponse.json({ message: "No valid operation" }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}


