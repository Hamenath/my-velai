import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

export default function RoleSelectScreen() {
  const router = useRouter();
  const { role, setRole, setHasSeenOnboarding, t, language } = useApp();

  const handleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleContinue = () => {
    setHasSeenOnboarding(true);
    if (role === 'worker') {
      router.replace('/(worker)/home');
    } else {
      router.replace('/(customer)/home');
    }
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Logo size="md" showSubtitle={false} />
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t('roleTitle')}</Text>
          <Text style={styles.subtitle}>{t('roleSubtitle')}</Text>
        </View>

        {/* Roles List */}
        <View style={styles.rolesList}>
          {/* Customer Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelect('customer')}
            style={[
              styles.roleCard,
              role === 'customer' && styles.selectedRoleCard,
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconBox,
                  role === 'customer' && styles.selectedIconBox,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.brandBlack}
                />
              </View>
              <View style={styles.radioWrapper}>
                <View
                  style={[
                    styles.radioCircle,
                    role === 'customer' && styles.selectedRadio,
                  ]}
                >
                  {role === 'customer' && <View style={styles.radioDot} />}
                </View>
              </View>
            </View>

            <Text style={styles.roleTitle}>{t('customerTitle')}</Text>
            <Text style={styles.roleDesc}>{t('customerDesc')}</Text>

            <View style={styles.bulletsRow}>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'வேலை பதிவு செய்ய' : 'Post Jobs'}
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'நேரடியாக அழைக்க' : 'Call Workers'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Worker Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelect('worker')}
            style={[
              styles.roleCard,
              role === 'worker' && styles.selectedRoleCard,
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconBox,
                  role === 'worker' && styles.selectedIconBox,
                ]}
              >
                <Ionicons
                  name="construct-outline"
                  size={20}
                  color={Colors.brandBlack}
                />
              </View>
              <View style={styles.radioWrapper}>
                <View
                  style={[
                    styles.radioCircle,
                    role === 'worker' && styles.selectedRadio,
                  ]}
                >
                  {role === 'worker' && <View style={styles.radioDot} />}
                </View>
              </View>
            </View>

            <Text style={styles.roleTitle}>{t('workerTitle')}</Text>
            <Text style={styles.roleDesc}>{t('workerDesc')}</Text>

            <View style={styles.bulletsRow}>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'தினக்கூலி & பகுதிநேரம்' : 'Daily Wage & Tasks'}
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'நேரடி வருமானம்' : 'Direct Income'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={t('continueBtn')}
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  rolesList: {
    flex: 1,
    gap: 14,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 16,
    ...Shadows.subtle,
  },
  selectedRoleCard: {
    borderColor: Colors.brandYellow,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedIconBox: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellow,
  },
  radioWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: Colors.brandBlack,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brandBlack,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  bulletsRow: {
    flexDirection: 'row',
    gap: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bulletText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  footer: {
    paddingBottom: 20,
  },
});
