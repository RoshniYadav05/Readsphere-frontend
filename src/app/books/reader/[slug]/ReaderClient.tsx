//src/app/books/reader/[slug]/ReaderClient.tsx
'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type Props = {
  pdfUrl: string;
  slug: string; // encoded
};

export default function ReaderClient({ pdfUrl, slug }: Props) {
  const startRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(0);
  const visibilityRef = useRef<boolean>(true);
  const router = useRouter();
  const supabase = createClient();

  // -------------------------------
  // 📌 1. Save READING HISTORY (on open)
  // -------------------------------
  useEffect(() => {
    async function saveHistory() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Find book by slug
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

  // Start timer on mount
  useEffect(() => {
    startRef.current = Date.now();

    function onVisibilityChange() {
      if (document.hidden) {
        if (startRef.current) {
          accumulatedRef.current += Date.now() - startRef.current;
          startRef.current = null;
        }
        visibilityRef.current = false;
      } else {
        if (!startRef.current) startRef.current = Date.now();
        visibilityRef.current = true;
      }
    }

    function onBeforeUnload() {
      sendReadingTime();
      saveReadingSession();
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      if (startRef.current) {
        accumulatedRef.current += Date.now() - startRef.current;
        startRef.current = null;
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', onBeforeUnload);

      sendReadingTime();
      saveReadingSession();
    };
  }, []);

  // ------------------------------------------------
  // 📌 2. Track reading PROGRESS every 10 seconds
  // (iframe does not give page events)
  // ------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 10000); // every 10 seconds

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
        // IFRAME cannot track real pages → store time-based progress
        current_page: null,
        total_pages: null,
      });
    } catch {}
  }

  // ------------------------------------------------
  // 📌 3. Save reading SESSION when page closes
  // ------------------------------------------------
  async function saveReadingSession() {
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

      const duration = Math.floor(accumulatedRef.current / 1000);
      if (duration < 5) return; // ignore tiny sessions

      await supabase.from('reading_sessions').insert({
        user_id: user.id,
        book_id: book.id,
        session_start: new Date(Date.now() - duration * 1000),
        session_end: new Date(),
        duration,
      });
    } catch {}
  }

  // ------------------------------------------------
  // ORIGINAL: send reading_time → KEEPING SAME
  // ------------------------------------------------
  async function sendReadingTime() {
    try {
      const durationMs = accumulatedRef.current;
      if (!durationMs || durationMs < 1000) return;

      const payload = {
        book_slug: slug,
        duration_seconds: Math.round(durationMs / 1000),
      };

      const url = '/api/reading-time';
      const body = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        });
      }
    } catch {}
  }

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
