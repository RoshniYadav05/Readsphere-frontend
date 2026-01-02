// src/app/(app)/dashboard/page.tsx
"use client"

import { motion } from "framer-motion"
import { BookOpen, Target, Heart } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "../../books/bubble-bg"


/* Animations (same system as Requirements) */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">
      <BubbleBackground />
      
      <motion.div
        className="max-w-7xl mx-auto space-y-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center items-center gap-2">
            <BookOpen className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Your Reading Dashboard
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Track your reading progress and stay consistent 📚
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {/* Books Read */}
          <motion.div variants={cardVariants}>
            <Card className="bg-slate-900/60 border border-slate-800 rounded-xl
                             shadow-lg shadow-purple-500/20
                             hover:-translate-y-2 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <BookOpen className="h-6 w-6 text-purple-400" />
                <div>
                  <CardTitle className="text-white">Books Read</CardTitle>
                  <CardDescription className="text-slate-400">
                    Your reading progress
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">0</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reading Goal */}
          <motion.div variants={cardVariants}>
            <Card className="bg-slate-900/60 border border-slate-800 rounded-xl
                             shadow-lg shadow-purple-500/20
                             hover:-translate-y-2 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <Target className="h-6 w-6 text-purple-400" />
                <div>
                  <CardTitle className="text-white">Reading Goal</CardTitle>
                  <CardDescription className="text-slate-400">
                    Books to read this year
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">0 / 50</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Favorite Genre */}
          <motion.div variants={cardVariants}>
            <Card className="bg-slate-900/60 border border-slate-800 rounded-xl
                             shadow-lg shadow-purple-500/20
                             hover:-translate-y-2 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <Heart className="h-6 w-6 text-purple-400" />
                <div>
                  <CardTitle className="text-white">Favorite Genre</CardTitle>
                  <CardDescription className="text-slate-400">
                    Based on your reading history
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">None</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  )
}
