"use client"

import { useMemo } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/store/hooks"
import { useTranslation } from "@/hooks/use-translation"
import { useClientSide } from "@/hooks/use-client-side"
import { User, Mail, Shield, BarChart3, CheckCircle2, Clock, XCircle, MessageSquare } from "lucide-react"
import { useGetRequestsQuery } from "@/features/requests/api/requests-api"

export default function ProfilePage() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)
  const { data: paged = { items: [], total: 0, page: 1, pageSize: 0 } } = useGetRequestsQuery(
    { page: 1, limit: 1000 },
    { skip: !user }
  )
  const apiRequests = paged.items
  const isClient = useClientSide()

  const statistics = useMemo(() => {
    if (!user) return { 
      totalRequests: 0, 
      totalMessages: 0,
      open: 0, 
      inProgress: 0, 
      closed: 0,
      userRequests: [],
      allMessages: []
    }

    const userRequests = user.role === "admin" ? apiRequests : apiRequests.filter((r) => r.userId === user.id)
    const allMessages = userRequests.flatMap(r => r.messages)
    const userMessages = allMessages

    return {
      totalRequests: userRequests.length,
      totalMessages: userMessages.length,
      open: userRequests.filter((r) => r.status === "open").length,
      inProgress: userRequests.filter((r) => r.status === "inProgress").length,
      closed: userRequests.filter((r) => r.status === "closed").length,
      userRequests,
      allMessages: userMessages,
    }
  }, [user, apiRequests])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("userProfile")}</h1>
            <p className="text-muted-foreground">View your account information and statistics</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("userInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {t("username")}
                  </div>
                  <p className="font-semibold">{user.username}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {t("email")}
                  </div>
                  <p className="font-semibold">{user.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    {t("role")}
                  </div>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>{t(user.role)}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t("statistics")}
                </CardTitle>
                <CardDescription>
                  {user.role === "admin" ? t("systemStats") : t("yourStats")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col justify-between h-20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      {t("totalShort")}
                    </div>
                    <p className="text-3xl font-bold leading-none">{statistics.totalRequests}</p>
                  </div>

                  <div className="flex flex-col justify-between h-20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      {t("messagesShort")}
                    </div>
                    <p className="text-3xl font-bold text-purple-500 leading-none">{statistics.totalMessages}</p>
                  </div>

                  <div className="flex flex-col justify-between h-20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      {t("closedShort")}
                    </div>
                    <p className="text-3xl font-bold text-green-500 leading-none">{statistics.closed}</p>
                  </div>

                  <div className="flex flex-col justify-between h-20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {t("openShort")}
                    </div>
                    <p className="text-3xl font-bold text-blue-500 leading-none">{statistics.open}</p>
                  </div>

                  <div className="flex flex-col justify-between h-20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      {t("inProgressShort")}
                    </div>
                    <p className="text-3xl font-bold text-yellow-500 leading-none">{statistics.inProgress}</p>
                  </div>

                  <div className="flex flex-col justify-between h-20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {t("memberShort")}
                    </div>
                    <p className="text-lg font-semibold leading-none">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {user.lastLoginAt && (
                    <div className="flex flex-col justify-between h-20">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {t("lastLoginShort")}
                      </div>
                      <p className="text-lg font-semibold leading-none">
                        {new Date(user.lastLoginAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col justify-between h-20">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      {`${t("openShort")} %`}
                    </div>
                    <p className="text-3xl font-bold text-indigo-500 leading-none">
                      {statistics.totalRequests > 0 ? Math.round((statistics.open / statistics.totalRequests) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {user.role === "admin" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Admin Information</CardTitle>
                <CardDescription>As an admin, you can view and manage all requests in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">• View all user requests</p>
                  <p className="text-sm text-muted-foreground">• Update request status (Open → In Progress → Closed)</p>
                  <p className="text-sm text-muted-foreground">• Respond to user messages</p>
                  <p className="text-sm text-muted-foreground">• Access system-wide statistics</p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
