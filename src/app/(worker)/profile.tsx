import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Typography, Spacing, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { AuthModal } from '../../components/profile/AuthModal';
import { LogoutConfirmModal } from '../../components/profile/LogoutConfirmModal';

export default function WorkerProfileScreen() {
  const router = useRouter();
  const { setRole, language, toggleLanguage, t } = useApp();
  const { user, profile, isProfileLoading, isSigningOut, signOut } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleSwitchToCustomer = () => {
    setRole('customer');
    router.replace('/(customer)/home');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+919443210000').catch(() => {
      Alert.alert(t('maduraiSupport'), t('maduraiHelpline'));
    });
  };

  const handleOpenLogout = () => {
    setLogoutError(null);
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutError(null);
    try {
      await signOut();
      setLogoutModalVisible(false);
    } catch (err: any) {
      setLogoutError(
        err?.message || (language === 'ta' ? 'வெளியேறுவதில் தோல்வி' : 'Sign out failed')
      );
    }
  };

  // Determine active display data
  const displayName =
    profile?.displayName ||
    (user
      ? user.displayName || (language === 'ta' ? 'ஹேமநாத் பி' : 'Hamenath B')
      : (language === 'ta' ? 'விருந்தினர் தொழிலாளி' : 'Guest Worker'));

  const email =
    profile?.email ||
    user?.email ||
    (language === 'ta' ? 'மின்னஞ்சல் இணைக்கப்படவில்லை' : 'hamestudy@gmail.com');

  const phone =
    profile?.phone ||
    (user ? '+91 87787 07086' : (language === 'ta' ? 'எண் இணைக்கப்படவில்லை' : '+91 87787 07086'));

  const avatarLetter = (displayName[0] || 'H').toUpperCase();

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.mainBg}>
      {/* 1. Header Banner & Top Navigation (Screen 4 Reference) */}
      <View style={styles.bannerContainer}>
        {/* Dark Top Wave Banner */}
        <View style={styles.darkBanner}>
          {/* Top navigation icons inside banner */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.circleNavBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color={Colors.brandBlack} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.circleNavBtn}
              onPress={() => router.push('/settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={20} color={Colors.brandBlack} />
            </TouchableOpacity>
          </View>

          {/* Add Banner Button */}
          <TouchableOpacity
            style={styles.addBannerBtn}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Banner', 'Upload custom banner feature')}
          >
            <Ionicons name="camera-outline" size={14} color={Colors.brandBlack} style={{ marginRight: 4 }} />
            <Text style={styles.addBannerText}>
              {language === 'ta' ? 'பேனர் சேர்' : 'Add Banner'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Large Avatar Overlapping Banner */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          {/* Blue Verified Badge */}
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Loading Indicator */}
        {isProfileLoading ? (
          <View style={styles.loadingBar}>
            <ActivityIndicator size="small" color={Colors.brandBlack} />
            <Text style={styles.loadingText}>
              {language === 'ta' ? 'சுயவிவரம் ஏற்றப்படுகிறது...' : 'Loading profile...'}
            </Text>
          </View>
        ) : null}

        {/* 2. User Information Hierarchy */}
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <Text style={styles.userPhone}>{phone}</Text>
        </View>

        {/* 3. Rating & Total Jobs Stats Row (Screen 4 Reference) */}
        <View style={styles.statsRow}>
          <View style={styles.statColumn}>
            <Ionicons name="star" size={20} color={Colors.brandYellowDark} style={{ marginBottom: 4 }} />
            <Text style={styles.statNumber}>5.0</Text>
            <Text style={styles.statLabel}>
              {language === 'ta' ? 'மதிப்பீடு' : 'Rating'}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statColumn}>
            <Ionicons name="briefcase-outline" size={20} color={Colors.brandYellowDark} style={{ marginBottom: 4 }} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>
              {language === 'ta' ? 'மொத்த வேலைகள்' : 'Total jobs'}
            </Text>
          </View>
        </View>

        {/* 4. PERSONAL & KYC DETAILS Card (Screen 4 Reference) */}
        <View style={styles.kycCard}>
          <View style={styles.kycHeaderRow}>
            <Text style={styles.kycSectionTitle}>
              {language === 'ta' ? 'தனிப்பட்ட & KYC விவரங்கள்' : 'PERSONAL & KYC DETAILS'}
            </Text>

            <View style={styles.kycActionGroup}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(true)}
                style={styles.editActionRow}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={12} color={Colors.brandBlack} style={{ marginRight: 3 }} />
                <Text style={styles.editText}>
                  {language === 'ta' ? 'திருத்து' : 'EDIT'}
                </Text>
              </TouchableOpacity>

              <View style={styles.approvedPill}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.success} style={{ marginRight: 3 }} />
                <Text style={styles.approvedText}>APPROVED</Text>
              </View>
            </View>
          </View>

          {/* DOB Row */}
          <View style={styles.kycRow}>
            <View style={styles.kycLabelGroup}>
              <Ionicons name="calendar-outline" size={16} color={Colors.brandBlack} style={styles.kycIcon} />
              <Text style={styles.kycLabel}>
                {language === 'ta' ? 'பிறந்த தேதி' : 'Date of Birth'}
              </Text>
            </View>
            <Text style={styles.kycValue}>15 Jan 2006</Text>
          </View>

          {/* Gender Row */}
          <View style={styles.kycRow}>
            <View style={styles.kycLabelGroup}>
              <Ionicons name="person-outline" size={16} color={Colors.brandBlack} style={styles.kycIcon} />
              <Text style={styles.kycLabel}>
                {language === 'ta' ? 'பாலினம்' : 'Gender'}
              </Text>
            </View>
            <Text style={styles.kycValue}>
              {language === 'ta' ? 'ஆண்' : 'Male'}
            </Text>
          </View>

          {/* Address Row */}
          <View style={styles.kycRow}>
            <View style={styles.kycLabelGroup}>
              <Ionicons name="location-outline" size={16} color={Colors.brandBlack} style={styles.kycIcon} />
              <Text style={styles.kycLabel}>
                {language === 'ta' ? 'முகவரி & இடம்' : 'Address & Location'}
              </Text>
            </View>
            <Text style={styles.kycValue}>Theni, Tamilnadu, 623351</Text>
          </View>

          {/* ID Verification Row */}
          <View style={[styles.kycRow, { borderBottomWidth: 0 }]}>
            <View style={styles.kycLabelGroup}>
              <Ionicons name="card-outline" size={16} color={Colors.brandBlack} style={styles.kycIcon} />
              <Text style={styles.kycLabel}>
                {language === 'ta' ? 'அடையாள சரிபார்ப்பு' : 'ID Verification'}
              </Text>
            </View>
            <Text style={styles.kycValue}>Didit (Verified)</Text>
          </View>
        </View>

        {/* 5. Menu List (Screen 4 Reference) */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => setEditModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <Ionicons name="person-outline" size={18} color={Colors.brandBlack} />
          </View>
          <Text style={styles.menuCardText}>
            {language === 'ta' ? 'சுயவிவரத்தைத் திருத்து' : 'Edit profile'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => router.push('/(worker)/jobs')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <Ionicons name="clipboard-outline" size={18} color={Colors.brandBlack} />
          </View>
          <Text style={styles.menuCardText}>
            {language === 'ta' ? 'என் வேலைகள்' : 'My zigs'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Language Selection */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={toggleLanguage}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <Ionicons name="globe-outline" size={18} color={Colors.brandBlack} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuCardText}>{t('preferredLanguage')}</Text>
          </View>
          <View style={styles.langPill}>
            <Text style={styles.langPillText}>
              {language === 'ta' ? 'English' : 'தமிழ்'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Switch to Customer Mode */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={handleSwitchToCustomer}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <Ionicons name="swap-horizontal" size={18} color={Colors.brandBlack} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuCardText}>
              {language === 'ta' ? 'வாடிக்கையாளர் முறைக்கு மாறுக' : 'Switch to Customer Mode'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Support Helpline */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={handleCallSupport}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <Ionicons name="call-outline" size={18} color={Colors.brandBlack} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuCardText}>{t('maduraiSupport')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Authentication Options */}
        {!user ? (
          <TouchableOpacity
            style={[styles.menuCard, { backgroundColor: Colors.brandYellow }]}
            onPress={() => setAuthModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FFFFFF' }]}>
              <Ionicons name="log-in-outline" size={18} color={Colors.brandBlack} />
            </View>
            <Text style={[styles.menuCardText, { fontWeight: '900' }]}>
              {language === 'ta' ? 'உள்நுழைக / பதிவு செய்க' : 'Sign In / Register'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.brandBlack} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.menuCard, { borderColor: '#FCA5A5' }]}
            onPress={handleOpenLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            </View>
            <Text style={[styles.menuCardText, { color: Colors.error }]}>
              {t('logout')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.error} />
          </TouchableOpacity>
        )}
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
        targetRole="worker"
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isSigningOut}
        userEmail={user?.email || (user ? 'Authenticated User' : null)}
        errorMessage={logoutError}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'relative',
    marginBottom: 50,
  },
  darkBanner: {
    backgroundColor: Colors.brandDarkCard,
    height: 180,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleNavBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  addBannerText: {
    fontSize: 11,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -40,
    left: 20,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: Colors.brandBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    ...Shadows.subtle,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: Typography.weight.black,
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  userInfoSection: {
    marginBottom: 20,
    marginTop: 4,
  },
  userName: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.black,
    color: Colors.brandBlack,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    marginBottom: 20,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.black,
    color: Colors.brandBlack,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  kycCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  kycHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  kycSectionTitle: {
    fontSize: 11,
    fontWeight: Typography.weight.black,
    color: Colors.brandBlack,
    letterSpacing: 0.5,
  },
  kycActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 11,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
  },
  approvedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  approvedText: {
    fontSize: 9.5,
    fontWeight: Typography.weight.black,
    color: Colors.success,
  },
  kycRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  kycLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kycIcon: {
    marginRight: 8,
  },
  kycLabel: {
    fontSize: Typography.size.xs,
    color: Colors.brandBlack,
    fontWeight: Typography.weight.medium,
  },
  kycValue: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuCardText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
    flex: 1,
  },
  langPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
  },
});
