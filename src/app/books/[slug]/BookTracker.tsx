// src/app/books/[slug]/BookTracker.tsx
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";

export default function BookTracker({ bookId }: { bookId: string }) {
  const { user } = useUser();
  const supabase = createClient();

  useEffect(() => {
    if (!user || !bookId) return;

    const trackOpen = async () => {
      await supabase.from("reading_sessions").insert({
        user_id: user.id,
        book_id: bookId,
      });

      await supabase.from("reading_progress").upsert(
        {
          user_id: user.id,
          book_id: bookId,
          current_page: 0,
        },
        { onConflict: "user_id,book_id" }
      );
    };

    trackOpen();
  }, [user, bookId]);

  return null;
}
