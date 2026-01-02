//src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion";
import { SignUp } from "@clerk/nextjs"
import { BookOpen, BookText, BookMarked, Quote, Sparkles } from "lucide-react"
import { Inter, DM_Serif_Display, Merriweather } from "next/font/google"

// Font setup
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
})
const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
})

// Book quotes
const bookQuotes = [
  "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
  "Books are a uniquely portable magic.",
  "Reading is to the mind what exercise is to the body.",
  "There is no friend as loyal as a book.",
  "A book is a dream that you hold in your hand.",
]

// Book animation variants
const bookVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeInOut" // ✅ Now TypeScript knows this is a valid Easing type
    },
  }),
};

// Page turning animation
const PageTurningAnimation = () => {
  return (
    <motion.div
      className="relative w-16 h-20 mx-auto"
      initial={{ rotateY: 0 }}
      animate={{ rotateY: 360 }}
      transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      <div className="absolute inset-0 bg-blue-100 rounded-r border-r border-blue-300 shadow-md" />
      <motion.div
        className="absolute inset-0 bg-white border-r border-blue-200 rounded-r shadow-md origin-left"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: [-5, -170, -180, -180, -5] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          times: [0, 0.3, 0.35, 0.9, 1],
          ease: "easeInOut",
        }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-8 h-[2px] bg-blue-200 mb-1 mx-2" />
        </div>
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-white border-r border-blue-200 rounded-r shadow-md origin-left"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: [-5, -5, -170, -180, -180] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          delay: 5,
          times: [0, 0.6, 0.9, 0.95, 1],
          ease: "easeInOut",
        }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-8 h-[2px] bg-blue-200 mb-1 mx-2" />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function SignInPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [randomQuote, setRandomQuote] = useState("")

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Set random quote
    setRandomQuote(bookQuotes[Math.floor(Math.random() * bookQuotes.length)])

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Book icons with their positions
  const bookIcons = [
    { Icon: BookOpen, position: { left: "15%", top: "70%" }, delay: 0 },
    { Icon: BookText, position: { left: "75%", top: "20%" }, delay: 1 },
    { Icon: BookMarked, position: { left: "25%", top: "40%" }, delay: 2 },
    { Icon: BookOpen, position: { left: "60%", top: "75%" }, delay: 3 },
    { Icon: BookText, position: { left: "10%", top: "15%" }, delay: 4 },
    { Icon: BookMarked, position: { left: "85%", top: "50%" }, delay: 5 },
    { Icon: BookOpen, position: { left: "40%", top: "10%" }, delay: 6 },
    { Icon: BookText, position: { left: "50%", top: "60%" }, delay: 7 },
  ];
  

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen w-full overflow-hidden ${inter.variable} ${dmSerif.variable} ${merriweather.variable} font-sans`}
    >
      {/* Left Section with animations */}
      <div className="relative w-full lg:w-1/2 bg-black overflow-hidden min-h-screen">
        {/* Animated grid background */}
        <div
          className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-50"
          style={{
            transform: `translate(${mousePosition.x / 100}px, ${mousePosition.y / 100}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-blue-500/20" />
          ))}
        </div>
        
          <h1 className="p-5  text-xl font-dm-serif font-bold text-yellow-200 animate-pulse ">ReadSphere.in</h1>

        {/* Floating blue square */}
        <motion.div
          className="absolute w-12 h-12 bg-blue-400 rounded-sm"
          style={{
            left: "20%",
            top: "20%",
            filter: "blur(1px)",
            boxShadow: "0 0 20px rgba(96, 165, 250, 0.7)",
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Animated book icons */}
        {bookIcons.map((book, index) => (
          <motion.div
            key={index}
            className="absolute text-blue-300/70"
            style={{
              ...book.position,
              filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))",
            }}
            custom={book.delay}
            variants={bookVariants}
            initial="hidden"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.2,
              rotate: [-5, 5, -5, 5, 0],
              transition: { duration: 0.5 },
            }}
          >
            <book.Icon className="w-8 h-8 md:w-10 md:h-10" />
          </motion.div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/50" />

        {/* Welcome text with glow effect */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1
              className="font-dm-serif text-5xl md:text-5xl font-bold text-white mb-4"
              style={{
                textShadow: "0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(96, 165, 250, 0.5)",
              }}
            >
              Welcome to <span className="text-yellow-300">ReadSphere</span>
            </h1>
            <motion.p
              className="text-white max-w-md mx-auto text-center opacity-80 text-lg md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your gateway to a world of knowledge and stories...
            </motion.p>

            {/* Book animation */}
            <motion.div
              className="mt-8 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <PageTurningAnimation />
            </motion.div>

            {/* Quote */}
            <motion.div
              className="relative mt-8 max-w-xs mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <Quote className="absolute -left-6 -top-4 text-blue-400/40 w-5 h-5" />
              <p className="font-merriweather text-yellow-300 text-lg italic">{randomQuote}</p>
              <Quote className="absolute -right-6 -bottom-4 text-blue-400/40 w-5 h-5 rotate-180" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Gradient divider - visible only on large screens */}
      <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-blue-400/50 to-transparent" />

      {/* Right Section with Clerk Auth */}
      <div className="w-full lg:w-1/2 min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Glassmorphism card */}
          <div className="flex justify-center items-center flex-col backdrop-blur-md bg-white rounded-2xl p-10 md:p-8 shadow-lg border border-white/50 ">
            {/* Background decoration */}
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2" />

            {/* Sparkles animation */}
            <motion.div
              className="absolute top-4 right-4 text-yellow-400"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>

            {/* Custom Clerk UI */}
            <SignUp
              appearance={{
                elements: {
                  rootBox: "font-inter",
                  card: "shadow-none p-10 border-0 bg-transparent",
                  headerTitle: "font-dm-serif text-2xl md:text-3xl text-slate-800",
                  headerSubtitle: "text-slate-600 text-sm md:text-base",
                  socialButtonsBlockButton:
                    "border border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md",
                  socialButtonsBlockButtonText: "font-medium",
                  dividerLine: "bg-slate-200",
                  dividerText: "text-slate-400",
                  formFieldLabel: "text-slate-700",
                  formFieldInput:
                    "rounded-lg border-slate-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition-all duration-200",
                  formButtonPrimary:
                    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 rounded-lg font-medium py-2.5 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
                  footerActionText: "text-slate-500",
                  footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                  identityPreviewText: "text-slate-600",
                  identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                },
              }}
            />

            {/* Additional footer text */}
            <motion.div
              className="mt-6 text-center text-xs text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Join thousands of readers exploring new worlds every day
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

