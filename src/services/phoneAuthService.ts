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
// Enable official Firebase testing settings in development to prevent external reCAPTCHA script collisions
if (Platform.OS === 'web' && __DEV__ && auth?.settings) {
  auth.settings.appVerificationDisabledForTesting = true;
}

export const phoneAuthService = {
  /**
   * Initializes or returns the persistent reCAPTCHA verifier mounted on a stable DOM container.
   * Avoids calling .clear() or removing containers dynamically, which triggers
   * "Cannot read properties of null (reading 'style')" inside Google's recaptcha__en.js.
   */
  getRecaptchaVerifier(): RecaptchaVerifier | null {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
      const containerId = 'recaptcha-container';
      let container = document.getElementById(containerId);

      // Ensure stable container exists in DOM
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.right = '0';
        container.style.zIndex = '-1';
        document.body.appendChild(container);
      }

      // Reuse existing verifier if healthy
      if (window.recaptchaVerifier) {
        return window.recaptchaVerifier;
      }

      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            // Widget expired, reset widget
            if (window.grecaptcha) {
              try {
                window.grecaptcha.reset();
              } catch {}
            }
          },
        });
        return window.recaptchaVerifier;
      } catch (err) {
        console.warn('[phoneAuthService] Error initializing RecaptchaVerifier:', err);
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
        throw new Error('reCAPTCHA verifier could not be initialized in this browser.');
      }
      try {
        const confirmation = await signInWithPhoneNumber(auth, formatted, verifier);
        activeConfirmationResult = confirmation;
        return true;
      } catch (err: any) {
        // Reset widget without destroying verifier or DOM container
        if (typeof window !== 'undefined' && window.grecaptcha) {
          try {
            window.grecaptcha.reset();
          } catch {}
        }
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
      throw this.mapFirebaseError(err);
    }
  },

  /**
   * Friendly error mapper for Firebase Auth errors
   */
  mapFirebaseError(err: any): Error {
    const code = err?.code || '';
    const message = err?.message || '';

    if (code === 'auth/admin-restricted-operation') {
      return new Error(
        'Operation restricted in Firebase. In Firebase Console → Authentication → Sign-in method, click "Phone", ensure "Enable" is toggled ON, and click the "Save" button at the bottom right.'
      );
    }
    if (code === 'auth/operation-not-allowed') {
      return new Error(
        'Phone Authentication is not enabled in Firebase. In Firebase Console → Authentication → Sign-in method, click "Phone", toggle "Enable", and click the "Save" button at the bottom right.'
      );
    }
    if (code === 'auth/invalid-phone-number') {
      return new Error('Invalid phone number format. Please enter a valid 10-digit mobile number.');
    }
    if (code === 'auth/missing-phone-number') {
      return new Error('Mobile number is required.');
    }
    if (code === 'auth/quota-exceeded') {
      return new Error(
        'SMS quota exceeded for today on Firebase free tier. Please use the test number +91 87787 07086 with code 123456 configured in your Firebase Console.'
      );
    }
    if (code === 'auth/too-many-requests') {
      return new Error('Too many attempts. Please wait a minute before requesting another OTP.');
    }
    if (code === 'auth/invalid-verification-code') {
      return new Error('Incorrect verification code. Please check the 6-digit code and try again.');
    }
    if (code === 'auth/code-expired') {
      return new Error('Verification code has expired. Please tap "Resend OTP" to request a new code.');
    }
    if (code === 'auth/captcha-check-failed') {
      return new Error('reCAPTCHA verification failed. Please try again.');
    }
    return new Error(message || 'Authentication error occurred. Please try again.');
  },
};
