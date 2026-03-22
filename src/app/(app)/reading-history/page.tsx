"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { BookOpen, Clock } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import BubbleBackground from "../../books/bubble-bg"

export default function ReadingHistory() {

  const { user } = useUser()
  const supabase = createClient()

  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchLogs = async () => {

      if (!user) return

      const { data } = await supabase
        .from("reading_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false })

      const grouped: any = {}

      data?.forEach((s) => {

        const date = new Date(s.start_time).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })

        if (!grouped[date]) {
          grouped[date] = []
        }

        grouped[date].push(s)
      })

      setLogs(Object.entries(grouped))
      setLoading(false)

    }

    fetchLogs()

  }, [user])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 md:px-8">
      
      <BubbleBackground />

      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <BookOpen className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Reading History
            </h1>
          </div>

          <p className="text-slate-400">
            Track everything you've read — sessions, time & habits 📚
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-slate-400">
            Loading your reading activity...
          </p>
        )}

        {/* Logs */}
        <div className="space-y-8">

          {logs.map(([date, sessions]: any) => (

            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg shadow-purple-500/20">

                {/* Date Header */}
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    📅 {date}
                  </CardTitle>

                  <CardDescription className="text-slate-400">
                    {sessions.length} reading sessions
                  </CardDescription>
                </CardHeader>

                {/* Sessions */}
                <CardContent className="space-y-4">

                  {sessions.map((s: any, i: number) => {

                    const start = new Date(s.start_time)
                    const end = new Date(
                      start.getTime() + s.duration_minutes * 60000
                    )

                    return (
                      <div
                        key={i}
                        className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg hover:bg-slate-800 transition"
                      >

                        <div className="flex justify-between items-center">

                          {/* Book */}
                          <p className="text-white font-medium">
                            📚 {s.book_title}
                          </p>

                          {/* Duration */}
                          <p className="text-purple-400 font-semibold flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {s.duration_minutes} min
                          </p>

                        </div>

                        {/* Time */}
                        <p className="text-sm text-slate-400 mt-2">
                          🕒 {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
                          {" → "}
                          {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>

                      </div>
                    )
                  })}

                </CardContent>

              </Card>

            </motion.div>

          ))}

        </div>

      </div>

    </main>
  )
}