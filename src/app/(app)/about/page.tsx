"use client"

import { Heart, Code, Lightbulb, BookOpen } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "../../books/bubble-bg"


export default function About() {
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <BubbleBackground/>
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">About ReadSphere</h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Connecting readers with their perfect books through the power of personalized recommendations
          </p>
        </motion.div>

        {/* About ReadSphere Section */}
        <motion.section
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div className="md:w-1/2 space-y-6" variants={itemVariants}>
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                >
                  <Heart className="h-6 w-6 text-purple-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-slate-400">
                At ReadSphere, we believe that the right book can change your life. Our mission is to connect readers with
                books that resonate with their unique interests, preferences, and reading habits.
              </p>
              <p className="text-slate-400">
                We are passionate about literature in all its forms and are dedicated to helping you discover stories
                that will captivate, inspire, and transform you.
              </p>
              <motion.div
                className="bg-slate-900/50 p-6 rounded-lg border border-slate-800"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <h3 className="text-xl font-semibold text-white mb-3">Our Vision</h3>
                <p className="text-slate-400">
                  To create a world where everyone can easily find books that speak to their soul, expanding horizons
                  and fostering a lifelong love of reading.
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              className="md:w-1/2 relative"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                <div className="relative w-3/4 h-3/4">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <Image
                      src="/smile.jpg"
                      alt="smile3"
                      width={20}
                      height={30}
                      className="w-full h-full object-cover" />
                    <BookOpen className="w-24 h-24 text-purple-400/50" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-4 -left-4 w-full h-full bg-slate-900/70 rounded-lg border border-purple-500/20"
                    animate={{ rotate: [3, 5, 3] }}
                    transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  >
                    <Image
                      src="/smile2.jpg"
                      alt="smile3"
                      width={20}
                      height={30}
                      className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-full h-full bg-slate-900/70 rounded-lg border border-blue-500/20"
                    animate={{ rotate: [-3, -5, -3] }}
                    transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  >
                    <Image
                      src="/smile3.jpg"
                      alt="smile3"
                      width={20}
                      height={30}
                      className="w-full h-full object-cover" />
                  </motion.div>
                  
                  <div className="relative w-full h-full bg-slate-900/90 rounded-lg border border-slate-800 p-6 flex items-center justify-center">
                 
                    <div className="text-center">
                   
                      <motion.h3
                        className="text-2xl font-bold text-white mb-2"
                        animate={{
                          textShadow: [
                            "0 0 8px rgba(168, 85, 247, 0)",
                            "0 0 16px rgba(168, 85, 247, 0.5)",
                            "0 0 8px rgba(168, 85, 247, 0)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      >
                        ReadSphere
                      </motion.h3>
                      <p className="text-slate-400">Illuminating your reading journey</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Developer Information Section */}
        
        <motion.section
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          
          <motion.div className="flex items-center gap-2 justify-center" variants={itemVariants}>
            
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 500, damping: 10 }}
            >
              <Code className="h-6 w-6 text-purple-400" />
              
            </motion.div>
            <h2 className="text-3xl font-bold text-white text-center">Meet the Team</h2>
          </motion.div>
          <motion.p className="text-slate-400 text-center max-w-3xl mx-auto" variants={itemVariants}>
            ReadSphere is built by a passionate team of book lovers, developers, and data scientists who are committed to
            creating the best book recommendation platform.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center"
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-slate-800"
                whileHover={{ scale: 1.2, borderRadius: "50%" }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/pkk.jpg"
                  alt="Developer profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover  "
                />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-1">Roshni Yadav</h3>
              <p className="text-purple-400 mb-3">Lead Project Developer</p>
              <p className="text-slate-400 text-sm">
              Specializes in strategic leadership, driving innovation, and overseeing cross-functional teams to deliver high-impact solutions while fostering collaboration, efficiency, and growth.
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center"
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-slate-800"
                whileHover={{ scale: 1.2, borderRadius: "50%" }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/pkk.jpg"
                  alt="Developer profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-1">Prakashkumar Yadav</h3>
              <p className="text-purple-400 mb-3">Frontend developer</p>
              <p className="text-slate-400 text-sm">
              Specializes in dynamic UI/UX development, building responsive, high-performance web applications, and crafting seamless user experiences with modern technologies.
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center"
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-slate-800"
                whileHover={{ scale: 1.2, borderRadius: "50%" }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/jrahul.jpg"
                  alt="Developer profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-1">Rahul Yadav</h3>
              <p className="text-purple-400 mb-3">UI/UX Designer</p>
              <p className="text-slate-400 text-sm">
              Specializes in creating user-centric designs, crafting visually appealing, intuitive, and seamless digital experiences that enhance user engagement and accessibility..
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center"
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: "0 20px 30px -10px rgba(124, 58, 237, 0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-slate-800"
                whileHover={{ scale: 1.2, borderRadius: "50%" }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/jay.jpg"
                  alt="Developer profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-1">Jay Waghela</h3>
              <p className="text-purple-400 mb-3">Ml Engineer</p>
              <p className="text-slate-400 text-sm">
              Specializes in developing intelligent systems, building scalable machine learning models, and leveraging data-driven algorithms to extract insights and drive automation across various domains.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Our Values Section */}
        <motion.section
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="flex items-center gap-2 justify-center" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 500, damping: 10 }}
            >
              <Lightbulb className="h-6 w-6 text-purple-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white text-center">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800"
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <h3 className="text-xl font-semibold text-white mb-3">Reader-Centric</h3>
              <p className="text-slate-400">
                We put readers first in everything we do. Our recommendations are personalized to your unique
                preferences, not driven by promotions or sponsorships.
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800"
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <h3 className="text-xl font-semibold text-white mb-3">Diversity in Literature</h3>
              <p className="text-slate-400">
                We celebrate diverse voices and perspectives, ensuring our recommendations include authors from all
                backgrounds and experiences.
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800"
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <h3 className="text-xl font-semibold text-white mb-3">Continuous Improvement</h3>
              <p className="text-slate-400">
                Our recommendation engine is constantly learning and evolving to better understand your preferences and
                provide more accurate suggestions.
              </p>
            </motion.div>
            <motion.div
              className="bg-slate-900/50 p-6 rounded-lg border border-slate-800"
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <h3 className="text-xl font-semibold text-white mb-3">Community Building</h3>
              <p className="text-slate-400">
                We are creating a community of readers who share recommendations, insights, and a passion for great
                books.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold text-white text-center" variants={itemVariants}>
            Get in Touch
          </motion.h2>
          <motion.p className="text-slate-400 text-center max-w-3xl mx-auto" variants={itemVariants}>
            Have questions, suggestions, or just want to say hello? We would love to hear from you!
          </motion.p>
          <motion.div
            className="bg-slate-900/50 p-8 rounded-lg border border-slate-800 max-w-2xl mx-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 15px 30px -10px rgba(124, 58, 237, 0.2)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className="text-center space-y-4">
              <p className="text-white">
                Email us at: <span className="text-purple-400">contact@ReadSphere.com</span>
              </p>
              <p className="text-white">Follow us on social media for updates and book recommendations</p>
              <div className="flex justify-center gap-4">
                <motion.button
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 hover:bg-purple-900/30 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </motion.button>
                <motion.button
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 hover:bg-purple-900/30 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </motion.button>
                <motion.button
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 hover:bg-purple-900/30 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  )
}

