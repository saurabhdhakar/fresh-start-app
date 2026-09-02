import { useRef, useState } from "react";
import { FocusAreaScreen } from "./FocusAreaScreen";

type Goal = { id: string; label: string; emoji: string };

export function AccountScreen({
  userName,
  gender,
  goals,
  goalId,
  photo,
  weight,
  height,
  targetWeight,
  lightMode,
  language,
  onPhoto,
  onSelectGoal,
  onWeight,
  onHeight,
  onTargetWeight,
  onToggleMode,
  onOpenLang,
  onLogout,
  onBack,
}: {
  userName: string | null;
  gender: "male" | "female";
  goals: Goal[];
  goalId: string | null;
  photo: string | null;
  weight: number;
  height: number;
  targetWeight: number;
  lightMode: boolean;
  language: string;
  onPhoto: (url: string) => void;
  onSelectGoal: (id: string) => void;
  onWeight: (n: number) => void;
  onHeight: (n: number) => void;
  onTargetWeight: (n: number) => void;
  onToggleMode: () => void;
  onOpenLang: () => void;
  onLogout: () => void;
  onBack: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const [water, setWater] = useState(0);
  const [share, setShare] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showFocusAreas, setShowFocusAreas] = useState(false);

  const bmi = height > 0 ? weight / Math.pow(height / 100, 2) : 0;
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";
  const goalLabel = goals.find((g) => g.id === goalId)?.label ?? "Not set";

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPhoto(URL.createObjectURL(f));
  };

  const shareProgress = async () => {
    const text = `💪 Flexova progress\nGoal: ${goalLabel}\nWeight: ${weight} kg → Target ${targetWeight} kg\nBMI: ${bmi.toFixed(1)} (${bmiLabel})\nWater today: ${water} glasses`;
    try {
      if (navigator.share) await navigator.share({ title: "My Flexova Progress", text });
      else {
        await navigator.clipboard.writeText(text);
        setNote("Progress card copied — paste on Instagram/WhatsApp!");
        setTimeout(() => setNote(null), 2500);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="px-5 pb-28 animate-rise">
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
      <input ref={camRef} type="file" accept="image/*" capture="user" hidden onChange={pick} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Account & Settings</h1>
        <button onClick={onBack} className="text-xs text-muted-foreground">
          ← Back
        </button>
      </div>

      {/* Profile */}
      <div className="mt-4 rounded-3xl gradient-card border border-border p-5 shadow-card flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary bg-secondary flex items-center justify-center text-3xl">
            {photo ? <img src={photo} alt="Profile" className="h-full w-full object-cover" /> : gender === "male" ? "🧔" : "👩"}
          </div>
        </div>
        <div className="mt-3 font-bold">{userName ?? "Guest User"}</div>
        <div className="text-[11px] text-muted-foreground uppercase tracking-widest">{goalLabel}</div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => fileRef.current?.click()} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
            🖼 Gallery
          </button>
          <button onClick={() => camRef.current?.click()} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
            📷 Camera
          </button>
        </div>
      </div>

      {/* BMI + water */}
      <Section title="Fitness Stats">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[11px] text-muted-foreground">BMI</div>
            <div className="text-2xl font-bold">{bmi ? bmi.toFixed(1) : "--"}</div>
            <div className="mt-1 inline-block rounded-full gradient-accent text-primary-foreground text-[10px] font-bold px-2 py-0.5">{bmiLabel}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[11px] text-muted-foreground">Water today</div>
            <div className="text-2xl font-bold">
              {water}
              <span className="text-xs font-medium text-muted-foreground"> / 8</span>
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setWater((w) => Math.max(0, w - 1))} className="h-7 w-7 rounded-lg border border-border text-sm">
                −
              </button>
              <button onClick={() => setWater((w) => Math.min(12, w + 1))} className="h-7 w-7 rounded-lg gradient-accent text-primary-foreground text-sm font-bold">
                +
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <NumField label="Weight (kg)" value={weight} onChange={onWeight} />
          <NumField label="Height (cm)" value={height} onChange={onHeight} />
        </div>
      </Section>

      {/* Goals */}
      <Section title="Edit Fitness Goals">
        <div className="grid grid-cols-2 gap-2">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => onSelectGoal(g.id)}
              className={`rounded-2xl border p-3 text-left transition ${
                goalId === g.id ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <div className="text-xl">{g.emoji}</div>
              <div className="mt-1 text-sm font-semibold">{g.label}</div>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <NumField label="Target weight (kg)" value={targetWeight} onChange={onTargetWeight} />
        </div>
      </Section>

      {/* Focus Areas */}
      <Section title="Focus Areas">
        <Row
          label="🎯 Edit Focus Areas"
          right={<span className="text-xs text-muted-foreground">Shoulder • Abs • Legs ›</span>}
          onClick={() => setShowFocusAreas(true)}
        />
      </Section>

      {/* Share */}
      <div className="mt-5 rounded-3xl gradient-card border border-border p-5 shadow-card">
        <div className="text-xs uppercase tracking-widest text-primary">Progress Card</div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <Stat label="Weight" value={`${weight}kg`} />
          <Stat label="Target" value={`${targetWeight}kg`} />
          <Stat label="BMI" value={bmi ? bmi.toFixed(1) : "--"} />
        </div>
        <button onClick={() => setShare(true)} className="mt-4 w-full rounded-xl gradient-accent text-primary-foreground font-semibold py-3 shadow-glow">
          ✨ Share My Progress
        </button>
        {note && <div className="mt-2 text-center text-[11px] text-primary">{note}</div>}
      </div>

      {/* Preferences */}
      <Section title="App Preferences">
        <Row label="🌗 Dark / Light Mode" right={<Toggle on={!lightMode} onClick={onToggleMode} />} />
        <Row label="🌐 Change Language" right={<span className="text-xs text-muted-foreground capitalize">{language} ›</span>} onClick={onOpenLang} />
      </Section>

      {/* Legal */}
      <Section title="Legal & Support">
        <Row label="💬 Help & Feedback" right={<span className="text-xs text-muted-foreground">›</span>} onClick={() => { setNote("Feedback: support@flexova.app"); setTimeout(() => setNote(null), 2500); }} />
        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full text-left px-4 py-3 text-xs text-muted-foreground"
        >
          Delete Account
        </button>
      </Section>

      <button onClick={onLogout} className="mt-6 w-full rounded-xl bg-destructive text-destructive-foreground font-bold py-3.5">
        Logout
      </button>
      <div className="mt-3 text-center text-[10px] text-muted-foreground">Flexova prototype • data resets on refresh</div>

      {share && (
        <Sheet onClose={() => setShare(false)}>
          <div className="rounded-3xl gradient-accent p-5 text-primary-foreground">
            <div className="text-xs uppercase tracking-widest opacity-80">Flexova</div>
            <div className="text-xl font-bold">{userName ?? "Fitness Warrior"}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm font-semibold">
              <div>🎯 {goalLabel}</div>
              <div>⚖️ {weight} kg</div>
              <div>📉 Target {targetWeight} kg</div>
              <div>📊 BMI {bmi ? bmi.toFixed(1) : "--"}</div>
            </div>
            <div className="mt-3 text-[11px] opacity-80">💧 {water}/8 glasses today</div>
          </div>
          <button onClick={shareProgress} className="mt-4 w-full rounded-xl gradient-accent text-primary-foreground font-semibold py-3">
            Share to Instagram / WhatsApp
          </button>
          <button onClick={() => setShare(false)} className="mt-2 w-full rounded-xl border border-border py-3 text-sm">
            Close
          </button>
        </Sheet>
      )}

      {confirmDelete && (
        <Sheet onClose={() => setConfirmDelete(false)}>
          <div className="font-bold">Delete account?</div>
          <p className="mt-1 text-xs text-muted-foreground">This clears your prototype session and all temporary data immediately.</p>
          <button onClick={onLogout} className="mt-4 w-full rounded-xl bg-destructive text-destructive-foreground font-bold py-3">
            Yes, delete
          </button>
          <button onClick={() => setConfirmDelete(false)} className="mt-2 w-full rounded-xl border border-border py-3 text-sm">
            Cancel
          </button>
        </Sheet>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{title}</div>
      <div className="rounded-2xl border border-border bg-card/40 p-3">{children}</div>
    </div>
  );
}

function Row({ label, right, onClick }: { label: string; right?: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-2 py-3 text-sm">
      <span>{label}</span>
      {right}
    </button>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <span
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition ${on ? "gradient-accent" : "bg-secondary"}`}
    >
      <span className={`h-5 w-5 rounded-full bg-card shadow transition ${on ? "translate-x-5" : ""}`} />
    </span>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-2">
      <div className="text-sm font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl border border-border bg-card p-5" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
