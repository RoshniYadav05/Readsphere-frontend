// src/app/books/[slug]/page.tsx

import BookTracker from "./BookTracker"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"
/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "./../bubble-bg"

type Book = {
  id: string
  book_title: string
  author: string | null
  cover_image: string | null
  f_page: string
  slug: string
  description: string | null
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: book } = await supabase
    .from("books")
    .select("book_title")
    .eq("slug", params.slug)
    .single()

  if (!book) return { title: "Book Not Found" }

  return {
    title: `${book.book_title} | ReadSphere`,
    description: `Read more details about ${book.book_title}.`,
  }
}

export default async function BookPage({
  params,
}: {
  params: { slug: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", params.slug)
    .single<Book>()

  if (!book) return notFound()

  const fallbackImage = "/book-placeholder.jpg"

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">
      <BubbleBackground/>
      <div className="max-w-6xl mx-auto space-y-12">

        {/* ✅ BOOK OPEN TRACKING */}
        <BookTracker bookId={book.id} />

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <BookOpen className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {book.book_title}
            </h1>
          </div>

          {book.author && (
            <p className="text-lg text-slate-400">
              By <span className="text-purple-400">{book.author}</span>
            </p>
          )}
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Book Cover */}
          <div className="flex justify-center">
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-3">
              <Image
                src={book.cover_image ?? fallbackImage}
                alt={book.book_title}
                width={300}
                height={450}
                className="rounded-lg object-cover shadow-2xl"
                unoptimized
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            {book.description && (
              <p className="text-base text-slate-300 leading-relaxed">
                {book.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={`/books/reader/${book.slug}`}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-xl font-semibold text-white shadow-lg"
              >
                Read / View Book
              </Link>

              <Link
                href="/books"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 transition rounded-xl font-semibold text-white flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
