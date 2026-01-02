// src/app/api/recommend/popularity/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      popular_books: [
        {
          id: 1,
          slug: "A-Wrinkle-in-Time",
          book_title: "A Wrinkle in Time",
          book_author: "Madeleine L'Engle",
          genre: "Childrens",
          rating: 4.3,
          cover_image: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/covers/A%20Wrinkle%20in%20Time.jpg",
          f_page: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/A%20Wrinkle%20in%20Time.pdf",
          pdf_filename: "A Wrinkle in Time.pdf",
          
        },
        {
          id: 2,
          slug: "rich-dad-poor-dad",
          book_title: "Rich Dad Poor Dad",
          book_author: "Robert Kiyosaki",
          genre: "Self-Help",
          rating: 4.5,
          cover_image: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/covers/Rich%20Dad%20Poor%20Dad.jpg",
          f_page: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/Rich%20Dad%20Poor%20Dad.pdf",
          pdf_filename: "Rich Dad Poor Dad.pdf",
          
        },
        {
          id: 3,
          slug: "the-hobbit",
          book_title: "The Hobbit",
          book_author: "J.R.R. Tolkien",
          genre: "Fantasy",
          rating: 4.7,
          cover_image: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/covers/The%20Hobbit.jpeg",
          f_page: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/The%20Hobbit.pdf",
          pdf_filename: "The-hobbit.pdf",
          
        },
        {
          id: 4,
          slug: "Python-Programming:-A-Step-by-Step-Guide-to-Learning-the-Language",
          book_title: "Python Programming: A Step-by-Step Guide to Learning the Language",
          book_author: "C. K. Dhaliwal",
          genre: "Engineering",
          rating: 4.3,
          cover_image: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/covers/Python%20Programming%20A%20Step-by-Step%20Guide%20to%20Learning%20the%20Language.jpg",
          f_page: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/Python%20Programming%20A%20Step-by-Step%20Guide%20to%20Learning%20the%20Language.pdf",
          pdf_filename: "Python-Programming:-A-Step-by-Step-Guide-to-Learning-the-Language.pdf",
          
        },
        {
          id: 5,
          slug: "Good Omens",
          book_title: "good-omens",
          book_author: "Terry Pratchett & Neil Gaiman",
          genre: "Fantasy",
          rating: 4.3,
          cover_image: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/covers/Good%20Omens.jpeg",
          f_page: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/Good%20Omens.pdf",
          pdf_filename: "good-omens.pdf",
          
        },
        {
          id: 6,
          slug: "The-Name-of-the-Wind",
          book_title: "The Name of the Wind",
          book_author: "Patrick Rothfuss",
          genre: "Fantasy",
          rating: 4.7,
          cover_image: "https://jdowuzdumrucojkramsx.supabase.co/storage/v1/object/public/book-files/covers/The%20Name%20of%20the%20Wind.jpg"
        },
        // Add 8 more books later
      ]
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load popular books" },
      { status: 500 }
    );
  }
}
