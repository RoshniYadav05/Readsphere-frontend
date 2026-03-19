"use client"

import { useUser } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"

interface Props {
  bookId: string
  bookTitle: string
}

export default function MarkCompletedButton({ bookId, bookTitle }: Props) {

  const { user } = useUser()
  const supabase = createClient()

  const markAsCompleted = async () => {

    if (!user) {
      alert("Please login first")
      return
    }

    /* 1️⃣ SAVE BOOK IN READ SHELF */

    const { error } = await supabase
      .from("user_books")
      .upsert({
        user_id: user.id,
        book_id: bookId,
        shelf: "read"
      })

    if (error) {
      console.error("Shelf update error:", error)
      alert("Failed to mark book as completed")
      return
    }

    /* 2️⃣ UPDATE DASHBOARD COUNTER */

    const storageKey = `readsphere-dashboard-${user.id}`

    const saved = localStorage.getItem(storageKey)

    if (saved) {

      const data = JSON.parse(saved)

      const updated = {
        ...data,
        booksRead: (data.booksRead || 0) + 1
      }

      localStorage.setItem(storageKey, JSON.stringify(updated))
    }

    /* 3️⃣ FEEDBACK */

    alert(`"${bookTitle}" marked as completed 🎉`)
  }

  return (
    <button
      onClick={markAsCompleted}
      className="px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-xl font-semibold text-white shadow-lg"
    >
      ✓ Mark as Completed
    </button>
  )
}