import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Google AdMob Banner slot.
 *
 * ── AdMob setup (fill in at deployment time) ──────────────────────────────
 * 1. App ID (goes in app.json / AndroidManifest / Info.plist, NOT here):
 *      AdMob App ID:  ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
 * 2. Banner Ad Unit ID for this slot:
 *      const AD_UNIT_ID = "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ";
 *
 * Web preview (this build): we render an anchored 320x50-style slot and,
 * when a real ad network script is available, load a live banner into it.
 * Native builds: mount the AdMob <BannerAd> component (anchored adaptive
 * banner) into this same container — the premium guard stays identical.
 *
 * Example native wiring (react-native-google-mobile-ads):
 *
 *   import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
 *   <BannerAd
 *     unitId={AD_UNIT_ID}                       // paste Ad Unit string here
 *     size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
 *     onAdLoaded={() => setLoaded(true)}
 *     onAdFailedToLoad={() => setLoaded(false)}
 *   />
 * ───────────────────────────────────────────────────────────────────────────
 */

// TODO(deployment): paste the real AdMob Banner Ad Unit ID here.
const ADMOB_AD_UNIT_ID = "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Attempts to load a live banner via the Google ad script when present. */
function useAdMobBanner(enabled: boolean, ref: React.RefObject<HTMLDivElement | null>) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    // Placeholder for the live network call. When the Google Ads script
    // (or native AdMob SDK) is wired with the real Ad Unit ID above, this
    // pushes the ad request; while offline / unconfigured we keep the
    // "Google AdMob Ads Loading..." placeholder below.
    try {
      if (window.adsbygoogle && ADMOB_AD_UNIT_ID.includes("ca-app-pub-") && !ADMOB_AD_UNIT_ID.includes("XXXX")) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setLoaded(true);
      }
    } catch {
      setLoaded(false);
    }
  }, [enabled, ref]);

  return loaded;
}

export function AdBanner({ onOpenSub }: { onOpenSub: () => void }) {
  const { t } = useI18n();
  const slotRef = useRef<HTMLDivElement>(null);
  const loaded = useAdMobBanner(true, slotRef);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-card">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("dash.adLabel")}
        </span>
      </div>

      {/* Anchored banner slot — 320x50 minimum, grows to adaptive height */}
      <div
        ref={slotRef}
        className="mt-3 flex min-h-[50px] w-full items-center justify-center overflow-hidden rounded-xl bg-muted/40"
        data-ad-unit={ADMOB_AD_UNIT_ID}
        data-ad-format="anchored-adaptive-banner"
      >
        {!loaded && (
          <span className="text-xs text-muted-foreground">Google AdMob Ads Loading...</span>
        )}
      </div>

      <button
        onClick={onOpenSub}
        className="mt-3 w-full rounded-xl bg-gradient-to-r from-primary/20 to-transparent px-3 py-2 text-left text-xs font-semibold text-primary"
      >
        {t("dash.adCta")} →
      </button>
    </div>
  );
}
