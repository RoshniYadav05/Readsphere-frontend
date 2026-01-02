"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Coffee, Heart, Lightbulb, Star, Zap  } from "lucide-react"
import Image from "next/image"
import { WarpBackground } from "@/components/magicui/warp-background"
// CHANGE 1: Import useEffect
import React, { useState, useEffect } from "react"
import {toast , ToastContainer} from "react-toastify"
import ReviewMarquee from "@/components/marquee"
import FeedbackDialog from "@/components/FeedbackDialog"

type Review = {
  name: string;
  username: string;
  body: string;
  img: string;
  rating: string;
};



export default function Home() {
  // CHANGE 2: Add state to check if we are on the client
  const [isClient, setIsClient] = useState(false);

  // CHANGE 3: Set the state to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const BooksFrontpage = [
    {id:1,title:"Maharaj BioGrahy",img:"maharaj.jpg"},
    {id:2,title:"Rich Dad Poor Dad",img:"rich_dad_poor_dad.png"},
    {id:3,title:"One Indian Girl",img:"one_indian_girl.png"},
    {id:4,title:"Praying to get Results",img:"praying.png"},
    {id:5,title:"100 Ways to Motivate yourself",img:"motivate.png"},
    {id:6,title:"Waiting And Daiting",img:"waiting.png"},
  ]

  const [reviews, setReviews] = useState([
    {
      name: "Rohit S.",
      username: "@rohit",
      body: "ReadSphere is a game-changer! The recommendations are spot-on, making book discovery effortless. Highly recommended!",
      img: "/roh.jpg",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
        name: "Chinmai P.",
        username: "@chinmai",
        body: "I was stuck in a reading slump, but ReadSphere brought back my love for books. Every recommendation is a gem!",
        img: "/chi.jpg",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Jenny",
      username: "@jenny",
      body: "Amazing experience! ReadSphere makes discovering books effortless and fun.",
      img: "/p2.jpg",
      rating: "⭐⭐⭐⭐"
    },
    {
        name: "Pratish B.",
        username: "@pratish",
        body: "The community aspect makes ReadSphere amazing! Real people, real recommendations—feels like a book club!",
        img: "/pra.jpg",
        rating: "⭐⭐⭐"
    },
    {
      name: "Ananya M.",
      username: "@ananya_reads",
      body: "Absolutely love ReadSphere! It’s like it knows exactly what I want to read next. Found so many hidden gems!",
      img: "/p3.jpg",
      rating: "⭐⭐⭐⭐"
    },
    {
      name: "jacqline D.",
      username: "@karand_books",
      body: "The personalized recommendations are seriously impressive. ReadSphere makes book hunting fun again!",
      img: "/p4.jpg",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      name: "Meera T.",
      username: "@meera_tales",
      body: "ReadSphere has transformed how I find books. It’s intuitive, fast, and super accurate. A must for every book lover!",
      img: "/p1.png",
      rating: "⭐⭐⭐⭐⭐"
    },

  ]);

  const addReview = (newReview: Review) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  const newsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Subscribed successfully!")
  }

  return (
    <div className="min-h-screen bg-[#050A1A] text-white overflow-hidden">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
      
      <WarpBackground
        className="h-screen"
        beamsPerSide={5}
        beamSize={5}
        beamDelayMax={3}
        beamDelayMin={0}
        beamDuration={3}
        perspective={100}>
      
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"  
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(5, 10, 26, 0.8), rgba(5, 10, 26, 0.95)), url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='50' height='50' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 50 0 L 0 0 0 50' fill='none' stroke='%23113' strokeWidth='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
              backgroundSize: "cover",
            }}
          />
        </div>

        <motion.div
          className="absolute top-1/4 left-0 w-full h-[300px] rotate-12 bg-gradient-to-r from-purple-600/20 via-purple-500/10 to-transparent"
          animate={{
            x: ["-10%", "10%", "-10%"],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-0 w-full h-[200px] -rotate-12 bg-gradient-to-l from-teal-500/20 via-teal-400/10 to-transparent"
          animate={{
            x: ["10%", "-10%", "10%"],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-2/3 left-0 w-full h-[150px] rotate-[5deg] bg-gradient-to-r from-green-500/20 via-green-400/10 to-transparent"
          animate={{
            x: ["-5%", "5%", "-5%"],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-[250px] -rotate-[8deg] bg-gradient-to-l from-orange-500/20 via-orange-400/10 to-transparent"
          animate={{
            x: ["5%", "-5%", "5%"],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />
 
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl pr-5 text-center  ">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 ">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 ">
                  ReadSphere
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10">
                Discover your next favorite book with personalized recommendations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-white text-[#050A1A] hover:bg-white/10 px-8 py-6 text-lg">
                  <Link href="/requirements">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black hover:bg-white/10 px-8 py-6 text-lg"
                >
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      </WarpBackground>
      
      <section className="py-16 bg-[#080D20] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trending This Week</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore the books that are captivating our community right now
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {BooksFrontpage.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={`/${book.img}`}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-3">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <p className="text-sm font-medium">{book.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/books">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-400 hover:text-slate-900 hover:border-slate-950">
                View All Trending Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#050A1A] opacity-90 z-0"></div>
        
        {/* CHANGE 4: Conditionally render this block only on the client */}
        {isClient && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/30 blur-sm z-0"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ReadSphere Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform analyzes thousands of books to find your perfect match
            </p>
          </div>
          {/* ... Rest of your component ... */}
        </div>
      </section>
      {/* ... The rest of your sections ... */}
    </div>
  )
}