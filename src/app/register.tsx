import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontFamilies, Shadows } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Header } from '../components/ui/Header';
import { GoogleButton } from '../components/ui/GoogleButton';
import { profileService } from '../services/profileService';

export default function RegisterScreen() {
  const router = useRouter();
  const { role, setRole, language, setHasSeenOnboarding } = useApp();
  const { signInWithGoogle } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await signInWithGoogle();

      // Retrieve existing Firestore profile using the permanent Firebase UID
      const existingProfile = await profileService.getProfile(user.uid);

      if (existingProfile) {
        // Returning user: restore their established profile role and go straight to home
        setRole(existingProfile.role);
        setHasSeenOnboarding(true);

        if (existingProfile.role === 'worker') {
          router.replace('/(worker)/home');
        } else {
          router.replace('/(customer)/home');
        }
      } else {
        // New user: retain the selected role and navigate to profile setup
        setRole(role);
        router.replace({
          pathname: '/profile-setup',
          params: {
            role,
            name: user.displayName || '',
            email: user.email || '',
          },
        });
      }
    } catch (err: any) {
      const msg = err?.message || 'Google sign-in failed. Please try again.';
      // Don't display an aggressive error banner if the user intentionally dismissed the popup
      if (!msg.toLowerCase().includes('cancelled') && !msg.toLowerCase().includes('closed')) {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <Header
        showLocation={false}
        title={language === 'ta' ? 'உள்நுழைக / பதிவு செய்க' : 'Sign In / Register'}
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Account Type Card */}
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
            accessibilityRole="button"
            accessibilityLabel={language === 'ta' ? 'கணக்கு வகையை மாற்றுக' : 'Change account type'}
          >
            <Text style={styles.changeRoleText}>
              {language === 'ta' ? 'மாற்றுக' : 'Change'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Heading Section */}
        <View style={styles.headingSection}>
          <View style={styles.badgeRow}>
            <View style={styles.googleIconBadge}>
              <Ionicons name="logo-google" size={26} color="#EA4335" />
            </View>
          </View>

          <Text style={styles.title}>
            {language === 'ta'
              ? 'Google மூலம் எளிதாக இணையுங்கள்'
              : 'Sign In with Google'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'ta'
              ? 'கடவுச்சொற்கள் அல்லது OTP தேவையில்லை. உங்கள் Google கணக்குடன் ஒரே தட்டலில் தொடங்குங்கள்.'
              : 'No passwords or OTP codes required. One tap to connect directly with local opportunities in Madurai.'}
          </Text>
        </View>

        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={Colors.error} />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        )}

        {/* Primary Action: Continue with Google */}
        <View style={styles.actionContainer}>
          <GoogleButton
            onPress={handleGoogleSignIn}
            loading={isLoading}
            title={language === 'ta' ? 'Google மூலம் தொடரவும்' : 'Continue with Google'}
            loadingText={language === 'ta' ? 'Google உடன் இணைக்கப்படுகிறது...' : 'Connecting to Google...'}
          />
        </View>

        {/* Security and Feature Highlights */}
        <View style={styles.highlightsContainer}>
          <View style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Ionicons name="flash-outline" size={18} color={Colors.brandBlack} />
            </View>
            <View style={styles.highlightTextCol}>
              <Text style={styles.highlightTitle}>
                {language === 'ta' ? 'உடனடி அணுகல்' : 'Instant & Frictionless'}
              </Text>
              <Text style={styles.highlightDesc}>
                {language === 'ta'
                  ? 'SMS தாமதங்கள் அல்லது சிக்கல்கள் இன்றி உடனடியாக உள்நுழையவும்.'
                  : 'Skip SMS delays, quota issues, and forgotten codes completely.'}
              </Text>
            </View>
          </View>

          <View style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Colors.brandBlack} />
            </View>
            <View style={styles.highlightTextCol}>
              <Text style={styles.highlightTitle}>
                {language === 'ta' ? 'நம்பகமான அடையாளம்' : 'Verified Google Identity'}
              </Text>
              <Text style={styles.highlightDesc}>
                {language === 'ta'
                  ? 'பாதுகாப்பான Firebase அங்கீகாரம் உங்கள் சுயவிவரத்தைப் பாதுகாக்கும்.'
                  : 'Industry-standard Firebase Authentication protects your profile.'}
              </Text>
            </View>
          </View>

          <View style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Ionicons name="location-outline" size={18} color={Colors.brandBlack} />
            </View>
            <View style={styles.highlightTextCol}>
              <Text style={styles.highlightTitle}>
                {language === 'ta' ? 'உள்ளூர் மதுரை நெட்வொர்க்' : 'Madurai Local Network'}
              </Text>
              <Text style={styles.highlightDesc}>
                {language === 'ta'
                  ? 'மாட்டுத்தாவணி, அண்ணா நகர், சிம்மக்கல் மற்றும் சுற்றியுள்ள பகுதிகள்.'
                  : 'Direct marketplace for Mattuthavani, Anna Nagar, Simmakkal, and more.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Privacy Terms Notice */}
        <View style={styles.footerNotice}>
          <Ionicons name="lock-closed-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.footerNoticeText}>
            {language === 'ta'
              ? 'தொடர்வதன் மூலம், MY VELAI விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறீர்கள்.'
              : 'By continuing, you agree to MY VELAI Terms of Service and Privacy Policy.'}
          </Text>
        </View>
      </ScrollView>
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
    marginBottom: 24,
    ...Shadows.subtle,
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
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 28,
  },
  badgeRow: {
    marginBottom: 16,
  },
  googleIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 24,
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
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  errorBanner: {
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
    lineHeight: 16,
    fontWeight: '600',
  },
  actionContainer: {
    marginBottom: 28,
  },
  highlightsContainer: {
    gap: 12,
    marginBottom: 28,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  highlightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  highlightTextCol: {
    flex: 1,
  },
  highlightTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginBottom: 2,
  },
  highlightDesc: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  footerNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  footerNoticeText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 15,
  },
});
