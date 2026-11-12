import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBIuJFn74hJK1LT_Shcl-Y5DMgiOArB8Ps',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'shipu-ai.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://shipu-ai-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'shipu-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'shipu-ai.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '953122849300',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:953122849300:web:f821f1a161ce7879001d01',
  measurementId: 'G-N2WMSS3MNG',
};

// Primary app (Realtime Database + Storage)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Secondary app dedicated to Google Authentication (matches reference setup)
const secondaryConfig = {
  apiKey: 'AIzaSyBIuJFn74hJK1LT_Shcl-Y5DMgiOArB8Ps',
  authDomain: 'shipu-ai.firebaseapp.com',
  projectId: 'shipu-ai',
  storageBucket: 'shipu-ai.firebasestorage.app',
  messagingSenderId: '953122849300',
  appId: '1:953122849300:web:f821f1a161ce7879001d01',
  measurementId: 'G-N2WMSS3MNG',
};
const secondaryApp = initializeApp(secondaryConfig, 'secondary');
export const secondaryAuth = getAuth(secondaryApp);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;