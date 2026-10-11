import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../lib/firebase';

let activeConfirmationResult: ConfirmationResult | null = null;

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: any;
  }
}

/**
 * Service managing real Firebase Phone Authentication across Web and Native.
 * - For Web: uses persistent RecaptchaVerifier on a stable DOM container.
 * - Supports configured Firebase test phone numbers (e.g. +91 87787 07086 with code 123456).
 * - For Native builds: handles dev client configuration and provides clear status guidance.
 */
// Enable official Firebase testing settings in development to allow configured test phone numbers on Web
if (Platform.OS === 'web' && __DEV__ && auth?.settings) {
  auth.settings.appVerificationDisabledForTesting = true;
}

export const phoneAuthService = {
  /**
   * Safely clears and resets the web reCAPTCHA verifier instance and its container.
   * Cleans up the existing instance so a fresh verifier can be recreated after errors.
   */
  clearRecaptchaVerifier(): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {
          // Ignore errors on already-destroyed verifier instances
        }
        window.recaptchaVerifier = undefined;
      }
      const container = document.getElementById('recaptcha-container');
      if (container) {
        try {
          container.innerHTML = '';
        } catch {}
      }
    }
  },

  /**
   * Initializes or reuses the web RecaptchaVerifier on a stable DOM container.
   * Ensures the DOM container exists, reuses existing healthy verifier, or creates a clean instance.
   */
  getRecaptchaVerifier(): RecaptchaVerifier | null {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
      const containerId = 'recaptcha-container';
      let container = document.getElementById(containerId);

      // Ensure stable container exists in document body
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
      }

      // Reuse existing verifier if healthy
      if (window.recaptchaVerifier) {
        return window.recaptchaVerifier;
      }

      // Ensure testing flag is active in development
      if (__DEV__ && auth?.settings) {
        auth.settings.appVerificationDisabledForTesting = true;
      }

      if (__DEV__) {
        console.log(
          '[phoneAuthService] Initializing RecaptchaVerifier. appVerificationDisabledForTesting:',
          auth?.settings?.appVerificationDisabledForTesting
        );
      }

      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            // Widget expired: clean up verifier so it will be recreated on next request
            this.clearRecaptchaVerifier();
          },
        });
        return window.recaptchaVerifier;
      } catch (err: any) {
        if (__DEV__) {
          console.warn('[phoneAuthService] Error initializing RecaptchaVerifier:', {
            code: err?.code,
            message: err?.message,
          });
        }
        this.clearRecaptchaVerifier();
        return null;
      }
    }
    return null;
  },

  /**
   * Formats a mobile number into standard E.164 format (+91XXXXXXXXXX)
   */
  formatToE164(rawPhone: string, defaultCountryCode = '+91'): string {
    const cleaned = rawPhone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    if (cleaned.length === 10) {
      return `${defaultCountryCode}${cleaned}`;
    }
    return `${defaultCountryCode}${cleaned.replace(/^91/, '')}`;
  },

  /**
   * Validates 10-digit Indian mobile numbers (starts with 6, 7, 8, or 9)
   */
  isValidIndianMobile(phone: string): boolean {
    const digitsOnly = phone.replace(/[^\d]/g, '');
    const nationalNumber =
      digitsOnly.startsWith('91') && digitsOnly.length === 12
        ? digitsOnly.slice(2)
        : digitsOnly;
    return /^[6-9]\d{9}$/.test(nationalNumber);
  },

  /**
   * Masks a phone number for privacy display: e.g. +91 87787 07086 -> +91 ••••• •7086
   */
  maskPhoneNumber(phone: string): string {
    const e164 = this.formatToE164(phone);
    if (e164.length >= 10) {
      const last4 = e164.slice(-4);
      const prefix = e164.slice(0, 3);
      return `${prefix} ••••• •${last4}`;
    }
    return phone;
  },

  /**
   * Indicates whether an active Firebase confirmation session is ready for code verification
   */
  hasActiveSession(): boolean {
    return activeConfirmationResult !== null;
  },

  /**
   * Sends real Firebase Phone OTP using Firebase Authentication
   */
  async sendOtp(phoneNumber: string): Promise<boolean> {
    const formatted = this.formatToE164(phoneNumber);

    if (Platform.OS === 'web') {
      const verifier = this.getRecaptchaVerifier();
      if (!verifier) {
        throw new Error('reCAPTCHA verifier could not be initialized in this browser. Please reload the page.');
      }
      try {
        if (__DEV__) {
          console.log('[phoneAuthService] Initiating signInWithPhoneNumber for:', this.maskPhoneNumber(formatted));
        }
        const confirmation = await signInWithPhoneNumber(auth, formatted, verifier);
        activeConfirmationResult = confirmation;
        return true;
      } catch (err: any) {
        // Safe development diagnostics: log error code and message without leaking PII or credentials
        if (__DEV__) {
          console.error('[phoneAuthService] sendOtp failed:', {
            code: err?.code,
            message: err?.message,
          });
        }
        // Clean up failed verifier safely so it is recreated on subsequent attempts
        this.clearRecaptchaVerifier();
        throw this.mapFirebaseError(err);
      }
    } else {
      // Native iOS / Android handling
      throw new Error(
        'Native SMS verification requires an EAS Development Build with SHA-256 fingerprint registered in Firebase Console. Please test via the Web preview at http://localhost:8082 or register a development client.'
      );
    }
  },

  /**
   * Verifies the 6-digit OTP code against the active Firebase confirmation session
   */
  async verifyOtp(otpCode: string): Promise<User> {
    if (!activeConfirmationResult) {
      throw new Error(
        'No active verification session. The page may have refreshed. Please tap "Resend OTP" or go back to request a code.'
      );
    }
    try {
      const userCredential = await activeConfirmationResult.confirm(otpCode.trim());
      activeConfirmationResult = null;
      return userCredential.user;
    } catch (err: any) {
      if (__DEV__) {
        console.error('[phoneAuthService] verifyOtp failed:', {
          code: err?.code,
          message: err?.message,
        });
      }
      throw this.mapFirebaseError(err);
    }
  },

  /**
   * Friendly error mapper for Firebase Auth errors with safe development diagnostics.
   * Displays the exact Firebase error code and message in __DEV__ without leaking sensitive data.
   */
  mapFirebaseError(err: any): Error {
    const code = err?.code || '';
    const rawMessage = err?.message || '';

    let userMessage = 'Authentication error occurred. Please try again.';

    if (code === 'auth/admin-restricted-operation') {
      userMessage =
        'Operation restricted in Firebase. In Firebase Console → Authentication → Sign-in method, click "Phone", ensure "Enable" is toggled ON, and click the "Save" button.';
    } else if (code === 'auth/operation-not-allowed') {
      userMessage =
        'Phone Authentication is not enabled or the test phone number is not registered in Firebase Console. If testing with a phone number, ensure it is added under Authentication → Sign-in method → Phone → "Phone numbers for testing" and Saved.';
    } else if (code === 'auth/invalid-phone-number') {
      userMessage = 'Invalid phone number format. Please enter a valid 10-digit mobile number.';
    } else if (code === 'auth/missing-phone-number') {
      userMessage = 'Mobile number is required.';
    } else if (code === 'auth/quota-exceeded') {
      userMessage =
        'SMS quota exceeded for today on Firebase free tier. Please use the configured test number +91 87787 07086 with code 123456.';
    } else if (code === 'auth/too-many-requests') {
      userMessage = 'Too many attempts. Please wait a minute before requesting another OTP.';
    } else if (code === 'auth/invalid-verification-code') {
      userMessage = 'Incorrect verification code. Please check the 6-digit code and try again.';
    } else if (code === 'auth/code-expired') {
      userMessage = 'Verification code has expired. Please tap "Resend OTP" to request a new code.';
    } else if (code === 'auth/captcha-check-failed') {
      userMessage = 'reCAPTCHA verification failed. Please try again.';
    } else if (rawMessage) {
      userMessage = rawMessage;
    }

    // In development mode, append exact Firebase error code for immediate diagnostics
    if (__DEV__ && code) {
      return new Error(`${userMessage} [${code}]`);
    }

    return new Error(userMessage);
  },
};
