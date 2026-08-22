import { useEffect } from "react";
import icon from "@/assets/flexova-icon.png";
import wordmark from "@/assets/flexova-wordmark.png";

export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gradient-hero">
      <div className="relative">
        <div className="absolute inset-0 -m-8 rounded-full border border-primary/30 animate-ring-spin" />
        <div className="absolute inset-0 -m-14 rounded-full border border-primary/10 animate-ring-spin" style={{ animationDirection: "reverse", animationDuration: "12s" }} />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-card p-4 shadow-glow animate-flex-pulse">
          <img src={icon} alt="Flexova app icon" className="h-full w-full object-contain" />
        </span>
      </div>
      <div className="mt-10 text-center animate-rise">
        <img src={wordmark} alt="Flexova logo" className="mx-auto h-14 w-auto" />
        <p className="mt-3 text-sm text-muted-foreground uppercase tracking-[0.3em]">Move. Sculpt. Rise.</p>
      </div>
      <div className="absolute bottom-12 flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-flex-pulse" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-flex-pulse" style={{ animationDelay: "0.15s" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-flex-pulse" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}
