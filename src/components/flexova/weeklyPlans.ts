import type { Exercise, WorkoutPlan } from "./data";

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type WeekPlans = [WorkoutPlan, WorkoutPlan, WorkoutPlan, WorkoutPlan, WorkoutPlan, WorkoutPlan, WorkoutPlan];

/** Raw entry shape — mirrors the provided workout database JSON. */
type RawExercise = {
  name: string;
  sets: string;
  reps: string;
  duration: string;
  gif_placeholder: string;
  machine?: string;
  alternatives?: string[];
};
type RawDay = { focus: string; exercises: RawExercise[] };
type RawWeek = Record<string, RawDay>; // keyed by day name

const EMOJI: Record<string, string> = {
  jumping_jacks: "🤸",
  burpees: "💥",
  light_burpees: "💥",
  mountain_climbers: "⛰️",
  high_knees: "🦵",
  butt_kicks: "🦶",
  squats: "🦵",
  sumo_squats: "🌷",
  lunges: "🚶",
  reverse_lunges: "🚶‍♀️",
  glute_bridges: "🍑",
  donkey_kicks: "🍑",
  fire_hydrants: "🔥",
  calf_raises: "🐾",
  seated_calf: "🐾",
  plank: "🧱",
  plank_jacks: "🧱",
  bicycle_crunches: "🚴",
  heel_touches: "👟",
  dead_bug: "🐞",
  flutter_kicks: "🌊",
  leg_raises: "📐",
  hanging_legs: "📐",
  russian_twists: "🌀",
  weighted_crunches: "🏋️",
  pushups: "💪",
  knee_pushups: "💗",
  weighted_pushups: "🏋️",
  shoulder_press: "🚀",
  light_press: "💗",
  overhead_press: "🚀",
  bicep_curls: "💪",
  barbell_curls: "💪",
  hammer_curls: "🔨",
  dips: "🔻",
  tricep_extension: "🔻",
  tricep_kickbacks: "🔻",
  boxing: "🥊",
  squat_jumps: "⚡",
  sprint: "🏃",
  skater_jumps: "⛸️",
  down_dog: "🧘",
  cobra: "🐍",
  child_pose: "🧘‍♀️",
  cat_cow: "🐈",
  stretching: "🧘",
  rest: "😴",
  bench_press: "🏋️",
  incline_press: "🏋️",
  chest_flyes: "✨",
  lat_pulldown: "🎯",
  barbell_rows: "🎯",
  barbell_squats: "🦵",
  leg_press: "🦿",
  deadlifts: "⚡",
  deadlift_heavy: "⚡",
  lateral_raises: "🦋",
  rear_delt: "🦋",
  shrugs: "🏔️",
  farmers_walk: "🧳",
  yoga_flow: "🧘‍♀️",
  hip_thrust: "🍑",
  band_walk: "🎀",
  step_ups: "🪜",
  jump_rope: "🪢",
};

const MUSCLE: Record<string, string> = {
  "Full Body Cardio & HIIT": "Cardio",
  "Lower Body Toning": "Legs",
  "Core & Abs Blast": "Core",
  "Upper Body Strength (Light)": "Upper Body",
  "Stamina & Endurance Fat Burn": "Conditioning",
  "Full Body Flexibility & Mobility": "Mobility",
  "REST DAY": "Recovery",
};

/** "45s" | "1 min" | "90s" | "2 min" | "All Day" -> rest seconds */
function restFromDuration(d: string): number {
  const s = d.toLowerCase();
  if (s.includes("all day")) return 0;
  const min = s.match(/([\d.]+)\s*min/);
  if (min) return Math.min(120, Math.round(parseFloat(min[1]!) * 60));
  const sec = s.match(/([\d.]+)\s*s/);
  if (sec) return Math.round(parseFloat(sec[1]!));
  return 45;
}

function toWorkoutPlan(dayName: string, day: RawDay, keyPrefix: string): WorkoutPlan {
  const isRest = day.focus.toUpperCase().includes("REST");
  const exercises: Exercise[] = day.exercises.map((e, i) => ({
    id: `${keyPrefix}-${dayName.slice(0, 3).toLowerCase()}-${i}`,
    name: e.name,
    muscle: MUSCLE[day.focus] ?? day.focus,
    sets: Number(e.sets) || 1,
    reps: e.reps === "0" ? e.duration : e.reps,
    rest: restFromDuration(e.duration),
    emoji: EMOJI[e.gif_placeholder] ?? "🏋️",
    machine: e.machine,
    alternatives: e.alternatives,
  }));
  const totalSets = exercises.reduce((a, e) => a + e.sets, 0);
  const mins = isRest ? 0 : Math.max(15, Math.round(totalSets * 3));
  return {
    title: day.focus,
    subtitle: isRest ? `${dayName} • Recovery & nutrition` : `${dayName} • ${exercises.length} exercises`,
    duration: isRest ? "Rest" : `${mins} min`,
    calories: isRest ? "0 kcal" : `${mins * 9} kcal`,
    exercises,
  };
}

function buildWeek(raw: RawWeek, keyPrefix: string): WeekPlans {
  return DAY_NAMES.map((d) => toWorkoutPlan(d, raw[d]!, keyPrefix)) as WeekPlans;
}

// ===================== WORKOUT DATABASE =====================

const MALE_WEIGHT_LOSS_RAW: RawWeek = {
  Monday: {
    focus: "Full Body Cardio & HIIT",
    exercises: [
      { name: "Jumping Jacks", sets: "3", reps: "45 sec", duration: "45s", gif_placeholder: "jumping_jacks" },
      { name: "Burpees", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "burpees" },
      { name: "Mountain Climbers", sets: "4", reps: "30 sec", duration: "30s", gif_placeholder: "mountain_climbers" },
      { name: "High Knees", sets: "3", reps: "45 sec", duration: "45s", gif_placeholder: "high_knees" },
    ],
  },
  Tuesday: {
    focus: "Lower Body Toning",
    exercises: [
      { name: "Bodyweight Squats", sets: "4", reps: "20", duration: "1 min", gif_placeholder: "squats" },
      { name: "Walking Lunges", sets: "3", reps: "15 each leg", duration: "1 min", gif_placeholder: "lunges" },
      { name: "Glute Bridges", sets: "3", reps: "15", duration: "45s", gif_placeholder: "glute_bridges" },
      { name: "Calf Raises", sets: "4", reps: "25", duration: "45s", gif_placeholder: "calf_raises" },
    ],
  },
  Wednesday: {
    focus: "Core & Abs Blast",
    exercises: [
      { name: "Plank Hold", sets: "3", reps: "60 sec", duration: "1 min", gif_placeholder: "plank" },
      { name: "Bicycle Crunches", sets: "3", reps: "20", duration: "45s", gif_placeholder: "bicycle_crunches" },
      { name: "Leg Raises", sets: "4", reps: "15", duration: "1 min", gif_placeholder: "leg_raises" },
      { name: "Russian Twists", sets: "3", reps: "30", duration: "45s", gif_placeholder: "russian_twists" },
    ],
  },
  Thursday: {
    focus: "Upper Body Strength (Light)",
    exercises: [
      { name: "Push-Ups (Standard)", sets: "4", reps: "15", duration: "1 min", gif_placeholder: "pushups", alternatives: ["Knee Push-Ups", "Incline Push-Ups"] },
      { name: "Dumbbell Shoulder Press", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "shoulder_press", machine: "Dumbbells", alternatives: ["Arnold Press", "Pike Push-Ups"] },
      { name: "Dumbbell Bicep Curls", sets: "3", reps: "15", duration: "45s", gif_placeholder: "bicep_curls", machine: "Dumbbells", alternatives: ["Resistance Band Curls", "Hammer Curls"] },
      { name: "Tricep Chair Dips", sets: "3", reps: "12", duration: "45s", gif_placeholder: "dips", alternatives: ["Bench Dips", "Diamond Push-Ups"] },
    ],
  },
  Friday: {
    focus: "Stamina & Endurance Fat Burn",
    exercises: [
      { name: "Shadow Boxing", sets: "3", reps: "2 min", duration: "2 min", gif_placeholder: "boxing" },
      { name: "Squat Jumps", sets: "4", reps: "12", duration: "1 min", gif_placeholder: "squat_jumps" },
      { name: "Plank Jacks", sets: "3", reps: "20", duration: "45s", gif_placeholder: "plank_jacks" },
      { name: "Sprinting in Place", sets: "3", reps: "30 sec", duration: "30s", gif_placeholder: "sprint" },
    ],
  },
  Saturday: {
    focus: "Full Body Flexibility & Mobility",
    exercises: [
      { name: "Downward Dog Pose", sets: "2", reps: "1 min", duration: "1 min", gif_placeholder: "down_dog" },
      { name: "Cobra Stretch", sets: "3", reps: "30 sec", duration: "30s", gif_placeholder: "cobra" },
      { name: "Child's Pose", sets: "2", reps: "2 min", duration: "2 min", gif_placeholder: "child_pose" },
      { name: "Cat-Cow Stretch", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "cat_cow" },
    ],
  },
  Sunday: {
    focus: "REST DAY",
    exercises: [{ name: "Rest & Muscle Recovery", sets: "0", reps: "0", duration: "All Day", gif_placeholder: "rest" }],
  },
};

const MALE_WEIGHT_GAIN_RAW: RawWeek = {
  Monday: {
    focus: "Heavy Chest & Triceps",
    exercises: [
      { name: "Flat Bench Press", sets: "4", reps: "8-12", duration: "90s", gif_placeholder: "bench_press", machine: "Bench Press", alternatives: ["Dumbbell Press", "Machine Chest Press"] },
      { name: "Incline Dumbbell Press", sets: "3", reps: "10", duration: "90s", gif_placeholder: "incline_press", machine: "Incline Bench", alternatives: ["Incline Machine Press", "Incline Push-Ups"] },
      { name: "Chest Flyes", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "chest_flyes", machine: "Cable Machine", alternatives: ["Pec Deck", "Dumbbell Flyes"] },
      { name: "Overhead Tricep Extension", sets: "4", reps: "10", duration: "1 min", gif_placeholder: "tricep_extension", alternatives: ["Rope Pushdown", "Skull Crushers"] },
    ],
  },
  Tuesday: {
    focus: "Heavy Back & Biceps",
    exercises: [
      { name: "Pull-Ups or Lat Pulldowns", sets: "4", reps: "10", duration: "90s", gif_placeholder: "lat_pulldown", machine: "Lat Pulldown", alternatives: ["Assisted Pull-Ups", "Band Pulldown"] },
      { name: "Bent-Over Barbell Rows", sets: "3", reps: "8", duration: "90s", gif_placeholder: "barbell_rows", machine: "Barbell", alternatives: ["Dumbbell Rows", "Seated Cable Row"] },
      { name: "Barbell Bicep Curls", sets: "4", reps: "10", duration: "1 min", gif_placeholder: "barbell_curls", machine: "Barbell", alternatives: ["EZ Bar Curls", "Dumbbell Curls"] },
      { name: "Hammer Curls", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "hammer_curls", machine: "Dumbbells", alternatives: ["Rope Hammer Curl", "Band Curls"] },
    ],
  },
  Wednesday: {
    focus: "Active Recovery & Core",
    exercises: [
      { name: "Hanging Leg Raises", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "hanging_legs", machine: "Pull-Up Bar", alternatives: ["Lying Leg Raises", "Captain's Chair Raise"] },
      { name: "Weighted Crunches", sets: "3", reps: "15", duration: "1 min", gif_placeholder: "weighted_crunches" },
      { name: "Foam Rolling / Stretching", sets: "1", reps: "10 min", duration: "10 min", gif_placeholder: "stretching" },
    ],
  },
  Thursday: {
    focus: "Legs Devastation (Quads & Calves)",
    exercises: [
      { name: "Barbell Back Squats", sets: "4", reps: "8-10", duration: "2 min", gif_placeholder: "barbell_squats", machine: "Squat Rack", alternatives: ["Goblet Squat", "Hack Squat Machine"] },
      { name: "Leg Press Machine", sets: "3", reps: "10", duration: "90s", gif_placeholder: "leg_press", machine: "Leg Press", alternatives: ["Bulgarian Split Squat", "Walking Lunges"] },
      { name: "Romanian Deadlifts", sets: "3", reps: "10", duration: "90s", gif_placeholder: "deadlifts", machine: "Barbell", alternatives: ["Dumbbell RDL", "Good Mornings"] },
      { name: "Seated Calf Raises", sets: "4", reps: "15", duration: "1 min", gif_placeholder: "seated_calf", machine: "Calf Machine", alternatives: ["Standing Calf Raise", "Step Calf Raise"] },
    ],
  },
  Friday: {
    focus: "Shoulders & Traps Power",
    exercises: [
      { name: "Overhead Barbell Press", sets: "4", reps: "8", duration: "90s", gif_placeholder: "overhead_press", machine: "Barbell", alternatives: ["Dumbbell Shoulder Press", "Machine Press"] },
      { name: "Dumbbell Lateral Raises", sets: "4", reps: "12", duration: "1 min", gif_placeholder: "lateral_raises", machine: "Dumbbells", alternatives: ["Cable Lateral Raise", "Band Raise"] },
      { name: "Rear Delt Flyes", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "rear_delt", alternatives: ["Face Pulls", "Reverse Pec Deck"] },
      { name: "Barbell Shrugs", sets: "3", reps: "10", duration: "1 min", gif_placeholder: "shrugs", machine: "Barbell", alternatives: ["Dumbbell Shrugs", "Trap Bar Shrugs"] },
    ],
  },
  Saturday: {
    focus: "Full Body Compound Strength",
    exercises: [
      { name: "Conventional Deadlift", sets: "3", reps: "5", duration: "2 min", gif_placeholder: "deadlift_heavy", machine: "Barbell", alternatives: ["Trap Bar Deadlift", "Rack Pulls"] },
      { name: "Weighted Push-Ups", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "weighted_pushups", alternatives: ["Standard Push-Ups", "Dips"] },
      { name: "Farmer's Walk", sets: "3", reps: "40 meters", duration: "1 min", gif_placeholder: "farmers_walk", machine: "Dumbbells", alternatives: ["Suitcase Carry", "Kettlebell Carry"] },
    ],
  },
  Sunday: {
    focus: "REST DAY (Muscle Growth)",
    exercises: [{ name: "Rest & High Protein Nutrition", sets: "0", reps: "0", duration: "All Day", gif_placeholder: "rest" }],
  },
};

const FEMALE_WEIGHT_LOSS_RAW: RawWeek = {
  Monday: {
    focus: "Full Body Fat Burn & Cardio",
    exercises: [
      { name: "Jumping Jacks", sets: "3", reps: "40 sec", duration: "40s", gif_placeholder: "jumping_jacks" },
      { name: "Incline Mountain Climbers", sets: "3", reps: "30 sec", duration: "30s", gif_placeholder: "mountain_climbers" },
      { name: "Butt Kicks", sets: "4", reps: "45 sec", duration: "45s", gif_placeholder: "butt_kicks" },
      { name: "Light Burpees (No Push-Up)", sets: "3", reps: "10", duration: "1 min", gif_placeholder: "light_burpees" },
    ],
  },
  Tuesday: {
    focus: "Glutes & Thigh Toning",
    exercises: [
      { name: "Sumo Squats", sets: "4", reps: "15", duration: "1 min", gif_placeholder: "sumo_squats" },
      { name: "Reverse Lunges", sets: "3", reps: "12 each leg", duration: "1 min", gif_placeholder: "reverse_lunges" },
      { name: "Donkey Kicks", sets: "3", reps: "15 each leg", duration: "45s", gif_placeholder: "donkey_kicks" },
      { name: "Fire Hydrants", sets: "3", reps: "15 each leg", duration: "45s", gif_placeholder: "fire_hydrants" },
    ],
  },
  Wednesday: {
    focus: "Flat Belly & Core",
    exercises: [
      { name: "Forearm Plank", sets: "3", reps: "45 sec", duration: "45s", gif_placeholder: "plank" },
      { name: "Heel Touches", sets: "3", reps: "20", duration: "45s", gif_placeholder: "heel_touches" },
      { name: "Dead Bug Exercise", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "dead_bug" },
      { name: "Flutter Kicks", sets: "3", reps: "30 sec", duration: "30s", gif_placeholder: "flutter_kicks" },
    ],
  },
  Thursday: {
    focus: "Upper Body Definition (Light)",
    exercises: [
      { name: "Knee Push-Ups", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "knee_pushups", alternatives: ["Wall Push-Ups", "Incline Push-Ups"] },
      { name: "Light Dumbbell Press", sets: "3", reps: "15", duration: "1 min", gif_placeholder: "light_press", machine: "Dumbbells", alternatives: ["Band Chest Press", "Machine Press"] },
      { name: "Tricep Kickbacks", sets: "3", reps: "12", duration: "45s", gif_placeholder: "tricep_kickbacks", machine: "Dumbbells", alternatives: ["Band Kickbacks", "Chair Dips"] },
    ],
  },
  Friday: {
    focus: "HIIT Metabolic Circuit",
    exercises: [
      { name: "Skater Jumps", sets: "3", reps: "20", duration: "45s", gif_placeholder: "skater_jumps" },
      { name: "Squat Pulses", sets: "3", reps: "20", duration: "45s", gif_placeholder: "squats" },
      { name: "Jump Rope", sets: "4", reps: "45 sec", duration: "45s", gif_placeholder: "jump_rope", alternatives: ["Invisible Rope", "High Knees"] },
      { name: "Plank Shoulder Taps", sets: "3", reps: "20", duration: "45s", gif_placeholder: "plank" },
    ],
  },
  Saturday: {
    focus: "Yoga, Stretch & Mobility",
    exercises: [
      { name: "Sun Salutation Flow", sets: "2", reps: "2 min", duration: "2 min", gif_placeholder: "yoga_flow" },
      { name: "Downward Dog", sets: "2", reps: "1 min", duration: "1 min", gif_placeholder: "down_dog" },
      { name: "Cat-Cow Stretch", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "cat_cow" },
      { name: "Child's Pose", sets: "2", reps: "2 min", duration: "2 min", gif_placeholder: "child_pose" },
    ],
  },
  Sunday: {
    focus: "REST DAY",
    exercises: [{ name: "Rest & Light Walking", sets: "0", reps: "0", duration: "All Day", gif_placeholder: "rest" }],
  },
};

const FEMALE_WEIGHT_GAIN_RAW: RawWeek = {
  Monday: {
    focus: "Glute Build & Strength",
    exercises: [
      { name: "Barbell Hip Thrust", sets: "4", reps: "10", duration: "90s", gif_placeholder: "hip_thrust", machine: "Barbell/Bench", alternatives: ["Glute Bridge", "Single-Leg Bridge"] },
      { name: "Goblet Squats", sets: "4", reps: "10", duration: "1 min", gif_placeholder: "squats", machine: "Dumbbell", alternatives: ["Bodyweight Squat", "Leg Press"] },
      { name: "Romanian Deadlifts", sets: "3", reps: "10", duration: "90s", gif_placeholder: "deadlifts", machine: "Dumbbells", alternatives: ["Good Mornings", "Hamstring Curl"] },
      { name: "Resistance Band Walks", sets: "3", reps: "20 steps", duration: "45s", gif_placeholder: "band_walk" },
    ],
  },
  Tuesday: {
    focus: "Upper Body Tone & Shape",
    exercises: [
      { name: "Dumbbell Chest Press", sets: "4", reps: "12", duration: "1 min", gif_placeholder: "light_press", machine: "Dumbbells", alternatives: ["Machine Press", "Push-Ups"] },
      { name: "Seated Cable Row", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "lat_pulldown", machine: "Cable", alternatives: ["Dumbbell Row", "Band Row"] },
      { name: "Dumbbell Lateral Raises", sets: "3", reps: "15", duration: "45s", gif_placeholder: "lateral_raises" },
      { name: "Hammer Curls", sets: "3", reps: "12", duration: "45s", gif_placeholder: "hammer_curls" },
    ],
  },
  Wednesday: {
    focus: "Core Strength & Posture",
    exercises: [
      { name: "Weighted Russian Twists", sets: "3", reps: "20", duration: "45s", gif_placeholder: "russian_twists" },
      { name: "Leg Raises", sets: "3", reps: "15", duration: "1 min", gif_placeholder: "leg_raises" },
      { name: "Forearm Plank", sets: "3", reps: "60 sec", duration: "1 min", gif_placeholder: "plank" },
      { name: "Dead Bug Exercise", sets: "3", reps: "12", duration: "45s", gif_placeholder: "dead_bug" },
    ],
  },
  Thursday: {
    focus: "Legs & Quads Growth",
    exercises: [
      { name: "Leg Press Machine", sets: "4", reps: "12", duration: "90s", gif_placeholder: "leg_press", machine: "Leg Press", alternatives: ["Goblet Squat", "Split Squat"] },
      { name: "Bulgarian Split Squats", sets: "3", reps: "10 each leg", duration: "1 min", gif_placeholder: "lunges" },
      { name: "Step-Ups with Dumbbells", sets: "3", reps: "12 each leg", duration: "1 min", gif_placeholder: "step_ups" },
      { name: "Seated Calf Raises", sets: "4", reps: "15", duration: "45s", gif_placeholder: "seated_calf" },
    ],
  },
  Friday: {
    focus: "Full Body Power & Curves",
    exercises: [
      { name: "Sumo Deadlifts", sets: "4", reps: "8", duration: "90s", gif_placeholder: "deadlifts", machine: "Barbell", alternatives: ["Dumbbell Deadlift", "Kettlebell Deadlift"] },
      { name: "Hip Thrust", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "hip_thrust" },
      { name: "Incline Dumbbell Press", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "incline_press" },
      { name: "Cable Rope Curls", sets: "3", reps: "12", duration: "45s", gif_placeholder: "barbell_curls" },
    ],
  },
  Saturday: {
    focus: "Mobility & Light Volume",
    exercises: [
      { name: "Glute Bridges", sets: "3", reps: "15", duration: "45s", gif_placeholder: "glute_bridges" },
      { name: "Sun Salutation Flow", sets: "2", reps: "2 min", duration: "2 min", gif_placeholder: "yoga_flow" },
      { name: "Cat-Cow Stretch", sets: "3", reps: "12", duration: "1 min", gif_placeholder: "cat_cow" },
      { name: "Child's Pose", sets: "2", reps: "2 min", duration: "2 min", gif_placeholder: "child_pose" },
    ],
  },
  Sunday: {
    focus: "REST DAY (Recovery & Nutrition)",
    exercises: [{ name: "Rest & High Protein Nutrition", sets: "0", reps: "0", duration: "All Day", gif_placeholder: "rest" }],
  },
};

/** Raw JSON-shaped database, exposed for reference/extension. */
export const WORKOUT_DB: Record<"male" | "female", Record<string, RawWeek>> = {
  male: { weight_loss: MALE_WEIGHT_LOSS_RAW, weight_gain: MALE_WEIGHT_GAIN_RAW },
  female: { weight_loss: FEMALE_WEIGHT_LOSS_RAW, weight_gain: FEMALE_WEIGHT_GAIN_RAW },
};

export const WEEKLY_PLANS: Record<"male" | "female", Record<string, WeekPlans>> = {
  male: {
    weight_loss: buildWeek(MALE_WEIGHT_LOSS_RAW, "mwl"),
    weight_gain: buildWeek(MALE_WEIGHT_GAIN_RAW, "mwg"),
  },
  female: {
    weight_loss: buildWeek(FEMALE_WEIGHT_LOSS_RAW, "fwl"),
    weight_gain: buildWeek(FEMALE_WEIGHT_GAIN_RAW, "fwg"),
  },
};

/** Returns today's plan from the 7-day routine, or null if the goal has no weekly routine. */
export function getDailyPlan(
  gender: "male" | "female",
  goal: string | null,
  dayIndex: number = new Date().getDay(),
): WorkoutPlan | null {
  if (!goal) return null;
  const week = WEEKLY_PLANS[gender]?.[goal];
  return week ? week[dayIndex % 7]! : null;
}
