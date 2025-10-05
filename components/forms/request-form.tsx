"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAppSelector } from "@/lib/store/hooks"
import { type RequestCategory } from "@/types/request"
import { useCreateRequestMutation } from "@/features/requests/api/requests-api"
import { useTranslation } from "@/hooks/use-translation"
import { Notifications } from "@/lib/services/notification-service"

const TITLE_MAX = 80
const DESCRIPTION_MAX = 1000

const requestSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters`),
  category: z.enum(["technical", "billing", "general", "support"]),
  description: z
    .string()
    .min(1, "Description is required")
    .max(DESCRIPTION_MAX, `Description must be at most ${DESCRIPTION_MAX} characters`),
})

type RequestFormData = z.infer<typeof requestSchema>

interface RequestFormProps {
  onSuccess?: () => void
}

export function RequestForm({ onSuccess }: RequestFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation()

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: "",
      category: "general",
      description: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: RequestFormData) => {
    if (!user) {
      Notifications.LOGIN_ERROR(t("loginError"))
      return
    }

    setIsSubmitting(true)

    try {
      await createRequest({
        title: data.title,
        description: data.description,
        category: data.category,
        userId: user.id,
        username: user.username,
      }).unwrap()

      Notifications.REQUEST_CREATED(t("requestCreated"))
      form.reset()
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/requests")
      }
    } catch (error) {
      Notifications.GENERIC_ERROR(t("errorOccurred"), t("pleaseTryAgain"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories: { value: RequestCategory; label: string }[] = [
    { value: "technical", label: t("technical") },
    { value: "billing", label: t("billing") },
    { value: "general", label: t("general") },
    { value: "support", label: t("support") },
  ]

  return (
    <Card variant="elevated" size="lg" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("createRequest")}</CardTitle>
        <CardDescription>
          {t("createRequestSubtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("titlePlaceholder")}
                      maxLength={TITLE_MAX}
                      {...field}
                    />
                  </FormControl>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {(field.value?.length ?? 0)}/{TITLE_MAX}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCategory")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      rows={6}
                      maxLength={DESCRIPTION_MAX}
                      {...field}
                    />
                  </FormControl>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {(field.value?.length ?? 0)}/{DESCRIPTION_MAX}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
      <Button type="submit" disabled={isSubmitting || isCreating}>
        {isSubmitting || isCreating ? t("loading") : t("submit")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
