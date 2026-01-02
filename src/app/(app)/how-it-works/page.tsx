"use client"

import { Filter, Star, Clock, Globe, Sparkles, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "../../books/bubble-bg"

export default function HowItWorks() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  // const fadeIn = {
  //   hidden: { opacity: 0 },
  //   visible: { opacity: 1, transition: { duration: 0.8 } },
  // }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
          <BubbleBackground />
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">How ReadSphere Works</h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Discover your next favorite book with our intelligent recommendation system
          </p>
        </motion.div>

        {/* Appreciation Section */}
        <motion.section className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-800/30"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart className="h-12 w-12 text-purple-400 hover:text-red-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">Thank You for Visiting ReadSphere</h2>
              <p className="text-lg text-slate-300 max-w-2xl">
                We are thrilled that you are here! Your journey to discovering amazing books begins now. Our team has
                crafted this platform with love and dedication to help you find stories that resonate with your soul.
              </p>
              <motion.div
                className="mt-4 bg-purple-600/20 px-6 py-3 rounded-lg border border-purple-500/30"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <p className="text-purple-300 font-medium">The right book at the right time can change your life.</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Personalized Recommendations Section */}
        <motion.section
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <motion.div className="md:w-1/2 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-2">
                <Filter className="h-6 w-6 text-purple-400" />
                <h2 className="text-3xl font-bold text-white">Personalized Book Recommendations</h2>
              </div>
              <p className="text-slate-400">
                Tell us what you are looking for, and we will find the perfect books for you. Our advanced recommendation
                system considers:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  className="bg-slate-900/50 p-4 rounded-lg border border-slate-800"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Genre Preferences</h3>
                  </div>
                  <p className="text-sm text-slate-400">
                    Fiction, mystery, sci-fi, romance, and many more categories to choose from
                  </p>
                </motion.div>
                <motion.div
                  className="bg-slate-900/50 p-4 rounded-lg border border-slate-800"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Minimum Rating</h3>
                  </div>
                  <p className="text-sm text-slate-400">Set your quality threshold with our rating filter</p>
                </motion.div>
                <motion.div
                  className="bg-slate-900/50 p-4 rounded-lg border border-slate-800"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Book Length</h3>
                  </div>
                  <p className="text-sm text-slate-400">Find the perfect length for your reading time</p>
                </motion.div>
                <motion.div
                  className="bg-slate-900/50 p-4 rounded-lg border border-slate-800"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Language Preference</h3>
                  </div>
                  <p className="text-sm text-slate-400">Discover books in your preferred language</p>
                </motion.div>
              </div>
            </motion.div>
            <motion.div className="md:w-1/2 relative" variants={itemVariants}>
              <motion.div
                className="bg-slate-900/70 border border-slate-800 rounded-lg p-6 shadow-xl shadow-purple-900/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Find Your Perfect Read</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Genre</label>
                      <div className="bg-slate-800 rounded-md p-2 text-white">Fantasy, Science Fiction</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Minimum Rating</label>
                      <div className="bg-slate-800 rounded-md p-2 text-white flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <Star className="h-4 w-4 text-slate-600" />
                        <span className="ml-2">4.0+</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Book Length</label>
                      <div className="bg-slate-800 rounded-md p-2 text-white">300-500 pages</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Language</label>
                      <div className="bg-slate-800 rounded-md p-2 text-white">English</div>
                    </div>
                    <Link href="/requirements">
  <motion.button
    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
    whileTap={{ scale: 0.95 }}
  >
    Get Recommendations
  </motion.button>
</Link>

                  </div>
                </div>
              </motion.div>
              <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-xl -z-10"></div>
            </motion.div>
          </div>
        </motion.section>

        {/* How to Use Section */}
        <motion.section
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-white text-center" variants={itemVariants}>
            How to Use ReadSphere
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center"
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 15px 30px -5px rgba(124, 58, 237, 0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-xl font-bold text-purple-400">1</span>
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Set Your Preferences</h3>
              <p className="text-slate-400">Tell us what you are looking for in your next great read</p>
            </motion.div>
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center"
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 15px 30px -5px rgba(124, 58, 237, 0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-xl font-bold text-purple-400">2</span>
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Personalized Suggestions</h3>
              <p className="text-slate-400">Our algorithm finds the perfect books tailored to your tastes</p>
            </motion.div>
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center"
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: "0 15px 30px -5px rgba(124, 58, 237, 0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="bg-purple-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-xl font-bold text-purple-400">3</span>
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Discover New Books</h3>
              <p className="text-slate-400">Explore your recommendations and find your next favorite book</p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}

