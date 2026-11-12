import { ref, get, set, push, remove, update, onValue } from 'firebase/database';
import { db } from '../lib/firebase';

export const dbRef = (path: string) => ref(db, path);

export async function readOnce<T = unknown>(path: string): Promise<T | null> {
  const snap = await get(ref(db, path));
  return snap.exists() ? (snap.val() as T) : null;
}

export async function writeValue(path: string, value: unknown): Promise<void> {
  await set(ref(db, path), value);
}

export async function pushValue(path: string, value: unknown): Promise<string> {
  const r = push(ref(db, path));
  await set(r, value);
  return r.key as string;
}

export async function updateValue(path: string, value: Record<string, unknown>): Promise<void> {
  await update(ref(db, path), value);
}

export async function removeValue(path: string): Promise<void> {
  await remove(ref(db, path));
}

export function subscribe(path: string, cb: (v: unknown) => void, onError?: (error: unknown) => void): () => void {
  const r = ref(db, path);
  const unsub = onValue(
    r,
    (snap) => cb(snap.exists() ? snap.val() : null),
    (error) => {
      console.error(`Firebase subscribe error (${path})`, error);
      if (onError) onError(error);
    }
  );
  return () => unsub();
}
