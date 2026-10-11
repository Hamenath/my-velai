import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { phoneAuthService } from '../services/phoneAuthService';
import { profileService } from '../services/profileService';
import { UserRole } from '../types';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; name?: string; role?: string }>();
  const { language, setRole, setHasSeenOnboarding } = useApp();
  const { verifyPhoneOtp, sendPhoneOtp } = useAuth();

  const phone = params.phone || '+918778707086';
  const name = params.name || '';
  const role = (params.role as UserRole) || 'customer';

  // 6 digit split inputs
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cooldown countdown timer (45 seconds)
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    let interval: any = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const maskedPhone = phoneAuthService.maskPhoneNumber(phone);
  const isComplete = digits.every((d) => d.length === 1);
  const fullCode = digits.join('');

  const handleDigitChange = (text: string, index: number) => {
    setErrorMessage(null);

    // Handle full paste (e.g. "123456")
    const cleanDigits = text.replace(/[^\d]/g, '');
    if (cleanDigits.length >= 6) {
      const splitArr = cleanDigits.slice(0, 6).split('');
      setDigits(splitArr);
      inputRefs.current[5]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanDigits.slice(-1);
    setDigits(newDigits);

    // Auto advance focus to next box
    if (cleanDigits && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    if (!isComplete) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await verifyPhoneOtp(fullCode);

      // Check whether user already possesses an existing Firestore profile
      const existingProfile = await profileService.getProfile(user.uid);

      if (existingProfile) {
        // Returning authenticated user: restore role and go directly to home
        setRole(existingProfile.role);
        setHasSeenOnboarding(true);

        if (existingProfile.role === 'worker') {
          router.replace('/(worker)/home');
        } else {
          router.replace('/(customer)/home');
        }
      } else {
        // New user: proceed to role-specific profile completion
        setRole(role);
        router.replace({
          pathname: '/profile-setup',
          params: {
            phone,
            name,
            role,
          },
        });
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (language === 'ta'
            ? 'தவறான OTP குறியீடு. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
            : 'Invalid or expired OTP. Please check the code and try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage(null);

    try {
      await sendPhoneOtp(phone);
      setCountdown(45);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (language === 'ta'
            ? 'OTP மீண்டும் அனுப்புவதில் தோல்வி. தயவுசெய்து காத்திருக்கவும்.'
            : 'Failed to resend OTP. Please wait before retrying.')
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <Header
        showLocation={false}
        title={language === 'ta' ? 'OTP சரிபார்ப்பு' : 'Verify Mobile'}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Title */}
          <View style={styles.headingSection}>
            <View style={styles.iconBadge}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color={Colors.brandBlack} />
            </View>

            <Text style={styles.title}>
              {language === 'ta' ? 'சரிபார்ப்புக் குறியீடு' : 'Enter Verification Code'}
            </Text>

            <Text style={styles.subtitle}>
              {language === 'ta'
                ? `உங்கள் கைபேசி எண்ணிற்கு (${maskedPhone}) அனுப்பப்பட்ட 6-இலக்க OTP குறியீட்டை உள்ளிடவும்.`
                : `We've sent a 6-digit OTP code to ${maskedPhone}.`}
            </Text>
          </View>

          {/* Quick test notice for Firebase Console test number */}
          {Boolean(__DEV__ && phone.includes('8778707086')) && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setDigits(['1', '2', '3', '4', '5', '6']);
                inputRefs.current[5]?.focus();
              }}
              style={styles.devBanner}
            >
              <Ionicons name="sparkles" size={15} color={Colors.brandBlack} />
              <Text style={styles.devBannerText}>
                {language === 'ta'
                  ? 'சோதனை எண் (+91 87787 07086): குறியீடு 123456 ஐ நிரப்ப தட்டவும்'
                  : 'Firebase Test Number (+91 87787 07086): Tap to fill OTP 123456'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* 6 Digit Split Input Boxes */}
          <View style={styles.otpBoxesRow}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpBox,
                  digit.length > 0 && styles.otpBoxFilled,
                  errorMessage && styles.otpBoxError,
                ]}
                keyboardType="number-pad"
                maxLength={6} // Allow paste on any box
                value={digit}
                onChangeText={(text) => handleDigitChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                textAlign="center"
                editable={!isLoading}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend Cooldown Section */}
          <View style={styles.resendSection}>
            {countdown > 0 ? (
              <Text style={styles.timerText}>
                {language === 'ta'
                  ? `மீண்டும் அனுப்ப காத்திருக்கவும்: 0:${countdown < 10 ? `0${countdown}` : countdown}`
                  : `Resend code in 0:${countdown < 10 ? `0${countdown}` : countdown}`}
              </Text>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleResend}
                disabled={isResending}
                style={styles.resendBtn}
              >
                {isResending ? (
                  <ActivityIndicator size="small" color={Colors.brandBlack} />
                ) : (
                  <>
                    <Ionicons name="reload" size={14} color={Colors.brandBlack} />
                    <Text style={styles.resendBtnText}>
                      {language === 'ta' ? 'மீண்டும் OTP அனுப்புக' : 'Resend OTP'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Change Phone Number Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.changePhoneLink}
          >
            <Text style={styles.changePhoneText}>
              {language === 'ta'
                ? 'தவறான எண்ணா? கைபேசி எண்ணை மாற்றுக'
                : 'Wrong number? Edit mobile number'}
            </Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <View style={styles.actionContainer}>
            <Button
              title={
                isLoading
                  ? language === 'ta'
                    ? 'சரிபார்க்கப்படுகிறது...'
                    : 'Verifying...'
                  : language === 'ta'
                  ? 'சரிபார்க்கவும்'
                  : 'Verify & Continue'
              }
              onPress={handleVerify}
              variant="primary"
              size="lg"
              fullWidth
              disabled={!isComplete || isLoading}
              style={styles.verifyBtn}
              textStyle={styles.verifyBtnText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Colors.brandYellow,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 22,
    fontWeight: '900',
    color: Colors.brandBlack,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  devBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    borderWidth: 1.5,
    borderColor: Colors.brandYellow,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  devBannerText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.brandBlack,
    fontWeight: '700',
    flex: 1,
  },
  errorBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorBannerText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.error,
    flex: 1,
    fontWeight: '600',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
    width: '100%',
  },
  otpBox: {
    width: 44,
    height: 54,
    borderRadius: Radius.md,
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    fontFamily: FontFamilies.primary,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.brandBlack,
    ...Shadows.subtle,
  },
  otpBoxFilled: {
    borderColor: Colors.brandBlack,
    backgroundColor: '#FFFFFF',
  },
  otpBoxError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF5F5',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resendBtnText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  changePhoneLink: {
    paddingVertical: 6,
    marginBottom: 28,
  },
  changePhoneText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  actionContainer: {
    width: '100%',
  },
  verifyBtn: {
    height: 54,
    minHeight: 54,
    borderRadius: Radius.lg,
    backgroundColor: Colors.brandYellow,
  },
  verifyBtnText: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
});
