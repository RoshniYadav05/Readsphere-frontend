"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type Book = {
  id: string;
  slug: string;
  book_title: string;
  author?: string;
  cover_image?: string;
};

function highlight(text: string, query: string) {
  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchBar() {

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [results, setResults] = useState<Book[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ---------------- LOAD BOOKS ONCE (LIKE ADMIN) ---------------- */
  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch("/api/books"); 
      const data = await res.json();

      setBooks(data || []);
    };

    fetchBooks();
  }, []);

  /* ---------------- LOCAL SEARCH (FAST) ---------------- */
  useEffect(() => {

    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = books.filter(
      (b) =>
        b.book_title.toLowerCase().includes(query.toLowerCase()) ||
        (b.author || "").toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 8));
    setSelectedIndex(-1);

  }, [query, books]);

  /* ---------------- KEYBOARD NAVIGATION ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

  if (!results.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();

    setSelectedIndex((prev) => {
      const next = prev === -1 ? 0 : Math.min(prev + 1, results.length - 1);

      itemRefs.current[next]?.scrollIntoView({
        block: "nearest",
      });

      return next;
    });
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();

    setSelectedIndex((prev) => {
      const next = prev <= 0 ? 0 : prev - 1;

      itemRefs.current[next]?.scrollIntoView({
        block: "nearest",
      });

      return next;
    });
  }

  if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault();
    window.location.href = `/books/${results[selectedIndex].slug ?? results[selectedIndex].id}`;
  }
};
  /* ---------------- UI ---------------- */
  return (
    <div className="relative w-full max-w-md">

      <input
  type="text"
  placeholder="Search books..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={handleKeyDown}
  className="w-full px-4 py-2 rounded-lg text-black"
/>

      {results.length > 0 && (

        <div className="absolute bg-white w-full mt-1 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">

          {results.map((book, index) => (

  <div
    {results.map((book, index) => (

  <div
    key={book.id}
    ref={(el) => {
      itemRefs.current[index] = el;
    }}
  >

    <Link
      href={`/books/${book.slug ?? book.id}`}
      className={`flex items-center gap-3 px-4 py-2 ${
        index === selectedIndex
          ? "bg-gray-200"
          : "hover:bg-gray-100"
      }`}
    >
                <Image
                  src={book.cover_image || "https://placehold.co/32x40"}
                  alt={book.book_title}
                  width={32}
                  height={40}
                  className="object-cover rounded"
                />

                <span>{highlight(book.book_title, query)}</span>

              </Link>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}