export type Country = {
  code: string;
  name: string;
  native: string;
  flag: string;
};

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", native: "भारत", flag: "🇮🇳" },
  { code: "US", name: "United States", native: "USA", flag: "🇺🇸" },
  { code: "CA", name: "Canada", native: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", native: "UK", flag: "🇬🇧" },
  { code: "AE", name: "United Arab Emirates", native: "Dubai", flag: "🇦🇪" },
  { code: "AU", name: "Australia", native: "Australia", flag: "🇦🇺" },
];

export type LanguageOption = {
  id: string;
  label: string;
  note: string;
  flag: string;
};

const IN_LANGS: LanguageOption[] = [
  { id: "hinglish", label: "Hinglish", note: "Default • Aapke liye best", flag: "🇮🇳" },
  { id: "en_in", label: "English (India)", note: "English", flag: "🇮🇳" },
  { id: "hi", label: "हिन्दी", note: "Hindi", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ்", note: "Tamil", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", note: "Telugu", flag: "🇮🇳" },
  { id: "kn", label: "ಕನ್ನಡ", note: "Kannada", flag: "🇮🇳" },
  { id: "ml", label: "മലയാളം", note: "Malayalam", flag: "🇮🇳" },
];

const GLOBAL_EN: LanguageOption = { id: "en", label: "English (Global)", note: "International", flag: "🌐" };

export function languagesForCountry(code: string | null): LanguageOption[] {
  switch (code) {
    case "IN":
      return IN_LANGS;
    case "AE":
      return [
        { ...GLOBAL_EN, label: "English" },
        { id: "ar", label: "العربية", note: "Arabic", flag: "🇦🇪" },
      ];
    case "CA":
      return [
        { ...GLOBAL_EN, label: "English" },
        { id: "fr", label: "Français", note: "French", flag: "🇨🇦" },
      ];
    default:
      return [GLOBAL_EN];
  }
}
