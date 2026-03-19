"use client"

import { useUser } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import Image from "next/image"
import BubbleBackground from "../../books/bubble-bg"

type Book = {
id:string
book_title:string
cover_image:string
slug:string
}

export default function MyBooksPage(){

const {user}=useUser()
const supabase=createClient()

const [shelves,setShelves]=useState({
want_to_read:[],
currently_reading:[],
read:[],
did_not_finish:[]
})

const [search,setSearch]=useState("")
const [sortType,setSortType]=useState("date_added")
const [results,setResults]=useState([])
const [activeShelf,setActiveShelf]=useState<string|null>(null)

useEffect(()=>{

loadShelves()

},[user])

const loadShelves = async () => {

  if (!user) return

  /* STEP 1: get user shelves */
  const { data: shelfData, error } = await supabase
    .from("user_books")
    .select("book_id, shelf, created_at, updated_at")
    .eq("user_id", user.id)

  if (error) {
    console.error(error)
    return
  }

  if (!shelfData || shelfData.length === 0) {
    setShelves({
      want_to_read: [],
      currently_reading: [],
      read: [],
      did_not_finish: []
    })
    return
  }

  /* STEP 2: collect book ids */
  const bookIds = shelfData.map((item) => item.book_id)

  /* STEP 3: fetch actual books */
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .in("id", bookIds)

  const grouped = {
    want_to_read: [],
    currently_reading: [],
    read: [],
    did_not_finish: []
  }

  /* STEP 4: group books by shelf */
  shelfData.forEach((entry) => {

    const book = books?.find((b) => b.id === entry.book_id)

    if (book && grouped[entry.shelf]) {
      grouped[entry.shelf].push(book)
    }

  })

  setShelves(grouped)
}
const searchBooks=async(q:string)=>{

setSearch(q)

if(q.length<2){
setResults([])
return
}

const {data}=await supabase
.from("books")
.select("*")
.ilike("book_title",`%${q}%`)
.limit(10)

setResults(data||[])

}

const addBook=async(bookId:string)=>{

if(!user || !activeShelf) return

await supabase
.from("user_books")
.upsert({
user_id:user.id,
book_id:bookId,
shelf:activeShelf
})

setResults([])
setSearch("")
loadShelves()

}

/* ⭐ ADD THIS FUNCTION RIGHT BELOW */

const moveBook = async (bookId: string, newShelf: string) => {

if (!user) return

await supabase
.from("user_books")
.update({
  shelf: newShelf,
  updated_at: new Date().toISOString()
})
.eq("user_id", user.id)
.eq("book_id", bookId)

/* ⭐ UPDATE DASHBOARD */

if(newShelf === "read"){

const storageKey = `readsphere-dashboard-${user.id}`

const saved = localStorage.getItem(storageKey)

if(saved){

const data = JSON.parse(saved)

data.booksRead = (data.booksRead || 0) + 1

localStorage.setItem(storageKey, JSON.stringify(data))

}

}

loadShelves()

}


const sortBooks = (books:any[]) => {

  if(sortType === "title"){
    return [...books].sort((a,b)=>
      a.book_title.localeCompare(b.book_title)
    )
  }

  if(sortType === "date_added"){
    return [...books].sort((a,b)=>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
    )
  }

  if(sortType === "last_updated"){
    return [...books].sort((a,b)=>
      new Date(b.updated_at || b.created_at).getTime() -
      new Date(a.updated_at || a.created_at).getTime()
    )
  }

  return books
}
/* 🔐 NOT LOGGED IN UI */

if (!user) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">

      <BubbleBackground />

      <h1 className="text-4xl font-bold mb-4">
        Your Personal Book Space 📚
      </h1>

      <p className="text-slate-400 max-w-xl mb-6">
        Track what you read, organize your shelves, and build your own reading journey.
        Save books you love, plan what to read next, and never lose your progress.
      </p>

      <p className="text-slate-500 mb-8">
        Login to create your personal library, manage your shelves,
        and unlock a smarter reading experience with ReadSphere.
      </p>

      <button
        onClick={() => window.location.href = "/sign-in"}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-lg"
      >
        Login to Continue
      </button>

    </div>
  )
}
return(

<div className="min-h-screen bg-slate-950 text-white p-10">

<BubbleBackground/>

<h1 className="text-4xl font-bold mb-10">
My Books
</h1>


<div className="flex items-center gap-4 mb-8 text-sm">

<span className="text-slate-400">
Sorted by
</span>

<select
value={sortType}
onChange={(e)=>setSortType(e.target.value)}
className="bg-slate-800 px-3 py-1 rounded"
>

<option value="date_added">
Date Added
</option>

<option value="last_updated">
Last Updated
</option>

<option value="title">
Title
</option>

</select>

</div>

<Shelf
title="Want to Read"
books={sortBooks(shelves.want_to_read)}
openSearch={()=>setActiveShelf("want_to_read")}
moveBook={moveBook}
/>

<Shelf
title="Currently Reading"
books={sortBooks(shelves.currently_reading)}
openSearch={()=>setActiveShelf("currently_reading")}
moveBook={moveBook}
/>

<Shelf
title="Done Reading"
books={sortBooks(shelves.read)}
openSearch={()=>setActiveShelf("read")}
moveBook={moveBook}
/>

<Shelf
title="Did not Finish"
books={sortBooks(shelves.did_not_finish)}
openSearch={()=>setActiveShelf("did_not_finish")}
moveBook={moveBook}
/>

{/* SEARCH MODAL */}

{activeShelf && (

<div className="fixed inset-0 bg-black/80 flex items-center justify-center">

<div className="bg-slate-900 p-6 rounded-xl w-[500px]">

<h2 className="text-xl mb-4">
Add book to {activeShelf.replace("_"," ")}
</h2>

<input
value={search}
onChange={(e)=>searchBooks(e.target.value)}
placeholder="Search books..."
className="w-full p-2 rounded bg-slate-800 mb-4"
/>

<div className="space-y-3 max-h-60 overflow-y-auto">

{results.map((book:any)=>(
<div
key={book.id}
className="flex items-center gap-3 cursor-pointer hover:bg-slate-800 p-2 rounded"
onClick={()=>addBook(book.id)}
>





<Image
src={book.cover_image || "/book-placeholder.jpg"}
alt={book.book_title}
width={40}
height={60}
/>

<span>{book.book_title}</span>

</div>
))}

</div>

<button
onClick={()=>setActiveShelf(null)}
className="mt-4 bg-red-500 px-4 py-2 rounded"
>
Close
</button>

</div>

</div>

)}

</div>

)

}

function Shelf({ title, books, openSearch, moveBook }: any) {
  

return(

<div className="mb-14">

{/* Header */}

<div className="flex justify-between items-center mb-4">

<h2 className="text-2xl font-semibold">
{title}
<span className="ml-2 text-sm text-slate-400">
({books.length})
</span>
</h2>

<button
onClick={openSearch}
className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
>
Add Book
</button>

</div>

{/* LIST STYLE */}

<div className="space-y-6">

{books.map((book:any)=>(

<div
key={book.id}
className="flex gap-4 border-b border-slate-800 pb-4"
>

<Image
src={book.cover_image || "/book-placeholder.jpg"}
alt={book.book_title}
width={80}
height={120}
className="rounded"
 />

<div className="flex-1">

<h3 className="text-lg font-semibold">
{book.book_title}
</h3>

<p className="text-sm text-slate-400">
by {book.author || "Unknown"}
</p>

<div className="flex gap-2 mt-3 text-xs flex-wrap">

<button
onClick={()=>moveBook(book.id,"want_to_read")}
className="bg-purple-600 px-2 py-1 rounded"
>
Want to Read
</button>

<button
onClick={()=>moveBook(book.id,"currently_reading")}
className="bg-blue-600 px-2 py-1 rounded"
>
Reading
</button>

<button
onClick={()=>moveBook(book.id,"read")}
className="bg-green-600 px-2 py-1 rounded"
>
Read
</button>

<button
onClick={()=>moveBook(book.id,"did_not_finish")}
className="bg-red-600 px-2 py-1 rounded"
>
DNF
</button>

</div>

</div>

</div>

))}

</div>

</div>

)

}