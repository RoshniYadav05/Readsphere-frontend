"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Search } from "lucide-react";
import Image from "next/image";

interface Book {
  id: string;
  slug: string;
  cover_image: string;
  book_title: string;
  author: string;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // ⭐ Debounced search + fixed API field
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const res = await fetch(`/api/search-books?q=${query}`);
      const data = await res.json();
      setSuggestions(data.results || []);
    };

    const delay = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSuggestions([]);
    setIsFocused(false);
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="text-2xl font-bold">
            ReadSphere
          </Link>

          {/* AUTH RIGHT (MOBILE) */}
          <div className="sm:hidden absolute right-12">
            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="text-white">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="sm:hidden text-2xl focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? "✖" : "☰"}
          </button>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden sm:flex items-center space-x-4">
            

            {/* ⭐ AMAZON-STYLE SEARCH BAR */}
            <div className="relative w-96 ml-5">
              <form onSubmit={handleSearch}>
                <div className="
                  flex items-center 
                  bg-white text-black 
                  rounded-md shadow-md 
                  border border-gray-300
                  overflow-hidden
                ">
                  
                  <Input
                    type="search"
                    placeholder="Search for books, authors, genres..."
                    className="w-full border-none shadow-none focus-visible:ring-0 focus:outline-none text-black"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                  />

                  <Button
                    type="submit"
                    className="rounded-none bg-purple-400 hover:bg-yellow-500 text-black"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              {/* ⭐ AMAZON-STYLE DROPDOWN WITH IMAGE */}
              {isFocused && suggestions.length > 0 && (
                <div className="
                  absolute left-0 right-0 mt-1 
                  bg-white text-black 
                  rounded-md shadow-lg z-50 
                  border border-gray-300
                  max-h-80 overflow-auto
                ">
                  {suggestions.map((book) => (
                    <div
                      key={book.id}
                      className="
                        flex items-center gap-3 
                        px-3 py-2 
                        cursor-pointer 
                        hover:bg-gray-100
                      "
                      onMouseDown={() => {
                        router.push(`/books/${book.slug}`);
                        setSuggestions([]);
                        setIsFocused(false);
                      }}
                    >
                      <Image
  src={book.cover_image && book.cover_image.trim() !== "" 
        ? book.cover_image 
        : "/placeholder-cover.png"}
  alt={book.book_title || "Book Cover"}
  width={40}
  height={60}
  unoptimized
/>


                      <div>
                        <p className="font-medium text-sm">{book.book_title}</p>
                        <p className="text-xs text-gray-600">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* NAV LINKS */}
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/recommendations">Top Picks</Link></li>
                <li><Link href="/about">About</Link></li>
              </ul>
            </nav>

            

            {/* AUTH */}
            <SignedOut>
              <SignInButton>
                <Button
  variant="outline"
  className="text-black hover:bg-transparent hover:text-black"
>
  Login
</Button>

              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

          </div>
        </div>


        {/* MOBILE MENU — UNCHANGED */}
        {/* (We can apply Amazon-style UI here too if you want) */}

      </div>
    </header>
  );
}
