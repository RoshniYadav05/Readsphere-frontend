"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@clerk/nextjs"

export default function LikeButton({ bookId }: { bookId: string }) {

  const supabase = createClient()
  const { user } = useUser()

  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const loadLikes = async () => {

      if (!user) return

      // total likes
      const { count } = await supabase
        .from("liked_books")
        .select("*", { count: "exact", head: true })
        .eq("book_id", bookId)

      setCount(count || 0)

      // check if user liked
      const { data } = await supabase
        .from("liked_books")
        .select("*")
        .eq("user_id", user.id)   // ✅ CLERK USER ID
        .eq("book_id", bookId)
        .single()

      if (data) setLiked(true)
    }

    loadLikes()
  }, [user, bookId])

  const handleLike = async () => {

    if (!user) {
      alert("Login required")
      return
    }

    const userId = user.id  // ✅ FIXED

    if (liked) {
      await supabase
        .from("liked_books")
        .delete()
        .eq("user_id", userId)
        .eq("book_id", bookId)

      setLiked(false)
      setCount(prev => prev - 1)

    } else {
      await supabase
        .from("liked_books")
        .insert({
          user_id: userId,
          book_id: bookId
        })

      setLiked(true)
      setCount(prev => prev + 1)
    }
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2"
    >
      <span
        className={`text-2xl transition ${
          liked ? "text-red-500 scale-110" : "text-gray-400"
        }`}
      >
        {liked ? "❤️" : "🤍"}
      </span>

      <span>{count}</span>
    </button>
  )
}