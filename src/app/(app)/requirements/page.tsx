//src/app/(app)/requirements/page.tsx
"use client"
import RequirementsForm from "./RequirementsForm"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "../../books/bubble-bg"

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

export default function RequirementsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">
      <BubbleBackground />
      <motion.div
        className="max-w-4xl mx-auto space-y-12"
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
              Get Personalized Recommendations
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Tell us what you're looking for, and our ML model will find books tailored to your taste ✨
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 shadow-lg shadow-purple-500/20"
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.35)" }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <RequirementsForm />
        </motion.div>
      </motion.div>
    </main>
  )
}
