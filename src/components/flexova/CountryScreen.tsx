import { useMemo, useState } from "react";
import { Search, Check } from "lucide-react";
import { COUNTRIES } from "./countries";
import { useI18n } from "@/lib/i18n";
import type { ClimateLocation } from "@/lib/geo";

export function CountryScreen({
  value,
  onSelect,
  onContinue,
  detected,
}: {
  value: string | null;
  onSelect: (code: string) => void;
  onContinue: () => void;
  detected?: ClimateLocation | null;
}) {
  const { t } = useI18n();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(needle) || c.native.toLowerCase().includes(needle) || c.code.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col px-6 pt-4 pb-8 animate-rise">
      <h1 className="text-2xl font-bold">{t("country.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("country.subtitle")}</p>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("country.search")}
          className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-primary"
        />
      </div>

      {detected?.countryName && (
        <p className="mt-3 text-[11px] text-muted-foreground">
          {t("country.detected")}: <span className="text-primary">{detected.countryName}</span>
        </p>
      )}

      <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto">
        {list.map((c) => {
          const active = value === c.code;
          return (
            <button
              key={c.code}
              onClick={() => onSelect(c.code)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left transition ${
                active ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-xl">{c.flag}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.native}</div>
              </div>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {active && <Check className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>

      <button
        disabled={!value}
        onClick={onContinue}
        className="mt-6 w-full rounded-2xl gradient-accent py-4 font-semibold text-primary-foreground shadow-glow transition disabled:opacity-40 disabled:shadow-none"
      >
        {t("common.continue")}
      </button>
    </div>
  );
}
