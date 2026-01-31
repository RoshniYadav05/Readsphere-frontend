"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function BookTracker({ bookId }: { bookId: string }) {
  const sessionStart = useRef<Date | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!bookId) return

    // 🟢 Start timer when book page loads
    sessionStart.current = new Date()

    const endSession = () => {
      if (!sessionStart.current) return

      const startTime = sessionStart.current
      const endTime = new Date()

      // ✅ DEFINE minutes FIRST
      const minutes = Math.max(
        1,
        Math.round(
          (endTime.getTime() - startTime.getTime()) / 60000
        )
      )

      // 🧪 Debug log (now safe)
      console.log("📚 Reading session ended", {
        book: bookId,
        minutes,
        start: startTime.toLocaleTimeString(),
        end: endTime.toLocaleTimeString(),
      })

      // 💾 Save session for dashboard (localStorage queue)
      const session = {
        book: bookId,
        minutes,
        start: startTime.toLocaleTimeString(),
        end: endTime.toLocaleTimeString(),
        date: new Date().toISOString().split("T")[0],
      }

      const key = "readsphere-reading-sessions"
      const existing = JSON.parse(
        localStorage.getItem(key) || "[]"
      )

      existing.unshift(session)
      localStorage.setItem(key, JSON.stringify(existing))

      // 🔁 Optional API call (future backend sync)
      fetch("/api/reading-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_slug: bookId,
          duration_seconds: minutes * 60,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
        }),
      })

      // Prevent double fire
      sessionStart.current = null
    }

    // 🔴 User refreshes / closes tab
    window.addEventListener("beforeunload", endSession)

    return () => {
      // 🔴 User navigates away (route change)
      endSession()
      window.removeEventListener("beforeunload", endSession)
    }
  }, [bookId, pathname])

  return null
}
