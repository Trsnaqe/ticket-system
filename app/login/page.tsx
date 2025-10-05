"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"
import { LoginForm } from "@/components/forms/login-form"

export default function LoginPage() {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    if (user) {
      router.replace("/requests")
    }
  }, [user, router])

  if (user) return null

  return <LoginForm />
}
