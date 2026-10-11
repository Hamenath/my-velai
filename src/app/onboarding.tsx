import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontFamilies } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, toggleLanguage, t } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: 'people-outline' as const,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      highlight: language === 'ta' ? 'மதுரை முழுவதும்' : 'Across Madurai',
    },
    {
      icon: 'cash-outline' as const,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      highlight: language === 'ta' ? 'இடைத்தரகர் கமிஷன் இல்லை' : 'Zero Middleman Fee',
    },
    {
      icon: 'language-outline' as const,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      highlight: language === 'ta' ? 'நம் தமிழ் மொழியில்' : 'Tamil-First Design',
    },
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      router.push('/language-select');
    }
  };

  const handleSkip = () => {
    router.push('/language-select');
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      {/* Top Bar with Language Toggle & Skip */}
      <View style={styles.topBar}>
        <Logo size="sm" showSubtitle={false} />
        <View style={styles.topRight}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleLanguage}
            style={styles.langBtn}
          >
            <Text style={styles.langBtnText}>
              {language === 'ta' ? 'English' : 'தமிழ்'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>
              {language === 'ta' ? 'தவிர்' : 'Skip'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Slide Content */}
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={slides[activeSlide].icon}
            size={40}
            color={Colors.brandBlack}
          />
        </View>

        <View style={styles.highlightPill}>
          <Text style={styles.highlightText}>
            {slides[activeSlide].highlight}
          </Text>
        </View>

        <Text style={styles.title}>{slides[activeSlide].title}</Text>
        <Text style={styles.desc}>{slides[activeSlide].desc}</Text>

        {/* Indicators */}
        <View style={styles.indicatorRow}>
          {slides.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setActiveSlide(idx)}
              style={[
                styles.indicatorDot,
                idx === activeSlide && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <Button
          title={
            activeSlide === slides.length - 1
              ? t('continueBtn')
              : language === 'ta'
              ? 'அடுத்து'
              : 'Next'
          }
          onPress={handleNext}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.round,
  },
  langBtnText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  skipBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  skipText: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  highlightPill: {
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  highlightText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 26,
  },
  desc: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderStrong,
  },
  activeDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brandBlack,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
