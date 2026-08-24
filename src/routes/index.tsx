import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame, StatusBar } from "@/components/flexova/PhoneFrame";
import { Splash } from "@/components/flexova/Splash";
import { LanguageScreen } from "@/components/flexova/LanguageScreen";
import { CountryScreen } from "@/components/flexova/CountryScreen";
import { AuthScreen } from "@/components/flexova/AuthScreen";
import { WelcomeScreen } from "@/components/flexova/WelcomeScreen";
import { GoalScreen } from "@/components/flexova/GoalScreen";
import { PeriodScreen } from "@/components/flexova/PeriodScreen";
import { Dashboard } from "@/components/flexova/Dashboard";
import { WorkoutSession } from "@/components/flexova/WorkoutSession";
import { FoodScanner } from "@/components/flexova/FoodScanner";
import { Subscription } from "@/components/flexova/Subscription";
import { InstallBanner } from "@/components/flexova/InstallBanner";
import { AccountScreen } from "@/components/flexova/AccountScreen";
import { FocusAreaScreen } from "@/components/flexova/FocusAreaScreen";

import {
  MALE_GOALS,
  FEMALE_GOALS,
  MALE_PLANS,
  FEMALE_PLANS,
  type WorkoutPlan,
} from "@/components/flexova/data";
import { getDailyPlan, DAY_NAMES } from "@/components/flexova/weeklyPlans";
import { I18nProvider, translate, type TranslationKey } from "@/lib/i18n";
import { pricingFor, type ClimateLocation } from "@/lib/geo";
import { detectClimateLocation } from "@/lib/geo.functions";

export const Route = createFileRoute("/")({
  component: Flexova,
});

type Screen =
  | "splash"
  | "country"
  | "language"
  | "auth"
  | "welcome"
  | "goal"
  | "period"
  | "focus"
  | "dashboard"
  | "workout"
  | "scanner"
  | "subscription"
  | "account"
  | "settings-lang";

// Screens that already render their own in-screen back/exit control
const SCREENS_WITH_OWN_BACK = new Set<Screen>([
  "goal",
  "period",
  "focus",
  "workout",
  "scanner",
  "subscription",
  "account",
  "settings-lang",
  "country",
]);




function Flexova() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [language, setLanguageState] = useState("hinglish");

  // Global language state: restored on load and persisted across navigation/sessions
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("flexova.language") : null;
    if (saved) setLanguageState(saved);
  }, []);
  const setLanguage = (l: string) => {
    setLanguageState(l);
    try {
      window.localStorage.setItem("flexova.language", l);
    } catch {
      /* storage unavailable */
    }
  };
  const [country, setCountry] = useState<string | null>(null);
  const [climate, setClimate] = useState<ClimateLocation | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [tab, setTab] = useState<"home" | "track" | "diet" | "progress" | "scan" | "plus">("home");
  const [isPremium, setIsPremium] = useState(false);
  const [cyclePhase, setCyclePhase] = useState<"early" | "mid" | "late" | null>(null);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [periodBanner, setPeriodBanner] = useState<string | null>(null);
  const [history, setHistory] = useState<Screen[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [bodyWeight, setBodyWeight] = useState(70);
  const [bodyHeight, setBodyHeight] = useState(170);
  const [targetWeight, setTargetWeight] = useState(65);
  const [lightMode, setLightMode] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");



  const go = (s: Screen) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
  };
  const goRoot = (s: Screen) => {
    setHistory([]);
    setScreen(s);
  };
  const back = () => {
    if (screen === "dashboard" && tab !== "home") {
      setTab("home");
      return;
    }
    const prev = history[history.length - 1];
    if (!prev) return;
    setScreen(prev);
    setHistory((h) => h.slice(0, -1));
  };
  const canGoBack =
    screen !== "splash" &&
    (history.length > 0 || (screen === "dashboard" && tab !== "home"));

  // Android / browser hardware back button
  useEffect(() => {
    window.history.pushState({ flexova: true }, "");
    const onPop = () => {
      backRef.current();
      window.history.pushState({ flexova: true }, "");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const backRef = useRef(back);
  backRef.current = back;

  // Auto IP / network based climate location detection on launch
  useEffect(() => {
    let cancelled = false;
    detectClimateLocation()
      .then((loc) => {
        if (cancelled) return;
        setClimate(loc);
        setCountry((c) => c ?? (["IN", "US", "GB", "CA", "AE", "AU"].includes(loc.countryCode) ? loc.countryCode : null));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const pricing = pricingFor(climate?.countryCode);

  // Apply theme via data attribute
  useEffect(() => {
    const el = document.documentElement;
    if (gender === "female") el.setAttribute("data-theme", "female");
    else el.removeAttribute("data-theme");
    return () => el.removeAttribute("data-theme");
  }, [gender]);

  // Light / dark mode
  useEffect(() => {
    const el = document.documentElement;
    if (lightMode) el.setAttribute("data-mode", "light");
    else el.removeAttribute("data-mode");
    return () => el.removeAttribute("data-mode");
  }, [lightMode]);


  const rawGoals = gender === "male" ? MALE_GOALS : FEMALE_GOALS;
  const goalGender = gender === "male" ? "male" : "female";
  const goals = rawGoals.map((g) => ({
    ...g,
    label: translate(language, `goal.${g.id}` as TranslationKey),
    desc: translate(language, `goalDesc.${goalGender}.${g.id}` as TranslationKey),
  }));
  const plans = gender === "male" ? MALE_PLANS : FEMALE_PLANS;
  const today = new Date().getDay();
  const dailyPlan = gender ? getDailyPlan(gender, goal, today) : null;
  const defaultPlan = dailyPlan ?? (goal && plans[goal] ? plans[goal] : Object.values(plans)[0]);
  const displayPlan = activePlan ?? defaultPlan;
  const baseGoalLabel = goals.find((g) => g.id === goal)?.label ?? translate(language, "goal.yourPlan");
  const goalLabel = dailyPlan && !activePlan ? `${baseGoalLabel} • ${DAY_NAMES[today]}` : baseGoalLabel;

  // ---- Live daily stats (in-memory only, resets on refresh) ----
  const [workoutDuration, setWorkoutDuration] = useState(0); // minutes
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [stepsCount, setStepsCount] = useState(0);
  const [exercisesDone, setExercisesDone] = useState(0);

  const num = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
  const planCalories = num(displayPlan.calories);
  const planDuration = num(displayPlan.duration);
  const totalExercises = displayPlan.exercises.length || 1;
  const dailyCalorieGoal = Math.max(200, planCalories || 500);

  const onExerciseComplete = () => {
    setExercisesDone((n) => n + 1);
    setCaloriesBurned((c) => c + Math.round(planCalories / totalExercises));
    setWorkoutDuration((d) => d + Math.max(1, Math.round(planDuration / totalExercises)));
    setStepsCount((s) => s + 250 + Math.round(Math.random() * 150));
  };

  // ---- Weekly consistency (Mon..Sun, in-memory only) ----
  const todayIdx = today === 0 ? 6 : today - 1;
  const weekDone = Array.from({ length: 7 }, (_, i) => i === todayIdx && exercisesDone > 0);
  const weekPeriod = Array.from({ length: 7 }, (_, i) => i === todayIdx && periodBanner !== null);

  const stats = {
    workoutDuration,
    caloriesBurned,
    stepsCount,
    dailyCalorieGoal,
    exercisesDone,
    exercisesTotal: totalExercises,
  };

  const resetSession = () => {
    setGender(null);
    setGoal(null);
    setActivePlan(null);
    setPeriodBanner(null);
    setCyclePhase(null);
    setTab("home");
    setWorkoutDuration(0);
    setCaloriesBurned(0);
    setStepsCount(0);
    setExercisesDone(0);
    setPhoto(null);
    setIsPremium(false);
  };

  const logout = () => {
    resetSession();
    setUserName(null);
    setAuthMode("login");
    goRoot("auth");
  };


  return (
    <I18nProvider language={language} setLanguage={setLanguage}>
    <PhoneFrame>
      <StatusBar
        title={
          screen === "splash"
            ? ""
            : userName && screen !== "auth"
              ? `Hi, ${userName.split(" ")[0]}`
              : "Flexova"
        }
        onBack={canGoBack && !SCREENS_WITH_OWN_BACK.has(screen) ? back : undefined}
      />

      {screen === "splash" && <Splash onDone={() => goRoot("country")} />}

      {screen === "country" && (
        <CountryScreen
          value={country}
          detected={climate}
          onSelect={setCountry}
          onContinue={() => go("language")}
        />
      )}

      {screen === "language" && (
        <LanguageScreen
          countryCode={country}
          value={language}
          onSelect={setLanguage}
          onContinue={() => go("auth")}
        />
      )}

      {screen === "auth" && (
        <AuthScreen
          initialMode={authMode}

          onDone={(n) => {
            setUserName(n);
            go("welcome");
          }}
          onSkip={() => {
            setUserName(null);
            go("welcome");
          }}
        />
      )}

      {screen === "welcome" && (
        <WelcomeScreen
          onPick={(g) => {
            setGender(g);
            go("goal");
          }}
        />
      )}

      {screen === "goal" && gender && (
        <GoalScreen
          gender={gender}
          goals={goals}
          onPick={(g) => {
            setGoal(g);
            if (gender === "female") go("period");
            else go("focus");
          }}
          onBack={() => back()}
        />
      )}

      {screen === "period" && (
        <PeriodScreen
          onSkip={() => {
            setPeriodBanner(null);
            setCyclePhase(null);
            go("focus");
          }}
          onDone={(plan, phase) => {
            setActivePlan(plan);
            setCyclePhase(plan ? phase : null);
            setPeriodBanner(plan ? `Recovery mode active — ${plan.title}` : null);
            go("focus");
          }}
        />
      )}

      {screen === "focus" && (
        <FocusAreaScreen
          onSave={() => goRoot("dashboard")}
          onBack={() => back()}
        />
      )}

      {screen === "dashboard" && gender && (
        <Dashboard
          pricing={pricing}
          gender={gender}
          goalLabel={goalLabel}
          goalId={goal}
          isPremium={isPremium}
          cyclePhase={cyclePhase}
          plan={displayPlan}
          stats={stats}
          weekDone={weekDone}
          weekPeriod={weekPeriod}
          tab={tab}
          onTab={setTab}
          onStart={() => go("workout")}
          onOpenScanner={() => go("scanner")}
          onOpenSub={() => go("subscription")}
          onOpenAccount={() => go("account")}
          photo={photo}

          onSelectGoal={(g) => {
            setGoal(g);
            setActivePlan(null);
            setPeriodBanner(null);
            setCyclePhase(null);
          }}
          onPeriodMode={() => go("period")}
          extraBanner={
            periodBanner ? (
              <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3 text-xs flex items-center gap-2">
                <span>🌸</span>
                <span className="font-medium">{periodBanner}</span>
              </div>
            ) : null
          }
        />
      )}

      {screen === "workout" && gender && (
        <WorkoutSession
          plan={displayPlan}
          gender={gender}
          onExerciseComplete={onExerciseComplete}
          onExit={() => back()}
        />
      )}

      {screen === "scanner" && <FoodScanner onExit={() => back()} />}

      {screen === "subscription" && <Subscription pricing={pricing} isPremium={isPremium} onSubscribe={() => setIsPremium(true)} onExit={() => back()} />}

      {screen === "account" && gender && (
        <AccountScreen
          userName={userName}
          gender={gender}
          goals={goals}
          goalId={goal}
          photo={photo}
          weight={bodyWeight}
          height={bodyHeight}
          targetWeight={targetWeight}
          lightMode={lightMode}
          language={language}
          onPhoto={setPhoto}
          onSelectGoal={(g) => {
            setGoal(g);
            setActivePlan(null);
            setPeriodBanner(null);
            setCyclePhase(null);
          }}
          onWeight={setBodyWeight}
          onHeight={setBodyHeight}
          onTargetWeight={setTargetWeight}
          onToggleMode={() => setLightMode((v) => !v)}
          onOpenLang={() => go("settings-lang")}
          onLogout={logout}
          onBack={() => back()}
        />
      )}

      {screen === "settings-lang" && (

        <LanguageScreen
          countryCode={country}
          standalone
          value={language}
          onSelect={setLanguage}
          onContinue={() => back()}
          onBack={() => back()}
        />
      )}

      {screen !== "splash" && <InstallBanner />}
    </PhoneFrame>
    </I18nProvider>
  );
}

