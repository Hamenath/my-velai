import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { GoogleButton } from '../ui/GoogleButton';
import { UserRole } from '../../types';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  targetRole: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onClose,
  targetRole,
}) => {
  const router = useRouter();
  const { language, setRole, setHasSeenOnboarding } = useApp();
  const { signInWithGoogle, signInQuickTest } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();

      // Check for an existing profile — returning user
      const existingProfile = await profileService.getProfile(user.uid);
      if (existingProfile) {
        setRole(existingProfile.role);
        setHasSeenOnboarding(true);
        onClose();
        if (existingProfile.role === 'worker') {
          router.replace('/(worker)/home');
        } else {
          router.replace('/(customer)/home');
        }
      } else {
        // New user: go to profile setup
        onClose();
        router.replace({
          pathname: '/profile-setup',
          params: {
            role: targetRole,
            name: user.displayName || '',
            email: user.email || '',
          },
        });
      }
    } catch (err: any) {
      const msg = err?.message || 'Google sign-in failed. Please try again.';
      if (!msg.toLowerCase().includes('cancelled') && !msg.toLowerCase().includes('closed')) {
        setErrorMsg(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTest = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await signInQuickTest(
        targetRole,
        language === 'ta'
          ? targetRole === 'worker' ? 'மதுரை தொழிலாளி' : 'மதுரை வாடிக்கையாளர்'
          : targetRole === 'worker' ? 'Madurai Worker' : 'Madurai Customer'
      );
      onClose();
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('auth/operation-not-allowed') || msg.includes('admin-restricted-operation')) {
        setErrorMsg(
          language === 'ta'
            ? 'அனானிமஸ் உள்நுழைவு Firebase கன்சோலில் முடக்கப்பட்டுள்ளது. Google மூலம் உள்நுழையவும்.'
            : 'Anonymous sign-in is disabled in Firebase Console. Please use Google Sign-In.'
        );
      } else {
        setErrorMsg(err?.message || 'Quick sign-in failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {language === 'ta' ? 'MY VELAI இல் உள்நுழைக' : 'Sign In to MY VELAI'}
              </Text>
              <Text style={styles.subtitle}>
                {targetRole === 'worker'
                  ? language === 'ta' ? 'தொழிலாளி சுயவிவரம்' : 'Worker Profile'
                  : language === 'ta' ? 'வாடிக்கையாளர் சுயவிவரம்' : 'Customer Profile'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} disabled={isLoading} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Google Sign-In */}
          <View style={styles.form}>
            <Text style={styles.hint}>
              {language === 'ta'
                ? 'கடவுச்சொற்கள் தேவையில்லை. உங்கள் Google கணக்குடன் பாதுகாப்பாக உள்நுழையவும்.'
                : 'No password needed. Sign in securely with your Google account.'}
            </Text>

            <GoogleButton
              onPress={handleGoogleSignIn}
              loading={isLoading}
              title={language === 'ta' ? 'Google மூலம் தொடரவும்' : 'Continue with Google'}
              loadingText={language === 'ta' ? 'Google உடன் இணைக்கப்படுகிறது...' : 'Connecting to Google...'}
            />

            {/* Development-only quick test */}
            {__DEV__ && (
              <TouchableOpacity
                onPress={handleQuickTest}
                disabled={isLoading}
                style={styles.quickTestBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="flash" size={15} color={Colors.brandBlack} />
                <Text style={styles.quickTestText}>
                  {language === 'ta'
                    ? 'விரைவு சோதனை (DEV)'
                    : 'Instant Test Sign In (DEV only)'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    ...Shadows.lifted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorBg,
    borderColor: Colors.errorBorder,
    borderWidth: 1,
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.error,
    flex: 1,
    fontWeight: '600',
  },
  form: {
    gap: 10,
  },
  hint: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  quickTestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    gap: 6,
  },
  quickTestText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
});
