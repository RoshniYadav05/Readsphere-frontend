// src/app/books/bubble-bg.tsx
"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

type Bubble = {
  id: number
  x: number
  y: number
  size: number
  duration: number
}

export default function BubbleBackground() {
  const [mounted, setMounted] = useState(false)
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const generateBubbles = () => {
      const pageHeight = document.body.scrollHeight
      const viewportHeight = window.innerHeight

      /**
       * 🧠 Density logic
       * 1 bubble per ~120px of scroll height
       * feels subtle + Kindle-like
       */
      const bubbleCount = Math.max(
        100,
        Math.floor(pageHeight / 40)
      )

      const newBubbles: Bubble[] = Array.from(
        { length: bubbleCount },
        (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * (pageHeight / viewportHeight) * 100,
          size: Math.random() * 35 + 40,
          duration: Math.random() * 15 + 15,
        })
      )

      setBubbles(newBubbles)
    }

    generateBubbles()

    // 🔁 Recalculate on resize (page length changes)
    window.addEventListener("resize", generateBubbles)
    return () => window.removeEventListener("resize", generateBubbles)
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-purple-500/25 blur-sm z-0"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
