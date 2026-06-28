"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
        body: JSON.stringify({ email: trimmed, source: "offerdiff" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Subscription failed");
      }
      track("email_submitted");
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Something went wrong — please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-300">You&apos;re on the list. 🎉</p>
        <p className="mt-1 text-sm text-slate-300">
          We&apos;ll email you when we ship new tools like this.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-slate-100">Get notified of new tools like this</h2>
      <p className="mt-1.5 text-sm text-slate-400">
        We&apos;re building more no-nonsense calculators for big career-money decisions. Drop your
        email and we&apos;ll tell you when the next one&apos;s live.
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
          className="w-full flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/30"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Adding…" : "Notify me"}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-sm text-rose-400">{message}</p>}
      <p className="mt-2 text-xs text-slate-500">No spam. One email when there&apos;s something worth your time.</p>
    </div>
  );
}
