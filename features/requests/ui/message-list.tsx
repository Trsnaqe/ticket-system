"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/hooks/use-translation"
import { useAppSelector } from "@/lib/store/hooks"
import { useAddMessageMutation } from "@/features/requests/api/requests-api"
import { Notifications } from "@/lib/services/notification-service"
import { Send, User } from "lucide-react"
import { useMemo, useState } from "react"
import type { Message } from "@/types/request"

interface MessageListProps {
  requestId: string
  messages: Message[]
}

export function MessageList({ requestId, messages }: MessageListProps) {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)
  const [addMessageApi, { isLoading: isAdding }] = useAddMessageMutation()
  const [newMessage, setNewMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({})

  const MAX_MESSAGE_LENGTH_INPUT = 1000
  const DISPLAY_PREVIEW_LENGTH = 500

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return

    setIsSubmitting(true)

    try {
      await addMessageApi({
        requestId,
        message: {
          userId: user.id,
          username: user.username,
          content: newMessage.trim().slice(0, MAX_MESSAGE_LENGTH_INPUT),
        },
      }).unwrap()

      Notifications.MESSAGE_SENT(t("messageSent"))
      setNewMessage("")
    } catch (error) {
      Notifications.GENERIC_ERROR(t("errorOccurred"), t("pleaseTryAgain"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const canSend = useMemo(() => {
    return Boolean(newMessage.trim()) && !isSubmitting && !isAdding
  }, [newMessage, isSubmitting, isAdding])

  const toggleExpand = (id: string) => {
    setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Card variant="default" size="default">
      <CardHeader>
        <CardTitle>{t("messages")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("noMessages")}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.userId === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex gap-3 max-w-[80%] sm:max-w-[60%] min-w-0">
                  <div className={`flex-shrink-0 ${
                    message.userId === user?.id ? "order-2" : "order-1"
                  }`}>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className={`flex-1 min-w-0 ${
                    message.userId === user?.id ? "order-1" : "order-2"
                  }`}>
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        message.userId === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className={`flex items-center gap-2 text-xs mb-2 ${
                        message.userId === user?.id ? "justify-end" : "justify-start"
                      }`}>
                        <span className="font-semibold opacity-90">{message.username}</span>
                        <span className="opacity-70">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words break-all">
                        {message.content.length > DISPLAY_PREVIEW_LENGTH && !expandedById[message.id]
                          ? `${message.content.slice(0, DISPLAY_PREVIEW_LENGTH)}…`
                          : message.content}
                      </div>
                      {message.content.length > DISPLAY_PREVIEW_LENGTH && (
                        <div className={`mt-2 ${message.userId === user?.id ? "text-right" : "text-left"}`}>
                          <button
                            type="button"
                            className={`text-xs underline opacity-90 hover:opacity-100 ${
                              message.userId === user?.id ? "text-primary-foreground" : "text-foreground"
                            }`}
                            onClick={() => toggleExpand(message.id)}
                          >
                            {expandedById[message.id] ? t("showLess") : t("showMore")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <Textarea
                placeholder={t("typeMessage")}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                disabled={isSubmitting}
                maxLength={MAX_MESSAGE_LENGTH_INPUT}
                wrap="soft"
                className="w-full h-24 overflow-y-auto overflow-x-hidden resize-none break-words break-all"
              />
              <div className="mt-1 text-xs text-muted-foreground">
                {newMessage.length}/{MAX_MESSAGE_LENGTH_INPUT}
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!canSend}
              size="sm"
              className="flex-shrink-0 w-full sm:w-auto"
              aria-label={t("send")}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



