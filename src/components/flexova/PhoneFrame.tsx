import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-md min-h-screen relative overflow-hidden gradient-hero">
        {children}
      </div>
    </div>
  );
}

export function StatusBar({ title, onBack }: { title?: string; onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2 text-[11px] font-medium text-muted-foreground">
      <div className="w-16 flex items-center">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-1 flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur transition-colors hover:border-primary/60 hover:text-primary active:scale-95"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back
          </button>
        ) : (
          <span>9:41</span>
        )}
      </div>
      <span className="uppercase tracking-widest">{title ?? "Flexova"}</span>
      <span className="w-16" />

    </div>
  );
}
