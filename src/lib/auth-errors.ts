import type { TranslationKey } from "@/lib/i18n";

const CODE_MAP: Record<string, TranslationKey> = {
  "auth/invalid-email": "fb.invalidEmail",
  "auth/missing-email": "fb.invalidEmail",
  "auth/user-disabled": "fb.userDisabled",
  "auth/user-not-found": "fb.userNotFound",
  "auth/wrong-password": "fb.wrongPassword",
  "auth/invalid-credential": "fb.invalidCredential",
  "auth/invalid-login-credentials": "fb.invalidCredential",
  "auth/email-already-in-use": "fb.emailInUse",
  "auth/weak-password": "fb.weakPassword",
  "auth/missing-password": "fb.missingPassword",
  "auth/too-many-requests": "fb.tooManyRequests",
  "auth/network-request-failed": "fb.networkError",
  "auth/popup-closed-by-user": "fb.popupClosed",
  "auth/cancelled-popup-request": "fb.popupClosed",
  "auth/popup-blocked": "fb.popupBlocked",
  "auth/operation-not-allowed": "fb.opNotAllowed",
  "auth/requires-recent-login": "fb.requiresRecentLogin",
  "auth/account-exists-with-different-credential": "fb.accountExists",
  "auth/unauthorized-domain": "fb.unauthorizedDomain",
  "auth/internal-error": "fb.unknown",
};

/** Extract the `auth/...` code from any thrown Firebase error shape. */
export function authErrorCode(err: unknown): string | null {
  if (err && typeof err === "object" && "code" in err && typeof (err as { code: unknown }).code === "string") {
    return (err as { code: string }).code;
  }
  const msg = err instanceof Error ? err.message : String(err ?? "");
  const match = msg.match(/\(?(auth\/[a-z-]+)\)?/i);
  return match ? match[1].toLowerCase() : null;
}

/** Map a thrown Firebase auth error to a translation key. */
export function authErrorKey(err: unknown): TranslationKey {
  const code = authErrorCode(err);
  return (code && CODE_MAP[code]) || "fb.unknown";
}
