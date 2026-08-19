export type Goal = string;

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  rest: number; // seconds
  emoji: string;
  machine?: string;
  alternatives?: string[];
};

export type WorkoutPlan = {
  title: string;
  subtitle: string;
  duration: string;
  calories: string;
  exercises: Exercise[];
};

export const MALE_GOALS = [
  { id: "weight_loss", label: "Weight Loss", desc: "Cut fat, keep strength", emoji: "🔥" },
  { id: "weight_gain", label: "Weight Gain", desc: "Structured surplus", emoji: "📈" },
  { id: "muscle", label: "Muscle Building", desc: "Hypertrophy focus", emoji: "💪" },
  { id: "fitness", label: "General Fitness", desc: "Balanced full body", emoji: "⚡" },
];

export const FEMALE_GOALS = [
  { id: "weight_loss", label: "Weight Loss", desc: "Lean & toned", emoji: "🌸" },
  { id: "weight_gain", label: "Weight Gain", desc: "Healthy curves", emoji: "🌷" },
  { id: "fitness", label: "Fitness", desc: "Feel your best", emoji: "✨" },
  { id: "shaping", label: "Body Shaping", desc: "Sculpt & define", emoji: "💫" },
];

const ex = (
  id: string,
  name: string,
  muscle: string,
  sets: number,
  reps: string,
  rest: number,
  emoji: string,
  machine?: string,
  alternatives?: string[],
): Exercise => ({ id, name, muscle, sets, reps, rest, emoji, machine, alternatives });

export const MALE_PLANS: Record<string, WorkoutPlan> = {
  weight_loss: {
    title: "Fat Burn Circuit",
    subtitle: "HIIT + Compound lifts",
    duration: "45 min",
    calories: "480 kcal",
    exercises: [
      ex("m1", "Treadmill Sprint", "Cardio", 4, "40 sec", 30, "🏃", "Treadmill", ["Jump Rope", "High Knees", "Burpees"]),
      ex("m2", "Kettlebell Swings", "Full Body", 4, "15 reps", 45, "🏋️", "Kettlebell", ["Dumbbell Swings", "Goblet Squats"]),
      ex("m3", "Barbell Squats", "Legs", 3, "12 reps", 60, "🦵", "Squat Rack", ["Goblet Squat", "Bulgarian Split Squat"]),
      ex("m4", "Push Ups", "Chest", 3, "20 reps", 45, "💥"),
      ex("m5", "Mountain Climbers", "Core", 3, "40 sec", 30, "⛰️"),
    ],
  },
  weight_gain: {
    title: "Mass Builder",
    subtitle: "Heavy compound day",
    duration: "60 min",
    calories: "520 kcal",
    exercises: [
      ex("m6", "Barbell Bench Press", "Chest", 4, "8 reps", 90, "🏋️", "Bench Press", ["Dumbbell Press", "Push Ups"]),
      ex("m7", "Deadlift", "Back/Legs", 4, "6 reps", 120, "⚡", "Barbell", ["Trap Bar Deadlift", "Romanian Deadlift"]),
      ex("m8", "Bent-over Rows", "Back", 4, "10 reps", 75, "🎯", "Barbell", ["Dumbbell Rows", "Cable Row"]),
      ex("m9", "Overhead Press", "Shoulders", 3, "8 reps", 75, "🚀", "Barbell", ["Dumbbell Shoulder Press", "Arnold Press"]),
      ex("m10", "Barbell Curl", "Biceps", 3, "10 reps", 60, "💪"),
    ],
  },
  muscle: {
    title: "Hypertrophy Split — Push",
    subtitle: "Chest • Shoulders • Triceps",
    duration: "55 min",
    calories: "460 kcal",
    exercises: [
      ex("m11", "Incline Dumbbell Press", "Upper Chest", 4, "10 reps", 75, "🏋️", "Incline Bench", ["Incline Push Up", "Cable Chest Press"]),
      ex("m12", "Cable Chest Fly", "Chest", 3, "12 reps", 60, "✨", "Cable Machine", ["Dumbbell Fly", "Pec Deck"]),
      ex("m13", "Dumbbell Shoulder Press", "Shoulders", 4, "10 reps", 75, "🚀"),
      ex("m14", "Lateral Raise", "Delts", 3, "15 reps", 45, "🦋"),
      ex("m15", "Tricep Rope Pushdown", "Triceps", 3, "12 reps", 60, "💪", "Cable Machine", ["Overhead Extension", "Dips"]),
      ex("m16", "Dips", "Triceps/Chest", 3, "10 reps", 60, "🔻"),
    ],
  },
  fitness: {
    title: "Total Body Flow",
    subtitle: "Balanced strength + mobility",
    duration: "40 min",
    calories: "380 kcal",
    exercises: [
      ex("m17", "Goblet Squat", "Legs", 3, "12 reps", 45, "🦵"),
      ex("m18", "Push Ups", "Chest", 3, "15 reps", 45, "💥"),
      ex("m19", "Dumbbell Row", "Back", 3, "12 reps", 45, "🎯"),
      ex("m20", "Plank", "Core", 3, "45 sec", 30, "🧱"),
      ex("m21", "Jump Squats", "Legs/Cardio", 3, "20 reps", 45, "⚡"),
    ],
  },
};

export const FEMALE_PLANS: Record<string, WorkoutPlan> = {
  weight_loss: {
    title: "Lean Sculpt Flow",
    subtitle: "Low impact fat burn",
    duration: "35 min",
    calories: "320 kcal",
    exercises: [
      ex("f1", "Glute Bridge", "Glutes", 3, "15 reps", 30, "🌸"),
      ex("f2", "Sumo Squat", "Glutes/Thighs", 3, "15 reps", 45, "🌷"),
      ex("f3", "Dumbbell Row", "Back", 3, "12 reps", 45, "💫"),
      ex("f4", "Bicycle Crunches", "Core", 3, "20 reps", 30, "✨"),
      ex("f5", "Walking Lunges", "Legs", 3, "12/side", 45, "🚶‍♀️"),
    ],
  },
  weight_gain: {
    title: "Strong & Curvy",
    subtitle: "Progressive strength",
    duration: "45 min",
    calories: "360 kcal",
    exercises: [
      ex("f6", "Hip Thrust", "Glutes", 4, "10 reps", 75, "🍑", "Barbell/Bench", ["Glute Bridge", "Single-leg Bridge"]),
      ex("f7", "Goblet Squat", "Legs", 4, "10 reps", 60, "🌷"),
      ex("f8", "Romanian Deadlift", "Hamstrings", 3, "10 reps", 75, "🌹"),
      ex("f9", "Dumbbell Press", "Chest", 3, "12 reps", 60, "💗"),
      ex("f10", "Cable Row", "Back", 3, "12 reps", 60, "✨", "Cable", ["Dumbbell Row", "Resistance Band Row"]),
    ],
  },
  fitness: {
    title: "Feel-Good Flow",
    subtitle: "Mobility + light strength",
    duration: "30 min",
    calories: "260 kcal",
    exercises: [
      ex("f11", "Cat-Cow Flow", "Spine", 2, "45 sec", 20, "🐈"),
      ex("f12", "Bodyweight Squat", "Legs", 3, "15 reps", 30, "🌿"),
      ex("f13", "Bird Dog", "Core", 3, "10/side", 30, "🐦"),
      ex("f14", "Wall Push Up", "Chest", 3, "12 reps", 30, "🌸"),
      ex("f15", "Standing Hip Circles", "Hips", 2, "40 sec", 20, "🌀"),
    ],
  },
  shaping: {
    title: "Body Sculpt",
    subtitle: "Hips • Core • Legs",
    duration: "40 min",
    calories: "310 kcal",
    exercises: [
      ex("f16", "Curtsy Lunge", "Glutes", 3, "12/side", 45, "💃"),
      ex("f17", "Side-lying Leg Raise", "Hips", 3, "15/side", 30, "🌸"),
      ex("f18", "Fire Hydrants", "Glute Medius", 3, "15/side", 30, "🔥"),
      ex("f19", "Russian Twist", "Obliques", 3, "20 reps", 30, "🌀"),
      ex("f20", "Donkey Kicks", "Glutes", 3, "15/side", 30, "🍑"),
    ],
  },
};

export const PERIOD_PLAN: Record<"early" | "mid" | "late", WorkoutPlan> = {
  early: {
    title: "Yoga & Stretch — Day 1-3",
    subtitle: "No intense lifts • Gentle yoga only",
    duration: "18 min",
    calories: "90 kcal",
    exercises: [
      ex("p1", "Deep Breathing", "Mind", 2, "2 min", 15, "🌬️"),
      ex("p2", "Child's Pose", "Back", 2, "60 sec", 20, "🧘‍♀️"),
      ex("p3", "Supine Twist", "Spine", 2, "45 sec/side", 20, "🌀"),
      ex("p12", "Cat-Cow Stretch", "Spine", 2, "60 sec", 20, "🐈"),
      ex("p13", "Reclined Butterfly", "Hips", 2, "60 sec", 20, "🦋"),
      ex("p14", "Legs-up-the-Wall", "Recovery", 1, "3 min", 20, "🧘"),
    ],
  },
  mid: {
    title: "Gentle Flow — Day 4-5",
    subtitle: "Light mobility & stretching",
    duration: "20 min",
    calories: "120 kcal",
    exercises: [
      ex("p4", "Cat-Cow", "Spine", 2, "60 sec", 20, "🐈"),
      ex("p5", "Hip Opener", "Hips", 2, "45 sec", 20, "🌸"),
      ex("p6", "Gentle Walk-in-place", "Cardio", 2, "3 min", 30, "🚶‍♀️"),
      ex("p7", "Seated Forward Fold", "Hamstrings", 2, "60 sec", 20, "🌿"),
    ],
  },
  late: {
    title: "Rebuild — Day 6+",
    subtitle: "Energy is returning",
    duration: "30 min",
    calories: "220 kcal",
    exercises: [
      ex("p8", "Glute Bridge", "Glutes", 3, "12 reps", 30, "🌸"),
      ex("p9", "Bodyweight Squat", "Legs", 3, "12 reps", 30, "🌷"),
      ex("p10", "Wall Push Up", "Chest", 3, "10 reps", 30, "💗"),
      ex("p11", "Bird Dog", "Core", 3, "10/side", 30, "🐦"),
    ],
  },
};

export const FEMALE_CATEGORIES = [
  { id: "hip", label: "Hip Focused", emoji: "🍑", desc: "Glute activation" },
  { id: "lower", label: "Lower Body", emoji: "🦵", desc: "Legs & thighs" },
  { id: "strength", label: "Strength", emoji: "💪", desc: "Build & tone" },
  { id: "mobility", label: "Mobility", emoji: "🧘‍♀️", desc: "Flexibility flow" },
];

export const FOOD_DEMO = [
  { name: "Grilled Chicken Bowl", kcal: 420, protein: 38, carbs: 32, fat: 14, confidence: 0.92, emoji: "🍗" },
  { name: "Avocado Toast", kcal: 310, protein: 9, carbs: 34, fat: 16, confidence: 0.87, emoji: "🥑" },
  { name: "Paneer Tikka", kcal: 380, protein: 22, carbs: 12, fat: 26, confidence: 0.78, emoji: "🧆" },
  { name: "Fruit Salad", kcal: 180, protein: 2, carbs: 42, fat: 1, confidence: 0.55, emoji: "🍓" },
];

export const LANGUAGES = [
  { id: "hinglish", label: "Hinglish", note: "Default • Aapke liye best", flag: "🇮🇳" },
  { id: "english", label: "English", note: "International", flag: "🇬🇧" },
  { id: "hindi", label: "हिन्दी", note: "Hindi", flag: "🇮🇳" },
];
