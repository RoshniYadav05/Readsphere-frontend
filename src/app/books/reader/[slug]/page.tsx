//src/app/books/reader/[slug]/page.tsx
import ReaderClient from './ReaderClient';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import BookTracker from '../../[slug]/BookTracker';

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;
  const supabase = createClient(cookies());

  const { data: book } = await supabase
    .from('books')
    .select('f_page, book_title')
    .eq('slug', slug)
    .single();

  if (!book) {
    return <div className="text-white p-10">Book not found</div>;
  }

  return (
    <div className="w-full h-screen bg-black">
      <BookTracker 
  bookId={book.id}
  bookTitle={book.book_title}
/>
      <ReaderClient pdfUrl={book.f_page} slug={slug} />
    </div>
  );
}
