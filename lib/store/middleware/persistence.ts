import { Middleware } from '@reduxjs/toolkit'

const STORAGE_KEY_PREFIX = 'ticket-system-'

export const persistenceMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action)
  
  if (typeof window === 'undefined') {
    return result
  }
  
  const state = store.getState()
  
  if (action.type.startsWith('auth/')) {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, JSON.stringify(state.auth))
    } catch (error) {
      console.error('Error persisting auth state:', error)
    }
  }
  
  if (action.type.startsWith('requests/')) {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}requests`, JSON.stringify(state.requests))
    } catch (error) {
      console.error('Error persisting requests state:', error)
    }
  }
  
  if (action.type.startsWith('language/')) {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}language`, JSON.stringify(state.language))
    } catch (error) {
      console.error('Error persisting language state:', error)
    }
  }
  
  return result
}

export const loadPersistedState = () => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const auth = localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`)
    const requests = localStorage.getItem(`${STORAGE_KEY_PREFIX}requests`)
    const language = localStorage.getItem(`${STORAGE_KEY_PREFIX}language`)

    return {
      auth: auth ? JSON.parse(auth) : undefined,
      requests: requests ? JSON.parse(requests) : undefined,
      language: language ? JSON.parse(language) : undefined,
    }
  } catch (error) {
    console.error('Error loading persisted state:', error)
    return {}
  }
}

export const clearPersistedState = () => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}auth`)
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}requests`)
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}language`)
  } catch (error) {
    console.error('Error clearing persisted state:', error)
  }
}

export const initializeStorage = () => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const existingRequests = localStorage.getItem(`${STORAGE_KEY_PREFIX}requests`)
    
    if (!existingRequests) {
      const defaultRequests = {
        requests: [
          {
            id: "1",
            title: "Login Issue",
            description: "Cannot login to my account",
            category: "technical",
            status: "open",
            userId: "2",
            username: "user1",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            messages: [
              {
                id: "m1",
                userId: "2",
                username: "user1",
                content: "I am having trouble logging in. Can you help?",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
              },
            ],
          },
          {
            id: "2",
            title: "Billing Question",
            description: "Question about my invoice",
            category: "billing",
            status: "inProgress",
            userId: "2",
            username: "user1",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 43200000).toISOString(),
            messages: [
              {
                id: "m2",
                userId: "2",
                username: "user1",
                content: "I have a question about my last invoice.",
                createdAt: new Date(Date.now() - 172800000).toISOString(),
              },
              {
                id: "m3",
                userId: "1",
                username: "admin",
                content: "I will look into this for you.",
                createdAt: new Date(Date.now() - 43200000).toISOString(),
              },
            ],
          },
        ],
      }
      localStorage.setItem(`${STORAGE_KEY_PREFIX}requests`, JSON.stringify(defaultRequests))
    }
  } catch (error) {
    console.error('Error initializing storage:', error)
  }
}
