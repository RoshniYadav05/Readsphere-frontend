"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import BubbleBackground from "../books/bubble-bg"

type Book = {
  id: string
  book_title: string
  author: string
  cover_image: string
  slug: string
}

/* SAME animation structure as requirements page */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
}

const emotionGenreMap: Record<string, string[]> = {
  happy: ["Fiction", "Self-Help", "Fantasy", "Romance", "Dystopian", "Science Fiction", "Young Adult","Biography", "Historical Fiction"],
  sad: ["Biography", "Motivational", "Self-Help", "Young Adult", "Dystopian", "Historical Fiction"],
  relaxed: ["Fantasy", "Fiction", "Literary Fiction", "Science Fiction", "Business", "Historical Fiction"
    ,"Self Help",
    "Engineering",
    "Science",
    "Biography",
    "Civil/Mechanical Engineering",
    "Business",
    "Software Engineering",
    "Motivational",
    "Autobiography", "Science Fiction", "Computer Science", "Computer Engineering", "Mechanical Engineering", "Biography"
  ],
  angry: ["Psychology", "Philosophy"],
  stressed: ["Self-Help", "Young Adult", "Psychology", "Biography", "Historical Fiction"],
  curious: ["Science", "Technology", "Historic", "Mystery", "True Crime", "Dystopian", "Science Fiction" ,"Computer Science", "Biography", "Historical Fiction"],
  motivated: [
    "Business",
    "Self Help",
    "Engineering",
    "Science",
    "Biography",
    "Civil/Mechanical Engineering",
    "Business",
    "Software Engineering",
    "Motivational",
    "Autobiography", "Science Fiction", 
    "Computer Science", "Computer Engineering", 
    "Mechanical Engineering",
    "Historic"
  ],
  tired: [
    "Fiction",
    "Horror",
    "Historical Fiction",
    "Science Fiction",
    "Gothic Fiction",
    "Young Adult",
    "Historic",
    "Literary Fiction",
    "Fantasy",
    "Dystopian",
  ],
  excited: ["Adventure", "Fantasy", "Fiction", "Dystopian", "Mystery", "Science Fiction"],
}

const emotions = [
  { key: "happy", emoji: "😊", label: "Happy" },
  { key: "sad", emoji: "😢", label: "Sad" },
  { key: "relaxed", emoji: "😌", label: "Relaxed" },
  { key: "angry", emoji: "😡", label: "Angry" },
  { key: "stressed", emoji: "🤯", label: "Stressed" },
  { key: "curious", emoji: "🧠", label: "Curious" },
  { key: "motivated", emoji: "🔥", label: "Motivated" },
  { key: "tired", emoji: "😴", label: "Tired" },
  { key: "excited", emoji: "🤩", label: "Excited" },
]

export default function MoodRecommendation() {

  const supabase = createClient()

  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [userMoodText, setUserMoodText] = useState("")

  const fetchBooks = async (emotion: string) => {

    setSelectedEmotion(emotion)
    setLoading(true)

    const genres = emotionGenreMap[emotion]

    const { data } = await supabase
      .from("books")
      .select("*")
      .in("genre", genres)
      .range(0, 49); // first 50 books

    setBooks(data || [])
    setLoading(false)
  }

const moodKeywords: Record<string, string[]> = {
  happy: [
    "happy","good","great","awesome","joy","joyful","glad","pleased",
    "content","cheerful","delighted","positive","nice","fantastic","amazing"
  ],

  sad: [
    "sad","depressed","unhappy","down","lonely","heartbroken",
    "cry","miserable","hopeless","gloomy","melancholy","blue","tear","sorrow"
  ],

  relaxed: [
    "relaxed","calm","peaceful","chill","comfortable","quiet",
    "restful","laid back","serene","tranquil","unwind","stress-free"
  ],

  angry: [
    "angry","mad","furious","annoyed","irritated","rage",
    "frustrated","upset","resentful","enraged","outraged","fuming","cross"
  ],

  stressed: [
    "stressed","anxious","overwhelmed","pressure","burnout",
    "worried","tension","panic","nervous","uneasy","tense","strained"
  ],

  curious: [
    "curious","interested","learning","explore","discover",
    "understand","study","research","knowledge"
  ],

  motivated: [
    "motivated","productive","focused","goal","achieve",
    "improve","success","work hard","discipline"
  ],

  tired: [
    "tired","sleepy","exhausted","fatigue","drained",
    "low energy","rest","nap","bed","yawn","weary","burnt out"
  ],

  excited: [
    "excited","thrilled","pumped","energized","can't wait",
    "amazing","celebration","achievement","joy","over the moon","stoked","ecstatic","elated"
  ]
}


  const detectMood = () => {

  const text = userMoodText.toLowerCase()

  let bestMood: string | null = null
  let bestScore = 0

  Object.entries(moodKeywords).forEach(([mood, keywords]) => {

    let score = 0

    keywords.forEach(word => {
      if (text.includes(word)) score++
    })

    if (score > bestScore) {
      bestScore = score
      bestMood = mood
    }

  })

  if (bestMood) {
    fetchBooks(bestMood)
  } else {
    alert("Couldn't understand mood. Try describing how you feel.")
  }
}

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">

      <BubbleBackground />

      <motion.div
        className="max-w-4xl mx-auto space-y-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

        {/* Header (same as requirements page) */}

        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >

          <div className="flex justify-center items-center gap-2">
            <BookOpen className="h-8 w-8 text-purple-400" />

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Mood Based Recommendations
            </h1>

          </div>

          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Choose an emoji or describe your mood and ReadSphere will recommend books that match how you feel.
          </p>

        </motion.div>

        {/* Main Card */}

        <motion.div
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 shadow-lg shadow-purple-500/20"
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.35)" }}
        >

          {/* TEXT MOOD INPUT */}

          <div className="flex justify-center gap-3 mb-10">

            <input
  type="text"
  placeholder="Describe your mood (e.g. I feel stressed today)"
  value={userMoodText}
  onChange={(e)=>setUserMoodText(e.target.value)}
  onKeyDown={(e)=>{
    if(e.key === "Enter"){
      detectMood()
    }
  }}
  className="px-4 py-2 rounded bg-slate-800 text-white w-full max-w-xl"
/>

            <button
              onClick={detectMood}
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
            >
              Detect Mood
            </button>

          </div>

          {/* Emoji Selector */}

          <div className="flex flex-wrap justify-center gap-6 text-4xl mb-12">

            {emotions.map((e) => (
              <button
                key={e.key}
                onClick={() => fetchBooks(e.key)}
                title={e.label}
                className="hover:scale-125 transition"
              >
                {e.emoji}
              </button>
            ))}

          </div>

          {/* Selected Emotion */}

          {selectedEmotion && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10 text-center"
            >

              <h2 className="text-2xl font-semibold">

                Because you're feeling {emotions.find(e=>e.key===selectedEmotion)?.emoji}

              </h2>

              <p className="text-purple-400 mt-2">
                Here are some books we think you'll enjoy.
              </p>

            </motion.div>

          )}

          {/* Loading */}

          {loading && (
            <p className="text-gray-400 text-center">Finding books for your mood...</p>
          )}

          {/* Books Grid */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {books.map((book) => (

              <Link
                key={book.id}
                href={`/books/${book.slug}`}
                className="group"
              >

                <div className="relative aspect-[2/3] overflow-hidden rounded-lg">

                  <Image
                    src={book.cover_image || "/book-placeholder.jpg"}
                    alt={book.book_title}
                    width={200}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />

                </div>

                <p className="mt-2 text-sm font-medium text-center">
                  {book.book_title}
                </p>

              </Link>

            ))}

          </div>

        </motion.div>

      </motion.div>

    </main>
  )
}