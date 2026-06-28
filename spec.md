# Batch Build Spec — 4 Products, 4 Channels

> Handoff doc for Claude Code. Read this whole file before writing any code.
> This is a **validation sprint**, not a product build. The rules below override any instinct to make things polished or complete.

---

## ⛔ PRIME DIRECTIVE (read this twice)

**Every product ships as an OFFER with a real ASK before it becomes a real product.**

An "offer" = a one-page site that (1) names an outcome a person wants, (2) lets them experience the core thing working, and (3) makes ONE real ask: pay money, or leave an email. Deployed to a live URL. That's the finish line for the weekend.

I (the human) have a documented habit of hiding from selling by building. Do **not** help me indulge it. If you find yourself adding auth, databases, account systems, settings pages, dashboards, onboarding flows, or a second feature — **stop**. None of that is allowed until a product shows a real signal (money or emails from a stranger).

**Build the smallest thing that can take a real ask. Deploy it. Move on.**

---

## The batch, in one table

| # | Product | What it is | Channel (how it's marketed) | The ONE real ask |
|---|---------|-----------|------------------------------|------------------|
| 1 | **StreakCard** | Shareable "Day N" consistency badge generator + transparent PNG export | My own IG/social audience | Free → email for "Pro" (custom designs, multi-streak, HD/transparent export) |
| 2 | **LeadLeak Audit** | A *manual service*, not an app — I audit a local business's site + Google Business Profile | Cold outreach to local home-services businesses | A paid pilot / deposit ($150 audit, $500 fix) |
| 3 | **LinkShine** (OG image gen) | Paste a title → pick a template → download a clean social-share (OG) card image | Build-in-public on X / IndieHackers | Free tier → email or small payment for credit packs |
| 4 | **OfferDiff** | Calculator: paste two job offers → one "Offer A is worth $X more/yr" number (salary + commute + benefits + remote + cost-of-living) | SEO + one Reddit drop (r/cscareerquestions, r/personalfinance) | Email capture (results emailed / "notify me of new tools") |

**The channels are the actual thing being practiced.** Each product trains a different distribution muscle: owned audience, cold B2B, build-in-public, SEO. Keep them distinct.

---

## Repo & deploy structure

- **Separate repo per product. NOT a monorepo.** These die or scale independently; coupling them is a mistake. Separate repos = separate Vercel deploys, separate domains, separate analytics, clean deletion when one flops.
- Do **not** build shared tooling / a shared component library across them. At this scale, wiring up shared infra costs more time than it saves and is itself a form of procrastination. A little copy-paste between repos is fine and faster.
- **LeadLeak (#2) is not a web app.** It's a single landing page (one HTML file, or Carrd/Tally) describing the service + a "book an audit" button. Do not build an audit tool. The whole point is I sell it first and do the audit by hand.

So: **3 small web-app repos + 1 landing page.**

---

## Shared spine (applies to web apps #1, #3, #4)

Every web app must have, and *only* have:

1. **A headline** that names the outcome (not the tech). E.g. OfferDiff → "Which job offer is *actually* better?" not "Job offer comparison calculator."
2. **The core thing, working, client-side, instantly** — no login wall in front of it. Let them feel the value in 5 seconds.
3. **One real ask**, wired with a **hosted tool, not custom backend**:
   - Payment → **Stripe Payment Link** (a hosted URL, zero backend code).
   - Email → a form service (Tally / Formspree) or a single Vercel serverless route writing to a hosted store. Do not build user auth.
4. **Analytics** — Vercel Analytics or Plausible. One event: did they make the ask (paid / submitted email)?
5. **Deployed to a live URL** on Vercel.

**Success metric, identical across all four: real signal (money or email from a stranger) vs. politeness.** A "this is cool" with no email is a zero.

---

## Recommended stack (optimize for ship-speed, not resume)

- **Framework:** Next.js (App Router) + Tailwind, deployed on Vercel. Consistent across the 3 web apps, trivial deploy, easy to add a serverless route later *if validated*.
  - #4 (OfferDiff) and #1 (StreakCard) are pure client-side — no backend at all. Keep them that way.
- **None of these 4 products need an AI/LLM API.** No keys, no model calls. Don't add them.
- **Image export (#1 StreakCard, #3 LinkShine):** render the card as styled HTML, export to PNG **client-side** with `html-to-image` (or `dom-to-image`). No server, no image pipeline. For #1, make sure transparent-background PNG export works — that's the "overlay on a reel" use case.
- **Payments:** Stripe Payment Links only. No Stripe SDK / checkout backend for v1.
- **Email capture:** Tally or Formspree embed, or one serverless route → a hosted store (Vercel KV / Supabase free tier). Simplest that works.

---

## ❌ Do NOT build (until a product earns it with real signal)

Auth / login. User accounts. Databases for app data. Dashboards. Settings/profile pages. Mobile apps. Multi-page navigation. Dark-mode toggles. Onboarding tours. A second feature. Anything that isn't headline + working core + one ask.

If a feature feels "obviously needed," that's the trap talking. Ship without it.

---

## Per-product specs

### 1) StreakCard — owned audience
- **Core:** Input a habit name + a day count (and optional start date) → render a clean, attractive "Day 230 🔥" card. A few template styles. Live preview.
- **Export:** Download as PNG. **Transparent-background option** (for overlaying on Reels/TikToks) is a must-have — it's a real use case for me and a differentiator.
- **MVP scope:** ~3 card templates, text inputs, live preview, PNG export. That's it.
- **The ask:** Free to use. Below the export button: "Want custom designs, multiple streaks, and HD/transparent exports? → [email field] Get notified when Pro drops." Capture emails.
- **Distribution (I do this, not you):** I post a Reel using the tool + "link in bio." Build it so the *output card is itself shareable* (looks good enough to post).
- **Watch for:** signups + people actually posting the cards.

### 2) LeadLeak Audit — cold B2B (LANDING PAGE ONLY)
- **Not an app.** One landing page: headline ("Your [roofing] site is quietly losing you calls — here's exactly where"), 3 bullets on what the audit covers (site speed, Google Business Profile, contact/booking friction), social-proof placeholder, and a **"Book a $150 audit" button → Stripe Payment Link or a Tally booking form.**
- **The ask:** a deposit / paid pilot. Pitch the *outcome*; deliver the audit by hand (manually) when someone pays.
- **Distribution (I do this):** cold email/DM 30 local home-services businesses, push every reply toward the paid audit.
- **Watch for:** deposits, not "sounds great." A free yes proves nothing.

### 3) LinkShine — build-in-public (OG image generator)
- **Core:** Inputs (title, optional subtitle/site name, optional accent color) + a few templates → live preview of a 1200×630 OG card → download PNG. Client-side render + export.
- **MVP scope:** ~4 templates, text + color inputs, PNG download. No accounts.
- **The ask:** Free for a couple exports, then "credit pack / Pro → [email or Stripe Payment Link]." Keep it light; email capture is fine for v1.
- **Distribution (I do this):** build it in public on X/IndieHackers, post the process. I'll dogfood it for these other landing pages.
- **Watch for:** signups + makers asking for it.

### 4) OfferDiff — SEO
- **Core:** Two columns (Offer A / Offer B). Inputs per offer: base salary, bonus, equity (simple $/yr), commute time, remote days/week, benefits estimate, and the city (for cost-of-living adjustment — a simple lookup table or manual COL index input is fine for v1). Output: one headline number — "Offer A is worth ~$X more per year, adjusted" — plus a short breakdown.
- **MVP scope:** the calculator + the result. Pure client-side. No backend.
- **The ask:** "Email me my results / notify me of new tools like this → [email field]." Capture emails.
- **SEO basics (do include these — cheap, and this product's whole channel is search):** a real `<title>`/meta description, an H1 matching search intent, a paragraph of plain-text context below the tool, clean semantic HTML, fast load. Target phrasing like "compare two job offers."
- **Distribution (I do this):** one good post in r/cscareerquestions / r/personalfinance, then let SEO compound.
- **Watch for:** organic search arrivals over the following weeks + email captures.

---

## Definition of DONE (the only goal this weekend)

- [ ] #1 StreakCard — deployed, PNG + transparent export works, email-capture ask live
- [ ] #2 LeadLeak — landing page deployed, "book audit" payment/booking ask live
- [ ] #3 LinkShine — deployed, OG card export works, email/payment ask live
- [ ] #4 OfferDiff — deployed, calculator works, SEO meta in place, email-capture ask live

Four live URLs, each making one real ask, each wired to analytics. **No fifth feature on any of them.** When one shows real signal, *that's* the one we build out — not before.

---

## Suggested build order

1. **OfferDiff** — pure client-side, no images, no payment integration. Fastest to a live URL. Get a win on the board.
2. **StreakCard** — adds client-side image export (`html-to-image`). Reuse that pattern for #3.
3. **LinkShine** — same image-export pattern, different templates.
4. **LeadLeak** — a single landing page; quickest of all, do it last or in parallel.

Start with #1. Ship it live before touching #2.
