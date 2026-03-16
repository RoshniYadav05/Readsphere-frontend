//src/components/searchBar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const fetchBooks = async () => {
      const res = await fetch(`/api/search-books?q=${query}`);
      const data = await res.json();
      setResults(data.results || []);
    };

    const timer = setTimeout(fetchBooks, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);


const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!results.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setSelectedIndex((prev) =>
      prev < results.length - 1 ? prev + 1 : prev
    );
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
  }

  if (e.key === "Enter" && selectedIndex >= 0) {
    window.location.href = `/books/${results[selectedIndex].slug}`;
  }
};

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
        <div className="absolute bg-white w-full mt-1 rounded-lg shadow-lg z-50">
          {results.map((book: any) => (
            <Link
              key={book.id}
              href={`/books/${book.slug}`}
              className="block px-4 py-2 hover:bg-gray-100 text-black"
            >
              {highlight(book.book_title, query)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}