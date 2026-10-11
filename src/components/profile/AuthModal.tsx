import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
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
  const { language, currentLocality } = useApp();
  const { signInWithEmail, signUpWithEmail, signInQuickTest } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg(language === 'ta' ? 'சரியான மின்னஞ்சலை உள்ளிடவும்.' : 'Please enter a valid email.');
      return;
    }
    if (cleanPass.length < 6) {
      setErrorMsg(
        language === 'ta'
          ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (mode === 'signup' && name.trim().length < 2) {
      setErrorMsg(language === 'ta' ? 'உங்கள் முழு பெயரை உள்ளிடவும்.' : 'Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(cleanEmail, cleanPass, {
          displayName: name.trim(),
          phone: phone.trim() || null,
          role: targetRole,
          localityId: currentLocality.id,
          locality_en: currentLocality.name_en,
          locality_ta: currentLocality.name_ta,
          language,
          trade_en: targetRole === 'worker' ? 'Daily Wage Worker' : undefined,
          trade_ta: targetRole === 'worker' ? 'தினக்கூலி பணியாளர்' : undefined,
          dailyRate: targetRole === 'worker' ? 750 : undefined,
          hourlyRate: targetRole === 'worker' ? 120 : undefined,
          skills: targetRole === 'worker' ? ['General Help'] : undefined,
        });
      } else {
        await signInWithEmail(cleanEmail, cleanPass);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed';
      if (msg.includes('auth/email-already-in-use')) {
        setErrorMsg(
          language === 'ta'
            ? 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. உள்நுழையவும்.'
            : 'Email already registered. Please sign in.'
        );
      } else if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        setErrorMsg(
          language === 'ta'
            ? 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.'
            : 'Invalid email or password.'
        );
      } else {
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
            ? 'அனானிமஸ் உள்நுழைவு Firebase கன்சோலில் முடக்கப்பட்டுள்ளது. மேலே உள்ள மின்னஞ்சல் மூலம் பதிவு செய்யவும்.'
            : 'Anonymous sign-in is disabled in Firebase Console. Please register using Email/Password above.'
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {mode === 'signup'
                  ? language === 'ta' ? 'புதிய கணக்கை உருவாக்கவும்' : 'Create Real Firebase Account'
                  : language === 'ta' ? 'கணக்கில் உள்நுழையவும்' : 'Sign In to MY VELAI'}
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

          {/* Mode Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              onPress={() => { setMode('signup'); setErrorMsg(null); }}
              style={[styles.tabBtn, mode === 'signup' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                {language === 'ta' ? 'பதிவு செய்ய' : 'Register'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setMode('signin'); setErrorMsg(null); }}
              style={[styles.tabBtn, mode === 'signin' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                {language === 'ta' ? 'உள்நுழைக' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Inputs */}
          <View style={styles.form}>
            {mode === 'signup' ? (
              <>
                <Text style={styles.label}>{language === 'ta' ? 'பெயர்' : 'Full Name'} *</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={language === 'ta' ? 'உங்கள் பெயர்' : 'Your name'}
                  placeholderTextColor={Colors.textMuted}
                  style={styles.input}
                />
                <Text style={styles.label}>{language === 'ta' ? 'மொபைல் எண்' : 'Phone'} (Optional)</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 94432 10000"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </>
            ) : null}

            <Text style={styles.label}>{language === 'ta' ? 'மின்னஞ்சல்' : 'Email'} *</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>{language === 'ta' ? 'கடவுச்சொல்' : 'Password'} *</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              style={styles.input}
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              style={[styles.submitBtn, isLoading && { opacity: 0.7 }]}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.brandBlack} />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'signup'
                    ? language === 'ta' ? 'பதிவு செய்து சுயவிவரத்தை உருவாக்க' : 'Create & Save Profile'
                    : language === 'ta' ? 'உள்நுழைக' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Quick Test Button */}
            <TouchableOpacity
              onPress={handleQuickTest}
              disabled={isLoading}
              style={styles.quickTestBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="flash" size={15} color={Colors.brandBlack} />
              <Text style={styles.quickTestText}>
                {language === 'ta'
                  ? 'விரைவு சோதனை: 1-கிளிக் சோதனை கணக்கு'
                  : 'Instant 1-Click Test Sign In (Firestore Verified)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Shadows.subtle,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontWeight: '800',
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
    fontSize: 12,
    color: Colors.error,
    flex: 1,
    fontWeight: '600',
  },
  form: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 6,
    marginBottom: 2,
  },
  input: {
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: Colors.brandYellow,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.brandBlack,
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
    marginTop: 8,
    gap: 6,
  },
  quickTestText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
});
