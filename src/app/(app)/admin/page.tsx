"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
} from "lucide-react"
import Image from "next/image"

import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type Book = {
  id: string
  book_title: string
  author: string
  genre: string
  rating: number
  description: string
  f_page: string
  slug: string
  pdf_filename: string
  cover_image: string
}

export default function AdminPanel() {
  const supabase = createClient()

  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddBookOpen, setIsAddBookOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const [newBook, setNewBook] = useState<Partial<Book>>({
    book_title: "",
    author: "",
    genre: "",
    rating: 0,
    description: "",
    f_page: "",
    slug: "",
    pdf_filename: "",
    cover_image: "",
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  /* ---------------- FETCH BOOKS ---------------- */
  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*")
      if (!error) {
        const sortedBooks = (data ?? []).sort(
          (a, b) => (b.cover_image ? 1 : 0) - (a.cover_image ? 1 : 0)
        )
        setBooks(sortedBooks)
      }
    }
    fetchBooks()
  }, [])

  /* ---------------- SEARCH + PAGINATION ---------------- */
  const booksPerPage = 6

  const filteredBooks = books.filter(
    (b) =>
      b.book_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  )

  /* ---------------- FILE UPLOAD (SINGLE BUCKET) ---------------- */
  const uploadFile = async (file: File, path: string) => {
    const filePath = `${path}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("book-files").upload(filePath, file)
    if (error) throw error
    return supabase.storage.from("book-files").getPublicUrl(filePath).data.publicUrl
  }

  /* ---------------- ADD / UPDATE BOOK ---------------- */
  const saveBook = async () => {
    try {
      let coverUrl = newBook.cover_image || ""
      let pdfUrl = newBook.pdf_filename || ""

      if (coverFile) coverUrl = await uploadFile(coverFile, "covers")
      if (pdfFile) pdfUrl = await uploadFile(pdfFile, "")

      const payload: Book = {
        ...newBook,
        cover_image: coverUrl,
        pdf_filename: pdfUrl,
        book_title: newBook.book_title || "",
        author: newBook.author || "",
        genre: newBook.genre || "",
        rating: newBook.rating || 0,
        description: newBook.description || "",
        f_page: newBook.f_page || "",
        slug: newBook.slug || "",
      } as Book

      if (editingBook) {
        await supabase.from("books").update(payload).eq("id", editingBook.id)
        toast.success("✅ Book updated")
      } else {
        await supabase.from("books").insert([payload])
        toast.success("✅ Book added")
      }

      setIsAddBookOpen(false)
      setEditingBook(null)
      setCoverFile(null)
      setPdfFile(null)
      setNewBook({
        book_title: "",
        author: "",
        genre: "",
        rating: 0,
        description: "",
        f_page: "",
        slug: "",
        pdf_filename: "",
        cover_image: "",
      })

      // Fetch & sort again
      const { data } = await supabase.from("books").select("*")
      const sortedBooks = (data ?? []).sort(
        (a, b) => (b.cover_image ? 1 : 0) - (a.cover_image ? 1 : 0)
      )
      setBooks(sortedBooks)
    } catch {
      toast.error("❌ Upload failed")
    }
  }

  /* ---------------- DELETE BOOK ---------------- */
  const deleteBook = async (id: string) => {
    await supabase.from("books").delete().eq("id", id)
    setBooks((prev) => prev.filter((b) => b.id !== id))
    toast.success("🗑️ Book deleted")
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ToastContainer />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex justify-between mb-6 gap-4">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 text-white"
          />

          <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBook(null)}>
                <Plus className="mr-2" /> Add Book
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white text-slate-900">
              <DialogHeader>
                <DialogTitle>
                  {editingBook ? "Edit Book" : "Add Book"}
                </DialogTitle>
              </DialogHeader>

              {/* ---------- FORM FIELDS ---------- */}
              <Input
                placeholder="Title"
                value={newBook.book_title || ""}
                onChange={(e) => setNewBook({ ...newBook, book_title: e.target.value })}
              />
              <Input
                placeholder="Author"
                value={newBook.author || ""}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
              <Input
                placeholder="Genre"
                value={newBook.genre || ""}
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Rating"
                value={newBook.rating || ""}
                onChange={(e) => setNewBook({ ...newBook, rating: Number(e.target.value) })}
              />
              <Input
                placeholder="Description"
                value={newBook.description || ""}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              />
              <Input
                placeholder="F Page"
                value={newBook.f_page || ""}
                onChange={(e) => setNewBook({ ...newBook, f_page: e.target.value })}
              />
              <Input
                placeholder="Slug"
                value={newBook.slug || ""}
                onChange={(e) => setNewBook({ ...newBook, slug: e.target.value })}
              />
              <Input
                placeholder="PDF Filename"
                value={newBook.pdf_filename || ""}
                onChange={(e) => setNewBook({ ...newBook, pdf_filename: e.target.value })}
              />
              <Input
                placeholder="Cover Image URL"
                value={newBook.cover_image || ""}
                onChange={(e) => setNewBook({ ...newBook, cover_image: e.target.value })}
              />

              
              <Button onClick={saveBook} className="mt-2">
                Save Book
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* ---------- TABLE ---------- */}
        <table className="w-full border text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-2">Cover</th>
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-2">
                  <Image
                    src={b.cover_image || "/placeholder.svg"}
                    width={60}
                    height={90}
                    alt=""
                  />
                </td>
                <td className="p-2">{b.book_title}</td>
                <td className="p-2">{b.author}</td>
                <td className="p-2 flex gap-2">
                  <Button
                    size="icon"
                    onClick={() => {
                      setEditingBook(b)
                      setNewBook(b)
                      setIsAddBookOpen(true)
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteBook(b.id)}
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------- PAGINATION ---------- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
              <ChevronLeft />
            </Button>
            <span>{currentPage} / {totalPages}</span>
            <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
