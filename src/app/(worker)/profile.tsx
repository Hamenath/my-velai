import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui/Button';

export default function WorkerProfileScreen() {
  const router = useRouter();
  const { setRole, language, toggleLanguage, t } = useApp();

  const handleSwitchToCustomer = () => {
    setRole('customer');
    router.replace('/(customer)/home');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+919443210000').catch(() => {
      Alert.alert(t('maduraiSupport'), t('maduraiHelpline'));
    });
  };

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      <Header
        showLocation={false}
        title={language === 'ta' ? 'தொழிலாளி சுயவிவரம்' : 'Worker Profile'}
      />

      <View style={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.topInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>தொ</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {language === 'ta' ? 'முருகன் கருப்பையா' : 'Murugan Karuppiah'}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={Colors.success}
                  style={{ marginLeft: 4 }}
                />
              </View>

              <Text style={styles.trade}>
                {language === 'ta'
                  ? 'எலக்ட்ரீஷியன் & வயரிங் நிபுணர்'
                  : 'Electrician & Wiring Specialist'}
              </Text>
              <Text style={styles.phone}>+91 98421 77123</Text>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={11} color="#EAB308" />
                <Text style={styles.ratingText}>4.9</Text>
                <Text style={styles.reviewsText}>
                  (84 {language === 'ta' ? 'மதிப்பீடுகள்' : 'reviews'})
                </Text>
              </View>
            </View>
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
          <Text style={styles.sectionTitle}>
            {language === 'ta' ? 'என் திறன்கள் மற்றும் கூலி' : 'My Skills & Rates'}
          </Text>

          <View style={styles.rateGrid}>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>
                {language === 'ta' ? 'தினக்கூலி' : 'Daily Wage'}
              </Text>
              <Text style={styles.rateValue}>₹850 / {language === 'ta' ? 'நாள்' : 'day'}</Text>
            </View>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>
                {language === 'ta' ? 'மணிநேர கூலி' : 'Hourly Rate'}
              </Text>
              <Text style={styles.rateValue}>₹150 / {language === 'ta' ? 'மணி' : 'hr'}</Text>
            </View>
          </View>

          <Text style={styles.skillsLabel}>
            {language === 'ta' ? 'செயலிலுள்ள திறன்கள்:' : 'Active Skills:'}
          </Text>
          <View style={styles.skillsRow}>
            {[
              language === 'ta' ? 'வீட்டு வயரிங்' : 'House Wiring',
              language === 'ta' ? 'இன்வெர்ட்டர்' : 'Inverter Setup',
              language === 'ta' ? 'மின்விசிறி சரிசெய்தல்' : 'Fan Repair',
              language === 'ta' ? 'MCB பாக்ஸ்' : 'MCB Panels',
            ].map((skill, idx) => (
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
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
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
        </View>
      </View>
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
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
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
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E',
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
