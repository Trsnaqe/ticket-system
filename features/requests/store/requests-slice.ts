import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Request, Message, RequestStatus } from "@/types/request"

interface RequestsState {
  requests: Request[]
}

const initialState: RequestsState = {
  requests: [],
}

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    createRequest: (state, action: PayloadAction<Omit<Request, "id" | "createdAt" | "updatedAt" | "messages">>) => {
      const newRequest: Request = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `m${Date.now()}`,
            userId: action.payload.userId,
            username: action.payload.username,
            content: action.payload.description,
            createdAt: new Date().toISOString(),
          },
        ],
      }
      state.requests.push(newRequest)
    },
    updateRequestStatus: (state, action: PayloadAction<{ id: string; status: RequestStatus }>) => {
      const request = state.requests.find((r) => r.id === action.payload.id)
      if (request) {
        request.status = action.payload.status
        request.updatedAt = new Date().toISOString()
      }
    },
    addMessage: (state, action: PayloadAction<{ requestId: string; message: Omit<Message, "id" | "createdAt"> }>) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId)
      if (request) {
        const newMessage: Message = {
          ...action.payload.message,
          id: `m${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        request.messages.push(newMessage)
        request.updatedAt = new Date().toISOString()
      }
    },
  },
})

export const { createRequest, updateRequestStatus, addMessage } = requestsSlice.actions
export default requestsSlice.reducer


