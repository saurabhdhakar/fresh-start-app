import { useState } from "react";
import { useI18n, type TranslationKey } from "@/lib/i18n";

type Feature = {
  no: string;
  emoji: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
};

const FEATURES: Feature[] = [
  { no: "01", emoji: "🩹", titleKey: "prem.f1.title", descKey: "prem.f1.desc" },
  { no: "02", emoji: "📷", titleKey: "prem.f2.title", descKey: "prem.f2.desc" },
  { no: "03", emoji: "🥗", titleKey: "prem.f3.title", descKey: "prem.f3.desc" },
  { no: "04", emoji: "💃", titleKey: "prem.f4.title", descKey: "prem.f4.desc" },
  { no: "05", emoji: "💧", titleKey: "prem.f5.title", descKey: "prem.f5.desc" },
];

/** Simulated admin-panel parameters — future API routed */
type PaywallConfig = {
  eyebrowKey: TranslationKey;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  actionLabelKey: TranslationKey;
};

const MALE_04: Feature = {
  no: "04",
  emoji: "🏋️",
  titleKey: "prem.f4m.title",
  descKey: "prem.f4m.desc",
};

export function FlexovaPremium({
  isPremium = false,
  gender = "female",
  onOpenSub,
}: {
  isPremium?: boolean;
  gender?: "male" | "female";
  onOpenSub: () => void;
}) {
  const { t } = useI18n();
  const [config] = useState<PaywallConfig>({
    eyebrowKey: "prem.eyebrow",
    titleKey: "prem.title",
    subtitleKey: "prem.subtitle",
    actionLabelKey: "prem.cta",
  });

  const [f1, f2, f3, femaleF4, f5] = FEATURES;
  const f4 = gender === "male" ? MALE_04 : femaleF4;

  return (
    <div className="space-y-3 animate-rise">
      {!isPremium && (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-xl p-5 shadow-card">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full gradient-accent opacity-20 blur-3xl" />
          <div className="text-[10px] uppercase tracking-widest text-primary">{t(config.eyebrowKey)}</div>
          <h2 className="mt-1 text-2xl font-bold">{t(config.titleKey)}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t(config.subtitleKey)}</p>
          <button
            onClick={onOpenSub}
            className="mt-4 w-full rounded-xl gradient-accent text-primary-foreground font-semibold py-3 shadow-glow"
          >
            {t(config.actionLabelKey)}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("prem.matrix")}</div>
        <div className="text-[10px] uppercase tracking-widest text-primary">
          {isPremium ? t("prem.allUnlocked") : t("prem.locked")}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Module feature={f1} isPremium={isPremium} onClick={onOpenSub} />
        <Module feature={f2} isPremium={isPremium} onClick={onOpenSub} />
      </div>

      <Module feature={f3} isPremium={isPremium} onClick={onOpenSub} wide />

      <div className="grid grid-cols-2 gap-3">
        <Module feature={f4} isPremium={isPremium} onClick={onOpenSub} />
        <Module feature={f5} isPremium={isPremium} onClick={onOpenSub} />
      </div>
    </div>
  );
}

function Module({
  feature,
  isPremium,
  wide,
  onClick,
}: {
  feature: Feature;
  isPremium: boolean;
  wide?: boolean;
  onClick: () => void;
}) {
  const { t } = useI18n();
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
        isPremium ? "border-primary/40 gradient-card shadow-glow" : "border-border bg-card hover:border-primary/50"
      } ${wide ? "w-full flex items-center gap-4" : ""}`}
    >
      <div className={wide ? "shrink-0" : ""}>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">No.{feature.no}</div>
        <div className={`mt-1 ${wide ? "text-4xl" : "text-2xl"}`}>{feature.emoji}</div>
      </div>
      <div className={wide ? "min-w-0" : ""}>
        <div className={`${wide ? "" : "mt-2"} font-semibold text-sm pr-6`}>{t(feature.titleKey)}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5 pr-6">{t(feature.descKey)}</div>
      </div>

      <span
        className={`absolute right-3 top-3 h-6 w-6 rounded-full flex items-center justify-center text-[11px] backdrop-blur-md ${
          isPremium ? "bg-primary/20 text-primary" : "bg-muted/60 text-muted-foreground"
        }`}
        aria-hidden
      >
        {isPremium ? "✓" : "🔒"}
      </span>
    </button>
  );
}
