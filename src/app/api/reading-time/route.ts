// app/api/reading-time/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { book_slug, duration_seconds, user_id } = body;

    if (!book_slug || !duration_seconds) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }

    const supabase = createClient(cookies());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await (await supabase)
      .from('reading_time')
      .insert({
        book_slug,
        duration_seconds,
        user_id: user_id || null,
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('API error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
