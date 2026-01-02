// src/app/search/page.tsx (Updated with Author, Genre, and Title Search)

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
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
    // This now searches BOOK_TITLE, GENRE, AND BOOK_AUTHOR for the query term.
    .or(`BOOK_TITLE.ilike.%${query}%,GENRE.ilike.%${query}%,BOOK_AUTHOR.ilike.%${query}%`);

  if (error) {
    console.error('Search error:', error);
    return <p className="text-center text-red-500 p-8">Error searching for books.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10 text-white">
        Search Results for &quot;{query}&quot;
      </h1>
      
      {books.length === 0 ? (
        <p className="text-center text-gray-400">No books found matching your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.slug}`}
              className="block group rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={book.F_PAGE || '/placeholder.svg'}
                alt={book.BOOK_TITLE}
                width={200}
                height={300}
                className="object-cover w-full h-auto aspect-[2/3] transform transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}