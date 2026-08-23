import { useI18n } from "@/lib/i18n";

export function GoalScreen({
  goals,
  onPick,
  onBack,
}: {
  gender: "male" | "female";
  goals: { id: string; label: string; desc: string; emoji: string }[];
  onPick: (g: string) => void;
  onBack: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="px-6 pt-6 pb-10 animate-rise">
      <button onClick={onBack} className="text-sm text-muted-foreground mb-6">← {t("common.back")}</button>
      <h2 className="text-2xl font-bold">{t("goal.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("goal.subtitle")}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => onPick(g.id)}
            className="rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary hover:shadow-glow"
          >
            <div className="text-3xl">{g.emoji}</div>
            <div className="mt-3 font-semibold">{g.label}</div>
            <div className="text-xs text-muted-foreground">{g.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
