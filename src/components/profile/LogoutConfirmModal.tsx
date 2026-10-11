import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

interface LogoutConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  userEmail?: string | null;
  errorMessage?: string | null;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isLoading,
  userEmail,
  errorMessage,
}) => {
  const { language, t } = useApp();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isLoading ? undefined : onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icon Badge */}
          <View style={styles.iconBadge}>
            <Ionicons name="log-out-outline" size={24} color={Colors.error} />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {language === 'ta' ? 'கணக்கிலிருந்து வெளியேறவா?' : 'Sign Out of Account?'}
          </Text>

          {/* Subtitle / Email */}
          <Text style={styles.subtitle}>
            {language === 'ta'
              ? 'உங்கள் சுயவிவரமும் வேலைகளும் கிளவுடில் பாதுகாப்பாக இருக்கும். எப்போது வேண்டுமானாலும் மீண்டும் உள்நுழையலாம்.'
              : 'Your profile and history remain securely saved in Cloud Firestore. You can sign back in anytime.'}
          </Text>

          {userEmail ? (
            <View style={styles.emailPill}>
              <Ionicons name="person-circle-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.emailText}>{userEmail}</Text>
            </View>
          ) : null}

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              style={[styles.btn, styles.cancelBtn]}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>
                {language === 'ta' ? 'ரத்து' : 'Cancel'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              style={[styles.btn, styles.logoutBtn]}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.logoutBtnText}>
                    {t('logout')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 22,
    alignItems: 'center',
    ...Shadows.lifted,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: Radius.round,
    backgroundColor: Colors.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.round,
    marginBottom: 14,
    gap: 6,
  },
  emailText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    marginBottom: 14,
    gap: 6,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '500',
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cancelBtn: {
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  logoutBtn: {
    backgroundColor: Colors.error,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
