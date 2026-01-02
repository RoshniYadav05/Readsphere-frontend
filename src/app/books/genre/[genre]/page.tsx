// src/app/books/genre/[genre]/page.tsx
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import GenreClient from "./GenreClient"

export async function generateMetadata({
  params,
}: {
  params: { genre: string }
}) {
  const genreName = decodeURIComponent(params.genre)

  return {
    title: `${genreName} Books | ReadSphere`,
    description: `Browse all ${genreName} books available on ReadSphere.`,
  }
}

export default async function GenreBooksPage({
  params,
}: {
  params: { genre: string }
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const genre = decodeURIComponent(params.genre)

  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .ilike("genre", genre)

  if (error || !books || books.length === 0) {
    return notFound()
  }

  return <GenreClient genre={genre} books={books} />
}
