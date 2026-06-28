"use client";

import { CITIES } from "@/lib/col";
import { CUSTOM, NATIONAL, assumedRent, type OfferForm } from "@/lib/form";
import { formatThousands } from "@/lib/format";

type Accent = "a" | "b";

const accent: Record<Accent, { badge: string; text: string; focus: string }> = {
  a: {
    badge: "bg-offer-a",
    text: "text-offer-a",
    focus: "focus:border-offer-a focus:ring-offer-a/20",
  },
  b: {
    badge: "bg-offer-b",
    text: "text-offer-b",
    focus: "focus:border-offer-b focus:ring-offer-b/20",
  },
};

interface Props {
  form: OfferForm;
  which: Accent;
  onChange: (patch: Partial<OfferForm>) => void;
}

export default function OfferColumn({ form, which, onChange }: Props) {
  const c = accent[which];
  const field = `w-full rounded-md border border-line bg-white px-3 py-2 text-[15px] text-ink outline-none transition focus:ring-2 ${c.focus}`;
  const rentPlaceholder = assumedRent(form).toLocaleString("en-US");

  return (
    <section className="flex flex-col gap-6" aria-label={`${form.label} inputs`}>
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded ${c.badge} font-mono text-sm font-semibold text-paper-raised`}
          aria-hidden
        >
          {which.toUpperCase()}
        </span>
        <input
          value={form.label}
          onChange={(e) => onChange({ label: e.target.value })}
          aria-label="Offer name"
          className={`min-w-0 flex-1 bg-transparent font-display text-lg font-medium ${c.text} outline-none`}
        />
      </div>

      <Group label="Compensation">
        <MoneyField id={`base-${which}`} label="Base salary" value={form.baseSalary} field={field} placeholder="150,000" onChange={(v) => onChange({ baseSalary: v })} />
        <div className="grid grid-cols-2 gap-3">
          <MoneyField id={`bonus-${which}`} label="Bonus / yr" value={form.bonus} field={field} placeholder="15,000" onChange={(v) => onChange({ bonus: v })} />
          <MoneyField id={`equity-${which}`} label="Equity / yr" value={form.equity} field={field} placeholder="20,000" onChange={(v) => onChange({ equity: v })} />
        </div>
        <MoneyField id={`benefits-${which}`} label="Benefits / yr" value={form.benefits} field={field} placeholder="12,000" onChange={(v) => onChange({ benefits: v })} hint="401(k) match, health premiums, etc." />
      </Group>

      <Group label="Work">
        <div className="grid grid-cols-2 gap-3">
          <Labeled id={`commute-${which}`} label="Commute (min)" hint="one-way">
            <input id={`commute-${which}`} type="number" inputMode="numeric" min={0} value={form.commuteMinutes} onChange={(e) => onChange({ commuteMinutes: e.target.value })} className={`${field} font-mono`} placeholder="30" />
          </Labeled>
          <Labeled id={`remote-${which}`} label="Remote days / wk">
            <select id={`remote-${which}`} value={form.remoteDays} onChange={(e) => onChange({ remoteDays: Number(e.target.value) })} className={field}>
              {[0, 1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </Labeled>
        </div>
      </Group>

      <Group label="Location">
        <Labeled id={`city-${which}`} label="City" hint="sets cost of living">
          <select id={`city-${which}`} value={form.city} onChange={(e) => onChange({ city: e.target.value })} className={field}>
            <option value={NATIONAL}>National average</option>
            {CITIES.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
            <option value={CUSTOM}>Custom index…</option>
          </select>
        </Labeled>

        {form.city === CUSTOM && (
          <Labeled id={`idx-${which}`} label="Cost-of-living index" hint="national average = 100">
            <input id={`idx-${which}`} type="number" inputMode="numeric" min={1} value={form.customIndex} onChange={(e) => onChange({ customIndex: e.target.value })} className={`${field} font-mono`} placeholder="100" />
          </Labeled>
        )}

        <MoneyField id={`rent-${which}`} label="Monthly rent" value={form.monthlyRent} field={field} placeholder={rentPlaceholder} onChange={(v) => onChange({ monthlyRent: v })} hint="Leave blank to use the city average" optional />
      </Group>
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">{label}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      {children}
    </div>
  );
}

function Labeled({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline gap-1.5 text-[13px] font-medium text-ink-2">
        {label}
        {hint && <span className="text-[12px] font-normal text-ink-3">· {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function MoneyField({
  id,
  label,
  value,
  onChange,
  field,
  placeholder,
  hint,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  field: string;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
}) {
  return (
    <Labeled id={id} label={label} hint={optional ? "optional" : undefined}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-ink-3">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={formatThousands(value)}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          className={`${field} pl-7 font-mono`}
          placeholder={placeholder}
        />
      </div>
      {hint && <p className="text-[12px] text-ink-3">{hint}</p>}
    </Labeled>
  );
}
