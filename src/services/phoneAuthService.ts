import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signInAnonymously,
  User,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../lib/firebase';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let activeConfirmationResult: ConfirmationResult | null = null;
let activeDevSession: { phoneNumber: string; expectedCode: string } | null = null;

/**
 * Service managing real Firebase Phone Authentication across Web and Native.
 * - For Web: uses RecaptchaVerifier and signInWithPhoneNumber.
 * - Supports configured Firebase test phone numbers (e.g. +91 94432 10000 with code 123456).
 * - For Native builds: handles dev client configuration and provides clear status guidance.
 */
export const phoneAuthService = {
  /**
   * Initializes or gets the singleton reCAPTCHA verifier for Web phone verification
   */
  getRecaptchaVerifier(): RecaptchaVerifier | null {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const containerId = 'recaptcha-container';
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        // Keep container invisible and non-disruptive to layout
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.right = '0';
        container.style.zIndex = '-1';
        document.body.appendChild(container);
      }

      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            // reCAPTCHA expired, reset for next attempt
            recaptchaVerifier = null;
          },
        });
      }
      return recaptchaVerifier;
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
   * Masks a phone number for privacy display: e.g. +91 94432 10000 -> +91 ••••• •0000
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
   * Indicates whether a development fallback session is active
   */
  isDevSessionActive(): boolean {
    return activeDevSession !== null || __DEV__;
  },

  /**
   * Sends real Firebase Phone OTP
   */
  async sendOtp(phoneNumber: string): Promise<boolean> {
    const formatted = this.formatToE164(phoneNumber);

    // In local development (__DEV__), when testing with designated development numbers,
    // initialize test verification session so developers and automated tests can verify end-to-end without being blocked by Google reCAPTCHA bot challenges.
    const DEV_TEST_NUMBERS = ['+919443210000', '+918778707086'];
    if (__DEV__ && DEV_TEST_NUMBERS.includes(formatted)) {
      console.log(
        `[phoneAuthService] Development test number (${formatted}) detected: initializing test verification session.`
      );
      activeDevSession = {
        phoneNumber: formatted,
        expectedCode: '123456',
      };
      activeConfirmationResult = null;
      return true;
    }

    if (Platform.OS === 'web') {
      const verifier = this.getRecaptchaVerifier();
      if (!verifier) {
        throw new Error('reCAPTCHA verifier could not be initialized in this browser.');
      }
      try {
        const confirmation = await signInWithPhoneNumber(auth, formatted, verifier);
        activeConfirmationResult = confirmation;
        activeDevSession = null;
        return true;
      } catch (err: any) {
        // Reset verifier on error so subsequent requests can re-initialize cleanly
        if (recaptchaVerifier) {
          try {
            recaptchaVerifier.clear();
          } catch {}
          recaptchaVerifier = null;
        }

        // When Phone Authentication is not toggled ON in Firebase Console (or region blocked):
        // In development (__DEV__), provide seamless fallback to test session (123456)
        // so the full onboarding, OTP validation, profile creation, and navigation can be tested.
        if (err?.code === 'auth/operation-not-allowed' && __DEV__) {
          console.warn(
            '[phoneAuthService] Phone Authentication is not enabled in Firebase Console (auth/operation-not-allowed). Falling back to Dev Test Session with OTP: 123456.'
          );
          activeDevSession = {
            phoneNumber: formatted,
            expectedCode: '123456',
          };
          activeConfirmationResult = null;
          return true;
        }

        throw this.mapFirebaseError(err);
      }
    } else {
      // Native iOS / Android handling
      // In development mode, allow test session for quick simulation if native SMS is not configured yet
      if (__DEV__) {
        console.warn(
          '[phoneAuthService] Native SMS: falling back to Dev Test Session in Expo development environment.'
        );
        activeDevSession = {
          phoneNumber: formatted,
          expectedCode: '123456',
        };
        activeConfirmationResult = null;
        return true;
      }
      throw new Error(
        'Native SMS verification requires an EAS Development Build with SHA-256 fingerprint registered in Firebase Console. Please test via the Web preview at http://localhost:8082 or register a development client.'
      );
    }
  },

  /**
   * Verifies the 6-digit OTP code against the active Firebase confirmation session
   */
  async verifyOtp(otpCode: string): Promise<User> {
    if (activeDevSession) {
      if (otpCode.trim() !== activeDevSession.expectedCode) {
        throw new Error('Incorrect verification code. Please check the 6-digit code and try again.');
      }
      // Sign in anonymously to obtain a real Firebase user with a UID for Firestore profile creation
      const anonCred = await signInAnonymously(auth);
      activeDevSession = null;
      return anonCred.user;
    }

    if (!activeConfirmationResult) {
      if (__DEV__ && otpCode.trim() === '123456') {
        const anonCred = await signInAnonymously(auth);
        return anonCred.user;
      }
      throw new Error('No active verification session. Please request a new OTP.');
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

    if (code === 'auth/operation-not-allowed') {
      return new Error(
        'Phone Authentication is not enabled for this region in your Firebase Console project. In Firebase Console → Authentication → Sign-in method, enable "Phone", configure SMS region policy for India (+91), or add "+91 94432 10000" under "Phone numbers for testing".'
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
        'SMS quota exceeded for today on Firebase free tier. For instant testing, please use test number +91 94432 10000 with code 123456.'
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

