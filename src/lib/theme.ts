import { useCallback, useState } from 'react'

export type Theme = 'light' | 'dark'

function resolvedTheme(): Theme {
  const set = document.documentElement.dataset.theme
  if (set === 'light' || set === 'dark') return set
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(resolvedTheme)

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('ft-theme', next)
      } catch {
        /* storage unavailable: preference just won't persist */
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
