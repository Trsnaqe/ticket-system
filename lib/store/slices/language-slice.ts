import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type Language, defaultLanguage } from "@/lib/i18n/config"

interface LanguageState {
  current: Language
}

const initialState: LanguageState = {
  current: defaultLanguage,
}

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.current = action.payload
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
