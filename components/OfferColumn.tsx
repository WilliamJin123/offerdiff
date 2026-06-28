"use client";

import { CITIES } from "@/lib/col";
import { CUSTOM, NATIONAL, type OfferForm } from "@/lib/form";

type Accent = "indigo" | "amber";

const accentStyles: Record<Accent, { dot: string; ring: string; label: string }> = {
  indigo: {
    dot: "bg-indigo-400",
    ring: "focus:border-indigo-400/70 focus:ring-indigo-400/30",
    label: "text-indigo-300",
  },
  amber: {
    dot: "bg-amber-400",
    ring: "focus:border-amber-400/70 focus:ring-amber-400/30",
    label: "text-amber-300",
  },
};

interface Props {
  form: OfferForm;
  accent: Accent;
  onChange: (patch: Partial<OfferForm>) => void;
}

export default function OfferColumn({ form, accent, onChange }: Props) {
  const a = accentStyles[accent];

  const fieldClass = `w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-100 outline-none transition focus:ring-2 ${a.ring}`;

  return (
    <section
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
      aria-label={`${form.label} inputs`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${a.dot}`} aria-hidden />
        <input
          value={form.label}
          onChange={(e) => onChange({ label: e.target.value })}
          aria-label="Offer name"
          className={`bg-transparent text-lg font-semibold ${a.label} outline-none`}
        />
      </div>

      <MoneyField
        id={`base-${accent}`}
        label="Base salary"
        value={form.baseSalary}
        onChange={(v) => onChange({ baseSalary: v })}
        className={fieldClass}
        placeholder="150,000"
      />
      <div className="grid grid-cols-2 gap-3">
        <MoneyField
          id={`bonus-${accent}`}
          label="Annual bonus"
          value={form.bonus}
          onChange={(v) => onChange({ bonus: v })}
          className={fieldClass}
          placeholder="15,000"
        />
        <MoneyField
          id={`equity-${accent}`}
          label="Equity / yr"
          value={form.equity}
          onChange={(v) => onChange({ equity: v })}
          className={fieldClass}
          placeholder="20,000"
          hint="Vesting value per year"
        />
      </div>

      <MoneyField
        id={`benefits-${accent}`}
        label="Benefits / yr"
        value={form.benefits}
        onChange={(v) => onChange({ benefits: v })}
        className={fieldClass}
        placeholder="12,000"
        hint="401(k) match, health premium coverage, etc."
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`commute-${accent}`} className="text-sm font-medium text-slate-300">
            Commute (min, one-way)
          </label>
          <input
            id={`commute-${accent}`}
            type="number"
            inputMode="numeric"
            min={0}
            value={form.commuteMinutes}
            onChange={(e) => onChange({ commuteMinutes: e.target.value })}
            className={fieldClass}
            placeholder="30"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`remote-${accent}`} className="text-sm font-medium text-slate-300">
            Remote days / week
          </label>
          <select
            id={`remote-${accent}`}
            value={form.remoteDays}
            onChange={(e) => onChange({ remoteDays: Number(e.target.value) })}
            className={fieldClass}
          >
            {[0, 1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d} className="bg-slate-900">
                {d} {d === 1 ? "day" : "days"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`city-${accent}`} className="text-sm font-medium text-slate-300">
          City <span className="text-slate-500">(cost of living)</span>
        </label>
        <select
          id={`city-${accent}`}
          value={form.city}
          onChange={(e) => onChange({ city: e.target.value })}
          className={fieldClass}
        >
          <option value={NATIONAL} className="bg-slate-900">
            National average
          </option>
          {CITIES.map((c) => (
            <option key={c.name} value={c.name} className="bg-slate-900">
              {c.name}
            </option>
          ))}
          <option value={CUSTOM} className="bg-slate-900">
            Custom index…
          </option>
        </select>
        {form.city === CUSTOM && (
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={form.customIndex}
            onChange={(e) => onChange({ customIndex: e.target.value })}
            className={`${fieldClass} mt-1`}
            placeholder="Cost-of-living index (national avg = 100)"
            aria-label="Custom cost-of-living index"
          />
        )}
      </div>
    </section>
  );
}

function MoneyField({
  id,
  label,
  value,
  onChange,
  className,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  className: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${className} pl-7`}
          placeholder={placeholder}
        />
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
