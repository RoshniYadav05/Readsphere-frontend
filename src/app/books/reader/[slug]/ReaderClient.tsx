//src/app/books/reader/[slug]/ReaderClient.tsx
//src/app/books/reader/[slug]/ReaderClient.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

import {
  startReadingSession,
  endReadingSession
} from '@/lib/readingTracker';

type Props = {
  pdfUrl: string;
  slug: string;
};

export default function ReaderClient({ pdfUrl, slug }: Props) {

  const startRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(0);
  const visibilityRef = useRef<boolean>(true);

  const router = useRouter();
  const supabase = createClient();

  // -------------------------------
  // 📌 1. Save READING HISTORY
  // -------------------------------
  useEffect(() => {
    async function saveHistory() {

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: book } = await supabase
        .from('books')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!book) return;

      await supabase.from('reading_history').upsert({
        user_id: user.id,
        book_id: book.id,
        last_opened_at: new Date(),
      });
    }

    saveHistory();
  }, []);

  // -------------------------------
  // 📌 2. START SESSION + TIMER
  // -------------------------------
  useEffect(() => {

    startReadingSession(); // ✅ NEW TRACKER START

    startRef.current = Date.now();

    function onVisibilityChange() {
      if (document.hidden) {

        if (startRef.current) {
          accumulatedRef.current +=
            Date.now() - startRef.current;

          startRef.current = null;
        }

        visibilityRef.current = false;

      } else {

        if (!startRef.current)
          startRef.current = Date.now();

        visibilityRef.current = true;
      }
    }

    async function onBeforeUnload() {

      sendReadingTime();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: book } = await supabase
        .from('books')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!book) return;

      await endReadingSession(
        user.id,
        book.id,
        supabase
      );
    }

    document.addEventListener(
      'visibilitychange',
      onVisibilityChange
    );

    window.addEventListener(
      'beforeunload',
      onBeforeUnload
    );

    return () => {

      if (startRef.current) {
        accumulatedRef.current +=
          Date.now() - startRef.current;
        startRef.current = null;
      }

      document.removeEventListener(
        'visibilitychange',
        onVisibilityChange
      );

      window.removeEventListener(
        'beforeunload',
        onBeforeUnload
      );

      onBeforeUnload();
    };

  }, []);

  // -------------------------------
  // 📌 3. PROGRESS TRACKING
  // -------------------------------
  useEffect(() => {

    const interval = setInterval(() => {
      saveProgress();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  async function saveProgress() {
    try {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: book } = await supabase
        .from('books')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!book) return;

      await supabase.from('reading_progress').upsert({
        user_id: user.id,
        book_id: book.id,
        current_page: null,
        total_pages: null,
      });

    } catch {}
  }

  // -------------------------------
  // 📌 KEEP EXISTING API TRACKING
  // -------------------------------
  async function sendReadingTime() {
    try {

      const durationMs = accumulatedRef.current;
      if (!durationMs || durationMs < 1000) return;

      const payload = {
        book_slug: slug,
        duration_seconds:
          Math.round(durationMs / 1000),
      };

      const body = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        const blob = new Blob([body], {
          type: 'application/json'
        });

        navigator.sendBeacon(
          '/api/reading-time',
          blob
        );

      } else {

        await fetch('/api/reading-time', {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body,
          keepalive: true,
        });
      }

    } catch {}
  }

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="w-full h-screen flex flex-col">

      <div className="flex-1">
        <iframe
          src={pdfUrl}
          title="Book Reader"
          className="w-full h-full"
          style={{ border: 0 }}
        />
      </div>

      <div className="p-3 bg-gray-900 text-white flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Back
        </button>

        <div className="text-sm opacity-80">
          Tracking reading time, progress, history & sessions.
        </div>
      </div>

    </div>
  );
}