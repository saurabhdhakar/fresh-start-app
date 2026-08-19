/* Quick-access panels opened from the Home feature strip (in-memory only) */
import { useState } from "react";
import { MALE_GOALS, FEMALE_GOALS } from "./data";

function Sheet({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl border border-border bg-card p-5 pb-8 shadow-card animate-rise max-h-[85%] overflow-y-auto">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-sm text-muted-foreground">
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function AIPlansPanel({
  gender,
  goalId,
  onSelectGoal,
  onPeriodMode,
  onClose,
}: {
  gender: "male" | "female";
  goalId: string | null;
  onSelectGoal: (id: string) => void;
  onPeriodMode: () => void;
  onClose: () => void;
}) {
  const goals = gender === "male" ? MALE_GOALS : FEMALE_GOALS;
  return (
    <Sheet title="🧠 AI Plans" subtitle="Pick a goal — Home workout card updates instantly" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        {goals.map((g) => {
          const active = g.id === goalId;
          return (
            <button
              key={g.id}
              onClick={() => {
                onSelectGoal(g.id);
                onClose();
              }}
              className={`rounded-2xl border p-4 text-left transition ${
                active ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary"
              }`}
            >
              <div className="text-2xl">{g.emoji}</div>
              <div className="mt-2 text-sm font-semibold">{g.label}</div>
              <div className="text-[11px] text-muted-foreground">{g.desc}</div>
            </button>
          );
        })}
      </div>

      {gender === "female" && (
        <button
          onClick={() => {
            onClose();
            onPeriodMode();
          }}
          className="mt-3 w-full rounded-2xl gradient-accent text-primary-foreground p-4 text-left shadow-glow"
        >
          <div className="text-2xl">🌸</div>
          <div className="mt-1 text-sm font-bold">Period Mode</div>
          <div className="text-[11px] opacity-80">Light yoga & stretching for Day 1-3</div>
        </button>
      )}
    </Sheet>
  );
}

export function TrackingPanel({ onClose }: { onClose: () => void }) {
  const [water, setWater] = useState(4);
  const [weight, setWeight] = useState(72.4);
  const [saved, setSaved] = useState(false);
  const goal = 8;

  return (
    <Sheet title="📈 Quick Tracking" subtitle="Log water & body weight (resets on refresh)" onClose={onClose}>
      <div className="rounded-2xl border border-border bg-background/40 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">💧 Water intake</div>
          <div className="text-xs text-muted-foreground">
            {water} / {goal} glasses
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full gradient-accent transition-all" style={{ width: `${Math.min(100, (water / goal) * 100)}%` }} />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => setWater((w) => Math.max(0, w - 1))} className="flex-1 rounded-xl border border-border py-2 text-sm font-semibold">
            − Glass
          </button>
          <button
            onClick={() => setWater((w) => w + 1)}
            className="flex-1 rounded-xl gradient-accent text-primary-foreground py-2 text-sm font-semibold shadow-glow"
          >
            + Glass
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-background/40 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">⚖️ Current weight</div>
          <div className="text-xs text-muted-foreground">{weight.toFixed(1)} kg</div>
        </div>
        <input
          type="range"
          min={40}
          max={130}
          step={0.1}
          value={weight}
          onChange={(e) => {
            setWeight(parseFloat(e.target.value));
            setSaved(false);
          }}
          className="mt-3 w-full accent-primary"
        />
        <div className="mt-2 flex gap-2">
          <button onClick={() => setWeight((w) => Math.max(40, +(w - 0.1).toFixed(1)))} className="flex-1 rounded-xl border border-border py-2 text-sm font-semibold">
            − 0.1
          </button>
          <button onClick={() => setWeight((w) => Math.min(130, +(w + 0.1).toFixed(1)))} className="flex-1 rounded-xl border border-border py-2 text-sm font-semibold">
            + 0.1
          </button>
        </div>
        <button
          onClick={() => setSaved(true)}
          className="mt-3 w-full rounded-xl gradient-accent text-primary-foreground py-2.5 text-sm font-semibold shadow-glow"
        >
          {saved ? "✅ Weight updated" : "Update weight"}
        </button>
      </div>
    </Sheet>
  );
}

const WEEKLY = [
  { id: "w1", label: "4 workouts this week", badge: "🥉 Consistent" },
  { id: "w2", label: "Drink 8 glasses daily", badge: "💧 Hydrated" },
  { id: "w3", label: "Hit protein target 5 days", badge: "🥚 Protein Pro" },
  { id: "w4", label: "10,000 steps on 3 days", badge: "👟 Stepper" },
];

const MONTHLY = [
  { id: "m1", label: "16 total workouts", badge: "🥈 Grinder" },
  { id: "m2", label: "Burn 12,000 kcal", badge: "🔥 Furnace" },
  { id: "m3", label: "Log weight every week", badge: "📊 Tracker" },
  { id: "m4", label: "No skipped rest days", badge: "🧘 Balanced" },
];

export function GoalsPanel({ onClose }: { onClose: () => void }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const all = [...WEEKLY, ...MONTHLY];
  const earned = all.filter((t) => done[t.id]);

  const List = ({ title, items }: { title: string; items: typeof WEEKLY }) => (
    <>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-4 mb-2">{title}</div>
      <div className="space-y-2">
        {items.map((t) => {
          const isDone = !!done[t.id];
          return (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`w-full rounded-2xl border p-3 flex items-center gap-3 text-left transition ${
                isDone ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <span
                className={`h-6 w-6 shrink-0 rounded-lg flex items-center justify-center text-xs ${
                  isDone ? "gradient-accent text-primary-foreground" : "border border-border"
                }`}
              >
                {isDone ? "✓" : ""}
              </span>
              <span className={`flex-1 text-sm ${isDone ? "line-through text-muted-foreground" : "font-medium"}`}>{t.label}</span>
              <span className={`text-[10px] font-semibold ${isDone ? "text-primary" : "text-muted-foreground opacity-50"}`}>{t.badge}</span>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <Sheet title="🏆 Goals" subtitle={`${earned.length} / ${all.length} targets completed`} onClose={onClose}>
      <div className="rounded-2xl border border-border bg-background/40 p-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Badges earned</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {earned.length === 0 ? (
            <span className="text-xs text-muted-foreground">Complete a target to unlock your first badge 🔒</span>
          ) : (
            earned.map((b) => (
              <span key={b.id} className="rounded-full gradient-accent text-primary-foreground text-[10px] font-bold px-3 py-1 shadow-glow">
                {b.badge}
              </span>
            ))
          )}
        </div>
      </div>

      <List title="Weekly targets" items={WEEKLY} />
      <List title="Monthly targets" items={MONTHLY} />
    </Sheet>
  );
}
