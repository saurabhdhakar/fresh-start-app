import { useState } from "react";

type Feature = {
  no: string;
  emoji: string;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  { no: "01", emoji: "🩹", title: "Smart Injury Mode", desc: "Auto-swaps unsafe moves around your injury." },
  { no: "02", emoji: "📷", title: "AI Calorie Scanner", desc: "Snap a meal, get instant macros." },
  { no: "03", emoji: "🥗", title: "Goal-Based Diet Engine", desc: "Filters every meal by goal, intensity, allergies, cuisine and budget — rebuilt daily." },
  { no: "04", emoji: "💃", title: "Female Sculpting Program", desc: "Cycle-aware sculpt & tone plans." },
  { no: "05", emoji: "💧", title: "Animated Hydration Tracker", desc: "Live wave rings + smart reminders." },
];

/** Simulated admin-panel parameters — future API routed */
type PaywallConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  actionLabel: string;
};

export function FlexovaPremium({
  isPremium = false,
  onOpenSub,
}: {
  isPremium?: boolean;
  onOpenSub: () => void;
}) {
  const [config] = useState<PaywallConfig>({
    eyebrow: "Membership",
    title: "Flexova Premium",
    subtitle: "Unlock the full coaching matrix — AI, diet engine and zero ads.",
    actionLabel: "Start 7-day trial",
  });

  const [f1, f2, f3, f4, f5] = FEATURES;

  return (
    <div className="space-y-3 animate-rise">
      {!isPremium && (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-xl p-5 shadow-card">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full gradient-accent opacity-20 blur-3xl" />
          <div className="text-[10px] uppercase tracking-widest text-primary">{config.eyebrow}</div>
          <h2 className="mt-1 text-2xl font-bold">{config.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{config.subtitle}</p>
          <button
            onClick={onOpenSub}
            className="mt-4 w-full rounded-xl gradient-accent text-primary-foreground font-semibold py-3 shadow-glow"
          >
            {config.actionLabel}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Feature matrix</div>
        <div className="text-[10px] uppercase tracking-widest text-primary">
          {isPremium ? "All unlocked" : "5 locked tools"}
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
        <div className={`${wide ? "" : "mt-2"} font-semibold text-sm pr-6`}>{feature.title}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5 pr-6">{feature.desc}</div>
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
