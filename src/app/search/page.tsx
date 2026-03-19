// src/app/search/page.tsx (Updated with Author, Genre, and Title Search)

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from "next/navigation";

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

type Book = {
  id: string;
  slug: string | null;
  book_title: string;
  author: string | null;
  genre: string | null;
  cover_image: string | null;
};
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;

  if (!query) {
    return <p className="text-center text-white p-8">Please enter a search term to begin.</p>;
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: books, error } = await (await supabase)
  .from('books')
  .select('*')
  .returns<Book[]>()
    // This now searches BOOK_TITLE, GENRE, AND BOOK_AUTHOR for the query term.
    .or(
  `book_title.ilike.%${query}%,author.ilike.%${query}%,genre.ilike.%${query}%,description.ilike.%${query}%`
)
.limit(20)

  if (error) {
    console.error('Search error:', error);
    return <p className="text-center text-red-500 p-8">Error searching for books.</p>;
  }
  // ✅ Auto-open if only one result
if (books && books.length === 1) {
  redirect(`/books/${books[0].slug ?? books[0].id}`);
}

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-white">
  Search Results for &quot;{query}&quot;
</h1>

<p className="text-center text-gray-400 mb-6">
  {books.length} results found
</p>
      
      {books.length === 0 ? (
        <p className="text-center text-gray-400">No books found matching your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
          {books.map((book) => (
  <Link
    key={book.id}
    href={`/books/${book.slug ?? book.id}`}
    className="group flex flex-col rounded-xl bg-slate-900 border border-slate-800
               hover:-translate-y-1 hover:border-purple-500/40
               hover:shadow-lg hover:shadow-purple-500/20 transition-all"
  >

    <div className="relative w-full aspect-[2/3]">
      <Image
        src={book.cover_image || "/book-placeholder.jpg"}
        alt={book.book_title}
        fill
        className="object-cover rounded-t-lg"
      />
    </div>

    <div className="p-3">
      <h3 className="text-sm font-semibold text-white line-clamp-2">
        {book.book_title}
      </h3>

      <p className="text-xs text-slate-400">
        {book.author || "Unknown"}
      </p>
    </div>

  </Link>
))}
              <Image
  src={books.cover_image || '/book-placeholder.jpg'}
  alt={books.book_title}
                width={200}
                height={300}
                className="object-cover w-full h-auto aspect-[2/3] transform transition-transform duration-300 group-hover:scale-105"
              />
            
        </div>
      )}
    </div>
  );
}