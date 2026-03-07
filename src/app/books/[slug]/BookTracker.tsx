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

  const startTimeRef = useRef<Date | null>(null);
  const sessionSavedRef = useRef(false);

  useEffect(() => {

    if (!bookTitle || !user) return;

    console.log("📚 Tracker started");

    startTimeRef.current = new Date();
    sessionSavedRef.current = false;

    const saveSession = async () => {

      if (!startTimeRef.current) return;
      if (sessionSavedRef.current) return;

      const startTime = startTimeRef.current;
      const endTime = new Date();

      const minutes = Math.max(
        1,
        Math.round(
          (endTime.getTime() - startTime.getTime()) / 60000
        )
      );

      console.log("📚 Saving reading session...");

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

          pages_read: 1,
          duration_minutes: minutes,
        });

      if (error) {
        console.log("❌ DB ERROR:", error);
      } else {
        console.log("✅ Reading session saved");
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
    };

  }, [bookTitle, pathname, user]);

  return null;
}