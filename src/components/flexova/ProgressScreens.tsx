/* Pitch-deck inspired screens: Daily Progress, AI Insight, Progress report */
import { useEffect, useRef, useState } from "react";

/** Smoothly animates a number towards its target for fluid updates. */
function useAnimatedNumber(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      setValue(next);
      fromRef.current = next;
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

export function ProgressRing({ value, size = 96 }: { value: number; size?: number }) {
  const animated = useAnimatedNumber(value);
  const shown = Math.round(animated);
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={8} className="stroke-border" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          stroke="var(--primary)"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, animated)) / 100}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-bold">{shown}%</div>
        <div className="text-[9px] text-muted-foreground">Goal</div>
      </div>
    </div>
  );
}

export type DailyStats = {
  workoutDuration: number; // minutes
  caloriesBurned: number;
  stepsCount: number;
  dailyCalorieGoal: number;
  exercisesDone: number;
  exercisesTotal: number;
};

export function DailyProgressCard({ stats }: { stats: DailyStats }) {
  const pct = Math.min(100, Math.round((stats.caloriesBurned / stats.dailyCalorieGoal) * 100));
  const mins = Math.round(useAnimatedNumber(stats.workoutDuration));
  const kcal = Math.round(useAnimatedNumber(stats.caloriesBurned));
  const steps = Math.round(useAnimatedNumber(stats.stepsCount));

  const rows = [
    { label: "Workout", value: `${mins} min` },
    { label: "Calories", value: `${kcal} kcal` },
    { label: "Steps", value: steps.toLocaleString() },
  ];
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Daily Progress</div>
        <div className="text-[10px] text-muted-foreground">Goal {stats.dailyCalorieGoal} kcal</div>
      </div>
      <div className="flex items-center gap-5">
        <ProgressRing value={pct} />
        <div className="flex-1 space-y-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-semibold tabular-nums">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AIInsightCard({ stats }: { stats: DailyStats }) {
  const pct = Math.min(100, Math.round((stats.caloriesBurned / stats.dailyCalorieGoal) * 100));
  const left = Math.max(0, stats.dailyCalorieGoal - stats.caloriesBurned);
  const remaining = Math.max(0, stats.exercisesTotal - stats.exercisesDone);

  let text: React.ReactNode;
  if (stats.exercisesDone === 0) {
    text = (
      <>
        Aaj ka session abhi baaki hai 💤 — <span className="text-primary font-medium">{stats.dailyCalorieGoal} kcal</span>{" "}
        ka target hai. Start Workout dabaa aur pehli exercise nikaal de.
      </>
    );
  } else if (pct >= 100) {
    text = (
      <>
        Beast mode! 🔥 Tune aaj ka poora goal cross kar liya —{" "}
        <span className="text-primary font-medium">{stats.caloriesBurned} kcal</span> burn, {stats.workoutDuration} min
        training. Ab recovery aur hydration pe dhyaan de.
      </>
    );
  } else {
    text = (
      <>
        Badhiya chal raha hai! 🔥 <span className="text-primary font-medium">{pct}% goal</span> complete — {left} kcal
        aur baaki. Bas {remaining || 1} exercise aur, phir aaj ka target done.
      </>
    );
  }

  return (
    <div className="rounded-3xl gradient-card border border-border p-5 shadow-card relative overflow-hidden">
      <div className="absolute -right-6 -bottom-8 h-28 w-28 rounded-full gradient-accent opacity-15 blur-2xl" />
      <div className="flex items-center gap-2">
        <span className="text-lg">🧠</span>
        <span className="text-sm font-semibold">AI Insight</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

/* Monthly analytics — 4 weeks of the current month */
const MONTH_TREND = [
  { label: "W1", v: 58 },
  { label: "W2", v: 66 },
  { label: "W3", v: 72 },
  { label: "W4", v: 85 },
];

const STATS = [
  { label: "Weight", value: "68.5", unit: "kg", delta: "▼ 3.4 kg this month", good: true },
  { label: "Body Fat", value: "14.5", unit: "%", delta: "▼ 2.1% this month", good: true },
  { label: "Muscle Mass", value: "52.1", unit: "kg", delta: "▲ 2.8 kg this month", good: true },
  { label: "BMI", value: "22.4", unit: "", delta: "▼ 1.1 this month", good: true },
];

const ACHIEVEMENTS = [
  { icon: "🔥", title: "7 Day Streak", desc: "Keep it up!" },
  { icon: "🏅", title: "500 kcal Club", desc: "Burned in one session" },
  { icon: "💪", title: "Consistency King", desc: "12 workouts this month" },
];

function MonthlyTrendChart({ data }: { data: { label: string; v: number }[] }) {
  const w = 300;
  const h = 110;
  const pad = 10;
  const max = 100;
  const pts = data.map((d, i) => {
    const x = pad + (i * (w - pad * 2)) / (data.length - 1);
    const y = h - pad - ((h - pad * 2) * d.v) / max;
    return { ...d, x, y };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#trendFill)" />
        <polyline points={line} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3.5} fill="var(--primary)" />
        ))}
      </svg>
      <div className="flex justify-between px-1">
        {data.map((d) => (
          <span key={d.label} className="text-[10px] text-muted-foreground">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function TransformationJourney() {
  const [before, setBefore] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const pick = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
    e.target.value = "";
  };

  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Transformation Journey</div>
      <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { key: "before", label: "Before", src: before, set: setBefore },
              { key: "after", label: "After", src: after, set: setAfter },
            ] as const
          ).map((slot) => (
            <label
              key={slot.key}
              className={`relative aspect-[3/4] rounded-2xl border border-dashed border-border overflow-hidden flex flex-col items-center justify-center text-center ${
                locked ? "cursor-default" : "cursor-pointer"
              }`}
            >
              {slot.src ? (
                <img src={slot.src} alt={`${slot.label} transformation photo`} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <span className="text-2xl">📸</span>
                  <span className="mt-1 text-xs font-semibold">{slot.label}</span>
                  <span className="text-[10px] text-muted-foreground">Tap to upload</span>
                </>
              )}
              <span className="absolute bottom-1 left-1 rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur">
                {slot.label}
              </span>
              {!locked && <input type="file" accept="image/*" className="hidden" onChange={pick(slot.set)} />}
            </label>
          ))}
        </div>

        <button
          onClick={() => setLocked((l) => !l)}
          disabled={!before || !after}
          className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-40 ${
            locked ? "border border-border bg-card text-muted-foreground" : "gradient-accent text-primary-foreground shadow-glow"
          }`}
        >
          {locked ? "🔒 Locked — Tap to unlock" : "Lock Transformation"}
        </button>
        <p className="mt-2 text-[10px] text-muted-foreground text-center">
          Demo only — photos stay on this device session and reset on refresh.
        </p>
      </div>
    </div>
  );
}

export function ProgressScreen() {
  const monthLabel = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  return (
    <div className="space-y-4 animate-rise">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Progress</h2>
        <div className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">{monthLabel}</div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Workout Score</div>
            <div className="text-[10px] text-muted-foreground">Monthly trend</div>
          </div>
          <div className="rounded-lg gradient-accent text-primary-foreground text-xs font-bold px-2 py-0.5">85</div>
        </div>
        <div className="mt-3">
          <MonthlyTrendChart data={MONTH_TREND} />
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Body Stats · Monthly</div>
        <div className="grid grid-cols-2 gap-2">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-3">
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-xl font-bold">
                {s.value}
                <span className="text-xs text-muted-foreground ml-0.5">{s.unit}</span>
              </div>
              <div className="text-[10px] text-primary">{s.delta}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Achievements</div>
        <div className="space-y-2">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-card p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-lg">{a.icon}</div>
              <div>
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-[11px] text-muted-foreground">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransformationJourney />
    </div>
  );
}


export type FeatureKey = "ai" | "nutrition" | "tracking" | "goals";

export function FeatureStrip({ onSelect }: { onSelect?: (k: FeatureKey) => void }) {
  const items: { icon: string; label: string; key: FeatureKey }[] = [
    { icon: "🧠", label: "AI Plans", key: "ai" },
    { icon: "🥗", label: "Nutrition", key: "nutrition" },
    { icon: "📈", label: "Tracking", key: "tracking" },
    { icon: "🏆", label: "Goals", key: "goals" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((i) => (
        <button
          key={i.label}
          onClick={() => onSelect?.(i.key)}
          className="rounded-2xl border border-border bg-card p-2 text-center transition hover:border-primary active:scale-95"
        >
          <div className="text-lg">{i.icon}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{i.label}</div>
        </button>
      ))}
    </div>
  );
}

