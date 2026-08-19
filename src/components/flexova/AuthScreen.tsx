import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Apple } from "lucide-react";
import icon from "@/assets/flexova-icon.png.asset.json";
import { useI18n } from "@/lib/i18n";
import { signInWithEmail, signUpWithEmail, signInWithProvider, sendReset } from "@/lib/firebase-auth";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.4 5.9 2.6 13.8l7.8 6.1C12.3 13.7 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.5 5.8c4.4-4.1 7.2-10.2 7.2-17.5Z" />
      <path fill="#FBBC05" d="M10.4 28.1a14.6 14.6 0 0 1 0-8.2l-7.8-6.1a23.5 23.5 0 0 0 0 20.4l7.8-6.1Z" />
      <path fill="#34A853" d="M24 47.5c6.2 0 11.5-2 15.3-5.5l-7.5-5.8c-2.1 1.4-4.8 2.3-7.8 2.3-6.4 0-11.7-4.2-13.6-10l-7.8 6.1C6.4 42.1 14.6 47.5 24 47.5Z" />
    </svg>
  );
}

export function AuthScreen({
  onDone,
  onSkip,
  initialMode = "signup",
}: {
  onDone: (name: string) => void;
  onSkip: () => void;
  initialMode?: "login" | "signup";
}) {
  const { t } = useI18n();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError(t("auth.errEmail"));
    if (password.length < 6) return setError(t("auth.errPassword"));
    if (mode === "signup" && password !== confirm) return setError(t("auth.errMatch"));
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const user =
        mode === "signup" ? await signUpWithEmail(email, password) : await signInWithEmail(email, password);
      onDone(user.displayName || email.split("@")[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message.replace(/^Firebase:\s*/, "") : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const social = async (kind: "google" | "apple") => {
    setError(null);
    setBusy(true);
    try {
      const user = await signInWithProvider(kind);
      onDone(user.displayName || user.email?.split("@")[0] || "Athlete");
    } catch (e) {
      setError(e instanceof Error ? e.message.replace(/^Firebase:\s*/, "") : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError(t("auth.errEmail"));
    setError(null);
    try {
      await sendReset(email);
      setNotice("Password reset email sent.");
    } catch (e) {
      setError(e instanceof Error ? e.message.replace(/^Firebase:\s*/, "") : "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col px-6 pt-2 pb-8 animate-rise">
      <div className="text-center">
        <img src={icon.url} alt="Flexova runner logo" className="mx-auto h-14 w-14 rounded-2xl shadow-glow" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-1">
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              mode === m ? "gradient-accent text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >
            {m === "signup" ? t("auth.signup") : t("auth.login")}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-2xl font-bold">{mode === "login" ? t("auth.welcomeTitle") : t("auth.createTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mode === "login" ? t("auth.welcomeSub") : t("auth.createSub")}</p>
      </div>

      <div className="mt-6 space-y-3">
        <Field icon={<Mail className="h-4 w-4" />}>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field icon={<Lock className="h-4 w-4" />}>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            type={showPw ? "text" : "password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder={t("auth.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            aria-label={showPw ? t("auth.hide") : t("auth.show")}
            onClick={() => setShowPw((s) => !s)}
            className="text-muted-foreground transition hover:text-primary"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </Field>

        {mode === "signup" && (
          <Field icon={<ShieldCheck className="h-4 w-4" />}>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.confirm")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button
              type="button"
              aria-label={showConfirm ? t("auth.hide") : t("auth.show")}
              onClick={() => setShowConfirm((s) => !s)}
              className="text-muted-foreground transition hover:text-primary"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>
        )}

        {mode === "login" && (
          <button type="button" onClick={forgot} className="ml-auto block text-xs font-medium text-sky-400">
            {t("auth.forgot")}
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
      {notice && <p className="mt-3 text-xs text-primary">{notice}</p>}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-6 w-full rounded-2xl gradient-accent py-4 font-semibold text-primary-foreground shadow-glow transition active:scale-[0.99] disabled:opacity-60"
      >
        {busy ? "…" : mode === "login" ? t("auth.login") : t("auth.signup")}
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {mode === "login" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
          }}
          className="font-semibold text-primary"
        >
          {mode === "login" ? t("auth.signup") : t("auth.login")}
        </button>
      </p>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("auth.or")}
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-4 space-y-3">
          <button
            onClick={() => social("apple")}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-medium transition hover:border-primary"
          >
            <Apple className="h-5 w-5" />
            {t("auth.apple")}
          </button>
          <button
            onClick={() => social("google")}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-medium transition hover:border-primary"
          >
            <GoogleLogo />
            {t("auth.google")}
          </button>
        </div>

        <button onClick={onSkip} className="mt-5 w-full text-center text-xs text-muted-foreground">
          {t("common.skip")} →
        </button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">{t("auth.demoNote")}</p>
      </div>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition focus-within:border-primary">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}
