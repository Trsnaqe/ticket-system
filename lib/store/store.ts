import { configureStore } from "@reduxjs/toolkit"
import { requestsApi } from "@/features/requests/api/requests-api"
import authReducer from "./slices/auth-slice"
import requestsReducer from "@/features/requests/store/requests-slice"
import languageReducer from "./slices/language-slice"
import { persistenceMiddleware, loadPersistedState, initializeStorage } from "./middleware/persistence"

let persistedState = {}
if (typeof window !== 'undefined') {
  initializeStorage()
  persistedState = loadPersistedState()
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    language: languageReducer,
    [requestsApi.reducerPath]: requestsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(persistenceMiddleware)
      .concat(requestsApi.middleware),
  preloadedState: persistedState,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
