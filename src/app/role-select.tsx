import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

export default function RoleSelectScreen() {
  const router = useRouter();
  const { role, setRole, language } = useApp();

  const handleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleContinue = () => {
    // Navigate to registration (Name & Mobile number) with selected role preserved
    router.push('/register');
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
          <Text style={styles.title}>
            {language === 'ta' ? 'கணக்கு வகையைத் தேர்ந்தெடுக்கவும்' : 'Choose Your Account Type'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'ta'
              ? 'உங்கள் தேவைக்கேற்ப கணக்கைத் தேர்ந்தெடுத்து தொடரவும்'
              : 'Select how you want to use MY VELAI today'}
          </Text>
        </View>

        {/* Roles List */}
        <View style={styles.rolesList}>
          {/* Card 1: Find Work (Worker) */}
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
                  name="briefcase-outline"
                  size={22}
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

            <Text style={styles.roleTitle}>
              {language === 'ta' ? 'வேலை தேடுகிறேன் (தொழிலாளி)' : 'Find Work'}
            </Text>
            <Text style={styles.roleDesc}>
              {language === 'ta'
                ? 'தினக்கூலி, பகுதிநேர வேலைகள், ஃப்ரீலான்ஸ் மற்றும் உள்ளூர் சேவை தொழிலாளர்களுக்கு.'
                : 'For part-time workers, daily-wage workers, freelancers, and service professionals.'}
            </Text>

            <View style={styles.bulletsRow}>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'தினக்கூலி & பகுதிநேர வேலைகள்' : 'Daily wage & local jobs'}
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'நேரடி வருமானம் (கமிஷன் இல்லை)' : 'Keep 100% of your earnings'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 2: Hire Workers (Customer) */}
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
                  name="people-outline"
                  size={22}
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

            <Text style={styles.roleTitle}>
              {language === 'ta' ? 'தொழிலாளர்களை அழைக்கிறேன்' : 'Hire Workers'}
            </Text>
            <Text style={styles.roleDesc}>
              {language === 'ta'
                ? 'வீட்டு வேலைகள் மற்றும் தொழில் பணிகளுக்கு ஆட்கள் தேவைப்படும் வாடிக்கையாளர்களுக்கு.'
                : 'For customers and homeowners who need trusted workers or local services.'}
            </Text>

            <View style={styles.bulletsRow}>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'சரிபார்க்கப்பட்ட தொழிலாளர்கள்' : 'Verified local workers'}
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.bulletText}>
                  {language === 'ta' ? 'வேலைகளை உடனே பதிவு செய்ய' : 'Post jobs in 30 seconds'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={language === 'ta' ? 'தொடர்க' : 'Continue'}
            onPress={handleContinue}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.continueBtn}
            textStyle={styles.continueBtnText}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 22,
    fontWeight: '900',
    color: Colors.brandBlack,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  rolesList: {
    gap: 14,
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    padding: 18,
    ...Shadows.subtle,
  },
  selectedRoleCard: {
    borderColor: Colors.brandYellow,
    backgroundColor: '#FEFCE8',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    padding: 4,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
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
    fontFamily: FontFamilies.primary,
    fontSize: 17,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginBottom: 4,
  },
  roleDesc: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  bulletsRow: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
  },
  continueBtn: {
    height: 54,
    minHeight: 54,
    borderRadius: Radius.lg,
    backgroundColor: Colors.brandYellow,
  },
  continueBtnText: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
});
