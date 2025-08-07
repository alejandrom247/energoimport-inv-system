import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = { mode: string, color: string }

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: {mode: 'dark', color: 'green'},
    setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = {mode: 'light', color: 'green'},
    storageKey = "inventory-ui-theme",
    ...props
}: ThemeProviderProps){
    const [storedTheme, setStoredTheme] = useState<Theme>(defaultTheme)

            const value = {
        theme: storedTheme,
        setTheme: (theme: Theme) => {
            setStoredTheme(theme)
        },
    }
        if(storedTheme.mode === "system"){
            const systemMode = window.matchMedia('(prefers-color-scheme: dark)')
            .matches 
            ? 'dark'
            : 'light'

            return (
            <ThemeProviderContext.Provider {...props} value={value}>
            <div data-theme={`${storedTheme.color}-${systemMode}`}>{children}</div>
            </ThemeProviderContext.Provider>)
        }
    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            <div className={`${storedTheme.mode}`} data-theme={`${storedTheme.color}-${storedTheme.mode}`}>{children}</div>
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if(context === undefined)
        throw new Error("useTheme debe ser usado dentro de un ThemeProvider")

    return context
}