// src/app/api/recommend/personalized/route.ts
// src/app/api/recommend/personalized/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { genre, author, min_rating } = body;
    const supabase = createClient(cookies());

    // Base query for recommendations
    let query = supabase
      .from("books")
      .select("id, slug, book_title, cover_image, genre, author, rating");

    if (genre) query = query.eq("genre", genre);
    if (author) query = query.ilike("author", `%${author}%`);
    if (min_rating) query = query.gte("rating", min_rating);

    const { data, error } = await query;
    if (error) throw error;

    // Exclude already recommended books from similar books
    const recommendedIds = data.map((b: { id: string | number }) => b.id);

    const { data: similarData, error: simErr } = await supabase
      .from("books")
      .select("id, slug, book_title, cover_image, genre")
      .eq("genre", genre)
      .not("id", "in", `(${recommendedIds.join(",")})`)
      .limit(8);

    if (simErr) throw simErr;

    return NextResponse.json({
      recommended_books: data,
      similar_books: similarData || [],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
