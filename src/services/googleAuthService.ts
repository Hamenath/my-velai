import {
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../lib/firebase';

// Complete any pending auth session in web browser for native redirect
if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

/**
 * Service managing real Firebase Google Authentication across Web and Native.
 * Uses Firebase's official GoogleAuthProvider as the identity provider.
 */
export const googleAuthService = {
  /**
   * Initiates Google Sign-In through Firebase Authentication.
   * - On Web: uses Firebase SDK's signInWithPopup with GoogleAuthProvider.
   * - On Native: requires Google Cloud OAuth Client ID configuration.
   */
  async signInWithGoogle(): Promise<User> {
    if (Platform.OS === 'web') {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      try {
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential.user;
      } catch (err: any) {
        throw this.mapGoogleAuthError(err);
      }
    } else {
      // For Native builds (Android/iOS)
      // When running in an EAS Development Build or standalone APK, native Google Sign-In
      // uses the Web Client ID and SHA-1 fingerprint registered in Google Cloud / Firebase Console.
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential.user;
      } catch (err: any) {
        throw this.mapGoogleAuthError(err);
      }
    }
  },

  /**
   * Maps Google Authentication errors to user-friendly messages while preserving error codes in development.
   */
  mapGoogleAuthError(err: any): Error {
    const code = err?.code || '';
    const rawMessage = err?.message || '';

    let userMessage = 'Google sign-in failed. Please try again.';

    if (code === 'auth/popup-closed-by-user') {
      userMessage = 'Google sign-in was cancelled.';
    } else if (code === 'auth/popup-blocked') {
      userMessage = 'Pop-up was blocked by your browser. Please allow pop-ups for localhost and try again.';
    } else if (code === 'auth/cancelled-popup-request') {
      userMessage = 'Another sign-in request is already in progress.';
    } else if (code === 'auth/network-request-failed') {
      userMessage = 'Network connection failed. Please check your internet connection.';
    } else if (code === 'auth/account-exists-with-different-credential') {
      userMessage = 'An account already exists with this email using a different sign-in method.';
    } else if (code === 'auth/operation-not-allowed') {
      userMessage = 'Google sign-in is not enabled in Firebase Console. Go to Authentication → Sign-in method → Google and click Enable.';
    } else if (code === 'auth/unauthorized-domain') {
      userMessage = 'The current domain is not authorized in Firebase Console → Authentication → Settings → Authorized domains.';
    } else if (rawMessage) {
      userMessage = rawMessage;
    }

    if (__DEV__ && code) {
      return new Error(`${userMessage} [${code}]`);
    }

    return new Error(userMessage);
  },
};
