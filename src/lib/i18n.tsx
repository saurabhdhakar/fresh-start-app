import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

export const RTL_LANGUAGES = new Set(["ar"]);

const en = {
  "app.tagline": "Move. Sculpt. Rise.",
  "common.continue": "Continue",
  "common.back": "Back",
  "common.save": "Save",
  "common.skip": "Skip for now",
  "country.title": "Select your country",
  "country.subtitle": "Where are you from?",
  "country.search": "Search country",
  "country.detected": "Detected via network",
  "lang.title": "Choose your language",
  "lang.subtitle": "Which language do you want to use the app in?",
  "auth.signup": "Sign Up",
  "auth.login": "Log In",
  "auth.createTitle": "Create your account",
  "auth.createSub": "Start your journey with Flexova",
  "auth.welcomeTitle": "Welcome back",
  "auth.welcomeSub": "Please enter your details to sign in.",
  "auth.email": "Email address",
  "auth.password": "Password",
  "auth.confirm": "Confirm password",
  "auth.show": "Show",
  "auth.hide": "Hide",
  "auth.forgot": "Forgot Password?",
  "auth.haveAccount": "Already have an account?",
  "auth.noAccount": "Don't have an account?",
  "auth.or": "or continue with",
  "auth.apple": "Continue with Apple",
  "auth.google": "Continue with Google",
  "auth.demoNote": "Demo prototype — no data is stored.",
  "auth.errEmail": "Enter a valid email",
  "auth.errPassword": "Password must be at least 6 characters",
  "auth.errMatch": "Passwords do not match",
  "welcome.title": "Choose your fitness journey",
  "welcome.subtitle": "A tailored experience awaits you",
  "welcome.male": "Male",
  "welcome.maleDesc": "Strength focused",
  "welcome.female": "Female",
  "welcome.femaleDesc": "Sculpt & wellness",
  "welcome.foot": "We personalize your workouts, tracking & recovery.",
  "sub.title": "Upgrade your journey",
  "sub.subtitle": "Unlock AI coaching, advanced plans and more.",
  "sub.month": "/month",
};

export type TranslationKey = keyof typeof en;
type Dict = Partial<Record<TranslationKey, string>>;

const hinglish: Dict = {
  "common.continue": "Continue",
  "common.skip": "Abhi ke liye skip karo",
  "country.title": "Select your country",
  "country.subtitle": "Aap kis country se hain?",
  "country.search": "Search country",
  "country.detected": "Network se detect hua",
  "lang.title": "Choose your language",
  "lang.subtitle": "Aap kis language me app use karna chahenge?",
  "auth.createSub": "Flexova ke saath shuruaat karo",
  "auth.welcomeSub": "Sign in karne ke liye details daalo.",
  "auth.errEmail": "Valid email daalo",
  "auth.errPassword": "Password kam se kam 6 characters ka ho",
  "auth.errMatch": "Dono passwords match nahi kar rahe",
  "auth.haveAccount": "Already account hai?",
  "auth.noAccount": "Account nahi hai?",
  "auth.demoNote": "Demo prototype — koi bhi data save nahi hota.",
  "welcome.title": "Apni fitness journey chuno",
  "welcome.subtitle": "Aapke liye personalised experience",
  "welcome.foot": "Hum aapke workouts, tracking aur recovery personalise karte hain.",
  "sub.title": "Apni journey upgrade karo",
  "sub.subtitle": "AI coaching, advanced plans aur bahut kuch unlock karo.",
  "sub.month": "/month",
};

const hi: Dict = {
  "common.continue": "आगे बढ़ें",
  "common.back": "वापस",
  "common.save": "सहेजें",
  "common.skip": "अभी छोड़ें",
  "country.title": "अपना देश चुनें",
  "country.subtitle": "आप किस देश से हैं?",
  "country.search": "देश खोजें",
  "country.detected": "नेटवर्क से पहचाना गया",
  "lang.title": "अपनी भाषा चुनें",
  "lang.subtitle": "आप ऐप किस भाषा में इस्तेमाल करना चाहेंगे?",
  "auth.signup": "साइन अप",
  "auth.login": "लॉग इन",
  "auth.createTitle": "अपना अकाउंट बनाएं",
  "auth.createSub": "Flexova के साथ शुरुआत करें",
  "auth.welcomeTitle": "वापस स्वागत है",
  "auth.welcomeSub": "साइन इन करने के लिए विवरण भरें।",
  "auth.email": "ईमेल पता",
  "auth.password": "पासवर्ड",
  "auth.confirm": "पासवर्ड की पुष्टि करें",
  "auth.show": "दिखाएं",
  "auth.hide": "छिपाएं",
  "auth.forgot": "पासवर्ड भूल गए?",
  "auth.haveAccount": "पहले से अकाउंट है?",
  "auth.noAccount": "अकाउंट नहीं है?",
  "auth.or": "या जारी रखें",
  "auth.apple": "Apple से जारी रखें",
  "auth.google": "Google से जारी रखें",
  "auth.demoNote": "डेमो प्रोटोटाइप — कोई डेटा सेव नहीं होता।",
  "auth.errEmail": "मान्य ईमेल डालें",
  "auth.errPassword": "पासवर्ड कम से कम 6 अक्षरों का हो",
  "auth.errMatch": "पासवर्ड मेल नहीं खाते",
  "welcome.title": "अपनी फिटनेस यात्रा चुनें",
  "welcome.subtitle": "आपके लिए ख़ास अनुभव",
  "welcome.male": "पुरुष",
  "welcome.maleDesc": "ताक़त पर केंद्रित",
  "welcome.female": "महिला",
  "welcome.femaleDesc": "शेप और वेलनेस",
  "welcome.foot": "हम आपके वर्कआउट, ट्रैकिंग और रिकवरी को पर्सनलाइज़ करते हैं।",
  "sub.title": "अपनी जर्नी अपग्रेड करें",
  "sub.subtitle": "AI कोचिंग, एडवांस्ड प्लान और बहुत कुछ अनलॉक करें।",
  "sub.month": "/माह",
};

const ta: Dict = {
  "common.continue": "தொடரவும்",
  "common.back": "பின்",
  "common.save": "சேமி",
  "common.skip": "இப்போது தவிர்",
  "country.title": "உங்கள் நாட்டைத் தேர்வுசெய்க",
  "country.subtitle": "நீங்கள் எந்த நாட்டைச் சேர்ந்தவர்?",
  "country.search": "நாட்டைத் தேடு",
  "lang.title": "உங்கள் மொழியைத் தேர்வுசெய்க",
  "lang.subtitle": "எந்த மொழியில் ஆப்பைப் பயன்படுத்த விரும்புகிறீர்கள்?",
  "auth.signup": "பதிவு",
  "auth.login": "உள்நுழை",
  "auth.createTitle": "கணக்கை உருவாக்குங்கள்",
  "auth.createSub": "Flexova உடன் தொடங்குங்கள்",
  "auth.welcomeTitle": "மீண்டும் வரவேற்கிறோம்",
  "auth.welcomeSub": "உள்நுழைய விவரங்களை உள்ளிடவும்.",
  "auth.email": "மின்னஞ்சல் முகவரி",
  "auth.password": "கடவுச்சொல்",
  "auth.confirm": "கடவுச்சொல்லை உறுதிப்படுத்து",
  "auth.forgot": "கடவுச்சொல் மறந்ததா?",
  "auth.or": "அல்லது தொடரவும்",
  "welcome.title": "உங்கள் உடற்பயிற்சி பயணத்தைத் தேர்வுசெய்க",
  "welcome.male": "ஆண்",
  "welcome.female": "பெண்",
  "sub.title": "உங்கள் பயணத்தை மேம்படுத்துங்கள்",
  "sub.month": "/மாதம்",
};

const te: Dict = {
  "common.continue": "కొనసాగించు",
  "common.back": "వెనుకకు",
  "common.skip": "ప్రస్తుతానికి దాటవేయి",
  "country.title": "మీ దేశాన్ని ఎంచుకోండి",
  "country.subtitle": "మీరు ఏ దేశం నుండి?",
  "country.search": "దేశాన్ని వెతకండి",
  "lang.title": "మీ భాషను ఎంచుకోండి",
  "lang.subtitle": "మీరు యాప్‌ను ఏ భాషలో వాడాలనుకుంటున్నారు?",
  "auth.signup": "సైన్ అప్",
  "auth.login": "లాగిన్",
  "auth.createTitle": "మీ ఖాతాను సృష్టించండి",
  "auth.createSub": "Flexova తో ప్రారంభించండి",
  "auth.welcomeTitle": "మళ్ళీ స్వాగతం",
  "auth.email": "ఇమెయిల్ చిరునామా",
  "auth.password": "పాస్‌వర్డ్",
  "auth.confirm": "పాస్‌వర్డ్ నిర్ధారించండి",
  "auth.forgot": "పాస్‌వర్డ్ మర్చిపోయారా?",
  "auth.or": "లేదా కొనసాగించండి",
  "welcome.title": "మీ ఫిట్‌నెస్ ప్రయాణాన్ని ఎంచుకోండి",
  "welcome.male": "పురుషుడు",
  "welcome.female": "స్త్రీ",
  "sub.month": "/నెల",
};

const kn: Dict = {
  "common.continue": "ಮುಂದುವರಿಸಿ",
  "common.back": "ಹಿಂದೆ",
  "common.skip": "ಸದ್ಯಕ್ಕೆ ಬಿಟ್ಟುಬಿಡಿ",
  "country.title": "ನಿಮ್ಮ ದೇಶವನ್ನು ಆರಿಸಿ",
  "country.subtitle": "ನೀವು ಯಾವ ದೇಶದವರು?",
  "country.search": "ದೇಶ ಹುಡುಕಿ",
  "lang.title": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
  "lang.subtitle": "ಯಾವ ಭಾಷೆಯಲ್ಲಿ ಆ್ಯಪ್ ಬಳಸಲು ಇಚ್ಛಿಸುತ್ತೀರಿ?",
  "auth.signup": "ಸೈನ್ ಅಪ್",
  "auth.login": "ಲಾಗಿನ್",
  "auth.createTitle": "ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ",
  "auth.createSub": "Flexova ಜೊತೆ ಪ್ರಾರಂಭಿಸಿ",
  "auth.welcomeTitle": "ಮತ್ತೆ ಸ್ವಾಗತ",
  "auth.email": "ಇಮೇಲ್ ವಿಳಾಸ",
  "auth.password": "ಪಾಸ್‌ವರ್ಡ್",
  "auth.confirm": "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
  "auth.forgot": "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
  "auth.or": "ಅಥವಾ ಮುಂದುವರಿಸಿ",
  "welcome.title": "ನಿಮ್ಮ ಫಿಟ್‌ನೆಸ್ ಪಯಣ ಆರಿಸಿ",
  "welcome.male": "ಪುರುಷ",
  "welcome.female": "ಮಹಿಳೆ",
  "sub.month": "/ತಿಂಗಳು",
};

const ml: Dict = {
  "common.continue": "തുടരുക",
  "common.back": "പിന്നോട്ട്",
  "common.skip": "ഇപ്പോൾ ഒഴിവാക്കുക",
  "country.title": "നിങ്ങളുടെ രാജ്യം തിരഞ്ഞെടുക്കുക",
  "country.subtitle": "നിങ്ങൾ ഏത് രാജ്യത്തുനിന്നാണ്?",
  "country.search": "രാജ്യം തിരയുക",
  "lang.title": "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
  "lang.subtitle": "ഏത് ഭാഷയിൽ ആപ്പ് ഉപയോഗിക്കണം?",
  "auth.signup": "സൈൻ അപ്പ്",
  "auth.login": "ലോഗിൻ",
  "auth.createTitle": "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
  "auth.createSub": "Flexova യിൽ തുടങ്ങുക",
  "auth.welcomeTitle": "വീണ്ടും സ്വാഗതം",
  "auth.email": "ഇമെയിൽ വിലാസം",
  "auth.password": "പാസ്‌വേഡ്",
  "auth.confirm": "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
  "auth.forgot": "പാസ്‌വേഡ് മറന്നോ?",
  "auth.or": "അല്ലെങ്കിൽ തുടരുക",
  "welcome.title": "നിങ്ങളുടെ ഫിറ്റ്നസ് യാത്ര തിരഞ്ഞെടുക്കുക",
  "welcome.male": "പുരുഷൻ",
  "welcome.female": "സ്ത്രീ",
  "sub.month": "/മാസം",
};

const ar: Dict = {
  "common.continue": "متابعة",
  "common.back": "رجوع",
  "common.save": "حفظ",
  "common.skip": "تخطي الآن",
  "country.title": "اختر دولتك",
  "country.subtitle": "من أي بلد أنت؟",
  "country.search": "ابحث عن الدولة",
  "country.detected": "تم الكشف عبر الشبكة",
  "lang.title": "اختر لغتك",
  "lang.subtitle": "بأي لغة تريد استخدام التطبيق؟",
  "auth.signup": "إنشاء حساب",
  "auth.login": "تسجيل الدخول",
  "auth.createTitle": "أنشئ حسابك",
  "auth.createSub": "ابدأ رحلتك مع Flexova",
  "auth.welcomeTitle": "مرحبًا بعودتك",
  "auth.welcomeSub": "يرجى إدخال بياناتك لتسجيل الدخول.",
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.confirm": "تأكيد كلمة المرور",
  "auth.show": "إظهار",
  "auth.hide": "إخفاء",
  "auth.forgot": "نسيت كلمة المرور؟",
  "auth.haveAccount": "لديك حساب بالفعل؟",
  "auth.noAccount": "ليس لديك حساب؟",
  "auth.or": "أو تابع باستخدام",
  "auth.apple": "المتابعة عبر Apple",
  "auth.google": "المتابعة عبر Google",
  "auth.demoNote": "نموذج تجريبي — لا يتم حفظ أي بيانات.",
  "auth.errEmail": "أدخل بريدًا صحيحًا",
  "auth.errPassword": "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
  "auth.errMatch": "كلمتا المرور غير متطابقتين",
  "welcome.title": "اختر رحلتك الرياضية",
  "welcome.subtitle": "تجربة مصممة خصيصًا لك",
  "welcome.male": "ذكر",
  "welcome.maleDesc": "التركيز على القوة",
  "welcome.female": "أنثى",
  "welcome.femaleDesc": "النحت والعافية",
  "welcome.foot": "نخصص تمارينك وتتبعك وتعافيك.",
  "sub.title": "طوّر رحلتك",
  "sub.subtitle": "افتح التدريب بالذكاء الاصطناعي وخططًا متقدمة والمزيد.",
  "sub.month": "/شهريًا",
};

const fr: Dict = {
  "common.continue": "Continuer",
  "common.back": "Retour",
  "common.save": "Enregistrer",
  "common.skip": "Passer pour l'instant",
  "country.title": "Sélectionnez votre pays",
  "country.subtitle": "D'où venez-vous ?",
  "country.search": "Rechercher un pays",
  "country.detected": "Détecté via le réseau",
  "lang.title": "Choisissez votre langue",
  "lang.subtitle": "Dans quelle langue souhaitez-vous utiliser l'app ?",
  "auth.signup": "S'inscrire",
  "auth.login": "Se connecter",
  "auth.createTitle": "Créez votre compte",
  "auth.createSub": "Commencez votre parcours avec Flexova",
  "auth.welcomeTitle": "Bon retour",
  "auth.welcomeSub": "Veuillez saisir vos informations pour vous connecter.",
  "auth.email": "Adresse e-mail",
  "auth.password": "Mot de passe",
  "auth.confirm": "Confirmer le mot de passe",
  "auth.show": "Afficher",
  "auth.hide": "Masquer",
  "auth.forgot": "Mot de passe oublié ?",
  "auth.haveAccount": "Vous avez déjà un compte ?",
  "auth.noAccount": "Pas encore de compte ?",
  "auth.or": "ou continuer avec",
  "auth.apple": "Continuer avec Apple",
  "auth.google": "Continuer avec Google",
  "auth.demoNote": "Prototype de démo — aucune donnée n'est enregistrée.",
  "auth.errEmail": "Saisissez un e-mail valide",
  "auth.errPassword": "Le mot de passe doit contenir au moins 6 caractères",
  "auth.errMatch": "Les mots de passe ne correspondent pas",
  "welcome.title": "Choisissez votre parcours fitness",
  "welcome.subtitle": "Une expérience sur mesure vous attend",
  "welcome.male": "Homme",
  "welcome.maleDesc": "Axé sur la force",
  "welcome.female": "Femme",
  "welcome.femaleDesc": "Sculpter et bien-être",
  "welcome.foot": "Nous personnalisons vos séances, votre suivi et votre récupération.",
  "sub.title": "Améliorez votre parcours",
  "sub.subtitle": "Débloquez le coaching IA, des plans avancés et plus encore.",
  "sub.month": "/mois",
};

export const DICTIONARIES: Record<string, Dict> = {
  en,
  en_in: en,
  hinglish,
  hi,
  ta,
  te,
  kn,
  ml,
  ar,
  fr,
};

type I18nValue = {
  language: string;
  setLanguage: (l: string) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  language,
  setLanguage,
  children,
}: {
  language: string;
  setLanguage: (l: string) => void;
  children: ReactNode;
}) {
  const dir: "ltr" | "rtl" = RTL_LANGUAGES.has(language) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language === "hinglish" ? "en-IN" : language.replace("_", "-");
    document.documentElement.dir = dir;
    return () => {
      document.documentElement.dir = "ltr";
    };
  }, [language, dir]);

  const value = useMemo<I18nValue>(
    () => ({
      language,
      setLanguage,
      dir,
      t: (key) => DICTIONARIES[language]?.[key] ?? en[key] ?? key,
    }),
    [language, setLanguage, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      language: "en",
      setLanguage: () => {},
      dir: "ltr",
      t: (key) => en[key] ?? key,
    };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
