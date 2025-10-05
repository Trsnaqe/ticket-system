"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { RequestForm } from "@/components/forms/request-form"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewRequestPage() {
  const { t } = useTranslation()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/requests">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("requests")}
              </Button>
            </Link>
          </div>

          <RequestForm />
        </main>
      </div>
    </AuthGuard>
  )
}
