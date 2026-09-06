import { Suspense, lazy } from "react";

const FocusAreaScreen = lazy(() =>
  import("./FocusAreaScreen").then((m) => ({ default: m.FocusAreaScreen })),
);

export type FocusGateState = "closed" | "editor" | "paywall";

/**
 * Renders either the premium upgrade sheet (free users) or the
 * Focus Area editor (premium users). Editor code + images load lazily
 * so mobile devices never pay the cost until it is actually opened.
 */
export function FocusAreaGate({
  state,
  gender,
  onClose,
  onUpgrade,
  onSaved,
}: {
  state: FocusGateState;
  gender: "male" | "female";
  onClose: () => void;
  onUpgrade: () => void;
  onSaved?: (areas: string[]) => void;
}) {
  if (state === "closed") return null;

  if (state === "paywall") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-t-3xl border border-border gradient-card p-6 shadow-card animate-rise"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto h-14 w-14 rounded-2xl gradient-accent shadow-glow flex items-center justify-center text-2xl">
            🎯
          </div>
          <h3 className="mt-4 text-center text-xl font-bold">Unlock Focus Areas</h3>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Pick your muscle groups and get customized 3D workouts built around them.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Target any muscle group you want",
              "Customized 3D workout generation",
              "Smart weekly plan rebalancing",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full gradient-accent text-primary-foreground text-[10px] flex items-center justify-center">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={onUpgrade}
            className="mt-5 w-full rounded-xl gradient-accent text-primary-foreground font-semibold py-3.5 shadow-glow"
          >
            Start 7-day free trial
          </button>
          <button onClick={onClose} className="mt-2 w-full rounded-xl border border-border py-3 text-sm">
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-white">
      <Suspense
        fallback={
          <div className="flex h-full min-h-screen items-center justify-center text-sm text-neutral-400">
            Loading…
          </div>
        }
      >
        <FocusAreaScreen
          gender={gender}
          onBack={onClose}
          onSave={(areas) => {
            onSaved?.(areas);
            onClose();
          }}
        />
      </Suspense>
    </div>
  );
}
