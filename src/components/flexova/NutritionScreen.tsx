/* Nutrition screen with freemium logic.
   Free  -> fixed "Simple Indian Meals" plan + locked premium features (preview only)
   Premium -> fully customized diet synced with goal, workout intensity & cycle phase */
import { useState } from "react";

type Meal = { time: string; emoji: string; title: string; items: string; kcal: number };

const FREE_PLAN: Meal[] = [
  { time: "7:30 AM", emoji: "🥛", title: "Breakfast", items: "2 roti + sabzi + 1 glass milk", kcal: 420 },
  { time: "11:00 AM", emoji: "🍎", title: "Mid-morning", items: "1 apple + 5 almonds", kcal: 160 },
  { time: "1:30 PM", emoji: "🍛", title: "Lunch", items: "Rice + dal + curd + salad", kcal: 560 },
  { time: "5:00 PM", emoji: "🍵", title: "Snack", items: "Roasted chana + green tea", kcal: 180 },
  { time: "8:30 PM", emoji: "🥗", title: "Dinner", items: "2 roti + paneer/veg sabzi", kcal: 480 },
];

const LOCKED_FEATURES = [
  { icon: "🎯", title: "Customized Goal Diet", desc: "Macros auto-tuned for Weight Gain / Weight Loss" },
  { icon: "💪", title: "Post-Workout Tailored Meals", desc: "Recovery meals based on today's workout intensity" },
  { icon: "🌸", title: "Cycle-Phase Nutrition", desc: "Iron & comfort foods for your period phase" },
  { icon: "🧠", title: "AI Meal Swaps", desc: "Unlimited swaps with live calorie balancing" },
];

function buildPremiumPlan(opts: {
  goalLabel: string;
  isGain: boolean;
  intensity: "rest" | "light" | "high";
  cyclePhase: "early" | "mid" | "late" | null;
}): { meals: Meal[]; target: number; protein: number } {
  const base = opts.isGain ? 2650 : 1750;
  const bump = opts.intensity === "high" ? 250 : opts.intensity === "light" ? 100 : 0;
  const target = base + bump;
  const protein = Math.round((opts.isGain ? 1.8 : 1.6) * 68);

  const meals: Meal[] = [
    {
      time: "7:30 AM",
      emoji: "🍳",
      title: "Breakfast",
      items: opts.isGain
        ? "4 egg whites + 2 paratha (ghee) + banana shake"
        : "Oats upma + 2 egg whites + green tea",
      kcal: opts.isGain ? 720 : 380,
    },
    {
      time: "11:00 AM",
      emoji: "🥜",
      title: "Mid-morning",
      items: opts.isGain ? "Peanut butter toast + dry fruits" : "Sprouts chaat + lemon water",
      kcal: opts.isGain ? 380 : 190,
    },
    {
      time: "1:30 PM",
      emoji: "🍛",
      title: "Lunch",
      items: opts.isGain
        ? "2 cup rice + rajma + chicken/paneer + curd"
        : "1 cup brown rice + dal + grilled paneer + salad",
      kcal: opts.isGain ? 820 : 520,
    },
    {
      time: opts.intensity === "rest" ? "5:00 PM" : "Post-workout",
      emoji: opts.intensity === "rest" ? "🍵" : "🥤",
      title: opts.intensity === "rest" ? "Evening Snack" : "Post-Workout Meal",
      items:
        opts.intensity === "high"
          ? "Whey + banana + 4 dates (fast carbs for high-intensity day)"
          : opts.intensity === "light"
            ? "Curd bowl + jaggery + soaked raisins"
            : "Roasted makhana + green tea",
      kcal: opts.intensity === "high" ? 420 : opts.intensity === "light" ? 260 : 170,
    },
    {
      time: "8:30 PM",
      emoji: "🥗",
      title: "Dinner",
      items: opts.isGain
        ? "3 roti + soya/chicken curry + veggies"
        : "2 roti + grilled veggies + clear soup",
      kcal: opts.isGain ? 640 : 430,
    },
  ];

  if (opts.cyclePhase) {
    meals.push({
      time: "10:00 PM",
      emoji: "🌸",
      title: opts.cyclePhase === "early" ? "Cycle Care (Day 1-3)" : "Cycle Care",
      items:
        opts.cyclePhase === "early"
          ? "Iron-rich: beetroot juice + dates + haldi doodh (cramp relief)"
          : "Magnesium boost: dark chocolate + pumpkin seeds + warm milk",
      kcal: 220,
    });
  }

  return { meals, target, protein };
}

export function NutritionScreen({
  isPremium,
  goalLabel,
  goalId,
  intensity,
  cyclePhase,
  onOpenSub,
}: {
  isPremium: boolean;
  goalLabel: string;
  goalId: string | null;
  intensity: "rest" | "light" | "high";
  cyclePhase: "early" | "mid" | "late" | null;
  onOpenSub: () => void;
}) {
  const [preview, setPreview] = useState(false);
  const isGain = !!goalId && /gain|muscle|bulk|strength/i.test(goalId);
  const premium = buildPremiumPlan({ goalLabel, isGain, intensity, cyclePhase });
  const showPremium = isPremium || preview;

  const freeTotal = FREE_PLAN.reduce((s, m) => s + m.kcal, 0);
  const meals = showPremium ? premium.meals : FREE_PLAN;
  const total = showPremium ? meals.reduce((s, m) => s + m.kcal, 0) : freeTotal;

  return (
    <div className="space-y-4 animate-rise">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Nutrition</h2>
        <div
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
            isPremium ? "gradient-accent text-primary-foreground shadow-glow" : "border border-border bg-card text-muted-foreground"
          }`}
        >
          {isPremium ? "👑 Premium" : "Free plan"}
        </div>
      </div>

      {preview && !isPremium && (
        <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3 text-xs flex items-center justify-between gap-2">
          <span>👀 Premium preview — sample data only</span>
          <button onClick={() => setPreview(false)} className="font-semibold text-primary">
            Exit
          </button>
        </div>
      )}

      <div className="rounded-3xl gradient-card border border-border p-5 shadow-card relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full gradient-accent opacity-20 blur-2xl" />
        <div className="text-xs uppercase tracking-widest text-primary">
          {showPremium ? goalLabel : "Simple Indian Meals"}
        </div>
        <h3 className="mt-1 text-xl font-bold">
          {showPremium ? "Your Customized Diet" : "Standard Healthy Plan"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {showPremium
            ? `Synced with ${isGain ? "Weight Gain" : "Weight Loss"} • ${
                intensity === "high" ? "High intensity day" : intensity === "light" ? "Light day" : "Rest day"
              }${cyclePhase ? " • Cycle phase" : ""}`
            : "Same plan for everyone — upgrade for a personalised one"}
        </p>
        <div className="mt-4 flex gap-4 text-xs">
          <span>
            🔥 <span className="font-medium">{total} kcal</span>
          </span>
          <span>
            🎯 <span className="font-medium">{showPremium ? `${premium.target} target` : "2000 target"}</span>
          </span>
          <span>
            🥚 <span className="font-medium">{showPremium ? `${premium.protein}g protein` : "~60g protein"}</span>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {meals.map((m) => (
          <div key={m.time + m.title} className="rounded-2xl border border-border bg-card p-3 flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-lg shrink-0">
              {m.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{m.title}</div>
                <div className="text-[10px] text-muted-foreground">{m.time}</div>
              </div>
              <div className="text-[11px] text-muted-foreground">{m.items}</div>
              <div className="mt-0.5 text-[10px] text-primary font-semibold">{m.kcal} kcal</div>
            </div>
          </div>
        ))}
      </div>

      {!isPremium && (
        <>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Premium features</div>
          <div className="space-y-2">
            {LOCKED_FEATURES.map((f) => (
              <button
                key={f.title}
                onClick={onOpenSub}
                className="w-full rounded-2xl border border-border bg-card p-3 flex items-center gap-3 text-left relative overflow-hidden"
              >
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-lg opacity-60">
                  {f.icon}
                </div>
                <div className="flex-1 opacity-60">
                  <div className="text-sm font-semibold">{f.title}</div>
                  <div className="text-[11px] text-muted-foreground">{f.desc}</div>
                </div>
                <span className="text-lg">🔒</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPreview((p) => !p)}
              className="rounded-2xl border border-border bg-card p-3 text-sm font-semibold"
            >
              {preview ? "Back to Free" : "👀 Preview Premium"}
            </button>
            <button
              onClick={onOpenSub}
              className="rounded-2xl gradient-accent text-primary-foreground p-3 text-sm font-semibold shadow-glow"
            >
              👑 Unlock Premium
            </button>
          </div>
        </>
      )}

      {isPremium && (
        <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3 text-xs">
          ✅ Auto-sync on — meals update with your goal, daily workout intensity{cyclePhase ? " and cycle phase" : ""}.
        </div>
      )}
    </div>
  );
}
