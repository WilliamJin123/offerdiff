import Calculator from "@/components/Calculator";
import EmailCapture from "@/components/EmailCapture";

const FAQ = [
  {
    q: "How does OfferDiff compare two job offers?",
    a: "It adds up each offer's annual value — base salary, bonus, equity, and benefits — then subtracts the cost of your commute and adjusts everything for the local cost of living. The result is a single apples-to-apples number for each offer, so you can see which one actually leaves you better off.",
  },
  {
    q: "How do you account for commute and remote work?",
    a: "Your commute is time you don't get paid for, so we value it at 50% of your hourly wage (base salary ÷ 2,080 hours) across 48 working weeks. More remote days mean fewer trips to the office, which directly lowers that cost — that's how flexibility shows up in the number.",
  },
  {
    q: "How does cost of living factor in?",
    a: "$150k in San Francisco doesn't buy what $150k buys in Austin. We convert each offer to equal purchasing power using a cost-of-living index (national average = 100), so a higher salary in an expensive city is compared fairly against a lower one somewhere cheaper.",
  },
  {
    q: "Is this financial advice?",
    a: "No. OfferDiff is a fast estimate to help you think clearly about a job-offer decision. It doesn't model taxes, raises, or equity upside, and it isn't financial advice.",
  },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "OfferDiff",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description:
      "Compare two job offers and get one number: which is actually worth more per year, adjusted for salary, commute, remote work, benefits, and cost of living.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.14),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-slate-200">
            Offer<span className="text-emerald-400">Diff</span>
          </span>
          <span className="text-xs text-slate-500">Free · No signup</span>
        </header>

        <section className="mt-12 text-center sm:mt-16">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
            Which job offer is <span className="text-emerald-400">actually</span> better?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-slate-300">
            Compare two job offers and get one number — adjusted for salary, bonus, equity, benefits,
            commute, remote days, and cost of living.
          </p>
        </section>

        <div className="mt-10 sm:mt-12">
          <Calculator />
        </div>

        <div className="mt-8">
          <EmailCapture />
        </div>

        {/* SEO context — real, readable content below the tool */}
        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold text-slate-100">
            A smarter way to compare two job offers
          </h2>
          <p className="mt-4 leading-relaxed text-slate-300">
            Most people compare job offers by base salary alone — and pick the wrong one. A bigger
            number in an expensive city, with a brutal commute and thin benefits, can quietly be worth
            tens of thousands less per year than a &ldquo;smaller&rdquo; offer somewhere cheaper.
            OfferDiff does the math that makes the two genuinely comparable.
          </p>
          <p className="mt-4 leading-relaxed text-slate-300">
            Enter each offer&apos;s salary, bonus, annual equity, and benefits value, then your commute
            and how many days a week you&apos;d work remotely, and the city. OfferDiff totals the
            compensation, charges each offer for the time you&apos;d lose commuting, and adjusts both to
            equal purchasing power. You get one honest headline: how much more, per year, one offer is
            really worth.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-slate-100">Common questions</h2>
          <dl className="mt-6 space-y-6">
            {FAQ.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-slate-100">{item.q}</dt>
                <dd className="mt-1.5 leading-relaxed text-slate-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          <p>OfferDiff · Estimates only, not financial advice. Cost-of-living indices are approximate.</p>
        </footer>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
    </main>
  );
}
