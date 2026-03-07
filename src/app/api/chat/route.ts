// src/app/api/chat/route.ts
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing OpenRouter API key" },
        { status: 500 }
      )
    }

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
          model: "meta-llama/llama-3.1-8b-instruct",
          temperature: 0.6,
          messages: [
            {
              role: "system",
              content: `
You are ReadSphere AI, an expert reading assistant.

Rules:
- Be friendly, concise, and practical
- Give clear summaries and actionable reading advice
- When recommending books, ALWAYS include a JSON block

If no books are recommended, DO NOT include the BOOKS block.
              `,
            },
            ...messages,
          ],
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("OpenRouter error:", data)
      return NextResponse.json(
        { error: data?.error?.message || "OpenRouter error" },
        { status: response.status }
      )
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    })
  } catch (err) {
    console.error("Chat API crash:", err)
    return NextResponse.json(
      { error: "AI failed to respond" },
      { status: 500 }
    )
  }
}
