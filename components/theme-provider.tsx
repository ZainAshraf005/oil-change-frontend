"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

type Props = Omit<
  ThemeProviderProps,
  "attribute" | "defaultTheme" | "enableSystem" | "disableTransitionOnChange" | "storageKey"
> & {
  attribute?: ThemeProviderProps["attribute"]
  defaultTheme?: ThemeProviderProps["defaultTheme"]
  enableSystem?: ThemeProviderProps["enableSystem"]
  disableTransitionOnChange?: boolean
  storageKey?: string
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = false,
  disableTransitionOnChange = true,
  storageKey = "ocr-theme",
  ...rest
}: Props) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      storageKey={storageKey}
      {...rest}
    >
      {children}
    </NextThemesProvider>
  )
}
