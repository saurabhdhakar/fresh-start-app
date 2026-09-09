import { useState } from "react";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { HistoryStrip, Trackers } from "./Trackers";
import { AIPlansPanel, TrackingPanel, GoalsPanel } from "./QuickPanels";
import { DailyProgressCard, AIInsightCard, ProgressScreen, FeatureStrip, type DailyStats } from "./ProgressScreens";
import { NutritionScreen } from "./NutritionScreen";
import { HydrationChallenges } from "./HydrationChallenges";
import { FlexovaPremium } from "./FlexovaPremium";
import { AdBanner } from "./AdBanner";
import { DEFAULT_PRICING, type Pricing } from "@/lib/geo";
import type { WorkoutPlan } from "./data";
import { FEMALE_CATEGORIES } from "./data";

type Tab = "home" | "track" | "diet" | "progress" | "scan" | "plus";

export function Dashboard({
  gender,
  goalLabel,
  goalId,
  plan,
  stats,
  weekDone,
  weekPeriod,
  isPremium,
  cyclePhase,
  onStart,
  onOpenScanner,
  onOpenSub,
  onOpenAccount,
  photo,

  onSelectGoal,
  onPeriodMode,
  tab,
  onTab,
  extraBanner,
  pricing = DEFAULT_PRICING,
}: {
  gender: "male" | "female";
  goalLabel: string;
  goalId?: string | null;
  plan: WorkoutPlan;
  stats: DailyStats;
  weekDone?: boolean[];
  weekPeriod?: boolean[];
  isPremium?: boolean;
  cyclePhase?: "early" | "mid" | "late" | null;
  onStart: () => void;
  onOpenScanner: () => void;
  onOpenSub: () => void;
  onOpenAccount: () => void;
  photo?: string | null;

  onSelectGoal: (id: string) => void;
  onPeriodMode: () => void;
  tab: Tab;
  onTab: (t: Tab) => void;
  extraBanner?: React.ReactNode;
  pricing?: Pricing;
}) {
  const { t } = useI18n();
  const [panel, setPanel] = useState<null | "ai" | "tracking" | "goals">(null);
  const intensity: "rest" | "light" | "high" =
    stats.exercisesDone === 0 ? "rest" : stats.caloriesBurned >= stats.dailyCalorieGoal * 0.6 ? "high" : "light";

  return (
    <div className="pb-24">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">{t("dash.greet")}</div>
            <div className="font-bold text-lg">{gender === "male" ? t("dash.champ") : t("dash.queen")}</div>
          </div>
          <button
            onClick={onOpenAccount}
            aria-label={t("dash.account")}
            className="h-10 w-10 rounded-full border border-border bg-card overflow-hidden flex items-center justify-center text-base"
          >
            {photo ? <img src={photo} alt="Profile" className="h-full w-full object-cover" /> : gender === "male" ? "🧔" : "👩"}
          </button>

        </div>
      </div>

      {tab === "home" && (
        <div className="px-5 mt-5 space-y-4 animate-rise">
          {extraBanner}
          <div className="rounded-3xl gradient-card border border-border p-5 shadow-card relative overflow-hidden">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full gradient-accent opacity-20 blur-2xl" />
            <div className="text-xs uppercase tracking-widest text-primary">{goalLabel}</div>
            <h2 className="mt-1 text-2xl font-bold">{plan.title}</h2>
            <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
            <div className="mt-4 flex gap-4 text-xs">
              <Mini label="⏱" value={plan.duration} />
              <Mini label="🔥" value={plan.calories} />
              <Mini label="💪" value={`${plan.exercises.length} ${t("dash.exercises")}`} />
            </div>
            <button onClick={onStart} className="mt-5 w-full rounded-xl gradient-accent text-primary-foreground font-semibold py-3 shadow-glow">
              {t("dash.start")}
            </button>
          </div>

          {gender === "female" && (
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{t("dash.categories")}</div>
              <div className="grid grid-cols-2 gap-2">
                {FEMALE_CATEGORIES.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-border bg-card p-3">
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="mt-1 text-sm font-semibold">{t(`cat.${c.id}` as TranslationKey)}</div>
                    <div className="text-[11px] text-muted-foreground">{t(`cat.${c.id}.desc` as TranslationKey)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FeatureStrip
            onSelect={(k) => {
              if (k === "nutrition") onTab("diet");
              else setPanel(k);
            }}
          />
          <DailyProgressCard stats={stats} />
          {!isPremium && <AdBanner onOpenSub={onOpenSub} />}
          <AIInsightCard stats={stats} />
          <HistoryStrip weekDone={weekDone} weekPeriod={weekPeriod} />

        </div>
      )}

      {tab === "track" && (
        <div className="px-5 mt-5 animate-rise">
          <h2 className="text-xl font-bold">{t("dash.trackers")}</h2>
          <p className="text-xs text-muted-foreground mb-4">{t("dash.trackersNote")}</p>
          <div className="space-y-4">
            <HydrationChallenges isPremium={Boolean(isPremium)} onOpenSub={onOpenSub} pricing={pricing} />
            <Trackers />
          </div>
        </div>
      )}

      {tab === "diet" && (
        <div className="px-5 mt-5">
          <NutritionScreen
            isPremium={Boolean(isPremium)}
            goalLabel={goalLabel}
            goalId={goalId ?? null}
            intensity={intensity}
            cyclePhase={cyclePhase ?? null}
            onOpenSub={onOpenSub}
          />
        </div>
      )}

      {tab === "progress" && (
        <div className="px-5 mt-5">
          <ProgressScreen />
        </div>
      )}

      {tab === "scan" && (
        <div className="px-5 mt-5">
          <button onClick={onOpenScanner} className="w-full rounded-3xl gradient-card border border-border p-6 text-left shadow-card">
            <div className="text-3xl">📷</div>
            <div className="mt-2 font-bold">{t("dash.openScanner")}</div>
            <div className="text-xs text-muted-foreground">{t("dash.openScannerDesc")}</div>
          </button>
        </div>
      )}

      {tab === "plus" && (
        <div className="px-5 mt-5">
          <FlexovaPremium isPremium={Boolean(isPremium)} gender={gender} onOpenSub={onOpenSub} />
        </div>
      )}

      {panel === "ai" && (
        <AIPlansPanel
          gender={gender}
          goalId={goalId ?? null}
          onSelectGoal={onSelectGoal}
          onPeriodMode={onPeriodMode}
          onClose={() => setPanel(null)}
        />
      )}
      {panel === "tracking" && <TrackingPanel onClose={() => setPanel(null)} />}
      {panel === "goals" && <GoalsPanel onClose={() => setPanel(null)} />}

      <BottomNav tab={tab} onTab={onTab} />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span>{label}</span>
      <span className="text-foreground/90 font-medium">{value}</span>
    </div>
  );
}


function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const { t } = useI18n();
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: t("nav.home"), icon: "🏠" },
    { id: "track", label: t("nav.track"), icon: "📊" },
    { id: "progress", label: t("nav.progress"), icon: "📈" },

    { id: "scan", label: t("nav.scan"), icon: "📷" },
    { id: "plus", label: t("nav.plus"), icon: "👑" },
  ];
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-3 z-30">
      <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-card px-2 py-2 flex justify-around">
        {items.map((i) => {
          const active = tab === i.id;
          return (
            <button
              key={i.id}
              onClick={() => onTab(i.id)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-[9px] font-semibold transition ${
                active ? "gradient-accent text-primary-foreground shadow-glow" : "text-muted-foreground"
              }`}
            >
              <span className="text-base">{i.icon}</span>
              {i.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
