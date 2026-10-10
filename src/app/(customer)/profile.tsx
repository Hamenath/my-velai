import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui/Button';

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { setRole, currentLocality, language, toggleLanguage, t } = useApp();

  const handleSwitchToWorker = () => {
    setRole('worker');
    router.replace('/(worker)/home');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+919443210000').catch(() => {
      Alert.alert(t('maduraiSupport'), t('maduraiHelpline'));
    });
  };

  return (
    <ScreenWrapper scrollable backgroundColor="#F8F8F6">
      <Header
        showLocation={false}
        title={language === 'ta' ? 'வாடிக்கையாளர் சுயவிவரம்' : 'Customer Profile'}
      />

      <View style={styles.container}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>வ</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.userName}>
              {language === 'ta' ? 'மதுரை வாடிக்கையாளர்' : 'Madurai Customer'}
            </Text>
            <Text style={styles.userPhone}>+91 94432 10000</Text>
            <View style={styles.localityTag}>
              <Ionicons name="location" size={12} color={Colors.brandBlack} />
              <Text style={styles.localityText}>
                {language === 'ta' ? currentLocality.name_ta : currentLocality.name_en}, Madurai
              </Text>
            </View>
          </View>
        </View>

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
              <Ionicons name="language-outline" size={20} color={Colors.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{t('preferredLanguage')}</Text>
              <Text style={styles.menuSub}>
                {language === 'ta' ? 'தமிழ் (செயலில்)' : 'English (Active)'}
              </Text>
            </View>
            <View style={styles.langPill}>
              <Text style={styles.langPillText}>
                {language === 'ta' ? 'Change to EN' : 'தமிழுக்கு மாறு'}
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
              <Ionicons name="settings-outline" size={20} color={Colors.textPrimary} />
            </View>
            <Text style={[styles.menuTitle, { flex: 1 }]}>
              {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Madurai Help & Support */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCallSupport}
            style={styles.menuItem}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="call-outline" size={20} color={Colors.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>{t('maduraiSupport')}</Text>
              <Text style={styles.menuSub}>{t('maduraiHelpline')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
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
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.textPrimary} />
            </View>
            <Text style={[styles.menuTitle, { flex: 1 }]}>{t('aboutMyVelai')}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Version info */}
        <Text style={styles.appVersion}>
          MY VELAI v1.0.0 (Madurai Edition)
        </Text>
      </View>
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
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.subtle,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.brandYellowDark,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  localityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.round,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  localityText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1.5,
    borderColor: Colors.brandYellowDark,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  switchDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  langPill: {
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.round,
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
    marginTop: 8,
  },
});
