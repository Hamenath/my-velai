import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { isSupported, getAnalytics, Analytics } from 'firebase/analytics';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Client-side Firebase configuration loaded from Expo environment variables.
 * Variables prefixed with EXPO_PUBLIC_ are automatically embedded at build time.
 */
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

/**
 * Checks whether valid Firebase credentials have been configured.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

if (!isFirebaseConfigured) {
  console.warn(
    '[Firebase] Configuration missing or incomplete. Ensure .env has valid EXPO_PUBLIC_FIREBASE_* variables.'
  );
}

// Initialize or retrieve the singleton Firebase App instance
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistent storage across platforms
let authInstance: Auth;
try {
  const getReactNativePersistence = (FirebaseAuth as unknown as { getReactNativePersistence?: (storage: unknown) => unknown }).getReactNativePersistence;
  if (Platform.OS !== 'web' && typeof getReactNativePersistence === 'function') {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage) as any,
    });
  } else {
    authInstance = getAuth(app);
  }
} catch {
  // Fall back to getAuth if already initialized (e.g. during Fast Refresh / hot reload)
  authInstance = getAuth(app);
}

export const auth: Auth = authInstance;

// Initialize Cloud Firestore
export const db: Firestore = getFirestore(app);

// Initialize Cloud Storage
export const storage: FirebaseStorage = getStorage(app);

// Initialize Firebase Analytics (web-only with environment support check)
let analyticsInstance: Analytics | null = null;
if (Platform.OS === 'web') {
  isSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        try {
          analyticsInstance = getAnalytics(app);
        } catch {
          // Analytics initialization is optional
        }
      }
    })
    .catch(() => {});
}

export const getAnalyticsInstance = (): Analytics | null => analyticsInstance;
