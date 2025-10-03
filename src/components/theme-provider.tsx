"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

interface WorldClassThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode
  enableColorScheme?: boolean
  enableTransitionOnChange?: boolean
  storageKey?: string
  enableSystemTheme?: boolean
  defaultTheme?: string
  themes?: string[]
}

export function ThemeProvider({ 
  children, 
  enableColorScheme = true,
  enableTransitionOnChange = true,
  storageKey = "health-management-theme",
  enableSystemTheme = true,
  defaultTheme = "system",
  themes = ["light", "dark", "system"],
  ...props 
}: WorldClassThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
    
    // Apply smooth transition class to document
    if (enableTransitionOnChange && typeof window !== 'undefined') {
      document.documentElement.classList.add('theme-transition')
    }
  }, [enableTransitionOnChange])

  // Prevent flash of unstyled content
  React.useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--theme-transition', '0.3s ease-out')
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div className="theme-loading">
        {children}
      </div>
    )
  }

  return (
    <NextThemesProvider 
      {...props}
      attribute="class"
      defaultTheme={defaultTheme}
      themes={themes}
      enableColorScheme={enableColorScheme}
      disableTransitionOnChange={!enableTransitionOnChange}
      storageKey={storageKey}
      enableSystem={enableSystemTheme}
    >
      {children}
    </NextThemesProvider>
  )
}
