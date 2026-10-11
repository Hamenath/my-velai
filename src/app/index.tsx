import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  StatusBar,
  Animated,
  Easing,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

const APP_LOGO = require('../../assets/images/app-logo.png');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { language } = useApp();
  const { user, profile } = useAuth();

  const [buttonReady, setButtonReady] = useState(false);
  const hasNavigatedRef = useRef(false);

  // Animation values initialized once via state
  const [logoAnim] = useState(() => new Animated.Value(0));
  const [arcAnim] = useState(() => new Animated.Value(0));
  const [icon1Anim] = useState(() => new Animated.Value(0)); // Briefcase (top)
  const [icon2Anim] = useState(() => new Animated.Value(0)); // People (top-left)
  const [icon3Anim] = useState(() => new Animated.Value(0)); // Home (top-right)
  const [icon4Anim] = useState(() => new Animated.Value(0)); // Location (bottom-left)
  const [icon5Anim] = useState(() => new Animated.Value(0)); // Service (bottom-right)
  const [taglineAnim] = useState(() => new Animated.Value(0));
  const [buttonAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let isMounted = true;
    const useNativeDriver = Platform.OS !== 'web';

    // Check reduced-motion preference
    AccessibilityInfo.isReduceMotionEnabled?.().then((reducedMotion) => {
      if (!isMounted) return;
      if (reducedMotion) {
        logoAnim.setValue(1);
        arcAnim.setValue(1);
        icon1Anim.setValue(1);
        icon2Anim.setValue(1);
        icon3Anim.setValue(1);
        icon4Anim.setValue(1);
        icon5Anim.setValue(1);
        taglineAnim.setValue(1);
        buttonAnim.setValue(1);
        setButtonReady(true);
        return;
      }

      // Master 3.3s Animation Sequence
      // 0.0–0.8s: Logo reveal (fade in, scale 0.92 -> 1, glide up 12px)
      const logoEntrance = Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      });

      // 0.5–1.5s: Yellow arc motion (sweeps around the logo with leading dot)
      const arcEntrance = Animated.sequence([
        Animated.delay(500),
        Animated.timing(arcAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
      ]);

      // 1.2–2.2s: Staggered opportunity icons reveal
      const iconsEntrance = Animated.sequence([
        Animated.delay(1200),
        Animated.stagger(100, [
          Animated.timing(icon1Anim, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.back(1.4)),
            useNativeDriver,
          }),
          Animated.timing(icon2Anim, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.back(1.4)),
            useNativeDriver,
          }),
          Animated.timing(icon3Anim, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.back(1.4)),
            useNativeDriver,
          }),
          Animated.timing(icon4Anim, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.back(1.4)),
            useNativeDriver,
          }),
          Animated.timing(icon5Anim, {
            toValue: 1,
            duration: 360,
            easing: Easing.out(Easing.back(1.4)),
            useNativeDriver,
          }),
        ]),
      ]);

      // 2.0–2.8s: Brand tagline ("Local Jobs. Real Opportunities.")
      const taglineEntrance = Animated.sequence([
        Animated.delay(2000),
        Animated.timing(taglineAnim, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
      ]);

      // 2.8–3.3s: Get Started button entrance
      const buttonEntrance = Animated.sequence([
        Animated.delay(2800),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
      ]);

      const animationGroup = Animated.parallel([
        logoEntrance,
        arcEntrance,
        iconsEntrance,
        taglineEntrance,
        buttonEntrance,
      ]);

      animationGroup.start(({ finished }) => {
        if (finished && isMounted) {
          setButtonReady(true);
        }
      });
    });

    return () => {
      isMounted = false;
      logoAnim.stopAnimation();
      arcAnim.stopAnimation();
      icon1Anim.stopAnimation();
      icon2Anim.stopAnimation();
      icon3Anim.stopAnimation();
      icon4Anim.stopAnimation();
      icon5Anim.stopAnimation();
      taglineAnim.stopAnimation();
      buttonAnim.stopAnimation();
    };
  }, [
    logoAnim,
    arcAnim,
    icon1Anim,
    icon2Anim,
    icon3Anim,
    icon4Anim,
    icon5Anim,
    taglineAnim,
    buttonAnim,
  ]);

  const handleProceed = useCallback(() => {
    if (!buttonReady || hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    // Returning authenticated user: skip onboarding and go straight to home screen
    if (user && profile) {
      if (profile.role === 'worker') {
        router.replace('/(worker)/home');
      } else {
        router.replace('/(customer)/home');
      }
      return;
    }
    // New or unauthenticated user: begin onboarding carousel
    router.replace('/onboarding');
  }, [buttonReady, user, profile, router]);

  // Geometric layout dimensions
  const ringSize = Math.min(Math.max(width * 0.72, 230), 280);
  const R = ringSize / 2;
  const logoWidth = Math.min(Math.max(ringSize * 0.64, 150), 180);
  const logoHeight = Math.round(logoWidth / 3);

  const topBadgeSize = 38;
  const normalBadgeSize = 32;

  // Statically computed angle offsets relative to circle perimeter
  const badgeOffsets = {
    briefcase: {
      top: -topBadgeSize / 2,
      left: R - topBadgeSize / 2,
    },
    people: {
      top: R - R * Math.cos((55 * Math.PI) / 180) - normalBadgeSize / 2,
      left: R - R * Math.sin((55 * Math.PI) / 180) - normalBadgeSize / 2,
    },
    home: {
      top: R - R * Math.cos((55 * Math.PI) / 180) - normalBadgeSize / 2,
      left: R + R * Math.sin((55 * Math.PI) / 180) - normalBadgeSize / 2,
    },
    location: {
      top: R + R * Math.cos((45 * Math.PI) / 180) - normalBadgeSize / 2,
      left: R - R * Math.sin((45 * Math.PI) / 180) - normalBadgeSize / 2,
    },
    service: {
      top: R + R * Math.cos((45 * Math.PI) / 180) - normalBadgeSize / 2,
      left: R + R * Math.sin((45 * Math.PI) / 180) - normalBadgeSize / 2,
    },
  };

  // Interpolations
  const logoOpacity = logoAnim;
  const logoScale = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });
  const logoTranslateY = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const arcOpacity = arcAnim.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 1, 1],
  });
  const arcRotate = arcAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-120deg', '240deg'],
  });

  const taglineOpacity = taglineAnim;
  const taglineTranslateY = taglineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

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

      {/* Hero Showcase Area */}
      <View style={styles.heroSection}>
        {/* Orbit Ring & Logo Arena */}
        <View style={[styles.orbitArena, { width: ringSize, height: ringSize }]}>
          {/* 1. Subtle Base Ring */}
          <Animated.View
            style={[
              styles.baseRing,
              {
                width: ringSize,
                height: ringSize,
                borderRadius: R,
                opacity: arcOpacity,
              },
            ]}
          />

          {/* 2. Rotating Yellow Arc with Node */}
          <Animated.View
            style={[
              styles.arcWrapper,
              {
                width: ringSize,
                height: ringSize,
                borderRadius: R,
                opacity: arcOpacity,
                transform: [{ rotate: arcRotate }],
              },
            ]}
          >
            <View
              style={[
                styles.yellowArcStroke,
                {
                  width: ringSize,
                  height: ringSize,
                  borderRadius: R,
                },
              ]}
            />
            <View style={styles.yellowArcDot} />
          </Animated.View>

          {/* 3. Hero Wordmark Artwork in Center */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { translateY: logoTranslateY },
                ],
              },
            ]}
          >
            <Image
              source={APP_LOGO}
              style={{
                width: logoWidth,
                height: logoHeight,
              }}
              resizeMode="contain"
              accessibilityLabel="MY VELAI"
            />
          </Animated.View>

          {/* 4. Staggered Opportunity Icon Badges */}
          {/* Badge 1: Jobs / Briefcase (Top Hero) */}
          <Animated.View
            style={[
              styles.badgeContainer,
              styles.topBadge,
              badgeOffsets.briefcase,
              {
                opacity: icon1Anim,
                transform: [{ scale: icon1Anim }],
              },
            ]}
          >
            <Ionicons name="briefcase" size={17} color={Colors.brandBlack} />
          </Animated.View>

          {/* Badge 2: People (Top-Left) */}
          <Animated.View
            style={[
              styles.badgeContainer,
              styles.normalBadge,
              badgeOffsets.people,
              {
                opacity: icon2Anim,
                transform: [{ scale: icon2Anim }],
              },
            ]}
          >
            <Ionicons name="people-outline" size={15} color={Colors.brandBlack} />
          </Animated.View>

          {/* Badge 3: Home Services (Top-Right) */}
          <Animated.View
            style={[
              styles.badgeContainer,
              styles.normalBadge,
              badgeOffsets.home,
              {
                opacity: icon3Anim,
                transform: [{ scale: icon3Anim }],
              },
            ]}
          >
            <Ionicons name="home-outline" size={15} color={Colors.brandBlack} />
          </Animated.View>

          {/* Badge 4: Local Location (Bottom-Left) */}
          <Animated.View
            style={[
              styles.badgeContainer,
              styles.normalBadge,
              badgeOffsets.location,
              {
                opacity: icon4Anim,
                transform: [{ scale: icon4Anim }],
              },
            ]}
          >
            <Ionicons name="location-outline" size={15} color={Colors.brandBlack} />
          </Animated.View>

          {/* Badge 5: Local Work / Services (Bottom-Right) */}
          <Animated.View
            style={[
              styles.badgeContainer,
              styles.normalBadge,
              badgeOffsets.service,
              {
                opacity: icon5Anim,
                transform: [{ scale: icon5Anim }],
              },
            ]}
          >
            <Ionicons name="construct-outline" size={15} color={Colors.brandBlack} />
          </Animated.View>
        </View>

        {/* Brand Tagline & Connecting Concept (Fades in at 2.0s) */}
        <Animated.View
          style={[
            styles.taglineSection,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          <Text style={styles.taglineHeading}>
            {language === 'ta'
              ? 'உள்ளூர் வேலைகள் • உண்மையான வாய்ப்புகள்'
              : 'Local Jobs. Real Opportunities.'}
          </Text>
          <Text style={styles.taglineSub}>
            {language === 'ta'
              ? 'வேலைகள் • மக்கள் • வாய்ப்புகள் • ஒரே இடத்தில்'
              : 'JOBS • PEOPLE • LOCAL OPPORTUNITIES'}
          </Text>
          <View style={styles.yellowAccentPill} />
        </Animated.View>
      </View>

      {/* Primary Action Button — reveals at 2.8s-3.3s and activates on complete */}
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
          disabled={!buttonReady}
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
    paddingBottom: 16,
  },
  orbitArena: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  baseRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  arcWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  yellowArcStroke: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: 'transparent',
    borderTopColor: Colors.brandYellow,
    borderRightColor: Colors.brandYellow,
  },
  yellowArcDot: {
    position: 'absolute',
    top: -4,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.brandYellow,
    ...Shadows.subtle,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  topBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF08A',
    borderWidth: 1.5,
    borderColor: Colors.brandYellow,
  },
  normalBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  taglineSection: {
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  taglineHeading: {
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.brandBlack,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  taglineSub: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.8,
  },
  yellowAccentPill: {
    width: 34,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.brandYellow,
    marginTop: 10,
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
    backgroundColor: Colors.brandYellow,
  },
  getStartedText: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
    letterSpacing: 0.3,
  },
});
