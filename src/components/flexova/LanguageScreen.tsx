import { useEffect } from "react";
import { Check } from "lucide-react";
import { languagesForCountry } from "./countries";
import { useI18n } from "@/lib/i18n";

export function LanguageScreen({
  countryCode,
  value,
  onSelect,
  onContinue,
  onBack,
  standalone,
}: {
  countryCode: string | null;
  value: string;
  onSelect: (v: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  standalone?: boolean;
}) {
  const { t } = useI18n();
  const options = languagesForCountry(countryCode);

  // Keep the selection valid for the chosen country
  useEffect(() => {
    if (!options.some((o) => o.id === value)) onSelect(options[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col px-6 pt-4 pb-8 animate-rise">
      {onBack && (
        <button onClick={onBack} className="mb-4 self-start text-sm text-muted-foreground">
          ← {t("common.back")}
        </button>
      )}
      <h1 className="text-2xl font-bold">{t("lang.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("lang.subtitle")}</p>

      <div className="mt-5 flex-1 space-y-2.5 overflow-y-auto">
        {options.map((l) => {
          const active = value === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onSelect(l.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left transition ${
                active ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-xl">{l.flag}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{l.label}</div>
                <div className="text-xs text-muted-foreground">{l.note}</div>
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
        onClick={onContinue}
        className="mt-6 w-full rounded-2xl gradient-accent py-4 font-semibold text-primary-foreground shadow-glow"
      >
        {standalone ? t("common.save") : t("common.continue")}
      </button>
    </div>
  );
}
