"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star, Loader, BookOpen } from "lucide-react"
import { SignedIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"
import BubbleBackground from "../../books/bubble-bg"

interface Book {
  id: string
  book_title: string
  book_author: string
  genre: string
  rating: number
  f_page: string
  slug: string
  cover_image: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

export default function Recommendations() {
  const { user } = useUser()
  const supabase = createClient()

  const [likedBooks, setLikedBooks] = useState<Book[]>([])
  const [genreBooks, setGenreBooks] = useState<Book[]>([])
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchData = async () => {

      if (!user) return

      try {

        // 🔥 1. Get liked books
        const { data: liked } = await supabase
          .from("liked_books")
          .select("book_id")
          .eq("user_id", user.id)

        const likedIds = liked?.map(b => b.book_id) || []

        // 🔥 2. Fetch liked books full data
        let likedData: Book[] = []
        if (likedIds.length) {
          const { data } = await supabase
            .from("books")
            .select("*")
            .in("id", likedIds)

          likedData = data || []
          setLikedBooks(likedData)
        }

        // 🔥 3. Get genres from liked books
        const likedGenres = likedData.map(b => b.genre)

        // 🔥 4. Get favorite genres
        const { data: pref } = await supabase
          .from("user_preferences")
          .select("favorite_genres")
          .eq("user_id", user.id)
          .single()

        const favGenres = pref?.favorite_genres || []

        // 🔥 5. Genre-based books
        if (favGenres.length) {
          const { data } = await supabase
            .from("books")
            .select("*")
            .in("genre", favGenres)
            .limit(12)

          setGenreBooks(data || [])
        }

        // 🔥 6. Combine genres (liked + fav)
        const allGenres = [...new Set([...likedGenres, ...favGenres])]

        // 🔥 7. Final recommendations
        if (allGenres.length) {
          const { data } = await supabase
            .from("books")
            .select("*")
            .in("genre", allGenres)
            .limit(20)

          setRecommendedBooks(data || [])
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }

    }

    fetchData()

  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader className="h-12 w-12 animate-spin mr-3" />
        <span className="text-2xl">Loading your top picks...</span>
      </div>
    )
  }

  // 🔥 reusable card
  const renderBooks = (books: Book[]) => (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      variants={containerVariants}
    >
      {books.map((book) => {
        const slug = book.book_title
          .trim()
          .replace(/ /g, "-")
          .replace(/[^\w-]/g, "")

        return (
          <motion.div
            key={book.id}
            className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden"
            variants={cardVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.35)",
            }}
          >
            <div className="relative h-64 flex items-center justify-center">
              <Image
                src={(book.cover_image || "/placeholder.svg").trim()}
                alt={book.book_title}
                width={200}
                height={300}
                className="object-contain h-full w-full p-4"
              />
            </div>

            <div className="p-5 space-y-2">
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {book.book_title}
              </h3>

              <p className="text-sm text-slate-400">
                {book.book_author}
              </p>

              <p className="text-xs text-purple-400 uppercase">
                {book.genre}
              </p>

              <div className="flex items-center gap-1 text-sm text-slate-300">
                {book.rating}
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              </div>

              <Button asChild className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                <Link href={`/books/${slug}`}>View Details</Link>
              </Button>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )

  return (
    <SignedIn>
      <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">
        <BubbleBackground />

        <div className="max-w-7xl mx-auto space-y-16">

          {/* HEADER */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Your Top Picks
              </h1>
            </div>
          </div>

          {/* 🔥 SECTION 1 */}
          {likedBooks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                ❤️ Books you liked
              </h2>
              {renderBooks(likedBooks)}
            </div>
          )}

          {/* 🔥 SECTION 2 */}
          {genreBooks.length > 0 && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                🎯 Based on your favorite genres
              </h2>
              {renderBooks(genreBooks)}
            </div>
          )}

          {/* 🔥 SECTION 3 */}
          {recommendedBooks.length > 0 && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
  🚀 Handpicked for You — Based on Your Likes & Taste
</h2>

<p className="text-sm text-slate-400 mb-6">
  A curated stack of books you haven’t explored yet, but are perfect for your reading style 📚
</p>
              {renderBooks(recommendedBooks)}
            </div>
          )}

        </div>
      </main>
    </SignedIn>
  )
}