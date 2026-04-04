//src/app/books/reader/[slug]/page.tsx
import dynamic from "next/dynamic"

const ReaderClient = dynamic(
  () => import("./ReaderClient"),
  { ssr: false }
)
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import BookTracker from '../../[slug]/BookTracker'

export const revalidate = 3600
export default async function ReaderPage({
  params,
}: {
  params: { slug: string }
}) {

  const { slug } = params

  const supabase = createClient(cookies())

  /* ---------------------------
     GUTENBERG BOOK DETECT
  ---------------------------- */

  if (slug.startsWith("gutenberg-")) {

  const bookId = slug.replace("gutenberg-", "")
  const readerUrl = `https://www.gutenberg.org/ebooks/${bookId}.html.images`

  return (
    <div className="w-full h-screen bg-black">

      <BookTracker
        bookId={bookId}
        bookTitle={`Gutenberg ${bookId}`}
      />

      <iframe
        src={readerUrl}
        className="w-full h-full"
      />

    </div>
  )
}

  /* ---------------------------
     NORMAL SUPABASE BOOK
  ---------------------------- */

  const { data: book } = await supabase
    .from('books')
    .select('id, f_page, book_title')
    .eq('slug', slug)
    .single()

  if (!book) {
    return <div className="text-white p-10">Book not found</div>
  }

  return (
    <div className="w-full h-screen bg-black">

      <BookTracker
  bookId={book.id}
  bookTitle={book.book_title}
/>

      <ReaderClient
        pdfUrl={book.f_page}
        slug={slug}
      />

    </div>
  )
}