import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export default function SplashScreen() {
  const router = useRouter();
  const { hasSeenOnboarding, role, language } = useApp();

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.92));

  const handleProceed = useCallback(() => {
    if (hasSeenOnboarding) {
      if (role === 'worker') {
        router.replace('/(worker)/home');
      } else {
        router.replace('/(customer)/home');
      }
    } else {
      router.replace('/onboarding');
    }
  }, [hasSeenOnboarding, role, router]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      handleProceed();
    }, 2200);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, handleProceed]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Logo size="hero" showSubtitle={false} />

        <View style={styles.textBlock}>
          <Text style={styles.maduraiTag}>
            {language === 'ta' ? 'மதுரை • தமிழ்நாடு' : 'MADURAI • TAMIL NADU'}
          </Text>
          <Text style={styles.tamilName}>என் வேலை</Text>
          <Text style={styles.tagline}>
            {language === 'ta'
              ? 'மதுரையின் உள்ளூர் வேலைகள் மற்றும் சேவைகள்'
              : 'Direct Local Jobs & Home Services'}
          </Text>
        </View>

        <View style={styles.featurePills}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {language === 'ta' ? 'தினக்கூலி' : 'Daily Wage'}
            </Text>
          </View>
          <View style={styles.pillDot} />
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {language === 'ta' ? 'எலக்ட்ரீஷியன்' : 'Electrician'}
            </Text>
          </View>
          <View style={styles.pillDot} />
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {language === 'ta' ? 'பிளம்பர்' : 'Plumber'}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Button
          title={language === 'ta' ? 'தொடங்குங்கள்' : 'Get Started'}
          onPress={handleProceed}
          variant="primary"
          size="lg"
          fullWidth
        />
        <Text style={styles.copyright}>
          MY VELAI • Madurai Local Marketplace v1.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    alignItems: 'center',
    marginTop: 20,
  },
  maduraiTag: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandYellowDark,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  tamilName: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.brandBlack,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 20,
  },
  featurePills: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pill: {},
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pillDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.brandYellowDark,
    marginHorizontal: 8,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  copyright: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 12,
  },
});
