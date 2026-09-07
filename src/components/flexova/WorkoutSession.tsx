import { memo, useEffect, useRef, useState } from "react";
import type { Exercise, WorkoutPlan } from "./data";
import { getExerciseLoopFor, getMuscleGlow } from "./exerciseAssets";


export function WorkoutSession({
  plan,
  onExit,
  gender,
  onExerciseComplete,
}: {
  plan: WorkoutPlan;
  onExit: () => void;
  gender: "male" | "female";
  onExerciseComplete?: () => void;
}) {
  const [exercises, setExercises] = useState<Exercise[]>(plan.exercises);
  const [swapped, setSwapped] = useState<Set<string>>(new Set());
  const [done, setDone] = useState<Set<string>>(new Set());
  const [restFor, setRestFor] = useState<Exercise | null>(null);
  const [altFor, setAltFor] = useState<Exercise | null>(null);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [zoomFor, setZoomFor] = useState<Exercise | null>(null);

  const complete = (e: Exercise) => {
    if (done.has(e.id)) return;
    const next = new Set(done);
    next.add(e.id);
    setDone(next);
    setRestFor(e);
    setShowCelebrate(true);
    onExerciseComplete?.();
    setTimeout(() => setShowCelebrate(false), 900);
  };

  useEffect(() => {
    setExercises(plan.exercises);
    setSwapped(new Set());
    setDone(new Set());
  }, [plan]);

  const swap = (target: Exercise, altName: string) => {
    setExercises((list) =>
      list.map((x) =>
        x.id === target.id
          ? { ...x, name: altName, machine: undefined, alternatives: target.alternatives }
          : x,
      ),
    );
    setSwapped((prev) => new Set(prev).add(target.id));
    setAltFor(null);
  };

  const progress = Math.round((done.size / exercises.length) * 100);
  const allDone = done.size === exercises.length;

  return (
    <div className="px-5 pt-4 pb-24 animate-rise">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-muted-foreground">← Exit</button>
        <div className="text-xs text-muted-foreground uppercase tracking-widest">
          {done.size}/{exercises.length} done
        </div>
      </div>

      <div className="mt-4 rounded-3xl gradient-card border border-border p-5 shadow-card">
        <div className="text-xs uppercase tracking-widest text-primary">Today's Session</div>
        <h1 className="mt-1 text-2xl font-bold">{plan.title}</h1>
        <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
        <div className="mt-4 flex gap-4 text-xs">
          <Stat label="Duration" value={plan.duration} />
          <Stat label="Est. burn" value={plan.calories} />
          <Stat label="Progress" value={`${progress}%`} />
        </div>
        <div className="mt-4 h-2 rounded-full bg-background/40 overflow-hidden">
          <div className="h-full gradient-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {exercises.map((e) => (
          <ExerciseCard
            key={e.id}
            e={e}
            swapped={swapped.has(e.id)}
            done={done.has(e.id)}
            gender={gender}
            onComplete={() => complete(e)}
            onAlt={() => setAltFor(e)}
            onZoom={() => setZoomFor(e)}
          />
        ))}
      </div>

      {allDone && (
        <div className="mt-6 rounded-3xl gradient-accent p-6 text-center text-primary-foreground shadow-glow animate-rise">
          <div className="text-4xl">🏆</div>
          <div className="mt-2 font-bold text-lg">Session Complete!</div>
          <div className="text-xs opacity-80">You crushed it. Recover well.</div>
          <button onClick={onExit} className="mt-4 px-6 py-2 rounded-xl bg-background/20 text-primary-foreground text-sm font-semibold">
            Back to Dashboard
          </button>
        </div>
      )}

      {zoomFor && (
        <ZoomModal name={zoomFor.name} gender={gender} onClose={() => setZoomFor(null)} />
      )}
      {showCelebrate && <Celebrate />}
      {restFor && <RestTimer exercise={restFor} onClose={() => setRestFor(null)} />}
      {altFor && (
        <AltDrawer
          exercise={altFor}
          onPick={(a) => swap(altFor, a)}
          onClose={() => setAltFor(null)}
          gender={gender}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

const ExerciseLoop = memo(function ExerciseLoop({
  name,
  emoji,
  muscle,
  gender,
  onZoom,
}: {
  name: string;
  emoji: string;
  muscle: string;
  gender: "male" | "female";
  onZoom: () => void;
}) {
  const glow = getMuscleGlow(muscle);
  return (
    <button
      type="button"
      onClick={onZoom}
      aria-label={`Zoom ${name} 3D demo`}
      className="relative shrink-0 overflow-hidden bg-background/50 active:scale-95 transition-transform"
      style={{
        height: 85,
        width: 85,
        borderRadius: 16,
        boxShadow: `inset 0 0 18px -4px ${glow}, 0 0 12px -4px ${glow}`,
        border: `1px solid ${glow}`,
      }}
    >
      <video
        src={getExerciseLoopFor(name, gender)}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        preload="none"
        aria-label={`${name} 3D demo loop`}
      />
      <span className="pointer-events-none absolute bottom-0.5 right-1 text-[11px]">{emoji}</span>
    </button>
  );
});

function ZoomModal({
  name,
  gender,
  onClose,
}: {
  name: string;
  gender: "male" | "female";
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-sm animate-rise">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-bold">{name}</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-9 w-9 rounded-full border border-border text-lg leading-none"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <video
          src={getExerciseLoopFor(name, gender)}
          className="max-h-full w-full rounded-3xl object-contain"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
        />
      </div>
    </div>
  );
}

const ExerciseCard = memo(function ExerciseCard({
  e,
  done,
  swapped,
  gender,
  onComplete,
  onAlt,
  onZoom,
}: {
  e: Exercise;
  done: boolean;
  swapped?: boolean;
  gender: "male" | "female";
  onComplete: () => void;
  onAlt: () => void;
  onZoom: () => void;
}) {
  return (
    <div className={`rounded-2xl border p-4 transition ${done ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-start gap-4">
        <ExerciseLoop name={e.name} emoji={e.emoji} muscle={e.muscle} gender={gender} onZoom={onZoom} />

        <div className="min-w-0 flex-1">
          <div className="font-semibold flex items-center gap-2 flex-wrap">
            <span className="truncate">{e.name}</span>
            {swapped && (
              <span className="text-[10px] rounded-full bg-primary/15 text-primary px-2 py-0.5">Swapped</span>
            )}
            {done && <span className="text-primary text-lg ml-auto">✓</span>}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{e.muscle} • {e.sets} × {e.reps}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Rest {e.rest}s</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={onAlt}
          className="text-[11px] rounded-lg border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground"
        >
          Machine Busy
        </button>
        <button
          onClick={onComplete}
          disabled={done}
          className={`text-xs font-semibold rounded-lg px-4 py-1.5 transition ${
            done ? "bg-primary/20 text-primary" : "gradient-accent text-primary-foreground"
          }`}
        >
          {done ? "Done" : "Complete"}
        </button>
      </div>
    </div>
  );
});



function Celebrate() {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="h-32 w-32 rounded-full gradient-accent shadow-glow animate-flex-pulse flex items-center justify-center text-5xl">
        ✓
      </div>
    </div>
  );
}

function RestTimer({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const [remaining, setRemaining] = useState(exercise.rest);
  const [vibrated, setVibrated] = useState(false);
  const [buzzing, setBuzzing] = useState(false);
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const buzzRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const buzzStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const stopVibration = () => {
    if (buzzRef.current) clearInterval(buzzRef.current);
    if (buzzStopRef.current) clearTimeout(buzzStopRef.current);
    buzzRef.current = null;
    buzzStopRef.current = null;
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(0);
    }
    setBuzzing(false);
  };

  useEffect(() => {
    intRef.current = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => {
      if (intRef.current) clearInterval(intRef.current);
    };
  }, []);

  // cleanup on unmount
  useEffect(() => stopVibration, []);

  useEffect(() => {
    if (remaining === 0 && !vibrated) {
      setVibrated(true);
      setBuzzing(true);
      const canVibrate = typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
      if (canVibrate) {
        const pulse = () => navigator.vibrate([1000, 500]);
        navigator.vibrate(0);
        pulse();
        buzzRef.current = setInterval(pulse, 1500);
      }
      // auto-stop after 20 seconds
      buzzStopRef.current = setTimeout(stopVibration, 20000);
      if (shellRef.current) shellRef.current.classList.add("animate-flex-pulse");
    }
  }, [remaining, vibrated]);

  const handleClose = () => {
    stopVibration();
    onClose();
  };

  const pct = ((exercise.rest - remaining) / exercise.rest) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-end sm:items-center justify-center">
      <div ref={shellRef} className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card border border-border p-6 shadow-glow animate-rise">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Smart Rest</div>
          <div className="mt-2 text-sm text-muted-foreground">After {exercise.name}</div>
          <div className="relative mx-auto mt-6 h-40 w-40">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="45" stroke="currentColor" className="text-muted" strokeWidth="6" fill="none" />
              <circle
                cx="50" cy="50" r="45"
                stroke="currentColor" className="text-primary"
                strokeWidth="6" fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold">{remaining}</div>
              <div className="text-xs text-muted-foreground">seconds</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            {remaining === 0
              ? buzzing
                ? "📳 Rest complete — phone vibrating"
                : "🎯 Rest complete"
              : "Breathe. Recover. Prepare."}
          </div>

          {buzzing && (
            <button
              onClick={stopVibration}
              className="mt-5 w-full rounded-2xl gradient-accent text-primary-foreground py-4 text-base font-bold shadow-glow animate-flex-pulse"
            >
              Stop Vibration
            </button>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                stopVibration();
                setVibrated(false);
                setRemaining((r) => r + 15);
              }}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold"
            >
              +15s
            </button>
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold"
            >
              {remaining === 0 ? "Continue" : "Skip Rest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AltDrawer({
  exercise,
  onClose,
  onPick,
}: {
  exercise: Exercise;
  onClose: () => void;
  onPick: (alt: string) => void;
  gender: "male" | "female";
}) {
  const alts = exercise.alternatives ?? [
    "Bodyweight variation",
    "Resistance band version",
    "Dumbbell substitute",
  ];
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-end justify-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-card border border-border p-6 shadow-card animate-rise" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto h-1 w-10 rounded-full bg-muted" />
        <div className="mt-4">
          <div className="text-xs uppercase tracking-widest text-primary">Machine Alternative</div>
          <h3 className="mt-1 text-lg font-bold">
            {exercise.machine ? `${exercise.machine} busy?` : "Equipment busy?"}
          </h3>
          <p className="text-sm text-muted-foreground">Try these targeting {exercise.muscle}:</p>
        </div>
        <div className="mt-4 space-y-2">
          {alts.map((a) => (
            <button
              key={a}
              onClick={() => onPick(a)}
              className="w-full flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4 text-left transition hover:border-primary"
            >
              <div>
                <div className="font-semibold text-sm">{a}</div>
                <div className="text-xs text-muted-foreground">Same target • Equal intensity</div>
              </div>
              <span className="text-primary">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
