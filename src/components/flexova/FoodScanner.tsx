import { useState } from "react";
import { FOOD_DEMO } from "./data";

export function FoodScanner({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<"idle" | "scanning" | "result" | "unsure" | "manual">("idle");
  const [result, setResult] = useState<(typeof FOOD_DEMO)[number] | null>(null);

  const upload = () => {
    setPhase("scanning");
    setTimeout(() => {
      const pick = FOOD_DEMO[Math.floor(Math.random() * FOOD_DEMO.length)];
      setResult(pick);
      setPhase(pick.confidence < 0.7 ? "unsure" : "result");
    }, 1800);
  };

  const selectManual = (item: typeof FOOD_DEMO[number]) => {
    setResult(item);
    setPhase("result");
  };

  return (
    <div className="px-5 pt-4 pb-24 animate-rise">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-muted-foreground">← Back</button>
        <div className="text-xs uppercase tracking-widest text-primary">Calorie Scanner</div>
        <span className="w-8" />
      </div>

      {phase === "idle" && (
        <div className="mt-6">
          <div className="rounded-3xl gradient-card border border-border p-8 text-center shadow-card">
            <div className="mx-auto h-24 w-24 rounded-3xl bg-background/40 border border-dashed border-border flex items-center justify-center text-4xl">
              📷
            </div>
            <h2 className="mt-4 text-xl font-bold">Scan your meal</h2>
            <p className="mt-1 text-sm text-muted-foreground">Upload a food image — AI estimates the calories.</p>
            <button
              onClick={upload}
              className="mt-6 w-full rounded-xl gradient-accent text-primary-foreground font-semibold py-3"
            >
              Upload Food Image
            </button>
            <div className="mt-3 text-[11px] text-muted-foreground">Demo feature • No image is saved</div>
          </div>
        </div>
      )}

      {phase === "scanning" && (
        <div className="mt-8 text-center">
          <div className="relative mx-auto h-48 w-48 rounded-3xl bg-card border border-border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-6xl">🍽️</div>
            <div className="absolute left-0 right-0 h-1 gradient-accent animate-[shine_1.6s_ease-in-out_infinite]" style={{ top: "40%" }} />
          </div>
          <div className="mt-6 font-semibold">Analyzing your meal…</div>
          <div className="text-xs text-muted-foreground">AI vision model estimating macros</div>
        </div>
      )}

      {(phase === "result" || phase === "unsure") && result && (
        <div className="mt-6 animate-rise">
          <div className="rounded-3xl gradient-card border border-border p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-background/40 flex items-center justify-center text-3xl">{result.emoji}</div>
              <div>
                <div className="text-xs text-muted-foreground">Detected</div>
                <div className="font-bold text-lg">{result.name}</div>
                <div className="text-[11px] text-muted-foreground">Confidence {Math.round(result.confidence * 100)}%</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-background/40 p-4 text-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Estimated</div>
              <div className="mt-1 text-4xl font-bold text-primary">{result.kcal}</div>
              <div className="text-xs text-muted-foreground">kcal</div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Macro label="Protein" value={`${result.protein}g`} />
              <Macro label="Carbs" value={`${result.carbs}g`} />
              <Macro label="Fat" value={`${result.fat}g`} />
            </div>
          </div>

          {phase === "unsure" && (
            <div className="mt-4 rounded-2xl border border-primary/40 bg-primary/10 p-4">
              <div className="text-sm font-semibold">Not fully sure?</div>
              <div className="text-xs text-muted-foreground">AI confidence is low. Aap manually select kar sakte hain.</div>
              <button onClick={() => setPhase("manual")} className="mt-3 w-full rounded-xl gradient-accent text-primary-foreground text-sm font-semibold py-2.5">
                Select food manually
              </button>
            </div>
          )}

          <button onClick={() => setPhase("idle")} className="mt-4 w-full rounded-xl border border-border py-3 text-sm font-semibold">
            Scan another
          </button>
        </div>
      )}

      {phase === "manual" && (
        <div className="mt-6 animate-rise">
          <h3 className="text-lg font-bold">Select your meal</h3>
          <div className="mt-4 space-y-2">
            {FOOD_DEMO.map((f) => (
              <button
                key={f.name}
                onClick={() => selectManual(f)}
                className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left"
              >
                <span className="text-2xl">{f.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.kcal} kcal • {f.protein}g protein</div>
                </div>
                <span className="text-primary">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/40 py-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
