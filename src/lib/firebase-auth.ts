// Browser-only Firebase auth helpers. Imported lazily so SSR never loads them.
export async function signUpWithEmail(email: string, password: string) {
  const { auth, db } = await import("@/integrations/firebase/client");
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
  await setDoc(
    doc(db, "users", cred.user.uid),
    { email: cred.user.email, displayName: cred.user.displayName ?? null, createdAt: serverTimestamp() },
    { merge: true },
  );
  return cred.user;
}

export async function signInWithEmail(email: string, password: string) {
  const { auth } = await import("@/integrations/firebase/client");
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function sendReset(email: string) {
  const { auth } = await import("@/integrations/firebase/client");
  const { sendPasswordResetEmail } = await import("firebase/auth");
  await sendPasswordResetEmail(auth, email);
}

export async function signInWithProvider(kind: "google" | "apple") {
  const { auth, googleProvider, appleProvider, db } = await import("@/integrations/firebase/client");
  const { signInWithPopup } = await import("firebase/auth");
  const cred = await signInWithPopup(auth, kind === "google" ? googleProvider : appleProvider);
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
  await setDoc(
    doc(db, "users", cred.user.uid),
    { email: cred.user.email, displayName: cred.user.displayName ?? null, createdAt: serverTimestamp() },
    { merge: true },
  );
  return cred.user;
}

export async function signOutUser() {
  const { auth } = await import("@/integrations/firebase/client");
  const { signOut } = await import("firebase/auth");
  await signOut(auth);
}

export async function uploadUserFile(uid: string, path: string, file: Blob) {
  const { storage } = await import("@/integrations/firebase/client");
  const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
  const fileRef = ref(storage, `users/${uid}/${path}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}