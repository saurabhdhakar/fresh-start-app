export function GoalScreen({
  gender,
  goals,
  onPick,
  onBack,
}: {
  gender: "male" | "female";
  goals: { id: string; label: string; desc: string; emoji: string }[];
  onPick: (g: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="px-6 pt-6 pb-10 animate-rise">
      <button onClick={onBack} className="text-sm text-muted-foreground mb-6">← Back</button>
      <h2 className="text-2xl font-bold">What's your goal?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {gender === "male" ? "Choose what you want to achieve" : "Chunein aapke liye kya important hai"}
      </p>

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
