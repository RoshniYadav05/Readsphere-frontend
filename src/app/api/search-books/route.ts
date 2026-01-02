import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }
  const supabase = await createClient(cookies());
  const { data, error } = await (await supabase)
    .from("books")
    .select(`
      id,
      slug,
      book_title,
      author,
      genre,
      f_page,
      cover_image,
      pdf_filename,
      description,
      rating
    `)
    .or(
      `book_title.ilike.%${query}%,author.ilike.%${query}%,genre.ilike.%${query}%`
    )
    .limit(10);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  return NextResponse.json({ results: data });
}
