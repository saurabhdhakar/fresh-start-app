import { DEFAULT_PRICING, type Pricing } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";

export function Subscription({
  onExit,
  isPremium = false,
  onSubscribe,
  pricing = DEFAULT_PRICING,
}: {
  onExit: () => void;
  isPremium?: boolean;
  onSubscribe?: () => void;
  pricing?: Pricing;
}) {
  const { t } = useI18n();
  return (
    <div className="px-5 pt-4 pb-24 animate-rise">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-muted-foreground">← Back</button>
        <div className="text-xs uppercase tracking-widest text-primary">Membership</div>
        <span className="w-8" />
      </div>

      <div className="mt-6 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl gradient-accent shadow-glow flex items-center justify-center text-2xl">👑</div>
        <h2 className="mt-4 text-2xl font-bold">{t("sub.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("sub.subtitle")}</p>
      </div>

      <div className="mt-6 space-y-4">
        <PlanCard
          title="Free"
          price={pricing.free}
          tag={isPremium ? "Downgraded" : "Current plan"}
          features={["Basic workouts", "Basic trackers", "Ads shown"]}
          cta={isPremium ? "Free plan" : "You're on Free"}
          disabled
        />
        <PlanCard
          title="Premium"
          price={pricing.monthly}
          period={t("sub.month")}
          highlight
          tag={isPremium ? "Active" : "Most popular"}
          features={[
            "Advanced workout customization",
            "AI features (coach & recovery)",
            "No ads, ever",
            "Priority calorie scanner",
            "Detailed analytics",
          ]}
          cta={isPremium ? "✓ Premium active" : "Start 7-day trial"}
          disabled={isPremium}
          onClick={onSubscribe}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/40 p-4 text-center">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sponsored</div>
        <div className="mt-1 text-sm font-medium">Ads placeholder — hidden on Premium</div>
      </div>
    </div>
  );
}

function PlanCard({
  title, price, period, features, cta, highlight, disabled, tag, onClick,
}: {
  title: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  disabled?: boolean;
  tag?: string;
  onClick?: () => void;
}) {
  return (
    <div className={`rounded-3xl border p-5 ${highlight ? "border-primary shadow-glow gradient-card" : "border-border bg-card"}`}>
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-sm uppercase tracking-widest text-muted-foreground">{title}</div>
          <div className="mt-1 text-3xl font-bold">
            {price}<span className="text-sm text-muted-foreground font-normal">{period}</span>
          </div>
        </div>
        {tag && <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${highlight ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{tag}</span>}
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${highlight ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold transition ${
          disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "gradient-accent text-primary-foreground"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
