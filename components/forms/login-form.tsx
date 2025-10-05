"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { login, mockUsers } from "@/lib/store/slices/auth-slice"
import { useTranslation } from "@/hooks/use-translation"
import { Notifications } from "@/lib/services/notification-service"
import { LanguageSelector } from "@/components/language-selector"

const loginSchema = z.object({
  username: z.string().trim().min(3, "Username is required"),
  password: z.string().trim().min(3, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)

    try {
      const { username, password } = data
      const userRecord = mockUsers[username]

      if (userRecord && userRecord.password === password) {
        dispatch(login(data))
        Notifications.LOGIN_SUCCESS(t("loginSuccess"))
        router.push("/requests")
      } else {
        Notifications.LOGIN_ERROR(t("loginError"))
      }
    } catch (error) {
      Notifications.LOGIN_ERROR(t("loginError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card variant="elevated" className="relative">
          <div className="absolute top-4 right-4">
            <LanguageSelector />
          </div>
          
          <CardHeader className="text-center pr-16">
            <CardTitle className="text-2xl">{t("loginTitle")}</CardTitle>
            <CardDescription>
              {t("loginSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="on" noValidate={false}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="username">{t("username")}</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          type="text"
                          placeholder={t("username")}
                          autoComplete="username"
                          inputMode="text"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">{t("password")}</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder={t("password")}
                          autoComplete="current-password"
                          inputMode="text"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("loading") : t("login")}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-3 bg-muted/50 rounded-md border border-muted-foreground/20">
              <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Demo Credentials</h4>
              <div className="text-xs space-y-0.5 text-muted-foreground">
                <p><span className="font-medium">Admin:</span> admin / admin</p>
                <p><span className="font-medium">User:</span> user1 / password</p>
                <p><span className="font-medium">User:</span> user2 / password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
