import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ReadSphere",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          temperature: 0.6,
          messages: [
            {
              role: "system",
              content: `
You are ReadSphere AI, an expert reading assistant.

Rules:
- Be friendly, concise, and practical
- Give clear summaries and actionable reading advice
- When recommending books, ALWAYS include a JSON block at the end like this:

BOOKS:
[
  {
    "title": "Book title",
    "author": "Author name",
    "reason": "Why this book is recommended"
  }
]

- If no books are recommended, DO NOT include the BOOKS block
- Use simple, human language
              `,
            },
            ...messages,
          ],
        }),
      }
    )

    const data = await response.json()

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "AI failed to respond" },
      { status: 500 }
    )
  }
}
