import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { book_slug, duration_seconds, start_time, end_time } = body

    if (!book_slug || !duration_seconds || !start_time || !end_time) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      )
    }

    // 🧠 Just echo back — frontend/dashboard will store & display
    return NextResponse.json({
      ok: true,
      readingSession: {
        book: book_slug,
        minutes: Math.round(duration_seconds / 60),
        start: start_time,
        end: end_time,
        date: new Date().toISOString().split("T")[0],
      },
    })
  } catch (err) {
    console.error("API error", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

