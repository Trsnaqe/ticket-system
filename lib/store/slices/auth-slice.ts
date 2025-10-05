import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type UserRole = "admin" | "user"

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: string
  lastLoginAt?: string
  statistics?: {
    totalRequests: number
    totalMessages: number
    openRequests: number
    inProgressRequests: number
    closedRequests: number
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

export const mockUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin",
    user: {
      id: "1",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
      statistics: {
        totalRequests: 0,
        totalMessages: 0,
        openRequests: 0,
        inProgressRequests: 0,
        closedRequests: 0,
      },
    },
  },
  user1: {
    password: "password",
    user: {
      id: "2",
      username: "user1",
      email: "user1@example.com",
      role: "user",
      createdAt: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
      statistics: {
        totalRequests: 0,
        totalMessages: 0,
        openRequests: 0,
        inProgressRequests: 0,
        closedRequests: 0,
      },
    },
  },
  user2: {
    password: "password",
    user: {
      id: "3",
      username: "user2",
      email: "user2@example.com",
      role: "user",
      createdAt: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
      statistics: {
        totalRequests: 0,
        totalMessages: 0,
        openRequests: 0,
        inProgressRequests: 0,
        closedRequests: 0,
      },
    },
  },
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; password: string }>) => {
      const { username, password } = action.payload
      const userRecord = mockUsers[username]

      if (userRecord && userRecord.password === password) {
        state.user = {
          ...userRecord.user,
          lastLoginAt: new Date().toISOString(),
        }
        state.isAuthenticated = true
      } else {
        state.user = null
        state.isAuthenticated = false
      }
    },
    loginFailed: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    updateUserStatistics: (state, action: PayloadAction<{ userId: string; statistics: Partial<User['statistics']> }>) => {
      if (state.user && state.user.id === action.payload.userId) {
        if (state.user.statistics) {
          state.user.statistics = { ...state.user.statistics, ...action.payload.statistics }
        } else {
          state.user.statistics = action.payload.statistics as User['statistics']
        }
      }
    },
  },
})

export const { login, loginFailed, logout, updateUserStatistics } = authSlice.actions
export default authSlice.reducer
