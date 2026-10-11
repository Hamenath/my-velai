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

export default function WorkerProfileScreen() {
  const router = useRouter();
  const { setRole, language, toggleLanguage, t } = useApp();
  const { user, profile, isProfileLoading, signOut } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleSwitchToCustomer = () => {
    setRole('customer');
    router.replace('/(customer)/home');
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
  const displayName = profile?.displayName || (language === 'ta' ? 'முருகன் கருப்பையா' : 'Murugan Karuppiah');
  const trade = language === 'ta'
    ? (profile?.trade_ta || profile?.trade_en || 'எலக்ட்ரீஷியன் & வயரிங் நிபுணர்')
    : (profile?.trade_en || 'Electrician & Wiring Specialist');
  const phone = profile?.phone || user?.email || '+91 98421 77123';
  const dailyRate = profile?.dailyRate ?? 850;
  const hourlyRate = profile?.hourlyRate ?? 150;
  const skills = profile?.skills && profile.skills.length > 0
    ? profile.skills
    : [
        language === 'ta' ? 'வீட்டு வயரிங்' : 'House Wiring',
        language === 'ta' ? 'இன்வெர்ட்டர்' : 'Inverter Setup',
        language === 'ta' ? 'மின்விசிறி சரிசெய்தல்' : 'Fan Repair',
        language === 'ta' ? 'MCB பாக்ஸ்' : 'MCB Panels',
      ];
  const avatarLetter = (displayName[0] || 'தொ').toUpperCase();

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      <Header
        showLocation={false}
        title={language === 'ta' ? 'தொழிலாளி சுயவிவரம்' : 'Worker Profile'}
      />

      <View style={styles.container}>
        {/* Loading Indicator */}
        {isProfileLoading ? (
          <View style={styles.loadingBar}>
            <ActivityIndicator size="small" color={Colors.brandBlack} />
            <Text style={styles.loadingText}>
              {language === 'ta' ? 'தொழிலாளி சுயவிவரம் ஏற்றப்படுகிறது...' : 'Loading Worker Profile...'}
            </Text>
          </View>
        ) : null}

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.topInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{displayName}</Text>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={Colors.success}
                  style={{ marginLeft: 4 }}
                />
                {user && profile ? (
                  <View style={styles.syncedPill}>
                    <Ionicons name="cloud-done" size={10} color={Colors.success} />
                    <Text style={styles.syncedText}>Cloud</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.trade}>{trade}</Text>
              <Text style={styles.phone}>{phone}</Text>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={11} color="#EAB308" />
                <Text style={styles.ratingText}>4.9</Text>
                <Text style={styles.reviewsText}>
                  (84 {language === 'ta' ? 'மதிப்பீடுகள்' : 'reviews'})
                </Text>
              </View>
            </View>

            {/* Edit Button */}
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

          {/* Verification Pill */}
          <View style={styles.verifiedBanner}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
            <Text style={styles.verifiedText}>
              {language === 'ta'
                ? 'ஆதார் & முகவரி சரிபார்க்கப்பட்டது'
                : 'Aadhaar & Madurai Address Verified'}
            </Text>
          </View>
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
                  : 'Save Worker Profile to Firestore'}
              </Text>
              <Text style={styles.authPromptDesc}>
                {language === 'ta'
                  ? 'கணக்கை உருவாக்கி உங்கள் கூலி, திறன்கள் மற்றும் வேலைகளைப் பாதுகாக்கவும்.'
                  : 'Register or sign in to persist your rates, skills, and jobs.'}
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

        {/* Switch to Customer Mode */}
        <View style={styles.switchCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>
              {language === 'ta' ? 'வேலை ஆட்கள் தேவையா?' : 'Need to hire someone?'}
            </Text>
            <Text style={styles.switchDesc}>
              {language === 'ta'
                ? 'வாடிக்கையாளர் முறைக்கு மாறி வேலைகளை பதிவிடுங்கள்.'
                : 'Switch to customer mode to post jobs or hire workers.'}
            </Text>
          </View>
          <Button
            title={language === 'ta' ? 'வாடிக்கையாளர் முறை' : 'Customer Mode'}
            onPress={handleSwitchToCustomer}
            variant="secondary"
            size="sm"
            style={{ marginLeft: 12 }}
          />
        </View>

        {/* My Skills & Rates */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {language === 'ta' ? 'என் திறன்கள் மற்றும் கூலி' : 'My Skills & Rates'}
            </Text>
            {user && profile ? (
              <TouchableOpacity onPress={() => setEditModalVisible(true)}>
                <Text style={styles.editSectionLink}>{t('editProfile')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.rateGrid}>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>
                {language === 'ta' ? 'தினக்கூலி' : 'Daily Wage'}
              </Text>
              <Text style={styles.rateValue}>₹{dailyRate} / {language === 'ta' ? 'நாள்' : 'day'}</Text>
            </View>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>
                {language === 'ta' ? 'மணிநேர கூலி' : 'Hourly Rate'}
              </Text>
              <Text style={styles.rateValue}>₹{hourlyRate} / {language === 'ta' ? 'மணி' : 'hr'}</Text>
            </View>
          </View>

          <Text style={styles.skillsLabel}>
            {language === 'ta' ? 'செயலிலுள்ள திறன்கள்:' : 'Active Skills:'}
          </Text>
          <View style={styles.skillsRow}>
            {skills.map((skill, idx) => (
              <View key={idx} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
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

          {/* Madurai Helpline */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCallSupport}
            style={[styles.menuItem, !user && { borderBottomWidth: 0 }]}
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  topInfo: {
    flexDirection: 'row',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editSectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandYellowDark,
  },
  trade: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  phone: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewsText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    marginTop: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
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
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.subtle,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  rateGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  rateBox: {
    flex: 1,
    backgroundColor: Colors.secondaryBg,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rateLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginTop: 2,
  },
  skillsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillPill: {
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 20,
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
});
