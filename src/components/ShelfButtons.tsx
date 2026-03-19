"use client"

import { useUser } from "@clerk/nextjs"
import { createClient } from "@/utils/supabase/client"

export default function ShelfButtons({ bookId }: { bookId: string }) {

const { user } = useUser()
const supabase = createClient()

const updateDashboard = () => {

const storageKey = `readsphere-dashboard-${user?.id}`

const saved = localStorage.getItem(storageKey)

if(!saved) return

const data = JSON.parse(saved)

data.booksRead = (data.booksRead || 0) + 1

localStorage.setItem(storageKey, JSON.stringify(data))
}

const addToShelf = async (shelf:string) => {

if(!user) return

await supabase
.from("user_books")
.upsert({
user_id:user.id,
book_id:bookId,
shelf:shelf
})

if(shelf === "read"){
updateDashboard()
}

alert(`Book added to ${shelf.replace("_"," ")}`)
}

return(

<div className="flex gap-3 mt-6 flex-wrap">

<button
onClick={()=>addToShelf("want_to_read")}
className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white text-sm"
>
Want to Read
</button>

<button
onClick={()=>addToShelf("currently_reading")}
className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
>
Currently Reading
</button>

<button
onClick={()=>addToShelf("read")}
className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm"
>
Read
</button>

<button
onClick={()=>addToShelf("did_not_finish")}
className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
>
Did Not Finish
</button>

</div>

)

}