export const languages = {
  en: "English",
  tr: "Türkçe",
} as const

export type Language = keyof typeof languages

export const defaultLanguage: Language = "tr"
