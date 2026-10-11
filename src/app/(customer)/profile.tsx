import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui/Button';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { AuthModal } from '../../components/profile/AuthModal';

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { setRole, currentLocality, language, toggleLanguage, t } = useApp();
  const { user, profile, isProfileLoading, signOut } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleSwitchToWorker = () => {
    setRole('worker');
    router.replace('/(worker)/home');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+919443210000').catch(() => {
      Alert.alert(t('maduraiSupport'), t('maduraiHelpline'));
    });
  };

  const handleSignOut = () => {
    Alert.alert(
      t('logout'),
      language === 'ta' ? 'நிச்சயமாக வெளியேற விரும்புகிறீர்களா?' : 'Are you sure you want to log out?',
      [
        { text: language === 'ta' ? 'ரத்து' : 'Cancel', style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  // Determine active display data
  const displayName = profile?.displayName || (language === 'ta' ? 'மதுரை வாடிக்கையாளர்' : 'Madurai Customer');
  const displayContact = profile?.phone || profile?.email || user?.email || '+91 94432 10000';
  const displayLocality = profile
    ? (language === 'ta' ? profile.locality_ta : profile.locality_en)
    : (language === 'ta' ? currentLocality.name_ta : currentLocality.name_en);
  const avatarLetter = (displayName[0] || 'வ').toUpperCase();

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      <Header
        showLocation={false}
        title={language === 'ta' ? 'வாடிக்கையாளர் சுயவிவரம்' : 'Customer Profile'}
      />

      <View style={styles.container}>
        {/* Loading Indicator */}
        {isProfileLoading ? (
          <View style={styles.loadingBar}>
            <ActivityIndicator size="small" color={Colors.brandBlack} />
            <Text style={styles.loadingText}>
              {language === 'ta' ? 'சுயவிவரம் ஏற்றப்படுகிறது...' : 'Loading Cloud Profile...'}
            </Text>
          </View>
        ) : null}

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{displayName}</Text>
              {user && profile ? (
                <View style={styles.syncedPill}>
                  <Ionicons name="cloud-done" size={11} color={Colors.success} />
                  <Text style={styles.syncedText}>Cloud</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.userPhone}>{displayContact}</Text>
            <View style={styles.localityTag}>
              <Ionicons name="location-outline" size={11} color={Colors.textSecondary} />
              <Text style={styles.localityText}>{displayLocality}, Madurai</Text>
            </View>
          </View>

          {/* Edit Profile Action */}
          {user && profile ? (
            <TouchableOpacity
              onPress={() => setEditModalVisible(true)}
              style={styles.editBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color={Colors.brandBlack} />
              <Text style={styles.editBtnText}>{t('editProfile')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Unauthenticated / Guest Account Prompt */}
        {!user ? (
          <View style={styles.authPromptCard}>
            <View style={{ flex: 1 }}>
              <View style={styles.authBadge}>
                <Ionicons name="shield-outline" size={12} color={Colors.brandBlack} />
                <Text style={styles.authBadgeText}>Cloud Firestore</Text>
              </View>
              <Text style={styles.authPromptTitle}>
                {language === 'ta'
                  ? 'சுயவிவரத்தை கிளவுடில் சேமிக்க'
                  : 'Save Profile to Cloud Firestore'}
              </Text>
              <Text style={styles.authPromptDesc}>
                {language === 'ta'
                  ? 'கணக்கை உருவாக்கி உங்கள் வேலைகள் மற்றும் சுயவிவரத்தை பாதுகாக்கவும்.'
                  : 'Register or sign in to persist your profile and history.'}
              </Text>
            </View>
            <Button
              title={language === 'ta' ? 'உள்நுழைக / பதிவு' : 'Sign In / Register'}
              onPress={() => setAuthModalVisible(true)}
              variant="primary"
              size="sm"
              style={{ marginLeft: 10 }}
            />
          </View>
        ) : null}

        {/* Switch Mode Action Card */}
        <View style={styles.switchCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>
              {language === 'ta' ? 'வேலை செய்ய விரும்புகிறீர்களா?' : 'Looking to work & earn?'}
            </Text>
            <Text style={styles.switchDesc}>
              {language === 'ta'
                ? 'தொழிலாளி முறைக்கு மாறி தினசரி வேலைகளைப் பெறுங்கள்.'
                : 'Switch to worker mode to discover local daily-wage jobs.'}
            </Text>
          </View>
          <Button
            title={language === 'ta' ? 'தொழிலாளி முறை' : 'Worker Mode'}
            onPress={handleSwitchToWorker}
            variant="primary"
            size="sm"
            style={{ marginLeft: 12 }}
          />
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/* Language Switch */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleLanguage}
            style={styles.menuItem}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="globe-outline" size={18} color={Colors.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{t('preferredLanguage')}</Text>
              <Text style={styles.menuSub}>
                {language === 'ta' ? 'தமிழ் (செயலில்)' : 'English (Active)'}
              </Text>
            </View>
            <View style={styles.langPill}>
              <Text style={styles.langPillText}>
                {language === 'ta' ? 'English' : 'தமிழ்'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/settings')}
            style={styles.menuItem}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="settings-outline" size={18} color={Colors.textPrimary} />
            </View>
            <Text style={[styles.menuTitle, { flex: 1 }]}>
              {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Madurai Help & Support */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCallSupport}
            style={styles.menuItem}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="call-outline" size={18} color={Colors.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{t('maduraiSupport')}</Text>
              <Text style={styles.menuSub}>{t('maduraiHelpline')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* About MY VELAI */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'MY VELAI • என் வேலை',
                language === 'ta'
                  ? 'மதுரை மக்களுக்கான நேரடி வேலைகள் மற்றும் சேவைகள் தளம்.'
                  : 'Madurai local jobs and services marketplace.'
              )
            }
            style={[styles.menuItem, !user && { borderBottomWidth: 0 }]}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.textPrimary} />
            </View>
            <Text style={[styles.menuTitle, { flex: 1 }]}>{t('aboutMyVelai')}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Sign Out Option (if authenticated) */}
          {user ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSignOut}
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
            >
              <View style={[styles.menuIcon, { backgroundColor: Colors.errorBg }]}>
                <Ionicons name="log-out-outline" size={18} color={Colors.error} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuTitle, { color: Colors.error }]}>{t('logout')}</Text>
                <Text style={styles.menuSub}>
                  {user.email ? user.email : 'Anonymous / Test Session'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Version info */}
        <Text style={styles.appVersion}>
          MY VELAI v1.0.0 (Madurai Edition)
        </Text>
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        profile={profile}
      />

      {/* Auth Modal for Sign In / Registration */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        targetRole="customer"
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  syncedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    borderColor: Colors.successBorder,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
    gap: 3,
  },
  syncedText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.success,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandYellow,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    gap: 4,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 8,
    marginBottom: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  authPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.brandYellowDark,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 14,
    ...Shadows.subtle,
  },
  authBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.brandYellow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    marginBottom: 4,
    gap: 3,
  },
  authBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  authPromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  authPromptDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  userPhone: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  localityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  localityText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 14,
    ...Shadows.subtle,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  switchDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 18,
    ...Shadows.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  langPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
  },
});
