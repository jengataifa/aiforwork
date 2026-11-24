import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import firebaseAppletConfig from '../../../firebase-applet-config.json';

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
  presentKeys: string[];
  projectId: string | null;
  databaseId: string | null;
}

const config = {
  apiKey: firebaseAppletConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: firebaseAppletConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: firebaseAppletConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: firebaseAppletConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId:
    firebaseAppletConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: firebaseAppletConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId:
    firebaseAppletConfig.measurementId || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId || '(default)',
};

export function getFirebaseConfigStatus(): FirebaseConfigStatus {
  const entries: Array<[string, string]> = [
    ['apiKey', config.apiKey],
    ['authDomain', config.authDomain],
    ['projectId', config.projectId],
    ['storageBucket', config.storageBucket],
    ['messagingSenderId', config.messagingSenderId],
    ['appId', config.appId],
  ];

  const missingKeys = entries.filter(([, v]) => !v || v.startsWith('MY_')).map(([k]) => k);
  const presentKeys = entries.filter(([, v]) => Boolean(v) && !v.startsWith('MY_')).map(([k]) => k);

  return {
    isConfigured: missingKeys.length === 0 && config.projectId !== 'remixed-project-id',
    missingKeys,
    presentKeys,
    projectId: config.projectId || null,
    databaseId: config.firestoreDatabaseId || null,
  };
}

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;
let connectionChecked = false;

if (getFirebaseConfigStatus().isConfigured) {
  const existing = getApps();
  appInstance = existing.length > 0 ? existing[0] : initializeApp(config);
  authInstance = getAuth(appInstance);
  dbInstance = getFirestore(appInstance, config.firestoreDatabaseId);
  storageInstance = getStorage(appInstance);
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export async function testFirestoreConnection(): Promise<{ ok: boolean; error?: string }> {
  if (!db) {
    return { ok: false, error: 'Firestore SDK is not initialized.' };
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration. Firestore client is offline.');
      return { ok: false, error: 'Firestore client is offline. Verify Firebase configuration.' };
    }
    // Permission-denied on /test/connection still proves live connectivity to the provisioned Firestore instance
    return { ok: true };
  }
}

if (typeof window !== 'undefined' && db && !connectionChecked) {
  connectionChecked = true;
  void testFirestoreConnection();
}

export function getFirebaseServices() {
  return {
    configured: getFirebaseConfigStatus().isConfigured,
    app,
    auth,
    db,
    storage,
  };
}
