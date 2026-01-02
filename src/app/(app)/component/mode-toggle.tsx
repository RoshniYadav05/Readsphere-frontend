// "use client";

// import { useTheme } from "@/app/(app)/component/theme-provider"

// export const ModeToggle = () => {
//   const { theme, setTheme } = useTheme()

//   return (
//     <button
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
//     >
//       {theme === "dark" ? "☀️" : "🌙"}
//     </button>
//   )
// }

"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes" // Assuming you're using next-themes

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Until the component is mounted, we can return null or a placeholder.
  // This avoids the hydration mismatch.
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="p-2 rounded-md"
      />
    )
  }

  // Now that we're on the client, we can safely render the correct icon.
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}