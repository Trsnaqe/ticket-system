import 'server-only'
import type { Request, RequestStatus, Message } from "@/types/request"
import fs from "fs"
import path from "path"

const DB_ROOT = process.env.VERCEL ? "/tmp" : process.cwd()
const DB_DIR = path.join(DB_ROOT, ".mock-db")
const DB_FILE = path.join(DB_DIR, "requests.json")

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = { requests: [] as Request[] }
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8")
  }
}

function readStore(): { requests: Request[] } {
  ensureDb()
  const raw = fs.readFileSync(DB_FILE, "utf-8")
  try {
    const parsed = JSON.parse(raw) as { requests: Request[] }
    return { requests: Array.isArray(parsed.requests) ? parsed.requests : [] }
  } catch {
    return { requests: [] }
  }
}

function writeStore(store: { requests: Request[] }) {
  ensureDb()
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf-8")
}

export function listRequests(): Request[] {
  return readStore().requests
}

export function getRequestById(id: string): Request | undefined {
  const store = readStore()
  return store.requests.find((r) => r.id === id)
}

export function createRequest(
  input: Omit<Request, "id" | "createdAt" | "updatedAt" | "messages"> & { description: string }
): Request {
  const store = readStore()
  const now = new Date().toISOString()
  const newRequest: Request = {
    ...input,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `m${Date.now()}`,
        userId: input.userId,
        username: input.username,
        content: input.description,
        createdAt: now,
      },
    ],
  }
  store.requests.push(newRequest)
  writeStore(store)
  return newRequest
}

export function updateRequestStatus(id: string, status: RequestStatus): Request | undefined {
  const store = readStore()
  const req = store.requests.find((r) => r.id === id)
  if (!req) return undefined
  req.status = status
  req.updatedAt = new Date().toISOString()
  writeStore(store)
  return req
}

export function addMessageToRequest(
  requestId: string,
  message: Omit<Message, "id" | "createdAt">
): Request | undefined {
  const store = readStore()
  const req = store.requests.find((r) => r.id === requestId)
  if (!req) return undefined
  const newMessage: Message = {
    ...message,
    id: `m${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  req.messages.push(newMessage)
  req.updatedAt = new Date().toISOString()
  writeStore(store)
  return req
}


