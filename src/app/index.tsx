import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  StatusBar,
  Animated,
  Easing,
  Platform,
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

  const [buttonReady, setButtonReady] = useState(false);

  // Animation values initialized once via state (avoids React 19 ref access during render)
  const [logoAnim] = useState(() => new Animated.Value(0));
  const [buttonAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';

    const animation = Animated.sequence([
      // 1. Logo Reveal (Duration: 1500ms, smooth ease-out)
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      // 2. Pause before button entrance (200ms)
      Animated.delay(200),
      // 3. Get Started Button Reveal (Duration: 500ms, smooth ease-out)
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        setButtonReady(true);
      }
    });

    return () => {
      animation.stop();
    };
  }, [logoAnim, buttonAnim]);

  const handleProceed = useCallback(() => {
    if (!buttonReady) return;
    if (hasSeenOnboarding) {
      if (role === 'worker') {
        router.replace('/(worker)/home');
      } else {
        router.replace('/(customer)/home');
      }
    } else {
      router.replace('/onboarding');
    }
  }, [buttonReady, hasSeenOnboarding, role, router]);

  // Responsive, prominent logo sizing keeping original proportions and generous whitespace
  const logoSize = Math.min(Math.max(width * 0.58, 200), 240);

  // Interpolations for logo (starts at opacity 0, scale 0.82, translated down 16px)
  const logoOpacity = logoAnim;
  const logoScale = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1],
  });
  const logoTranslateY = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  // Interpolations for button (starts at opacity 0, translated down 12px)
  const buttonOpacity = buttonAnim;
  const buttonTranslateY = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

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
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { translateY: logoTranslateY },
            ],
          }}
        >
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
        </Animated.View>
      </View>

      {/* Primary Action Button pinned near the bottom — reveals only after logo finishes */}
      <Animated.View
        style={[
          styles.footerSection,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
        pointerEvents={buttonReady ? 'auto' : 'none'}
      >
        <Button
          title={language === 'ta' ? 'தொடங்குங்கள்' : 'Get Started'}
          onPress={handleProceed}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.getStartedButton}
          textStyle={styles.getStartedText}
        />
      </Animated.View>
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
