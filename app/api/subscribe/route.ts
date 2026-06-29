import { NextResponse } from "next/server";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, source } = (body ?? {}) as { email?: string; source?: string };
  const trimmed = typeof email === "string" ? email.trim().toLowerCase() : "";
  const cleanSource =
    (typeof source === "string" ? source : "offerdiff").slice(0, 60) || "offerdiff";

  if (!EMAIL_RE.test(trimmed)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // No store configured (e.g. local dev without keys): accept and log so the
  // UX works, but make it obvious the email wasn't persisted.
  if (!url || !key) {
    console.warn(`[subscribe] Supabase not configured — not persisted: ${trimmed}`);
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const res = await fetch(`${url}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal,resolution=ignore-duplicates",
      },
      body: JSON.stringify({ email: trimmed, source: cleanSource }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[subscribe] Supabase insert failed (${res.status}): ${detail}`);
      return NextResponse.json({ error: "Could not save email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error("[subscribe] Unexpected error:", err);
    return NextResponse.json({ error: "Could not save email" }, { status: 500 });
  }
}
