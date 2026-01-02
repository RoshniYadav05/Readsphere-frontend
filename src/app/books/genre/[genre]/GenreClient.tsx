//src/app/books/genre/[genre]/GenreClient.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, Library } from "lucide-react"
import { useMemo, useState } from "react"
/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "../../bubble-bg"


type Book = {
  id: string
  slug: string
  book_title: string
  author: string | null
  cover_image: string | null
  rating?: number
}

const genreStyles: Record<string, { icon: string; gradient: string }> = {
  fantasy: { icon: "🧙‍♂️", gradient: "from-purple-600 to-indigo-600" },
  romance: { icon: "❤️", gradient: "from-pink-500 to-rose-600" },
  technology: { icon: "💻", gradient: "from-blue-500 to-cyan-600" },
  "self help": { icon: "🧠", gradient: "from-emerald-500 to-teal-600" },
}

/* 📘 ONE UNIFIED BOOK CARD */
function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group w-full max-w-[180px] mx-auto rounded-xl
                 bg-slate-900 border border-slate-800 overflow-hidden
                 hover:-translate-y-1 hover:border-purple-500/40
                 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={book.cover_image || "/book-placeholder.jpg"}
          alt={book.book_title}
          fill
          className="object-cover"
        />
      </div>

      {/* Fixed text area */}
      <div className="p-3 h-[78px] flex flex-col justify-between">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {book.book_title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-1">
          {book.author || " "}
        </p>
      </div>
    </Link>
  )
}

export default function GenreClient({
  genre,
  books,
}: {
  genre: string
  books: Book[]
}) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("rating")

  const filteredBooks = useMemo(() => {
    let result = books.filter((b) =>
      b.book_title.toLowerCase().includes(search.toLowerCase())
    )

    if (sort === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    if (sort === "az") {
      result.sort((a, b) => a.book_title.localeCompare(b.book_title))
    }

    return result
  }, [books, search, sort])

  const style =
    genreStyles[genre.toLowerCase()] ?? {
      icon: "📚",
      gradient: "from-purple-600 to-blue-600",
    }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-14">
        <BubbleBackground/>

        {/* Back */}
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Genres
        </Link>

        {/* Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h1 className="text-4xl font-bold flex items-center gap-3 capitalize">
            <span>{style.icon}</span>
            {genre} Books
          </h1>
          <p className="text-slate-400 mt-2">
            Explore complete collection of {genre} books
          </p>

          <div className="mt-6 flex gap-3 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books..."
                className="w-full pl-10 py-2 rounded-lg bg-slate-950 border border-slate-700"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg bg-slate-950 border border-slate-700 px-3"
            >
              <option value="rating">Top Rated</option>
              <option value="az">A – Z</option>
            </select>
          </div>
        </div>

        {/* All Books */}
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Library className="text-purple-400" />
            All {genre} Books ({filteredBooks.length})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
