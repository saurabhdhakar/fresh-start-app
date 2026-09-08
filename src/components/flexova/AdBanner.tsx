import { useI18n } from "@/lib/i18n";

export function AdBanner({ onOpenSub }: { onOpenSub: () => void }) {
  const { t } = useI18n();

  return (
    <button
      onClick={onOpenSub}
      className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-card transition active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-lg">
          👑
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("dash.adLabel")}
            </span>
          </div>
          <div className="mt-1 text-sm font-semibold">{t("dash.adTitle")}</div>
          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {t("dash.adDesc")}
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-gradient-to-r from-primary/20 to-transparent px-3 py-2 text-xs font-semibold text-primary">
        {t("dash.adCta")} →
      </div>
    </button>
  );
}
