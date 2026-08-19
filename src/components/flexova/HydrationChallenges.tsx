import { useState } from "react";
import { DEFAULT_PRICING, type Pricing } from "@/lib/geo";

type Character = {
  id: string;
  name: string;
  emoji: string;
  goal: string;
  challenge: string;
};

const CHARACTERS: Character[] = [
  { id: "gorilla", name: "Bulking Gorilla", emoji: "🦍", goal: "Muscle Gain", challenge: "4L / day · 7 day mass streak" },
  { id: "cheetah", name: "Shredded Cheetah", emoji: "🐆", goal: "Weight Loss", challenge: "3L / day · fat-burn sprint" },
  { id: "flamingo", name: "Toned Flamingo", emoji: "🦩", goal: "Toning", challenge: "2.5L / day · glow streak" },
  { id: "bear", name: "Iron Bear", emoji: "🐻", goal: "Strength", challenge: "4.5L / day · power week" },
  { id: "dolphin", name: "Zen Dolphin", emoji: "🐬", goal: "Recovery", challenge: "3L / day · calm flow" },
];

function GlassOutline({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative mx-auto h-40 w-28">
      <div
        className="absolute inset-0 border-2 border-border overflow-hidden bg-background/40"
        style={{ borderRadius: "10px 10px 26px 26px", clipPath: "polygon(8% 0, 92% 0, 82% 100%, 18% 100%)" }}
      >
        <div
          className="absolute inset-x-0 bottom-0 gradient-accent opacity-90"
          style={{ height: `${p}%`, transition: "height .8s cubic-bezier(.22,1,.36,1)" }}
        >
          <div className="absolute inset-0 animate-shine" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold drop-shadow">{Math.round(p)}%</span>
      </div>
    </div>
  );
}

function CharacterFill({ emoji, percent, locked }: { emoji: string; percent: number; locked?: boolean }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative mx-auto h-24 w-24 rounded-full border border-border bg-background/50 overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-x-0 bottom-0 gradient-accent opacity-40"
        style={{ height: locked ? "35%" : `${p}%`, transition: "height .8s cubic-bezier(.22,1,.36,1)" }}
      />
      <span className="relative text-4xl">{emoji}</span>
    </div>
  );
}

export function HydrationChallenges({
  isPremium = false,
  onOpenSub,
  pricing = DEFAULT_PRICING,
}: {
  isPremium?: boolean;
  onOpenSub: () => void;
  pricing?: Pricing;
}) {
  const [glasses, setGlasses] = useState(3);
  const [selected, setSelected] = useState<string>(CHARACTERS[0]?.id ?? "gorilla");
  const [paywall, setPaywall] = useState<Character | null>(null);
  const pct = (glasses / 8) * 100;

  return (
    <div className="rounded-[2rem] gradient-card border border-border p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Hydration Challenges</div>
          <div className="text-sm font-semibold">Fill your character 💧</div>
        </div>
        <span className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-semibold">
          {(glasses * 0.25).toFixed(2)}L
        </span>
      </div>

      <div className="mt-5">
        {isPremium ? (
          <CharacterFill
            emoji={CHARACTERS.find((c) => c.id === selected)?.emoji ?? "🦍"}
            percent={pct}
          />
        ) : (
          <GlassOutline percent={pct} />
        )}
        <div className="mt-2 text-center text-[11px] text-muted-foreground">{glasses} / 8 glasses today</div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setGlasses((g) => Math.max(0, g - 1))}
          aria-label="Remove a glass"
          className="h-11 w-11 rounded-full border border-border bg-background/40 text-lg font-bold active:scale-95 transition"
        >
          −
        </button>
        <button
          onClick={() => setGlasses((g) => Math.min(8, g + 1))}
          className="flex-1 rounded-full gradient-accent text-primary-foreground py-3 text-sm font-bold shadow-glow active:scale-[0.98] transition"
        >
          + Log a drink
        </button>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Character Store</div>
          {!isPremium && <span className="text-[10px] uppercase tracking-widest text-primary">Premium</span>}
        </div>

        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
          {CHARACTERS.map((c) => {
            const active = isPremium && selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => (isPremium ? setSelected(c.id) : setPaywall(c))}
                className={`relative shrink-0 snap-start w-40 rounded-3xl border p-4 text-left transition ${
                  active ? "border-primary shadow-glow" : "border-border"
                } bg-card`}
              >
                <div className={!isPremium ? "blur-[3px] opacity-70" : ""}>
                  <CharacterFill emoji={c.emoji} percent={pct} locked={!isPremium} />
                  <div className="mt-3 text-sm font-semibold">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.goal}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{c.challenge}</div>
                </div>

                {!isPremium && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-10 w-10 rounded-full gradient-accent text-primary-foreground shadow-glow flex items-center justify-center text-base">
                      🔒
                    </span>
                  </span>
                )}
                {active && (
                  <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest rounded-full bg-primary text-primary-foreground px-2 py-0.5">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {paywall && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] gradient-card border border-primary shadow-glow p-6 animate-rise">
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-2xl gradient-accent shadow-glow flex items-center justify-center text-2xl">
                {paywall.emoji}
              </div>
              <button onClick={() => setPaywall(null)} className="text-sm text-muted-foreground" aria-label="Close">
                ✕
              </button>
            </div>
            <h3 className="mt-4 text-2xl font-bold">Unlock All Characters &amp; Fitness Challenges</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {paywall.name} fills up live as you hydrate — plus streak challenges built for {paywall.goal}.
            </p>

            <ul className="mt-4 space-y-2">
              {[
                "Every premium character avatar",
                "Goal-based hydration challenges & streaks",
                "Animated fill-up progress and rewards",
                "No ads, ever",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-3xl font-bold">{pricing.monthly}</span>
              <span className="text-sm text-muted-foreground">/month · 7-day free trial</span>
            </div>

            <button
              onClick={() => {
                setPaywall(null);
                onOpenSub();
              }}
              className="mt-4 w-full rounded-xl gradient-accent text-primary-foreground py-3 text-sm font-bold shadow-glow"
            >
              Continue to checkout
            </button>
            <button onClick={() => setPaywall(null)} className="mt-2 w-full py-2 text-xs text-muted-foreground">
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
