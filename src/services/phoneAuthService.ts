import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../lib/firebase';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let activeConfirmationResult: ConfirmationResult | null = null;

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
   * Sends real Firebase Phone OTP
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
        // Reset verifier on error so subsequent requests can re-initialize cleanly
        if (recaptchaVerifier) {
          try {
            recaptchaVerifier.clear();
          } catch {}
          recaptchaVerifier = null;
        }
        throw this.mapFirebaseError(err);
      }
    } else {
      // Native iOS / Android handling
      // Note: Full native background SMS requires an EAS Development Build with SafetyNet/Play Integrity SHA-256 registered in Firebase Console.
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

    if (code === 'auth/invalid-phone-number') {
      return new Error('Invalid phone number format. Please enter a valid 10-digit mobile number.');
    }
    if (code === 'auth/missing-phone-number') {
      return new Error('Mobile number is required.');
    }
    if (code === 'auth/quota-exceeded') {
      return new Error('SMS quota exceeded for today on Firebase free tier. For instant testing, please use test number +91 94432 10000 with code 123456.');
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
