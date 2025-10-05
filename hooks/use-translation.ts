"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { translations } from "@/lib/i18n/translations"
import { defaultLanguage } from "@/lib/i18n/config"

export function useTranslation() {
  const storeLanguage = useAppSelector((state) => state.language.current)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const language = isMounted ? storeLanguage : defaultLanguage

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key]
  }

  return { t, language }
}
