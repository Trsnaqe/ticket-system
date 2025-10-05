import type { NextRequest } from "next/server"

export interface MockUser {
  id: string
  role: "admin" | "user"
  username: string
}

export function getUserFromHeaders(req: NextRequest): MockUser | null {
  const id = req.headers.get("x-user-id")
  const role = req.headers.get("x-user-role") as MockUser["role"] | null
  const username = req.headers.get("x-user-name")
  if (!id || !role || !username) return null
  if (role !== "admin" && role !== "user") return null
  return { id, role, username }
}


