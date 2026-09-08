import warmupAsset from "@/assets/loops/m_warmup.mp4.asset.json";
import cardioAsset from "@/assets/loops/m_cardio.mp4.asset.json";
import upperAsset from "@/assets/loops/m_upper.mp4.asset.json";
import lowerAsset from "@/assets/loops/m_lower.mp4.asset.json";
import fWarmupAsset from "@/assets/loops/f_warmup.mp4.asset.json";
import fCardioAsset from "@/assets/loops/f_cardio.mp4.asset.json";
import fUpperAsset from "@/assets/loops/f_upper.mp4.asset.json";
import fLowerAsset from "@/assets/loops/f_lower.mp4.asset.json";

export const LOOPS = {
  warmup: warmupAsset.url,
  cardio: cardioAsset.url,
  upper: upperAsset.url,
  lower: lowerAsset.url,
} as const;

/** Fallback used whenever an exercise is not present in the catalog. */
export const FALLBACK_LOOP = LOOPS.warmup;

const normalize = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Global exercise -> 3D loop video catalog (free + premium exercises). */
const RAW_CATALOG: Record<string, string> = {
  // Cardio / conditioning
  "Jumping Jacks": LOOPS.cardio,
  "Burpees": LOOPS.cardio,
  "Mountain Climbers": LOOPS.cardio,
  "High Knees": LOOPS.cardio,
  "Jump Rope": LOOPS.cardio,
  "Treadmill Sprint": LOOPS.cardio,
  "Jump Squats": LOOPS.cardio,
  "Kettlebell Swings": LOOPS.cardio,
  "Gentle Walk-in-place": LOOPS.cardio,

  // Chest / shoulders / arms / back
  "Close Grip Chest Press": LOOPS.upper,
  "Chest Fly": LOOPS.upper,
  "Cable Chest Fly": LOOPS.upper,
  "Dumbbell Pullover": LOOPS.upper,
  "Barbell Bench Press": LOOPS.upper,
  "Incline Dumbbell Press": LOOPS.upper,
  "Dumbbell Press": LOOPS.upper,
  "Push Ups": LOOPS.upper,
  "Wall Push Up": LOOPS.upper,
  "Dips": LOOPS.upper,
  "Overhead Press": LOOPS.upper,
  "Dumbbell Shoulder Press": LOOPS.upper,
  "Lateral Raise": LOOPS.upper,
  "Barbell Curl": LOOPS.upper,
  "Tricep Rope Pushdown": LOOPS.upper,
  "Bent-over Rows": LOOPS.upper,
  "Dumbbell Row": LOOPS.upper,
  "Cable Row": LOOPS.upper,

  // Lower body / glutes / core
  "Barbell Squats": LOOPS.lower,
  "Goblet Squat": LOOPS.lower,
  "Bodyweight Squat": LOOPS.lower,
  "Sumo Squat": LOOPS.lower,
  "Deadlift": LOOPS.lower,
  "Romanian Deadlift": LOOPS.lower,
  "Hip Thrust": LOOPS.lower,
  "Glute Bridge": LOOPS.lower,
  "Walking Lunges": LOOPS.lower,
  "Curtsy Lunge": LOOPS.lower,
  "Donkey Kicks": LOOPS.lower,
  "Fire Hydrants": LOOPS.lower,
  "Side-lying Leg Raise": LOOPS.lower,
  "Bicycle Crunches": LOOPS.lower,
  "Russian Twist": LOOPS.lower,
  "Plank": LOOPS.lower,
  "Bird Dog": LOOPS.lower,

  // Mobility / recovery
  "Cat-Cow": LOOPS.warmup,
  "Cat-Cow Flow": LOOPS.warmup,
  "Cat-Cow Stretch": LOOPS.warmup,
  "Child's Pose": LOOPS.warmup,
  "Supine Twist": LOOPS.warmup,
  "Deep Breathing": LOOPS.warmup,
  "Reclined Butterfly": LOOPS.warmup,
  "Legs-up-the-Wall": LOOPS.warmup,
  "Hip Opener": LOOPS.warmup,
  "Seated Forward Fold": LOOPS.warmup,
  "Standing Hip Circles": LOOPS.warmup,
};

const CATALOG: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_CATALOG).map(([k, v]) => [normalize(k), v]),
);

/** Always returns a playable loop URL — never undefined. */
export function getExerciseLoop(name: string): string {
  return CATALOG[normalize(name)] ?? FALLBACK_LOOP;
}

/**
 * Gender-aware loop lookup. Male/female specific clips are registered here as
 * they become available; anything unregistered falls back to the shared loop.
 */
const GENDER_CATALOG: Record<"male" | "female", Record<string, string>> = {
  male: {},
  female: {},
};

export function getExerciseLoopFor(name: string, gender: "male" | "female"): string {
  return GENDER_CATALOG[gender][normalize(name)] ?? getExerciseLoop(name);
}

/** Neon glow colour per muscle group for the 3D container overlay. */
export function getMuscleGlow(muscle: string): string {
  const m = muscle.toLowerCase();
  if (/(chest|pec)/.test(m)) return "oklch(0.78 0.19 25)";
  if (/(back|lat)/.test(m)) return "oklch(0.75 0.18 260)";
  if (/(shoulder|delt)/.test(m)) return "oklch(0.82 0.18 80)";
  if (/(arm|bicep|tricep)/.test(m)) return "oklch(0.78 0.18 300)";
  if (/(core|abs|oblique)/.test(m)) return "oklch(0.85 0.19 190)";
  if (/(glute|butt|hip)/.test(m)) return "oklch(0.78 0.18 340)";
  if (/(leg|quad|hamstring|calf)/.test(m)) return "oklch(0.80 0.19 150)";
  if (/(cardio|full)/.test(m)) return "oklch(0.87 0.19 130)";
  return "oklch(0.87 0.19 130)";
}
