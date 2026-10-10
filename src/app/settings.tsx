import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Header } from '../components/ui/Header';
import { LocationModal } from '../components/ui/LocationModal';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    language,
    setLanguage,
    role,
    setRole,
    currentLocality,
    setHasSeenOnboarding,
    t,
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const handleToggleRole = () => {
    const nextRole = role === 'customer' ? 'worker' : 'customer';
    setRole(nextRole);
    if (nextRole === 'worker') {
      router.replace('/(worker)/home');
    } else {
      router.replace('/(customer)/home');
    }
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+919443210000').catch(() => {
      Alert.alert(t('maduraiSupport'), t('maduraiHelpline'));
    });
  };

  const handleResetOnboarding = () => {
    setHasSeenOnboarding(false);
    router.replace('/onboarding');
  };

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      <Header
        showLocation={false}
        title={language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
        onBack={() => router.back()}
      />

      <View style={styles.container}>
        {/* Language Preferences */}
        <Text style={styles.sectionHeader}>{t('preferredLanguage')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLanguage('ta')}
            style={styles.settingRow}
          >
            <Text style={styles.rowTitle}>தமிழ் (Tamil)</Text>
            {language === 'ta' && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.brandYellowDark}
              />
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLanguage('en')}
            style={styles.settingRow}
          >
            <Text style={styles.rowTitle}>English</Text>
            {language === 'en' && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.brandYellowDark}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* User Role Switch */}
        <Text style={styles.sectionHeader}>
          {language === 'ta' ? 'பயனர் நிலை' : 'Active Role Mode'}
        </Text>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggleRole}
            style={styles.settingRow}
          >
            <View>
              <Text style={styles.rowTitle}>
                {role === 'customer'
                  ? language === 'ta'
                    ? 'வாடிக்கையாளர் நிலை (செயலில்)'
                    : 'Customer Mode (Active)'
                  : language === 'ta'
                  ? 'தொழிலாளி நிலை (செயலில்)'
                  : 'Worker Mode (Active)'}
              </Text>
              <Text style={styles.rowSub}>
                {role === 'customer'
                  ? language === 'ta'
                    ? 'தொழிலாளி நிலைக்கு மாற தட்டவும்'
                    : 'Tap to switch to Worker mode'
                  : language === 'ta'
                  ? 'வாடிக்கையாளர் நிலைக்கு மாற தட்டவும்'
                  : 'Tap to switch to Customer mode'}
              </Text>
            </View>
            <Ionicons name="swap-horizontal" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Location Preferences */}
        <Text style={styles.sectionHeader}>
          {language === 'ta' ? 'இயல்புநிலை பகுதி' : 'Default Locality'}
        </Text>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLocationModalVisible(true)}
            style={styles.settingRow}
          >
            <View>
              <Text style={styles.rowTitle}>
                {language === 'ta' ? currentLocality.name_ta : currentLocality.name_en}, Madurai
              </Text>
              <Text style={styles.rowSub}>{currentLocality.landmark}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionHeader}>{t('notificationSettings')}</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowTitle}>
                {language === 'ta' ? 'உடனடி அறிவிப்புகள்' : 'Push Notifications'}
              </Text>
              <Text style={styles.rowSub}>
                {language === 'ta'
                  ? 'புதிய வேலைகள் மற்றும் முன்பதிவு நிலை பற்றிய தகவல்கள்'
                  : 'Alerts for new jobs and booking status'}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.brandYellow }}
              thumbColor={notificationsEnabled ? Colors.brandBlack : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Help & Support */}
        <Text style={styles.sectionHeader}>{t('maduraiSupport')}</Text>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCallSupport}
            style={styles.settingRow}
          >
            <View>
              <Text style={styles.rowTitle}>{t('maduraiHelpline')}</Text>
              <Text style={styles.rowSub}>
                {language === 'ta' ? 'மதுரை அலுவலக உதவி எண்' : 'Direct Helpline Desk'}
              </Text>
            </View>
            <Ionicons name="call-outline" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Developer / Reset Options */}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleResetOnboarding}
            style={styles.resetBtn}
          >
            <Ionicons name="reload" size={15} color={Colors.textSecondary} />
            <Text style={styles.resetText}>
              {language === 'ta' ? 'அறிமுக வழிகாட்டியை மீண்டும் காண்க' : 'Replay Welcome Onboarding'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rowSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
