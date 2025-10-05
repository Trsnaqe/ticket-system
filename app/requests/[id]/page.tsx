"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/store/hooks"
import { useGetRequestByIdQuery } from "@/features/requests/api/requests-api"
import { useTranslation } from "@/hooks/use-translation"
import { MessageList } from "@/features/requests/ui/message-list"
import { StatusUpdater } from "@/features/requests/ui/status-updater"
import { Notifications } from "@/lib/services/notification-service"
import { ArrowLeft, Clock } from "lucide-react"
import type { RequestStatus } from "@/types/request"

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const { data: request, isLoading, isError, error } = useGetRequestByIdQuery(params.id, { skip: !user })

  useEffect(() => {
    if (request && user) {
      if (user.role === "admin") return
      if (request.userId !== user.id) {
        Notifications.UNAUTHORIZED_REQUEST(t("accessDenied"))
        router.push("/requests")
      }
    }
  }, [request, user, router, t])

  useEffect(() => {
    if (!isLoading && isError && error) {
      const status = 'status' in error ? error.status : null
      if (status === 401) {
        Notifications.UNAUTHORIZED_REQUEST(t("unauthorized"))
        router.push("/login")
      } else if (status === 403) {
        Notifications.UNAUTHORIZED_REQUEST(t("accessDenied"))
        router.push("/requests")
      } else {
        Notifications.REQUEST_NOT_FOUND(t("requestNotFound"))
        router.push("/requests")
      }
    }
  }, [isLoading, isError, error, router, t])

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-muted/30">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t("loading")}</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </AuthGuard>
    )
  }

  if (isError && error) {
    const status = 'status' in error ? error.status : null
    let errorMessage = t("requestNotFound")
    let errorTitle = t("notFound")
    
    if (status === 401) {
      errorMessage = t("unauthorized")
      errorTitle = t("unauthorized")
    } else if (status === 403) {
      errorMessage = t("accessDenied")
      errorTitle = t("forbidden")
    }
    
    return (
      <AuthGuard>
        <div className="min-h-screen bg-muted/30">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Card>
              <CardHeader>
                <CardTitle>{errorTitle}</CardTitle>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{errorMessage}</p>
                <Button onClick={() => router.push("/requests")} className="mt-4">
                  {t("requests")}
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </AuthGuard>
    )
  }

  if (!request) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-muted/30">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t("loading")}</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </AuthGuard>
    )
  }

  if (user && user.role !== "admin" && request.userId !== user.id) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-muted/30">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Access denied</p>
                <Button onClick={() => router.push("/requests")} className="mt-4">
                  {t("requests")}
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </AuthGuard>
    )
  }


  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500"
      case "inProgress":
        return "bg-yellow-500/10 text-yellow-500"
      case "closed":
        return "bg-green-500/10 text-green-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between gap-2">
            <Link href="/requests">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t("requests")}</span>
              </Button>
            </Link>
            
            <StatusUpdater requestId={request.id} currentStatus={request.status} />
          </div>

          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl mb-2">{request.title}</CardTitle>
                    <CardDescription>
                      Created by {request.username} on {formatDate(request.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(request.status)}>{t(request.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{t("description")}</h3>
                    <p className="text-muted-foreground">{request.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">{t(request.category)}</Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {t("updatedAt")}: {formatDate(request.updatedAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <MessageList requestId={request.id} messages={request.messages} />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
