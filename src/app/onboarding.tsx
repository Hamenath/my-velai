import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../constants/colors';
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
      icon: 'people' as const,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      highlight: language === 'ta' ? 'மதுரை முழுவதும்' : 'Across Madurai',
    },
    {
      icon: 'cash' as const,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      highlight: language === 'ta' ? 'இடைத்தரகர் கமிஷன் இல்லை' : 'Zero Middleman Fee',
    },
    {
      icon: 'language' as const,
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
          <TouchableOpacity activeOpacity={0.7} onPress={handleSkip}>
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
            size={44}
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
    paddingVertical: 14,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langBtn: {
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1,
    borderColor: Colors.brandYellowDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.round,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#171717',
    marginBottom: 20,
  },
  highlightPill: {
    backgroundColor: Colors.brandYellowSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Colors.brandYellowLight,
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854D0E',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  desc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderStrong,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brandBlack,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
