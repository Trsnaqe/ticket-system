import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Request, RequestStatus, Message } from "@/types/request"

type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  offset?: number
  hasPrevious?: boolean
  hasNext?: boolean
}

export const requestsApi = createApi({
  reducerPath: "requestsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      try {
        const state = getState() as unknown as { auth?: { user?: { id: string; role: string; username: string } } }
        const user = state?.auth?.user
        if (user) {
          headers.set("x-user-id", user.id)
          headers.set("x-user-role", user.role)
          headers.set("x-user-name", user.username)
        }
      } catch {}
      return headers
    },
  }),
  tagTypes: ["Requests", "Request"],
  endpoints: (builder) => ({
    getRequests: builder.query<Paginated<Request>, { page?: number; limit?: number; offset?: number } | void>({
      query: (args) => {
        const page = args && 'page' in args && args?.page ? args.page : 1
        const limit = args && 'limit' in args && args?.limit ? args.limit : 8
        const offsetParam = args && 'offset' in args && args?.offset !== undefined ? `&offset=${args.offset}` : ''
        return { url: `/requests?page=${page}&limit=${limit}${offsetParam}` }
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((r) => ({ type: "Request" as const, id: r.id })),
              { type: "Requests" as const, id: "LIST" },
            ]
          : [{ type: "Requests" as const, id: "LIST" }],
    }),
    getRequestById: builder.query<Request, string>({
      query: (id) => ({ url: `/requests/${id}` }),
      providesTags: (_res, _err, id) => [{ type: "Request", id }],
    }),
    createRequest: builder.mutation<
      Request,
      { title: string; description: string; category: Request["category"]; userId: string; username: string }
    >({
      query: (body) => ({ url: "/requests", method: "POST", body }),
      invalidatesTags: [{ type: "Requests", id: "LIST" }],
    }),
    updateStatus: builder.mutation<Request, { id: string; status: RequestStatus }>({
      query: ({ id, status }) => ({ url: `/requests/${id}`, method: "PATCH", body: { status } }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Request", id }],
    }),
    addMessage: builder.mutation<
      Request,
      { requestId: string; message: Omit<Message, "id" | "createdAt"> }
    >({
      query: ({ requestId, message }) => ({ url: `/requests/${requestId}`, method: "PATCH", body: { message } }),
      invalidatesTags: (_res, _err, { requestId }) => [{ type: "Request", id: requestId }],
    }),
  }),
})

export const {
  useGetRequestsQuery,
  useGetRequestByIdQuery,
  useCreateRequestMutation,
  useUpdateStatusMutation,
  useAddMessageMutation,
} = requestsApi


