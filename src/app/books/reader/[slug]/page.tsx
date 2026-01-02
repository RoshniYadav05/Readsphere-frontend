import ReaderClient from './ReaderClient';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function ReaderPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient(cookies());

  const { data: book } = await supabase
    .from('books')
    .select('f_page')
    .eq('slug', params.slug)
    .single();

  if (!book) {
    return <div className="text-white p-10">Book not found</div>;
  }

  return (
    <div className="w-full h-screen bg-black">
      <ReaderClient pdfUrl={book.f_page} slug={params.slug} />
    </div>
  );
}
