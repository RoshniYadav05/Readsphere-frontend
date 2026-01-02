import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createClient(cookies());

    const { data, error } = await supabase
      .from("books")
      .select("genre");

    if (error) throw error;

    const uniqueGenres = [...new Set(data.map(item => item.genre).filter(Boolean))].sort();

    return NextResponse.json({ genres: uniqueGenres });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ genres: [] });
  }
}
