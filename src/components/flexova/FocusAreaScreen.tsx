import { useState } from "react";
import { Check } from "lucide-react";
import maleBody from "@/assets/focus-body.png";
import femaleBody from "@/assets/focus-body-female.png";

type Area = {
  id: string;
  label: string;
  side: "left" | "right";
  /** vertical position (%) of the button and the dot */
  top: number;
  /** horizontal position (%) of the anchor dot on the body */
  dotX: number;
  dotY: number;
};

const AREAS: Area[] = [
  { id: "shoulder", label: "Shoulder", side: "right", top: 22, dotX: 63, dotY: 24 },
  { id: "arm", label: "Arm", side: "right", top: 37, dotX: 69, dotY: 39 },
  { id: "abs", label: "Abs", side: "right", top: 52, dotX: 54, dotY: 50 },
  { id: "leg", label: "Leg", side: "right", top: 74, dotX: 57, dotY: 73 },
  { id: "back", label: "Back", side: "left", top: 22, dotX: 39, dotY: 27 },
  { id: "chest", label: "Chest", side: "left", top: 37, dotX: 44, dotY: 36 },
  { id: "butt", label: "Butt", side: "left", top: 58, dotX: 43, dotY: 60 },
  { id: "fullbody", label: "Full Body", side: "left", top: 86, dotX: 47, dotY: 88 },
];

const BTN_EDGE_LEFT = 30; // right edge (%) of left-side buttons
const BTN_EDGE_RIGHT = 70; // left edge (%) of right-side buttons

export function FocusAreaScreen({
  gender = "male",
  onSave,
  onBack,
}: {
  gender?: "male" | "female";
  onSave?: (areas: string[]) => void;
  onBack?: () => void;
}) {
  const bodyImg = gender === "female" ? femaleBody : maleBody;
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const save = () => {
    if (!selected.length) return;
    console.log("Selected focus areas:", selected);
    onSave?.(selected);
  };

  return (
    <div className="flex h-full max-h-screen min-h-screen flex-col overflow-y-auto overscroll-contain bg-white text-neutral-900" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="px-6 pt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-3 text-xs font-semibold text-neutral-500"
          >
            ← Back
          </button>
        )}
        <h1 className="text-2xl font-black tracking-tight">Focus Area</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Pick one or more muscle groups you want to train.
        </p>
      </div>

      {/* Body map */}
      <div className="relative mx-auto mt-4 w-full max-w-sm shrink-0 px-3 pb-6">
        <div className="relative w-full" style={{ aspectRatio: "3 / 5" }}>
          <img
            src={bodyImg}
            alt="Fitness athlete showing muscle focus areas"
            width={640}
            height={1216}
            loading="lazy"
            decoding="async"
            className="absolute left-1/2 top-0 h-full w-auto -translate-x-1/2 object-contain"
          />

          {AREAS.map((a) => {
            const active = selected.includes(a.id);
            const edge = a.side === "left" ? BTN_EDGE_LEFT : BTN_EDGE_RIGHT;
            const lineLeft = Math.min(edge, a.dotX);
            const lineWidth = Math.abs(a.dotX - edge);
            return (
              <div key={a.id}>
                {/* connector */}
                <span
                  className={`pointer-events-none absolute h-px transition-colors ${
                    active ? "bg-neutral-900" : "bg-neutral-300"
                  }`}
                  style={{
                    left: `${lineLeft}%`,
                    width: `${lineWidth}%`,
                    top: `${(a.top + a.dotY) / 2}%`,
                  }}
                />
                {/* anchor dot */}
                <button
                  type="button"
                  aria-label={`${a.label} marker`}
                  aria-pressed={active}
                  onClick={() => toggle(a.id)}
                  className={`absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all ${
                    active
                      ? "scale-125 border-white bg-lime-400 shadow-[0_0_0_3px_rgba(163,230,53,0.35)]"
                      : "border-white bg-neutral-900/80"
                  }`}
                  style={{ left: `${a.dotX}%`, top: `${a.dotY}%` }}
                />
                {/* label button */}
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(a.id)}
                  className={`absolute -translate-y-1/2 rounded-full border px-3 py-1.5 text-[13px] transition-all active:scale-95 ${
                    a.side === "left" ? "text-left" : "text-right"
                  } ${
                    active
                      ? "border-lime-400 bg-lime-400 font-bold text-neutral-900 shadow-md"
                      : "border-neutral-200 bg-neutral-50 font-medium text-neutral-700"
                  }`}
                  style={
                    a.side === "left"
                      ? { left: 0, top: `${a.top}%`, minWidth: "24%" }
                      : { right: 0, top: `${a.top}%`, minWidth: "24%" }
                  }
                >
                  {a.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="sticky bottom-0 mt-2 border-t border-neutral-100 bg-white px-6 pb-6 pt-4">
        <p className="mb-2 text-center text-xs text-neutral-400">
          {selected.length
            ? `${selected.length} area${selected.length > 1 ? "s" : ""} selected`
            : "Select at least one area"}
        </p>
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={save}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all ${
            selected.length
              ? "bg-neutral-900 text-white shadow-lg active:scale-[0.98]"
              : "cursor-not-allowed bg-neutral-200 text-neutral-400"
          }`}
        >
          <Check className="h-5 w-5" />
          Save
        </button>
      </div>
    </div>
  );
}
