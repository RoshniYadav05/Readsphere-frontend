//src/app/books/[slug]/BookTracker.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";

export default function BookTracker({
  bookId,
  bookTitle,
}: {
  bookId: string
  bookTitle: string
}) {
  const supabase = createClient();
  const pathname = usePathname();
  const { user } = useUser();

  const startTimeRef = useRef<number | null>(null);
  const sessionSavedRef = useRef(false);

  // ✅ ADD THIS
  const maxScrollRef = useRef(0);

  useEffect(() => {

    if (!bookTitle || !user) return;

    console.log("📚 Tracker started");

    startTimeRef.current = Date.now();
    sessionSavedRef.current = false;
    maxScrollRef.current = 0; // reset scroll

    // ✅ ADD THIS SCROLL TRACKER
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const percent = scrollTop / docHeight;

      if (percent > maxScrollRef.current) {
        maxScrollRef.current = percent;
      }
    };

    window.addEventListener("scroll", handleScroll);

    const saveSession = async () => {

      if (!startTimeRef.current) return;
      if (sessionSavedRef.current) return;

      const startTimeMs = startTimeRef.current;
      const endTimeMs = Date.now();

      const diffMs = endTimeMs - startTimeMs;

      // ignore ultra short sessions
      if (diffMs < 5000) return;

      const minutes = Number((diffMs / 60000).toFixed(2));

      const startTime = new Date(startTimeMs);
      const endTime = new Date(endTimeMs);

      // ✅ ADD PAGE CALCULATION HERE
      const totalHeight =
  document.documentElement.scrollHeight;

const viewportHeight = window.innerHeight;

const totalPages = Math.ceil(
  totalHeight / viewportHeight
);

const estimatedPages = Math.max(
  1,
  Math.ceil(maxScrollRef.current * totalPages)
);

      console.log("📚 Saving:", minutes, "minutes", estimatedPages, "pages");

      const { error } = await supabase
        .from("reading_sessions")
        .insert({
          user_id: user.id,
          book_id: bookId,
          book_title: bookTitle,

          reading_date: startTime.toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
          }),

          start_time: startTime.toLocaleString("sv-SE", {
            timeZone: "Asia/Kolkata",
          }),

          end_time: endTime.toLocaleString("sv-SE", {
            timeZone: "Asia/Kolkata",
          }),

          // ✅ REPLACED
          pages_read: estimatedPages,

          duration_minutes: minutes,
        });

      if (!error) {
        sessionSavedRef.current = true;
      }

      startTimeRef.current = null;
    };

    const handleBeforeUnload = () => {
      saveSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      saveSession();
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // ✅ CLEANUP SCROLL
      window.removeEventListener("scroll", handleScroll);
    };

  }, [bookTitle, pathname, user]);

  return null;
}