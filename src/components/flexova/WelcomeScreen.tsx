import wordmark from "@/assets/flexova-wordmark.png.asset.json";
import maleCard from "@/assets/male-card.jpg.asset.json";
import femaleCard from "@/assets/female-card.jpg.asset.json";
import { useI18n } from "@/lib/i18n";

export function WelcomeScreen({ onPick }: { onPick: (g: "male" | "female") => void }) {
  const { t } = useI18n();
  return (
    <div className="px-6 pt-8 pb-10 animate-rise">
      <img src={wordmark.url} alt="Flexova logo" className="h-12 w-auto" />
      <div className="mt-6 text-center">
        <h2 className="text-3xl font-bold">{t("welcome.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("welcome.subtitle")}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          onClick={() => onPick("male")}
          className="group relative h-80 overflow-hidden rounded-3xl border-2 border-primary/50 bg-card text-left transition hover:border-primary hover:shadow-glow"
        >
          <img
            src={maleCard.url}
            alt="Man training with dumbbells"
            width={768}
            height={1024}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 28%, oklch(0.12 0.02 260 / 0.85) 70%, oklch(0.1 0.02 260 / 0.96))" }}
          />
          <div className="absolute inset-x-0 bottom-0 p-4 text-center">
            <div className="text-lg font-bold">{t("welcome.male")}</div>
            <div className="mx-auto my-2 h-px w-14 bg-primary" />
            <div className="text-xs text-muted-foreground">{t("welcome.maleDesc")}</div>
          </div>
        </button>

        <button
          onClick={() => onPick("female")}
          className="group relative h-80 overflow-hidden rounded-3xl border-2 bg-card text-left transition hover:shadow-glow"
          style={{ borderColor: "oklch(0.82 0.13 15 / 0.6)" }}
        >
          <img
            src={femaleCard.url}
            alt="Woman stretching in a gym"
            width={768}
            height={1024}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 28%, oklch(0.14 0.03 340 / 0.85) 70%, oklch(0.11 0.02 340 / 0.96))" }}
          />
          <div className="absolute inset-x-0 bottom-0 p-4 text-center">
            <div className="text-lg font-bold">{t("welcome.female")}</div>
            <div className="mx-auto my-2 h-px w-14" style={{ background: "oklch(0.82 0.13 15)" }} />
            <div className="text-xs text-muted-foreground">{t("welcome.femaleDesc")}</div>
          </div>
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">{t("welcome.foot")}</p>
    </div>
  );
}
