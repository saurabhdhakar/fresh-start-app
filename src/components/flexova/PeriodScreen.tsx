import { useState } from "react";
import { PERIOD_PLAN, type WorkoutPlan } from "./data";

export function PeriodScreen({
  onDone,
  onSkip,
}: {
  onDone: (plan: WorkoutPlan | null, phase: "early" | "mid" | "late") => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState<"ask" | "day">("ask");
  const [day, setDay] = useState(1);

  const phase = day <= 3 ? "early" : day <= 5 ? "mid" : "late";

  return (
    <div className="px-6 pt-6 pb-10 animate-rise">
      <div className="rounded-3xl gradient-card border border-border p-6 shadow-card">
        <div className="text-3xl">🌸</div>
        <h2 className="mt-3 text-xl font-bold">Period Mode</h2>

        {step === "ask" && (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Kya aap abhi apne period pe hain? We'll adjust your workouts for comfort and recovery.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep("day")}
                className="rounded-xl gradient-accent text-primary-foreground font-semibold py-3"
              >
                Yes
              </button>
              <button
                onClick={onSkip}
                className="rounded-xl border border-border bg-card font-semibold py-3"
              >
                No
              </button>
            </div>
          </>
        )}

        {step === "day" && (
          <>
            <p className="mt-2 text-sm text-muted-foreground">Aap kaunse din pe hain?</p>
            <div className="mt-5">
              <div className="text-5xl font-bold text-primary">Day {day}</div>
              <input
                type="range"
                min={1}
                max={7}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="mt-4 w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>1</span><span>4</span><span>7</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Suggested phase</div>
              <div className="mt-1 font-semibold">{PERIOD_PLAN[phase].title}</div>
              <div className="text-xs text-muted-foreground">{PERIOD_PLAN[phase].subtitle}</div>
              {phase === "early" && (
                <div className="mt-3 rounded-xl border border-primary/40 bg-primary/10 p-3 text-xs">
                  🧘‍♀️ Day 1-3: intense exercises hata diye gaye — sirf lightweight yoga aur stretching.
                </div>
              )}
            </div>

            <button
              onClick={() => onDone(PERIOD_PLAN[phase], phase)}
              className="mt-6 w-full rounded-xl gradient-accent text-primary-foreground font-semibold py-3"
            >
              Start Recovery Session
            </button>
            <button onClick={onSkip} className="mt-2 w-full text-xs text-muted-foreground py-2">
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
