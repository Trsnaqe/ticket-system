"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/hooks/use-translation"
import { useAppSelector } from "@/lib/store/hooks"
import { useAddMessageMutation } from "@/features/requests/api/requests-api"
import { Notifications } from "@/lib/services/notification-service"
import { Send, User } from "lucide-react"
import { useState } from "react"
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return

    setIsSubmitting(true)

    try {
      await addMessageApi({
        requestId,
        message: {
          userId: user.id,
          username: user.username,
          content: newMessage.trim(),
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
                <div className="flex gap-3 max-w-[80%] sm:max-w-[60%]">
                  <div className={`flex-shrink-0 ${
                    message.userId === user?.id ? "order-2" : "order-1"
                  }`}>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className={`flex-1 ${
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
                      <div className="text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex flex-col sm:flex-row gap-2">
            <Textarea
              placeholder={t("typeMessage")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              disabled={isSubmitting}
              className="w-full"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSubmitting || isAdding}
              size="icon"
              className="flex-shrink-0 w-full sm:w-auto"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



