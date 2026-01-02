"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star, Loader, BookOpen } from "lucide-react"
import { SignedIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "../../books/bubble-bg"
interface Book {
  book_title: string
  book_author: string
  genre: string
  rating: number
  f_page: string
  slug: string
  cover_image: string
}

/* Animation Variants – same style as About page */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
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
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await fetch("/api/recommend/popularity")
        const data = await response.json()
        setBooks(data.popular_books || [])
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularBooks()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader className="h-12 w-12 animate-spin mr-3" />
     
        <span className="text-2xl">Loading your top picks...</span>
      </div>
    )
  }

  return (
    <SignedIn>
      <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">
           <BubbleBackground/>
        <motion.div
          className="max-w-7xl mx-auto space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex justify-center items-center gap-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Your Top Picks
              </h1>
            </div>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Handpicked books curated just for your reading taste ✨
            </p>
          </motion.div>

          {/* Books Grid */}
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
                  key={book.book_title}
                  className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden"
                  variants={cardVariants}
                  whileHover={{
                    y: -10,
                    boxShadow:
                      "0 20px 30px -10px rgba(124, 58, 237, 0.35)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {/* Book Image */}
                  <div className="relative h-64 bg-gradient-to-br from-purple-600/10 to-blue-600/10 flex items-center justify-center">
                    <Image
                      src={(book.cover_image || "/placeholder.svg").trim()}
                      alt={book.book_title}
                      width={200}
                      height={300}
                      className="object-contain h-full w-full p-4"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {book.book_title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {book.book_author}
                    </p>
                    <p className="text-xs text-purple-400 uppercase tracking-wide">
                      {book.genre}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-slate-300">
                      {book.rating}
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    </div>

                    <Button
                      asChild
                      className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                    >
                      <Link href={`/books/${slug}`}>View Details</Link>
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </main>
    </SignedIn>
  )
}
