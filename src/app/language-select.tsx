import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadows, FontFamilies } from '../constants/colors';
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
          <Logo size="md" showSubtitle={false} />
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
    marginBottom: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  optionsList: {
    flex: 1,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    ...Shadows.subtle,
  },
  selectedCard: {
    borderColor: Colors.brandYellow,
    backgroundColor: '#FFFFFF',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedFlagCircle: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellow,
  },
  flagLetter: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recommendedBadge: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  recommendedText: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  langTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  langSub: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 210,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
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
  footer: {
    paddingBottom: 20,
  },
});
