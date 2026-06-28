import Calculator from "@/components/Calculator";
import EmailCapture from "@/components/EmailCapture";

const FAQ = [
  {
    q: "How does OfferDiff compare two job offers?",
    a: "It adds up each offer's annual value — base, bonus, equity, and benefits — then subtracts the costs that location and lifestyle quietly impose: your commute, your rent, and everyday living costs. What's left is the money each offer actually leaves you per year, side by side.",
  },
  {
    q: "Can I use my real rent instead of an estimate?",
    a: "Yes — that's the point. Enter your expected monthly rent for each offer and OfferDiff uses it directly. Leave it blank and it assumes the city's average rent, so you always get an answer either way.",
  },
  {
    q: "How do you handle commute and remote work?",
    a: "Your commute is unpaid time, so we value it at 50% of your hourly wage (base ÷ 2,080 hours) across 48 working weeks. More remote days mean fewer trips, which directly lowers that cost — that's how flexibility shows up in the number.",
  },
  {
    q: "How are living costs estimated?",
    a: "Beyond rent, we estimate non-housing essentials — food, transport, utilities — and scale them by each city's cost-of-living index (national average = 100). It's an estimate; rent, the biggest swing, is the part you control directly.",
  },
  {
    q: "Is this financial advice?",
    a: "No. OfferDiff is a fast, honest estimate to help you think clearly about a job-offer decision. It doesn't model income tax, raises, or equity upside, and it isn't financial or tax advice.",
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
      "Compare two job offers and get one honest number: which actually leaves you more per year after salary, commute, rent, and cost of living.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main className="mx-auto max-w-4xl px-5 sm:px-6">
      <header className="flex items-center justify-between border-b border-line py-5">
        <span className="font-display text-lg font-semibold tracking-tight">
          Offer<span className="text-money">Diff</span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          Free · instant · no signup
        </span>
      </header>

      <section className="pt-12 sm:pt-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">
          Job-offer comparison · cost-of-living adjusted
        </p>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-[1.75rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.05]">
          Which job offer is <span className="italic text-money">actually</span> better?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
          Paste two offers. OfferDiff nets out salary, bonus, equity, benefits, commute, and the real
          cost of living — rent included — into one honest number: which one leaves you more.
        </p>
      </section>

      <div className="mt-10 sm:mt-12">
        <Calculator />
      </div>

      <div className="mt-6">
        <EmailCapture />
      </div>

      <section className="mt-20 border-t border-line pt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">The reasoning</p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-medium tracking-tight">
          A smarter way to compare two job offers
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 leading-relaxed text-ink-2">
          <p>
            Most people compare offers by base salary alone — and pick the wrong one. A bigger number
            in an expensive city, with a long commute, thin benefits, and brutal rent, can quietly be
            worth tens of thousands less per year than a smaller offer somewhere cheaper. OfferDiff
            does the math that makes the two genuinely comparable.
          </p>
          <p>
            Enter each offer&apos;s salary, bonus, annual equity, and benefits, then your commute,
            remote days, city, and rent. OfferDiff totals the compensation, charges each offer for the
            time you&apos;d lose commuting and the cost of living where you&apos;d live, and shows what
            each one actually leaves you. One honest headline, with every line shown.
          </p>
        </div>

        <h2 className="mt-14 font-display text-2xl font-medium tracking-tight">Common questions</h2>
        <dl className="mt-6 max-w-2xl divide-y divide-line border-t border-line">
          {FAQ.map((item) => (
            <div key={item.q} className="py-5">
              <dt className="font-display font-medium text-ink">{item.q}</dt>
              <dd className="mt-2 leading-relaxed text-ink-2">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-16 border-t border-line py-8 text-[12px] text-ink-3">
        <p>
          OfferDiff · Estimates only, not financial or tax advice. Cost-of-living indices and average
          rents are approximate.
        </p>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
    </main>
  );
}
