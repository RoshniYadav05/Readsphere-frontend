// src/app/(app)/requirements/RequirementsForm.tsx
"use client"

import dynamic from "next/dynamic"

// ✅ CORRECT: explicitly Select export return karo
const Select = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => mod.Select),
  { ssr: false }
)

const SelectTrigger = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => mod.SelectTrigger),
  { ssr: false }
)

const SelectValue = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => mod.SelectValue),
  { ssr: false }
)

const SelectContent = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => mod.SelectContent),
  { ssr: false }
)

const SelectItem = dynamic(
  () =>
    import("@/components/ui/select").then((mod) => mod.SelectItem),
  { ssr: false }
)


import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';
import Image from 'next/image';

type Book = {
  id: number;
  slug: string;
  book_title: string;
  cover_image: string; // updated field
};

// Helper to check valid URL
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function RequirementsForm() {
  const [genres, setGenres] = useState<string[]>([]);
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [min_rating, setMinRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');

  // Fetch genres (client-side)
  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await fetch("/api/genres");
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Failed to load genres");
      }
    }
    loadGenres();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations([]);
    setSimilarBooks([]);

    const userPreferences = {
      genre,
      author,
      min_rating: min_rating ? Number(min_rating) : null,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

      const response = await fetch(`${apiUrl}/recommend/personalized`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPreferences),
      });

      if (!response.ok) throw new Error("Network response was not ok.");

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setRecommendations(data.recommended_books || []);
        setSimilarBooks(data.similar_books || []);
      }

    } catch (err) {
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Safely get image src (fallback if invalid)
  const getSafeImageSrc = (url: string) => {
    return url && isValidUrl(url) ? url : "/placeholder.svg";
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-card p-8 rounded-lg shadow-lg space-y-6"
      >
        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="genre" className="text-black">
  Favorite Genre
</Label>

          <Select value={genre} onValueChange={setGenre} >
            <SelectTrigger id="genre" className="text-black">
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent >
              {genres.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author" className="text-black">Preferred Author (Optional)</Label>
          <Input
            id="author"
            type="text"
            placeholder="e.g., J.K. Rowling"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        {/* Min rating */}
        <div className="space-y-2">
          <Label htmlFor="min_rating" className="text-black">Minimum Rating (Optional)</Label>
          <Input
            id="min_rating"
            type="number"
            placeholder="e.g., 4.5"
            step="0.1"
            min="0"
            max="5"
            value={min_rating}
            onChange={(e) => setMinRating(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Getting Recommendations..." : "Find My Books"}
        </Button>
      </form>

      {/* Results */}
      <div className="mt-12">
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Similar Books */}
        {similarBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">Similar Books</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {similarBooks.map((book: Book) => (
                <Link key={book.id} href={`/books/${book.slug}`}>
                  <Image
                    src={getSafeImageSrc(book.cover_image)}
                    alt={book.book_title}
                    width={200}
                    height={300}
                    className="rounded-lg hover:scale-105 transition"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">
              Here Are Your Recommendations
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
              {recommendations.map((book) => (
                <Link key={book.id} href={`/books/${book.slug}`}>
                  <Image
                    src={getSafeImageSrc(book.cover_image)}
                    alt={book.book_title}
                    width={200}
                    height={300}
                    className="object-cover w-full rounded-lg transition-transform hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
