import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { en } from '../content/en'
import { es } from '../content/es'
import type { Content, Lang } from '../content/types'

const dictionaries: Record<Lang, Content> = { es, en }

interface LangState {
  lang: Lang
  t: Content
  toggleLang: () => void
}

const LangContext = createContext<LangState | null>(null)

function initialLang(): Lang {
  const attr = document.documentElement.lang
  if (attr === 'en' || attr === 'es') return attr
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'es' ? 'en' : 'es'
      document.documentElement.lang = next
      try {
        localStorage.setItem('ft-lang', next)
      } catch {
        /* storage unavailable: preference just won't persist */
      }
      return next
    })
  }, [])

  const value = useMemo(() => ({ lang, t: dictionaries[lang], toggleLang }), [lang, toggleLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
