# OfferDiff — Growth Playbook

Live: https://offerdiff.vercel.app · Goal: real signal (emails from strangers), not upvotes.

## Tracked links (one per channel — the `?ref=` lands in the Supabase `subscribers.source` column)

| Channel | Link |
|---|---|
| Reddit r/SideProject | `https://offerdiff.vercel.app/?ref=sideproject` |
| Reddit r/cscareerquestions | `https://offerdiff.vercel.app/?ref=csq` |
| Reddit r/personalfinance | `https://offerdiff.vercel.app/?ref=pf` |
| Reddit r/overemployed | `https://offerdiff.vercel.app/?ref=oe` |
| Reddit r/financialindependence | `https://offerdiff.vercel.app/?ref=fi` |
| Reddit r/InternetIsBeautiful | `https://offerdiff.vercel.app/?ref=iib` |
| Hacker News | `https://offerdiff.vercel.app/?ref=hn` |
| TikTok (put in bio) | `https://offerdiff.vercel.app/?ref=tiktok` |
| Instagram Reels (bio) | `https://offerdiff.vercel.app/?ref=reels` |
| YouTube Shorts | `https://offerdiff.vercel.app/?ref=shorts` |
| LinkedIn | `https://offerdiff.vercel.app/?ref=linkedin` |
| X / Twitter | `https://offerdiff.vercel.app/?ref=x` |

Check results in: **Vercel Analytics** (visitors + `email_submitted` / `share_copied`) and **Supabase → Table editor → subscribers** (group by `source`).

---

## REDDIT

### The rule that matters
r/cscareerquestions and r/personalfinance **auto-remove self-promo / tool links** and can ban you. There, **comment value-first** on existing offer threads; only include the link if it genuinely adds to your answer. For *posting* links, use the tool-friendly subs below.

### Subreddit map
| Sub | Approach | Link OK in a post? |
|---|---|---|
| r/SideProject, r/InternetIsBeautiful, r/webdev (Showoff Saturday) | "I built this" post | ✅ |
| r/overemployed | "compare your offers" post/comment | ✅ usually |
| r/financialindependence, r/Salary, r/jobs | value post/comment, COL/tax angle | ⚠️ check rules |
| r/cscareerquestions, r/personalfinance, r/ExperiencedDevs | value comment only | ❌ (comment, link sparingly) |

### Post A — r/SideProject / r/InternetIsBeautiful
**Title:** I built a free tool that shows which job offer is *actually* better — after tax, rent, commute & cost of living

> A friend almost took a $20k-higher SF offer over one in Austin. After CA state tax, higher rent, and a longer commute, the "smaller" Austin offer actually left them ~$30k/yr ahead. People compare base salary and pick wrong.
>
> So I made **OfferDiff**: paste two offers → it nets out salary + bonus + equity + benefits, minus federal/state income tax, commute, rent, and cost of living, into one number — which leaves you more per year. Every line shown, no black box. Client-side, free, no signup.
>
> https://offerdiff.vercel.app/?ref=sideproject
>
> v1 — I'd love feedback on the assumptions (how I value commute time, the state-tax estimate). What would you want it to account for?

### Post B — r/overemployed
**Title:** Made a calculator to compare two offers on real take-home (tax + rent + commute), not headline salary

> Juggling offers and the base numbers lie — a higher number in a high-tax/high-rent city can net less. OfferDiff nets out tax (fed + state), rent, commute, and COL into one "money left over" number, side by side. Free, no signup: https://offerdiff.vercel.app/?ref=oe

### Value comment (drop in real "Offer A vs B?" threads — csq / pf / ExperiencedDevs)
> Don't compare base — compare what's left after the costs each offer forces on you:
> 1. Gross = base + bonus + annual equity
> 2. − income tax (this is the big one: e.g. TX 0% vs CA ~9–10%)
> 3. − rent (use the real number for each city)
> 4. − a commute "tax" (those hours are unpaid)
> That order flips a lot of these decisions. [If they gave numbers, do the quick math here.] I built a free calc that does exactly this if useful: https://offerdiff.vercel.app/?ref=csq — but the steps above are the gist.

---

## TIKTOK
Format: vertical 9:16, **hook in the first 1.5s**, screen-record the tool, on-screen captions (most watch muted), 15–35s, trending/neutral audio. CTA always: **"link in bio"** (put the `?ref=tiktok` link there).

### Video 1 — "The bigger offer that pays less" (lead with this; strongest)
- **Hook (caption + VO):** "This $180,000 offer pays LESS than this $150,000 one. Watch."
- **Beats:** screen-record OfferDiff → type Offer A: SF $180k → Offer B: Austin $150k → result flips to Austin.
- **Captions over demo:** "CA state tax 🔻" / "SF rent 🔻" / "45-min commute 🔻" / "Austin wins by $30k/yr"
- **End card:** "Compare YOUR offers — free, link in bio."

### Video 2 — "3 things you forget comparing offers"
- **Hook:** "Comparing job offers by salary? You're doing it wrong. 3 things you forgot:"
- **1** State income tax (0% vs ~10%) · **2** Rent (can be $20k/yr apart) · **3** Your commute is unpaid time
- Quick demo netting it out. **CTA:** "Free tool, link in bio."

### Video 3 — "POV: you almost took the wrong offer"
- **Hook:** "POV: you're about to accept the wrong job offer."
- Story beat: "Offer A is $25k more… so you say yes." → "but after tax, rent, and commute—" → show tool → "Offer B was actually better."
- **CTA:** "Run yours before you sign. Link in bio."

### Video 4 — maker / build-in-public
- **Hook:** "I built a free tool that tells you which job offer is actually better."
- 10-sec demo, no signup. **CTA:** "Try it — link in bio. Tell me what to add."

### Video 5 — relatable skit (talking head)
- **Hook:** "Recruiter: 'It's $185k!' Me, after state tax, rent, and a 45-minute commute:" → cut to the real take-home number on screen.
- **CTA:** "Know your real number. Link in bio."

> Repurpose every TikTok 1:1 to **Instagram Reels** (`?ref=reels`) and **YouTube Shorts** (`?ref=shorts`).

---

## LINKEDIN (strong fit — career audience, links allowed)
> "Just take the higher salary" is bad advice.
>
> A $180k offer in San Francisco can leave you with **less** money than a $150k offer in Austin — once you count state income tax, rent, and your commute. Most people compare the headline number and never run the real math.
>
> So I built a free tool — **OfferDiff**. Paste two offers and it nets out salary, bonus, equity, and benefits, minus federal + state tax, commute, rent, and cost of living, into one number: which one actually leaves you more per year. Every line shown.
>
> Free, no signup → https://offerdiff.vercel.app/?ref=linkedin
>
> Weighing two offers right now? I'd genuinely value your feedback.
>
> #jobsearch #careers #compensation #personalfinance

---

## HACKER NEWS — Show HN
**Title:** Show HN: OfferDiff – which job offer is actually better, after tax and cost of living
> I kept seeing people compare offers by base salary and pick the wrong one. OfferDiff nets out salary/bonus/equity/benefits minus federal + state income tax, FICA, commute time, rent, and cost of living into one itemized number. Pure client-side, free, no signup. Tax uses 2025 federal brackets + an effective state rate; commute time valued at 50% of hourly wage. Curious what HN thinks of the assumptions. https://offerdiff.vercel.app/?ref=hn

Post Tue–Thu ~8–10am PT.

---

## X / TWITTER (thread)
1/ Most people pick the wrong job offer — they compare base salary. A $180k offer in SF can leave you *less* than $150k in Austin once you count state tax, rent, and commute. So I built OfferDiff. 🧵
2/ It nets out salary + bonus + equity + benefits − income tax (fed + state) − commute − rent − cost of living. One honest number, every line shown.
3/ Free, no signup, instant 👉 https://offerdiff.vercel.app/?ref=x — built in a weekend, what should it account for next?

---

## SUGGESTED SEQUENCE (week 1)
1. **Day 1 (Tue–Thu am):** Show HN + r/SideProject + LinkedIn. Watch Analytics live.
2. **Day 1–7:** Drop the value-comment in r/cscareerquestions / r/personalfinance whenever an "Offer A vs B?" thread appears (daily).
3. **Day 2–5:** TikTok video 1, then 2 — repost to Reels + Shorts. Test which hook lands.
4. **Ongoing:** Add site to Google Search Console, submit `/sitemap.xml`. SEO compounds over weeks.

## What "they want it" looks like
- ✅ Strangers leave emails (track by source), people hit *Copy link* to share, comments ask for features.
- ❌ Upvotes/"cool!" with zero emails = zero. Kill or pivot if a week of traffic yields no emails.
- Rough bar: ~1–3% visitor→email is okay, >5% is real demand.
