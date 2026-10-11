import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontFamilies } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { phoneAuthService } from '../services/phoneAuthService';

export default function RegisterScreen() {
  const router = useRouter();
  const { role, language } = useApp();
  const { sendPhoneOtp } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation states
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        phoneAuthService.getRecaptchaVerifier();
      } catch {}
    }
  }, []);

  const validate = (): boolean => {
    let isValid = true;
    setNameError(null);
    setPhoneError(null);
    setErrorMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setNameError(
        language === 'ta'
          ? 'தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துகள்).'
          : 'Please enter your full name (at least 2 characters).'
      );
      isValid = false;
    }

    const cleanDigits = phone.replace(/[^\d]/g, '');
    if (!cleanDigits) {
      setPhoneError(
        language === 'ta'
          ? 'தயவுசெய்து உங்கள் 10-இலக்க கைபேசி எண்ணை உள்ளிடவும்.'
          : 'Please enter your 10-digit mobile number.'
      );
      isValid = false;
    } else if (!phoneAuthService.isValidIndianMobile(cleanDigits)) {
      setPhoneError(
        language === 'ta'
          ? 'சரியான 10-இலக்க கைபேசி எண்ணை உள்ளிடவும் (6, 7, 8 அல்லது 9-ல் தொடங்க வேண்டும்).'
          : 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.'
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSendOtp = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const fullPhone = phoneAuthService.formatToE164(phone);

    try {
      await sendPhoneOtp(fullPhone);
      // Navigate to OTP verification screen passing verified params
      router.push({
        pathname: '/otp-verify',
        params: {
          phone: fullPhone,
          name: name.trim(),
          role,
        },
      });
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (language === 'ta'
            ? 'OTP அனுப்புவதில் தோல்வி. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
            : 'Failed to send OTP. Please verify your mobile number and try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseTestNumber = () => {
    setName(role === 'worker' ? 'கதிரவன் (Worker)' : 'செந்தில் (Customer)');
    setPhone('8778707086');
    setNameError(null);
    setPhoneError(null);
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <Header
        showLocation={false}
        title={language === 'ta' ? 'பதிவு செய்தல்' : 'Registration'}
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
          {/* Selected Account Type Pill */}
          <View style={styles.roleCard}>
            <View style={styles.roleCardLeft}>
              <View style={styles.roleIconBox}>
                <Ionicons
                  name={role === 'worker' ? 'briefcase' : 'people'}
                  size={18}
                  color={Colors.brandBlack}
                />
              </View>
              <View>
                <Text style={styles.roleLabel}>
                  {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட கணக்கு' : 'Selected Account'}
                </Text>
                <Text style={styles.roleValue}>
                  {role === 'worker'
                    ? language === 'ta'
                      ? 'வேலை தேடுபவர் (Worker)'
                      : 'Find Work (Worker)'
                    : language === 'ta'
                    ? 'ஆட்கள் தேவை (Customer)'
                    : 'Hire Workers (Customer)'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/role-select')}
              style={styles.changeRoleBtn}
            >
              <Text style={styles.changeRoleText}>
                {language === 'ta' ? 'மாற்றுக' : 'Change'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Heading */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>
              {language === 'ta' ? 'உங்கள் விவரங்களை உள்ளிடவும்' : 'Enter Your Details'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'ta'
                ? 'உங்கள் கைபேசி எண்ணை சரிபார்க்க 6-இலக்க OTP அனுப்பப்படும். கடவுச்சொல் தேவையில்லை.'
                : "We'll send a 6-digit OTP to verify your mobile number. No password required."}
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {language === 'ta' ? 'முழு பெயர்' : 'Full Name'}{' '}
              <Text style={{ color: Colors.error }}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, nameError && styles.inputErrorBorder]}>
              <Ionicons
                name="person-outline"
                size={18}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder={language === 'ta' ? 'எ.கா: ரமேஷ் குமார்' : 'e.g. Ramesh Kumar'}
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={(val) => {
                  setName(val);
                  if (nameError) setNameError(null);
                }}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
            {nameError && <Text style={styles.fieldErrorText}>{nameError}</Text>}
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {language === 'ta' ? 'கைபேசி எண்' : 'Mobile Number'}{' '}
              <Text style={{ color: Colors.error }}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, phoneError && styles.inputErrorBorder]}>
              {/* Country Code Pill */}
              <View style={styles.countryCodeBadge}>
                <Text style={styles.flagText}>🇮🇳</Text>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>

              <TextInput
                style={styles.textInput}
                placeholder={language === 'ta' ? '98765 43210' : '98765 43210'}
                placeholderTextColor={Colors.textMuted}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val.replace(/[^\d]/g, '').slice(0, 10));
                  if (phoneError) setPhoneError(null);
                }}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!isLoading}
              />
            </View>
            {phoneError && <Text style={styles.fieldErrorText}>{phoneError}</Text>}
          </View>

          {/* Quick Development Test Card */}
          {__DEV__ && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUseTestNumber}
              style={styles.testHintCard}
            >
              <View style={styles.testHintHeader}>
                <Ionicons name="sparkles" size={14} color={Colors.brandBlack} />
                <Text style={styles.testHintTitle}>
                  {language === 'ta' ? 'விரைவு சோதனை எண் (Quick Test)' : 'Quick Test Available'}
                </Text>
              </View>
              <Text style={styles.testHintDesc}>
                {language === 'ta'
                  ? 'தானாக நிரப்ப தட்டவும்: +91 87787 07086 (சோதனை OTP: 123456)'
                  : 'Tap to autofill: +91 87787 07086 (Test OTP: 123456)'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Submit Action */}
          <View style={styles.actionContainer}>
            <Button
              title={
                isLoading
                  ? language === 'ta'
                    ? 'OTP அனுப்பப்படுகிறது...'
                    : 'Sending OTP...'
                  : language === 'ta'
                  ? 'OTP அனுப்புக'
                  : 'Send OTP'
              }
              onPress={handleSendOtp}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              style={styles.submitBtn}
              textStyle={styles.submitBtnText}
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
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEFCE8',
    borderWidth: 1.5,
    borderColor: Colors.brandYellow,
    borderRadius: Radius.lg,
    padding: 12,
    marginBottom: 20,
  },
  roleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleLabel: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  roleValue: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginTop: 1,
  },
  changeRoleBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  changeRoleText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  headingSection: {
    marginBottom: 24,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 22,
    fontWeight: '900',
    color: Colors.brandBlack,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.error,
    flex: 1,
    lineHeight: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  inputErrorBorder: {
    borderColor: Colors.error,
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: 10,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    gap: 4,
  },
  flagText: {
    fontSize: 16,
  },
  countryCodeText: {
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  fieldErrorText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.error,
    marginTop: 5,
    fontWeight: '600',
  },
  testHintCard: {
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    borderStyle: 'dashed',
  },
  testHintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  testHintTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  testHintDesc: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  actionContainer: {
    marginTop: 8,
  },
  submitBtn: {
    height: 54,
    minHeight: 54,
    borderRadius: Radius.lg,
    backgroundColor: Colors.brandYellow,
  },
  submitBtnText: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
});
