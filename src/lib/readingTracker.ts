//src/lib/readingTracker.ts
// ==========================
// SESSION VARIABLES
// ==========================
let sessionStart: Date | null = null;
let pageStartTime: Date | null = null;

let validPages = 0;
let totalActiveTime = 0;


// ==========================
// START SESSION
// ==========================
export function startReadingSession() {
  sessionStart = new Date();
  pageStartTime = new Date();

  validPages = 0;
  totalActiveTime = 0;
}


// ==========================
// PAGE TRACK (30s RULE)
// ==========================
export function onPageChange() {
  if (!pageStartTime) return;

  const now = new Date();

  const secondsSpent =
    (now.getTime() - pageStartTime.getTime()) / 1000;

  if (secondsSpent >= 30) {
    validPages++;
    totalActiveTime += secondsSpent;
  }

  pageStartTime = new Date();
}


// ==========================
// END SESSION
// ==========================
export async function endReadingSession(
  userId: string,
  bookId: string,
  startTime: Date,
  endTime: Date,
  supabase: any
) {

  console.log("🔥 endReadingSession STARTED");

  const minutes = Math.max(
    1,
    Math.round(
      (endTime.getTime() -
        startTime.getTime()) / 60000
    )
  );

  const { data, error } = await supabase
    .from("reading_sessions")
    .insert({
      user_id: userId,
      book_id: bookId,
      reading_date:
        startTime.toISOString().split("T")[0],
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      pages_read: 1,
      duration_minutes: minutes,
    });

  console.log("✅ INSERT DATA:", data);
  console.log("❌ INSERT ERROR:", error);
}