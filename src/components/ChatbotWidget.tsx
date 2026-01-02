//src/components/ChatbotWidget.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

type Message = {
  role: "user" | "bot"
  content: string
}

type Book = {
  title: string
  author: string
  reason: string
}

export default function ChatbotWidget() {
  const router = useRouter() // 🔹 Router for navigation
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hi 👋 I’m ReadSphere AI. Ask me for book summaries, recommendations, or reading help 📚",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔹 Slug helper function
  const createSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

  // 🔹 Extract BOOKS JSON from AI response
  const extractBooks = (text: string): Book[] | null => {
    const match = text.match(/BOOKS:\s*(\[[\s\S]*\])/)
    if (!match) return null

    try {
      return JSON.parse(match[1])
    } catch {
      return null
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: "user", content: input }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await res.json()
      const botReply: string = data.reply

      // ✨ Typing effect
      let index = 0
      setMessages(prev => [...prev, { role: "bot", content: "" }])

      const interval = setInterval(() => {
        index++
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1].content = botReply.slice(0, index)
          return updated
        })

        if (index >= botReply.length) {
          clearInterval(interval)
          setLoading(false)
        }
      }, 15)
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Sorry, something went wrong. Please try again.",
        },
      ])
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-6 right-20 z-50
          w-20 h-16
          rounded-full
          bg-gradient-to-r from-indigo-900 via-purple-900 to-black
          text-white text-2xl
          flex items-center justify-center
          shadow-2xl
          hover:scale-110
          transition-transform
        "
      >
        💬
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="
              fixed bottom-20 right-20 z-50
              w-80 h-[420px]
              bg-zinc-900
              text-white
              rounded-xl
              shadow-2xl
              flex flex-col
            "
          >
            {/* Header */}
            <div className="p-3 font-semibold border-b border-zinc-700 bg-black rounded-t-xl">
              ReadSphere AI
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
              {messages.map((msg, i) => {
                const books = extractBooks(msg.content)
                const cleanText = msg.content.replace(
                  /BOOKS:[\s\S]*/,
                  ""
                ).trim()

                return (
                  <div key={i} className="space-y-2">
                    <div
                      className={`p-2 rounded-lg max-w-[80%] ${
                        msg.role === "user"
                          ? "bg-indigo-700 text-white ml-auto"
                          : "bg-zinc-800 text-zinc-100"
                      }`}
                    >
                      {cleanText}
                    </div>

                    {/* 📚 Book Cards */}
                    {books && (
                      <div className="grid grid-cols-1 gap-2">
                        {books.map((book, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              router.push(`/books/${createSlug(book.title)}`)
                            }
                            className="
                              bg-zinc-900
                              border border-zinc-700
                              rounded-lg
                              p-3
                              cursor-pointer
                              hover:border-indigo-500
                              hover:bg-zinc-800
                              transition
                            "
                          >
                            <div className="font-semibold">
                              {book.title}
                            </div>
                            <div className="text-xs text-zinc-400">
                              by {book.author}
                            </div>
                            <div className="text-zinc-300 mt-1 text-xs">
                              {book.reason}
                            </div>
                            <div className="text-xs text-indigo-400 mt-1">
                              Click to read →
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {loading && (
                <div className="bg-zinc-800 text-zinc-400 p-2 rounded-lg w-fit text-xs">
                  ReadSphere AI is typing…
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-zinc-700 flex gap-2 bg-black rounded-b-xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about a book..."
                className="
                  flex-1
                  bg-zinc-800
                  text-white
                  border border-zinc-700
                  rounded-md
                  px-2 py-1
                  text-sm
                  outline-none
                  placeholder-zinc-400
                "
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="
                  bg-indigo-700
                  hover:bg-indigo-800
                  disabled:opacity-50
                  text-white
                  px-3
                  rounded-md
                  text-sm
                "
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
