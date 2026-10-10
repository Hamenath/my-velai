import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../constants/colors';
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
          <Logo size="md" showSubtitle />
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
                  name="person"
                  size={24}
                  color={role === 'customer' ? Colors.brandBlack : Colors.textPrimary}
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
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'வேலை பதிவு செய்ய' : 'Post Jobs'}
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
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
                  name="hammer"
                  size={24}
                  color={role === 'worker' ? Colors.brandBlack : Colors.textPrimary}
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
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'தினக்கூலி & பகுதிநேரம்' : 'Daily Wage & Tasks'}
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
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
    fontSize: 21,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  rolesList: {
    flex: 1,
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 18,
  },
  selectedRoleCard: {
    borderColor: Colors.brandYellowDark,
    backgroundColor: '#FFFEF5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedIconBox: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellowDark,
  },
  radioWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: Colors.brandBlack,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.brandBlack,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  roleDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  bulletsRow: {
    flexDirection: 'row',
    gap: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bulletText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  footer: {
    paddingBottom: 20,
  },
});
