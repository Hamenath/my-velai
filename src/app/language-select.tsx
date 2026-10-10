import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export default function LanguageSelectScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useApp();

  const handleContinue = () => {
    router.push('/role-select');
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
          <Text style={styles.title}>
            {language === 'ta' ? 'உங்கள் மொழியைத் தேர்வு செய்க' : 'Choose Your Preferred Language'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'ta'
              ? 'செயலியை உங்கள் விருப்பப்படி பயன்படுத்தலாம்'
              : 'Select how you want to experience MY VELAI'}
          </Text>
        </View>

        {/* Language Options */}
        <View style={styles.optionsList}>
          {/* Tamil Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLanguage('ta')}
            style={[
              styles.optionCard,
              language === 'ta' && styles.selectedCard,
            ]}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.flagCircle,
                  language === 'ta' && styles.selectedFlagCircle,
                ]}
              >
                <Text style={styles.flagLetter}>த</Text>
              </View>
              <View>
                <View style={styles.badgeRow}>
                  <Text style={styles.langTitle}>தமிழ்</Text>
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>பரிந்துரை</Text>
                  </View>
                </View>
                <Text style={styles.langSub}>
                  மதுரை மற்றும் தமிழக மக்களுக்கான எளிய வடிவம்
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.radioCircle,
                language === 'ta' && styles.selectedRadio,
              ]}
            >
              {language === 'ta' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* English Option */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLanguage('en')}
            style={[
              styles.optionCard,
              language === 'en' && styles.selectedCard,
            ]}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.flagCircle,
                  language === 'en' && styles.selectedFlagCircle,
                ]}
              >
                <Text style={styles.flagLetter}>En</Text>
              </View>
              <View>
                <Text style={styles.langTitle}>English</Text>
                <Text style={styles.langSub}>
                  Simple and clear English interface
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.radioCircle,
                language === 'en' && styles.selectedRadio,
              ]}
            >
              {language === 'en' && <View style={styles.radioDot} />}
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
    marginBottom: 24,
  },
  titleSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  optionsList: {
    flex: 1,
    gap: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    borderColor: Colors.brandYellowDark,
    backgroundColor: Colors.brandYellowSoft,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedFlagCircle: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellowDark,
  },
  flagLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recommendedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16803D',
  },
  langTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  langSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
    maxWidth: 210,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
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
  footer: {
    paddingBottom: 20,
  },
});
