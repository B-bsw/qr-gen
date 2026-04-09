'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function Providers({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light')

    useEffect(() => {
        const storedTheme = localStorage.getItem('qr-theme')
        if (storedTheme === 'light' || storedTheme === 'dark') {
            setThemeState(storedTheme)
            document.documentElement.classList.toggle(
                'dark',
                storedTheme === 'dark'
            )
            return
        }

        document.documentElement.classList.remove('dark')
    }, [])

    const setTheme = (nextTheme: Theme) => {
        setThemeState(nextTheme)
        localStorage.setItem('qr-theme', nextTheme)
        document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    }

    const value = useMemo(
        () => ({
            theme,
            setTheme,
        }),
        [theme]
    )

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within Providers')
    }

    return context
}
