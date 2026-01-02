import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"

/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "./bubble-bg"

type Book = {
  id: string
  slug: string
  book_title: string
  author: string | null
  cover_image: string | null
  genre: string | null
}

/* 📘 UNIFIED BOOK CARD */
function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex-shrink-0 w-36 sm:w-40 rounded-xl
                 bg-slate-900 border border-slate-800
                 hover:-translate-y-1 hover:border-purple-500/40
                 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
    >
      <div className="w-full aspect-[3/4] relative">
        <Image
          src={book.cover_image || "/book-placeholder.jpg"}
          alt={book.book_title}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>

      <div className="p-3 flex flex-col justify-between h-[140px]">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2">
            {book.book_title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-1">
            {book.author || "Unknown"}
          </p>
        </div>
        <span className="mt-2 inline-block w-full text-center
                         bg-purple-600 text-white text-xs sm:text-sm py-2 rounded-lg
                         group-hover:bg-purple-700 transition">
          Read Book
        </span>
      </div>
    </Link>
  )
}

export default async function BooksPage() {
  const supabase = createClient(cookies())

  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .order("book_title", { ascending: true })

  if (error) {
    return <div className="text-white">Failed to fetch books</div>
  }

  const booksByGenre: Record<string, Book[]> = {}

  books?.forEach((book) => {
    const genre = book.genre || "Others"
    if (!booksByGenre[genre]) booksByGenre[genre] = []
    booksByGenre[genre].push(book)
  })

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8 overflow-hidden">

      {/* ✅ BUBBLE BACKGROUND */}
      <BubbleBackground />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Explore Books by Genre
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Discover books faster by browsing categories tailored to your interests
          </p>
        </div>

        {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
          <section key={genre} className="space-y-6">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{genre}</h2>
              <Link
                href={`/books/genre/${encodeURIComponent(genre)}`}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                View all →
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {genreBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
