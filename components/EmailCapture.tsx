"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  // Channel attribution: capture ?ref= at first render, before the calculator
  // rewrites the URL. Lands in the Supabase `source` column so you can see
  // which post actually converted.
  const [source] = useState(() => {
    if (typeof window === "undefined") return "offerdiff";
    const ref = new URLSearchParams(window.location.search).get("ref");
    return ref ? ref.slice(0, 40).replace(/[^\w.-]/g, "") || "offerdiff" : "offerdiff";
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Subscription failed");
      }
      track("email_submitted", { source });
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Something went wrong — please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-money/40 bg-money/[0.06] px-6 py-7 text-center">
        <p className="font-display text-lg font-medium text-money">You&apos;re on the list.</p>
        <p className="mt-1 text-sm text-ink-2">
          We&apos;ll email you when we ship the next tool for big money decisions.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line-strong bg-paper-raised px-6 py-7 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          Stay posted
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h2 className="mt-3 font-display text-xl font-medium text-ink">
        Get the next tool like this
      </h2>
      <p className="mt-1.5 max-w-xl text-sm text-ink-2">
        We&apos;re building more plain-spoken calculators for big career-money calls. Leave your email
        and we&apos;ll tell you when the next one&apos;s live.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@email.com"
          aria-label="Email address"
          className="w-full flex-1 rounded-md border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-money focus:ring-2 focus:ring-money/20"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-ink px-6 py-3 font-medium text-paper-raised transition hover:bg-money disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Adding…" : "Notify me"}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-sm text-loss">{message}</p>}
      <p className="mt-2 text-[12px] text-ink-3">No spam. One email when there&apos;s something worth your time.</p>
    </div>
  );
}
