//src/app/(app)/admin/page.tsx
"use client"

import type React from "react"
import Link from "next/link"
import { useState , useEffect} from "react"
import { Plus, Search, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter ,CardHeader , CardTitle , CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Image from "next/image";
import { toast , ToastContainer } from "react-toastify"


type Book = {
  BOOK_ID: number
  BOOK_TITLE: string
  BOOK_AUTHOR: string
  GENRE: string
  LANGUAGE: string
  A_RATINGS: number
  RATERS: number
  F_PAGE: string
  LINK: string
}

export default function AdminPanel() {
  const [books, setBooks] = useState<Book[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddBookOpen, setIsAddBookOpen] = useState(false)
  const [newBook, setNewBook] = useState<Partial<Book>>({
    BOOK_ID: books.length > 0 ? Math.max(...books.map((book) => book.BOOK_ID)) + 1 : 1,
    BOOK_TITLE: "",
    BOOK_AUTHOR: "",
    GENRE: "",
    LANGUAGE: "",
    A_RATINGS: 0,
    RATERS: 0,
    F_PAGE: "",
    LINK: "",
  })

  useEffect(() => {
      const fetchAllBooks = async () => {
        try {
          const response = await fetch("https://readsphere-ml-service.onrender.com/recommend/all_books");
          const data = await response.json();
          console.log(data)
          setBooks(data.all_books); // Update state with fetched books
          
        } catch (err) {
          console.error("Error fetching books:", err);
          
        }
      };
  
      fetchAllBooks();
    }, []);

  const booksPerPage = 6

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.BOOK_TITLE.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.BOOK_AUTHOR.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.GENRE.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)

  const handleAddBook =async () => {
    if (!newBook.BOOK_TITLE || !newBook.BOOK_AUTHOR) {
        toast.error("please fill all necessary details")
    }

    const bookToAdd = {
      BOOK_ID: newBook.BOOK_ID || 1,
      BOOK_TITLE: newBook.BOOK_TITLE,
      BOOK_AUTHOR: newBook.BOOK_AUTHOR,
      GENRE: newBook.GENRE || "Unknown",
      LANGUAGE: newBook.LANGUAGE || "English",
      A_RATINGS: newBook.A_RATINGS || 0,
      RATERS: newBook.RATERS || 0,
      F_PAGE: newBook.F_PAGE || "",
      LINK: newBook.LINK || "",
    }

    // api request

    try {
      const response = await fetch("https://ReadSphere-ml-service.onrender.com/admin/add_book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookToAdd),
      });
      toast.success("Book added successfully")
      if (!response.ok) throw new Error("Failed to new add book");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding book:", error)
      toast.error("Error adding book")
    }
      
    



    setBooks([...books, bookToAdd as Book])
    setIsAddBookOpen(false)
    setNewBook({
      BOOK_ID: books.length > 0 ? Math.max(...books.map((book) => book.BOOK_ID)) + 1 : 1,
      BOOK_TITLE: "",
      BOOK_AUTHOR: "",
      GENRE: "",
      LANGUAGE: "",
      A_RATINGS: 0,
      RATERS: 0,
      F_PAGE: "",
      LINK: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewBook({
      ...newBook,
      [name]: name === "BOOK_ID" || name === "A_RATINGS" || name === "RATERS" ? Number.parseInt(value) : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewBook({
      ...newBook,
      [name]: value,
    })
  }

  
  

  return (
      <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
        <ToastContainer />
        <div className="w-full max-w-7xl mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage your book recommendation system</p>
          </header>
    
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search books..."
                className="pl-10 bg-slate-900 border-slate-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
    
            <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus size={18} className="mr-2" /> Add Book
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Add New Book</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Fill in the details to add a new book to your collection.
                  </DialogDescription>
                </DialogHeader>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="BOOK_ID">Book ID</Label>
                    <Input
                      id="BOOK_ID"
                      name="BOOK_ID"
                      type="number"
                      className="bg-slate-800 border-slate-700"
                      value={newBook.BOOK_ID}
                      onChange={handleInputChange}
                    />
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="BOOK_TITLE">Book Title</Label>
                    <Input
                      id="BOOK_TITLE"
                      name="BOOK_TITLE"
                      type="text"
                      className="bg-slate-800 border-slate-700"
                      value={newBook.BOOK_TITLE}
                      onChange={handleInputChange}
                    />
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="BOOK_AUTHOR">Book Author</Label>
                    <Input
                      id="BOOK_AUTHOR"
                      name="BOOK_AUTHOR"
                      className="bg-slate-800 border-slate-700"
                      value={newBook.BOOK_AUTHOR}
                      onChange={handleInputChange}
                    />
                  </div>
                  
    
                  <div className="space-y-2">
                    <Label htmlFor="GENRE">GENRE</Label>
                    <Select onValueChange={(value) => handleSelectChange("GENRE", value)} value={newBook.GENRE}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select GENRE" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Non-Fiction">AutoBioGraphy</SelectItem>
                        <SelectItem value="Science Fiction">BioGraphy</SelectItem>
                        <SelectItem value="Fantasy">Poetry</SelectItem>
                        <SelectItem value="Mystery">Comedy</SelectItem>
                        <SelectItem value="Romance">Personal_Growth</SelectItem>
                        <SelectItem value="Thriller">Relationship</SelectItem>
                        <SelectItem value="Biography">Religion</SelectItem>
                        <SelectItem value="Biography">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="LANGUAGE">Language</Label>
                    <Select onValueChange={(value) => handleSelectChange("LANGUAGE", value)} value={newBook.LANGUAGE}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="A_RATINGS">Average Rating</Label>
                    <Input
                      id="A_RATINGS"
                      name="A_RATINGS"
                      type="number"
                      min="0"
                      step="any"
                      className="bg-slate-800 border-slate-700"
                      value={newBook.A_RATINGS}
                      onChange={handleInputChange}
                    />
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="RATERS">Number of Raters</Label>
                    <Input
                      id="RATERS"
                      name="RATERS"
                      type="number"
                      min="0"
                      className="bg-slate-800 border-slate-700"
                      value={newBook.RATERS}
                      onChange={handleInputChange}
                    />
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="F_PAGE">Front Page URL</Label>
                    <Input
                      id="F_PAGE"
                      name="F_PAGE"
                      type="text"
                      className="bg-slate-800 border-slate-700"
                      value={newBook.F_PAGE}
                      onChange={handleInputChange}
                    />
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="LINK">Book Link</Label>
                    <Input
                      id="LINK"
                      name="LINK"
                      type="text"
                      className="bg-slate-800 border-slate-700"
                      value={newBook.LINK}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
    
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddBookOpen(false)}
                    className="border-slate-700 text-white hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddBook} className="bg-emerald-600 hover:bg-emerald-700">
                    Add Book
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
    
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Book Collection</h2>
    
            {filteredBooks.length === 0 ? (
              <div className="bg-slate-900 rounded-lg p-8 text-center">
                <p className="text-slate-400">No books found. Add some books to your collection.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {currentBooks.map((book) => (
                    <Card key={book.BOOK_TITLE}>
                      <CardHeader>
                        <Image
                          src={book.F_PAGE || "/placeholder.svg"}
                          alt={book.BOOK_TITLE}
                          width={200}
                          height={300}
                          className="w-full h-60 object-cover rounded-md"
                          priority={true}
                          loading="eager"
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-start gap-2">
                        <CardTitle>{book.BOOK_TITLE}</CardTitle>
                        <CardDescription>{book.BOOK_AUTHOR}</CardDescription>
                        <CardDescription>{book.GENRE}</CardDescription>
                        <CardDescription className="flex items-center gap-1">
                          Rating: {book.A_RATINGS}
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        </CardDescription>
                      </CardContent>
                      <CardFooter>
                        <Button asChild>
                          <Link href={book.LINK}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
    
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-slate-700 text-white hover:bg-slate-800"
                      >
                        <ChevronLeft size={18} />
                      </Button>
    
                      <div className="flex items-center gap-1 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "border-slate-700 text-white hover:bg-slate-800"
                            }
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
    
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border-slate-700 text-white hover:bg-slate-800"
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    
    

    )
}



