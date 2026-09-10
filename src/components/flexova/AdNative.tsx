import { useI18n } from "@/lib/i18n";

/**
 * Google AdMob Native Advanced Ad slot.
 *
 * ── AdMob setup (fill in at deployment time) ──────────────────────────────
 * 1. App ID (goes in app.json / AndroidManifest / Info.plist, NOT here):
 *      AdMob App ID:  ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
 * 2. Native Advanced Ad Unit ID for this slot:
 *      const AD_UNIT_ID = "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ";
 *
 * Web preview (this build): we render a 250–300px native-style card and,
 * when a real ad network script is available, load a live native ad into it.
 * Native builds: mount the AdMob <NativeAd> component into this same container
 * — the premium guard stays identical.
 * ───────────────────────────────────────────────────────────────────────────
 */

// TODO(deployment): paste the real AdMob Native Advanced Ad Unit ID here.
const ADMOB_NATIVE_AD_UNIT_ID = "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ";

export function AdNative({ isPremium }: { isPremium?: boolean }) {
  const { t } = useI18n();

  if (isPremium) return null;

  return (
    <div
      className="relative mt-5 w-full overflow-hidden rounded-3xl border border-border/40 p-5 shadow-card"
      style={{ backgroundColor: "#141416", minHeight: "260px" }}
      data-ad-unit={ADMOB_NATIVE_AD_UNIT_ID}
      data-ad-format="native-advanced"
    >
      {/* Ad badge */}
      <div className="absolute right-4 top-4">
        <span className="rounded-md bg-muted/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("dash.adLabel")}
        </span>
      </div>

      {/* Centered placeholder label */}
      <div className="mt-6 flex flex-col items-center justify-center text-center">
        <span className="text-sm font-semibold text-foreground/90">
          {t("dash.nativeAdSlot")}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          {t("dash.nativeAdDesc")}
        </span>
      </div>

      {/* Native ad skeleton */}
      <div className="mt-5 flex items-start gap-4">
        {/* Square image placeholder */}
        <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-muted/30 flex items-center justify-center text-2xl">
          🖼️
        </div>

        {/* Title + description */}
        <div className="flex-1 pt-1">
          <div className="font-semibold text-foreground/90 leading-tight">
            {t("dash.nativeAdTitle")}
          </div>
          <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {t("dash.nativeAdDesc")}
          </div>
        </div>
      </div>

      {/* Prominent action button */}
      <button
        className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold text-primary-foreground shadow-glow transition active:scale-[0.98]"
        style={{ background: "var(--gradient-accent)" }}
        onClick={() => {}}
        aria-label={t("dash.nativeAdCta")}
      >
        {t("dash.nativeAdCta")}
      </button>
    </div>
  );
}
