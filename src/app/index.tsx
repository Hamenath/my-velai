import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';

const APP_LOGO = require('../../assets/images/app-logo.png');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { hasSeenOnboarding, role, language } = useApp();

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

  // Responsive, prominent logo sizing keeping original proportions and generous whitespace
  const logoSize = Math.min(Math.max(width * 0.58, 200), 240);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 24),
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Hero Logo Area — centered in the upper/main portion of the screen */}
      <View style={styles.heroSection}>
        <Image
          source={APP_LOGO}
          style={[
            styles.logoImage,
            {
              width: logoSize,
              height: logoSize,
            },
          ]}
          resizeMode="contain"
          accessibilityLabel="MY VELAI"
        />
      </View>

      {/* Primary Action Button pinned near the bottom */}
      <View style={styles.footerSection}>
        <Button
          title={language === 'ta' ? 'தொடங்குங்கள்' : 'Get Started'}
          onPress={handleProceed}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.getStartedButton}
          textStyle={styles.getStartedText}
        />
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
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  logoImage: {
    borderRadius: 36,
  },
  footerSection: {
    width: '100%',
    paddingBottom: 8,
  },
  getStartedButton: {
    height: 56,
    minHeight: 56,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
    letterSpacing: 0.2,
  },
});
