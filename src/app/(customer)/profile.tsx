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
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
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
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.userName}>
              {language === 'ta' ? 'மதுரை வாடிக்கையாளர்' : 'Madurai Customer'}
            </Text>
            <Text style={styles.userPhone}>+91 94432 10000</Text>
            <View style={styles.localityTag}>
              <Ionicons name="location-outline" size={11} color={Colors.textSecondary} />
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
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.textPrimary} />
            </View>
            <Text style={[styles.menuTitle, { flex: 1 }]}>{t('aboutMyVelai')}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
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
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
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
