import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import icon from "@/assets/flexova-icon.png.asset.json";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function InstallBanner() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua);
    setIsIos(ios);
    if (ios) setVisible(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    const onInstalled = () => setVisible(false);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible) return null;

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      setDeferred(null);
      if (outcome === "accepted") setVisible(false);
      return;
    }
    setIosHelp(true);
  };

  return (
    <div className="fixed bottom-[4.75rem] left-1/2 z-50 w-full max-w-md -translate-x-1/2 p-3 animate-rise">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/95 p-3 shadow-card backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full gradient-accent opacity-20 blur-2xl" />
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setVisible(false)}
          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground transition hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 pr-6">
          <img src={icon.url} alt="Flexova app icon" className="h-11 w-11 rounded-xl" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">Get the Flexova App</div>
            <div className="truncate text-[11px] text-muted-foreground">
              Faster workouts, offline-ready, home-screen icon
            </div>
          </div>
          <button
            type="button"
            onClick={install}
            className="flex shrink-0 items-center gap-1.5 rounded-xl gradient-accent px-3.5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition active:scale-95"
          >
            <Download className="h-4 w-4" />
            Download App
          </button>
        </div>

        {iosHelp && (
          <div className="mt-3 rounded-xl border border-border bg-background/60 p-3 text-[11px] text-muted-foreground">
            {isIos ? (
              <span className="flex items-center gap-1.5">
                Tap <Share className="h-3.5 w-3.5 text-primary" /> Share → <b className="text-foreground">Add to Home Screen</b>
              </span>
            ) : (
              <span>
                Open your browser menu → <b className="text-foreground">Install app</b> / Add to Home screen
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
