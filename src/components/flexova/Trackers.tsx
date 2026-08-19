import { useState } from "react";

/* Waterlama-inspired fluid trackers */

function FluidRing({
  percent,
  size = 220,
  centerTop,
  centerMain,
  centerSub,
  tint = "primary",
}: {
  percent: number;
  size?: number;
  centerTop: string;
  centerMain: string;
  centerSub: string;
  tint?: "primary" | "accent";
}) {
  const p = Math.max(0, Math.min(100, percent));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const inner = size - stroke * 2 - 10;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* progress ring */}
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-border" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          stroke={tint === "primary" ? "var(--primary)" : "var(--accent)"}
          strokeDasharray={c}
          strokeDashoffset={c - (c * p) / 100}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>

      {/* fluid glass */}
      <div
        className="absolute rounded-full overflow-hidden shadow-glow"
        style={{
          width: inner,
          height: inner,
          left: (size - inner) / 2,
          top: (size - inner) / 2,
          background: "color-mix(in oklab, var(--surface-2) 80%, transparent)",
        }}
      >
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: `${p}%`, transition: "height 0.9s cubic-bezier(.22,1,.36,1)" }}
        >
          {/* waves */}
          <div className="absolute -top-3 left-0 w-[200%] h-6 animate-wave-slow opacity-80">
            <Wave />
          </div>
          <div className="absolute -top-2 left-0 w-[200%] h-6 animate-wave-fast opacity-60">
            <Wave />
          </div>
          <div className="absolute inset-0 gradient-accent opacity-90" />
          <div className="absolute inset-0 animate-shine" />
        </div>

        {/* bubbles */}
        <span className="absolute left-[28%] bottom-2 h-1.5 w-1.5 rounded-full bg-background/40 animate-bubble" />
        <span className="absolute left-[55%] bottom-2 h-2 w-2 rounded-full bg-background/30 animate-bubble [animation-delay:1.1s]" />
        <span className="absolute left-[74%] bottom-2 h-1 w-1 rounded-full bg-background/40 animate-bubble [animation-delay:2.2s]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[10px] uppercase tracking-widest text-foreground/70">{centerTop}</div>
          <div className="text-3xl font-bold drop-shadow">{centerMain}</div>
          <div className="text-[11px] text-foreground/70">{centerSub}</div>
        </div>
      </div>
    </div>
  );
}

function Wave() {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-full">
      <path
        d="M0 20 Q 25 4 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 V 40 H 0 Z"
        fill="var(--primary)"
      />
    </svg>
  );
}

export function Trackers() {
  const [water, setWater] = useState(4);
  const [protein, setProtein] = useState(78);
  const [weight, setWeight] = useState(72.4);

  const waterPct = (water / 8) * 100;
  const proteinPct = Math.min(100, (protein / 140) * 100);

  return (
    <div className="space-y-4">
      {/* WATER */}
      <div className="rounded-[2rem] gradient-card border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Hydration</div>
            <div className="text-sm font-semibold">Stay topped up 💧</div>
          </div>
          <div className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-semibold">
            {Math.round(waterPct)}%
          </div>
        </div>

        <FluidRing
          percent={waterPct}
          centerTop="Water"
          centerMain={`${(water * 0.25).toFixed(2)}L`}
          centerSub={`${water} / 8 glasses`}
        />

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setWater((w) => Math.max(0, w - 1))}
            className="h-11 w-11 rounded-full border border-border bg-background/40 text-lg font-bold active:scale-95 transition"
            aria-label="Remove a glass"
          >
            −
          </button>
          <button
            onClick={() => setWater((w) => Math.min(8, w + 1))}
            className="flex-1 rounded-full gradient-accent text-primary-foreground py-3 text-sm font-bold shadow-glow active:scale-[0.98] transition"
          >
            + Add a glass
          </button>
          <button
            onClick={() => setWater(0)}
            className="h-11 w-11 rounded-full border border-border bg-background/40 text-xs font-semibold active:scale-95 transition"
            aria-label="Reset water"
          >
            ↺
          </button>
        </div>

        <div className="mt-4 flex gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWater(i + 1 === water ? i : i + 1)}
              aria-label={`Set ${i + 1} glasses`}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < water ? "gradient-accent" : "bg-background/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* PROTEIN */}
      <div className="rounded-[2rem] gradient-card border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Protein</div>
            <div className="text-sm font-semibold">Fuel the muscle 🥩</div>
          </div>
          <div className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-semibold">
            {Math.round(proteinPct)}%
          </div>
        </div>

        <FluidRing
          percent={proteinPct}
          size={200}
          centerTop="Protein"
          centerMain={`${protein}g`}
          centerSub="of 140g goal"
        />

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[10, 25, 40].map((v) => (
            <button
              key={v}
              onClick={() => setProtein((p) => Math.min(200, p + v))}
              className="rounded-full border border-border bg-background/40 py-2.5 text-xs font-bold active:scale-95 transition"
            >
              +{v}g
            </button>
          ))}
        </div>
        <button
          onClick={() => setProtein(0)}
          className="mt-2 w-full rounded-full border border-border py-2 text-[11px] font-semibold text-muted-foreground active:scale-[0.98] transition"
        >
          Reset day
        </button>
      </div>

      {/* WEIGHT */}
      <div className="rounded-[2rem] border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Weight</div>
            <div className="mt-1 text-2xl font-bold">
              {weight.toFixed(1)}
              <span className="text-sm text-muted-foreground"> kg</span>
            </div>
          </div>
          <div className="text-3xl">⚖️</div>
        </div>
        <MiniChart />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setWeight((w) => +(w - 0.1).toFixed(1))}
            className="flex-1 rounded-full border border-border py-2 text-xs font-semibold active:scale-95 transition"
          >
            -0.1
          </button>
          <button
            onClick={() => setWeight((w) => +(w + 0.1).toFixed(1))}
            className="flex-1 rounded-full border border-border py-2 text-xs font-semibold active:scale-95 transition"
          >
            +0.1
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniChart() {
  const points = [74.2, 73.8, 73.5, 73.1, 72.9, 72.6, 72.4];
  const max = Math.max(...points),
    min = Math.min(...points);
  const w = 280,
    h = 60;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full h-16">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" className="text-primary" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#area)" />
      <path d={path} fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HistoryStrip({
  weekDone = [],
  weekPeriod = [],
  todayIndex,
}: {
  /** Mon..Sun booleans: workout completed */
  weekDone?: boolean[];
  /** Mon..Sun booleans: period rest day (streak-safe) */
  weekPeriod?: boolean[];
  todayIndex?: number;
}) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const jsDay = new Date().getDay();
  const today = todayIndex ?? (jsDay === 0 ? 6 : jsDay - 1);

  const done = days.map((_, i) => Boolean(weekDone[i]));
  const rest = days.map((_, i) => Boolean(weekPeriod[i]));

  const sessions = done.filter(Boolean).length;
  const restDays = rest.filter((r, i) => r && !done[i]).length;

  // Streak: count back from today, period rest days don't break it.
  let streak = 0;
  for (let i = today; i >= 0; i--) {
    if (done[i]) streak++;
    else if (rest[i]) continue;
    else break;
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">This Week</div>
          <div className="mt-1 text-sm font-semibold">
            {sessions === 0 ? "No sessions yet" : `${sessions} session${sessions > 1 ? "s" : ""} completed`}
            {restDays > 0 && (
              <span className="text-muted-foreground font-normal"> · {restDays} rest day{restDays > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-2xl transition-opacity ${streak > 0 ? "opacity-100" : "opacity-30 grayscale"}`}>🔥</span>
          {streak > 0 && <span className="text-sm font-bold text-primary tabular-nums">{streak}</span>}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        {days.map((d, i) => {
          const isDone = done[i];
          const isRest = rest[i] && !isDone;
          const isToday = i === today;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`relative h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isDone
                    ? "bg-emerald-500 text-white shadow-glow"
                    : isRest
                      ? "bg-fuchsia-500/80 text-white"
                      : "border border-border text-muted-foreground"
                } ${isToday && !isDone && !isRest ? "ring-2 ring-primary/60" : ""}`}
              >
                {isDone ? "✓" : isRest ? "🌸" : d}
              </div>
              <span
                className={`h-1 w-1 rounded-full ${isDone ? "bg-emerald-500" : isRest ? "bg-fuchsia-500" : "bg-muted"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

