"use client"

import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/lib/store/hooks"
import { setLanguage } from "@/lib/store/slices/language-slice"
import { languages, type Language } from "@/lib/i18n/config"
import { useTranslation } from "@/hooks/use-translation"

export function LanguageSelector() {
  const dispatch = useAppDispatch()
  const { language } = useTranslation()

  const handleLanguageChange = (lang: Language) => {
    dispatch(setLanguage(lang))
  }

  const currentLanguage = languages[language]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={language === code ? "bg-accent" : ""}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
