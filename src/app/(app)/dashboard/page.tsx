// src/app/(app)/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Target, Heart, Clock } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

/* 🔹 CLIENT-ONLY BUBBLE BACKGROUND */
import BubbleBackground from "../../books/bubble-bg"

/* Animations */
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

interface ReadingDay {
  date: string
  minutes: number
}

interface DashboardData {
  booksRead: number
  goal: number
  favoriteGenres: string[]
  dailyReading: ReadingDay[]
}
interface ReadingSession {
  start_time: string
  reading_date: string
  duration_minutes: number
  pages_read: number
  book_title: string
}
const GENRE_OPTIONS = [
  "Fiction",
  "Non-Fiction",
  "Self Help",
  "Fantasy",
  "Romance",
  "Mystery",
  "Thriller",
  "Biography",
  "Science",
  "Psychology",
  "Business",
  "Technology",
]

export default function Dashboard() {

  const { user, isLoaded } = useUser()
  const supabase = createClient()

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [goalInput, setGoalInput] = useState("")

  const [sessions, setSessions] = useState<ReadingSession[]>([])
  console.log("Sessions:", sessions)
  const [streak, setStreak] = useState(0)

  const storageKey = user ? `readsphere-dashboard-${user.id}` : null

  // 📥 Load user-specific data (WITH MIGRATION FIX)
  useEffect(() => {
    if (!isLoaded || !user || !storageKey) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      const parsed = JSON.parse(saved)

      // 🔥 MIGRATE OLD DATA FORMAT SAFELY
      const migrated: DashboardData = {
        booksRead: parsed.booksRead ?? 0,
        goal: parsed.goal ?? 0,
        favoriteGenres: parsed.favoriteGenres ?? [],
        dailyReading: parsed.dailyReading ?? [],
      }

      setData(migrated)
      setLoading(false)
    } else {
      const initialData: DashboardData = {
        booksRead: 0,
        goal: 0,
        favoriteGenres: [],
        dailyReading: [],
      }
      setData(initialData)
      localStorage.setItem(storageKey, JSON.stringify(initialData))
      setLoading(false)
    }
  }, [isLoaded, user, storageKey])

  // 💾 Persist
  useEffect(() => {
    if (data && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(data))
    }
  }, [data, storageKey])

  // 📅 Format date
  const todayLabel = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })

  // 🔥 AUTO READING TIME LISTENER
  useEffect(() => {
    const handler = (e: any) => {
      setData((prev) => {
        if (!prev) return prev

        const minutes = Math.max(0, Number(e.detail?.minutes || 0))
        if (!minutes) return prev

        const existingIndex = prev.dailyReading.findIndex(
          (d) => d.date === todayLabel
        )

        const updatedDaily = [...prev.dailyReading]

        if (existingIndex >= 0) {
          updatedDaily[existingIndex].minutes += minutes
        } else {
          updatedDaily.push({ date: todayLabel, minutes })
        }

        return {
          ...prev,
          dailyReading: updatedDaily,
        }
      })
    }

    window.addEventListener("reading-time", handler)
    return () => window.removeEventListener("reading-time", handler)
  }, [todayLabel])

  // 🎯 Set goal (0+ only)
  const setGoal = () => {
    if (!data) return
    const goal = Math.max(0, parseInt(goalInput || "0"))
    setData({ ...data, goal })
    setGoalInput("")
  }

  // ❤️ Toggle genre (FUNCTIONAL UPDATE FIX)
  const toggleGenre = (genre: string) => {
    setData((prev) => {
      if (!prev) return prev

      const exists = prev.favoriteGenres.includes(genre)
      const updated = exists
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre]

      return {
        ...prev,
        favoriteGenres: updated,
      }
    })
  }
  
  // 📊 FETCH READING SESSIONS
useEffect(() => {
  const fetchSessions = async () => {

    if (!user) return

    const { data, error } = await supabase
      .from("reading_sessions")
.select("start_time, reading_date, duration_minutes, book_title")
.eq("user_id", user.id)
.order("start_time", { ascending: true })

    if (error) {
      console.log("DB error:", error)
      return
    }

    console.log("Sessions from DB:", data)

    setSessions(data || [])
  }

  fetchSessions()
}, [user])

// 🔥 CALCULATE STREAK
useEffect(() => {
  if (!sessions.length) return

  const uniqueDates = [
    ...new Set(sessions.map((s) => s.reading_date)),
  ].sort()

  let streakCount = 0
  let current = new Date()

  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const sessionDate = new Date(uniqueDates[i])

    const diff =
      (current.getTime() - sessionDate.getTime()) /
      (1000 * 60 * 60 * 24)

    if (diff <= 1) {
      streakCount++
      current = sessionDate
    } else {
      break
    }
  }

  setStreak(streakCount)
}, [sessions])

// 🔥 CALCULATE STREAK
useEffect(() => {
  if (!sessions.length) return

  const uniqueDates = [
    ...new Set(sessions.map((s) => s.reading_date)),
  ].sort()

  let streakCount = 0
  let current = new Date()

  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const sessionDate = new Date(uniqueDates[i])

    const diff =
      (current.getTime() - sessionDate.getTime()) /
      (1000 * 60 * 60 * 24)

    if (diff <= 1) {
      streakCount++
      current = sessionDate
    } else {
      break
    }
  }

  setStreak(streakCount)
}, [sessions])


// 📊 CHART DATA
const grouped: Record<string, {
  date: string
  minutes: number
  books: string[]
}> = {}

sessions.forEach((s) => {

  const date = new Date(s.start_time).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
  })

  if (!grouped[date]) {
    grouped[date] = {
      date,
      minutes: 0,
      books: []
    }
  }

  grouped[date].minutes += s.duration_minutes

  // ✅ get book title safely
  const bookTitle = s.book_title || s.books?.book_title

  if (bookTitle && !grouped[date].books.includes(bookTitle)) {
    grouped[date].books.push(bookTitle)
  }

})

const chartData = Object.values(grouped)


const sessionMap: Record<string, number> = {}

sessions.forEach((s) => {

  const key = new Date(s.start_time)
    .toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    })

  sessionMap[key] =
    (sessionMap[key] || 0) + s.duration_minutes

})


function getHeatColor(date: string) {

  const minutes = sessionMap[date] || 0

  // no reading
  if (minutes === 0)
    return "bg-slate-700 border border-slate-600"

  // light reading
  if (minutes < 10)
    return "bg-purple-900"

  // medium
  if (minutes < 30)
    return "bg-purple-700"

  // strong
  if (minutes < 60)
    return "bg-purple-500"

  // intense
  return "bg-purple-400"
}




const days: string[] = []

const start = new Date("2026-01-01")
const end = new Date("2026-12-31")

for (
  let d = new Date(start);
  d <= end;
  d.setDate(d.getDate() + 1)
) {

  days.push(
    d.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    })
  )

}

const months: string[] = []

if (user?.createdAt) {

  const start = new Date(user.createdAt)

  for (let i = 0; i < 12; i++) {

    const d = new Date(start)
    d.setMonth(start.getMonth() + i)

    months.push(
      d.toLocaleString("default", { month: "short" })
    )

  }

}

const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

// 🔥 HEATMAP COLOR FUNCTION
const getActivityLevel = (date: string) => {
  const daySessions = sessions.filter(
    (s) => s.reading_date === date
  )

  const totalMinutes = daySessions.reduce(
    (sum, s) => sum + (s.duration_minutes || 0),
    0
  )

  if (totalMinutes === 0) return "bg-slate-800"
  if (totalMinutes < 10) return "bg-purple-300"
  if (totalMinutes < 30) return "bg-purple-500"
  return "bg-purple-700"
}


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

        {/* Controls */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Goal */}
          <motion.div variants={cardVariants}>
            <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  Set Reading Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Books this year"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="flex-1 bg-slate-800 text-white px-3 py-2 rounded"
                />
                <button
                  onClick={setGoal}
                  className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600"
                >
                  Save
                </button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Genres */}
          <motion.div variants={cardVariants}>
            <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-400" />
                  Favorite Genres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => {
                    const active =
                      data?.favoriteGenres?.includes(genre) || false

                    return (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1 rounded-full text-sm border transition
                          ${
                            active
                              ? "bg-purple-500 border-purple-500 text-white"
                              : "border-slate-600 text-slate-300 hover:bg-slate-800"
                          }`}
                      >
                        {genre}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {/* Books Read */}
          <motion.div variants={cardVariants}>
            <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg shadow-purple-500/20 hover:-translate-y-2 transition">
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
                <p className="text-4xl font-bold text-white">
                  {loading ? "..." : data?.booksRead ?? 0}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Goal */}
          <motion.div variants={cardVariants}>
            <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg shadow-purple-500/20 hover:-translate-y-2 transition">
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
                <p className="text-4xl font-bold text-white">
                  {loading
                    ? "..."
                    : `${data?.booksRead ?? 0} / ${data?.goal ?? 0}`}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Genres */}
          <motion.div variants={cardVariants}>
            <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg shadow-purple-500/20 hover:-translate-y-2 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <Heart className="h-6 w-6 text-purple-400" />
                <div>
                  <CardTitle className="text-white">Favorite Genres</CardTitle>
                  <CardDescription className="text-slate-400">
                    Based on your choice
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-white">
                  {loading
                    ? "..."
                    : data?.favoriteGenres?.length
                    ? data.favoriteGenres.join(", ")
                    : "None"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Graph */}
        <motion.div variants={cardVariants}>
          <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg shadow-purple-500/20">
            <CardHeader className="flex flex-row items-center gap-3">
              <Clock className="h-6 w-6 text-purple-400" />
              <div>
                <CardTitle className="text-white">
                  Daily Reading Time
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Auto-tracked from your reader (date + minutes)
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="h-64">
              {loading ? (
                <p className="text-slate-400">Loading chart...</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
  <LineChart data={chartData}>

    <XAxis dataKey="date" />
    <YAxis />

    <Tooltip
      content={({ payload }) => {
        
        if (!payload || !payload.length) return null

        const d = payload[0].payload
        

        return (
          <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow">
            <p className="text-white font-semibold">
              📚 {d.books?.join(", ")}
            </p>
            <p className="text-purple-400">
              ⏱ {d.minutes} minutes
            </p>
            <p className="text-slate-400 text-sm">
              📅 {d.date}
            </p>
          </div>
        )
      }}
    />

    <Line
      type="monotone"
      dataKey="minutes"
      stroke="#a855f7"
      strokeWidth={3}
      dot={{ r: 6 }}
      activeDot={{ r: 8 }}
    />

  </LineChart>
</ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 🔥 ACTIVITY SECTION */}
<motion.div
  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
  variants={containerVariants}
>

  {/* 🔥 STREAK CARD */}
  <motion.div variants={cardVariants}>
    <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg shadow-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🔥 Reading Streak
        </CardTitle>

        <CardDescription className="text-slate-400">
          Consecutive days you read
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-5xl font-bold text-purple-400">
          {streak}
        </p>

        <p className="text-slate-400 mt-2">
          days in a row
        </p>
      </CardContent>
    </Card>
  </motion.div>


  {/* 📊 HEATMAP */}
  <motion.div
    className="lg:col-span-2"
    variants={cardVariants}
  >
    <Card className="bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg shadow-purple-500/20">

      <CardHeader>
        <CardTitle className="text-white">
          Reading Activity
        </CardTitle>

        <CardDescription className="text-slate-400">
          Your reading activity since you joined
        </CardDescription>
      </CardHeader>

      <CardContent>

        <div className="flex">

  {/* Weekday labels */}
  <div className="flex flex-col text-xs text-slate-400 mr-3 justify-between">

{weekdays.map((d)=>(
<span key={d}>{d}</span>
))}

</div>
  

  <div>

    {/* Month labels */}
    <div className="grid grid-cols-12 text-xs text-slate-400 mb-2">

{[
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
].map((m)=>(
<span key={m}>{m}</span>
))}

</div>

    {/* Heatmap grid */}
    <div className="grid grid-flow-col grid-rows-7 gap-[3px]">

      {days.map((date) => (

  <div
    key={date}
    title={`${date} • ${sessionMap[date] || 0} min`}
    className={`w-[11px] h-[11px] rounded-[2px] ${getHeatColor(date)} transition`}
  />

))}

    </div>

  </div>

</div>

      </CardContent>

    </Card>
  </motion.div>

</motion.div>
      </motion.div>
    </main>
  )
}
