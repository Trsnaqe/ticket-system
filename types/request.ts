export type RequestStatus = "open" | "inProgress" | "closed"
export type RequestCategory = "technical" | "billing" | "general" | "support"

export interface Message {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
}

export interface Request {
  id: string
  title: string
  description: string
  category: RequestCategory
  status: RequestStatus
  userId: string
  username: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}


