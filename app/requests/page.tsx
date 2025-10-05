"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { useAppSelector } from "@/lib/store/hooks"
import { DEFAULT_PAGE_SIZE } from "@/lib/config"
import { useGetRequestsQuery } from "@/features/requests/api/requests-api"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useTranslation } from "@/hooks/use-translation"
import type { RequestStatus, RequestCategory } from "@/types/request"
import { Clock, MessageSquare, Plus, Search, Filter, X } from "lucide-react"

export default function RequestsPage() {
  const { t, language } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)
  const [page, setPage] = useState(1)
  const pageSize = DEFAULT_PAGE_SIZE
  const { data: paged = { items: [], total: 0, page: 1, pageSize }, isLoading, isError } = useGetRequestsQuery(
    { page, limit: pageSize },
    { skip: !user }
  )
  const apiRequests = paged.items

  const [nameFilter, setNameFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<RequestCategory | "all">("all")
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all")

  const filteredRequests = useMemo(() => {
    return apiRequests.filter((request) => {
      if (nameFilter && !request.title.toLowerCase().includes(nameFilter.toLowerCase())) {
        return false
      }

      if (categoryFilter !== "all" && request.category !== categoryFilter) {
        return false
      }

      if (statusFilter !== "all" && request.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [apiRequests, nameFilter, categoryFilter, statusFilter, user])

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "inProgress":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "closed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.role === "admin" ? t("allRequests") : t("myRequests")}</h1>
              <p className="text-muted-foreground">
                {paged.total} {t("requests").toLowerCase()}
              </p>
            </div>
            <Link href="/new-request">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t("newRequest")}
              </Button>
            </Link>
          </div>

          <Card variant="flat" className="mb-3">
            <CardContent className="py-2">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3 items-center">
                {/* Search Input */}
                <div className="relative col-span-2 md:col-span-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t("filterByName")} 
                    value={nameFilter} 
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="pl-9 h-8 md:h-9 text-sm"
                  />
                </div>

                {/* Category Filter */}
                <div className="w-full md:col-span-1">
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => setCategoryFilter(value as RequestCategory | "all")}
                  >
                    <SelectTrigger size="sm" className="w-full justify-start h-8 md:h-9 text-sm">
                      <Filter className="h-4 w-4 mr-1 flex-shrink-0" />
                      <SelectValue placeholder={t("category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="technical">{t("technical")}</SelectItem>
                      <SelectItem value="billing">{t("billing")}</SelectItem>
                      <SelectItem value="general">{t("general")}</SelectItem>
                      <SelectItem value="support">{t("support")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="w-full md:col-span-1">
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequestStatus | "all")}>
                    <SelectTrigger size="sm" className="w-full justify-start h-8 md:h-9 text-sm">
                      <SelectValue placeholder={t("status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">{t("open")}</SelectItem>
                      <SelectItem value="inProgress">{t("inProgress")}</SelectItem>
                      <SelectItem value="closed">{t("closed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters Button */}
                {(nameFilter || categoryFilter !== "all" || statusFilter !== "all") && (
                  <div className="w-full col-span-2 md:col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNameFilter("")
                        setCategoryFilter("all")
                        setStatusFilter("all")
                      }}
                      className="gap-2 w-full sm:w-auto h-8 md:h-9 text-sm"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {/* Active Filters Display */}
              {(nameFilter || categoryFilter !== "all" || statusFilter !== "all") && (
                <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t text-xs">
                  {nameFilter && (
                    <Badge variant="secondary" className="gap-1 h-6">
                      Search: "{nameFilter}"
                      <button
                        onClick={() => setNameFilter("")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1 h-6">
                      {t("category")}: {t(categoryFilter)}
                      <button
                        onClick={() => setCategoryFilter("all")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1 h-6">
                      {t("status")}: {t(statusFilter)}
                      <button
                        onClick={() => setStatusFilter("all")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-muted-foreground">{t("loading")}</div>
          ) : isError ? (
            <EmptyState
              title={t("errorOccurred")}
              description={t("pleaseTryAgain")}
              icon={<MessageSquare className="h-12 w-12" />}
              action={{ label: t("newRequest"), onClick: () => (window.location.href = "/new-request") }}
            />
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              title={t("noRequests")}
              description={t("noRequestsMessage")}
              icon={<MessageSquare className="h-12 w-12" />}
              action={{
                label: t("newRequest"),
                onClick: () => window.location.href = "/new-request"
              }}
            />
          ) : (
            <div className="grid gap-4">
              {filteredRequests.map((request) => (
                <Link key={request.id} href={`/requests/${request.id}`}>
                  <Card variant="default" className="hover:bg-accent/50 transition-colors cursor-pointer hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl mb-2">{request.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{request.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(request.status)}>{t(request.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(request.createdAt)}
                        </div>
                        <Badge variant="outline">{t(request.category)}</Badge>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {request.messages.length}
                        </div>
                        <span className="ml-auto">{language === "en" ? "by " : ""}{request.username}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && paged.total > 0 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setPage((p) => Math.max(1, p - 1))
                      }}
                      className={!paged.hasPrevious ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.ceil(paged.total / pageSize) }).map((_, idx) => {
                    const pageNum = idx + 1
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={page === pageNum}
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(pageNum)
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        const totalPages = Math.ceil(paged.total / pageSize)
                        setPage((p) => Math.min(totalPages, p + 1))
                      }}
                      className={!paged.hasNext ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
