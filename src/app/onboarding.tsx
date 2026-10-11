import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

interface SlideData {
  id: string;
  tagline_en: string;
  tagline_ta: string;
  title_en: string;
  title_ta: string;
  desc_en: string;
  desc_ta: string;
  type: 'discover' | 'earn' | 'connect';
}

const SLIDES: SlideData[] = [
  {
    id: 'slide-1',
    tagline_en: 'DISCOVER LOCAL WORK',
    tagline_ta: 'உள்ளூர் வேலை வாய்ப்புகள்',
    title_en: 'Find Work Near You',
    title_ta: 'உங்களைச் சுற்றியுள்ள வேலைகளைக் கண்டறியுங்கள்',
    desc_en: 'Discover local jobs and daily-wage opportunities around your area.',
    desc_ta: 'உங்கள் பகுதியில் உள்ள தினக்கூலி மற்றும் பகுதிநேர வேலை வாய்ப்புகளை உடனடியாக கண்டறியவும்.',
    type: 'discover',
  },
  {
    id: 'slide-2',
    tagline_en: 'EARN FAIRLY',
    tagline_ta: 'நேரடி வருமானம்',
    title_en: 'Your Skills. Your Earnings.',
    title_ta: 'உங்கள் திறமை. உங்கள் வருமானம்.',
    desc_en: 'Connect directly with customers and showcase your skills without unnecessary middlemen.',
    desc_ta: 'இடைத்தரகர் இல்லாமல் வாடிக்கையாளர்களுடன் நேரடியாக இணைந்து உங்கள் நியாயமான ஊதியத்தைப் பெறுங்கள்.',
    type: 'earn',
  },
  {
    id: 'slide-3',
    tagline_en: 'GET CONNECTED',
    tagline_ta: 'உண்மையான வாய்ப்புகள்',
    title_en: 'Local People. Real Opportunities.',
    title_ta: 'உள்ளூர் மக்கள். உண்மையான வாய்ப்புகள்.',
    desc_en: 'Find trusted workers or discover your next job in your neighbourhood.',
    desc_ta: 'நம்பகமான தொழிலாளர்களைக் கண்டறியுங்கள் அல்லது உங்கள் அடுத்த வேலையைப் பெறுங்கள்.',
    type: 'connect',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { language, toggleLanguage, setHasSeenOnboarding } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideData>>(null);
  const [scrollX] = useState(() => new Animated.Value(0));

  const handleFinishOnboarding = () => {
    setHasSeenOnboarding(true);
    router.push('/role-select');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinishOnboarding();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  // Render minimal illustration based on slide type
  const renderVisual = (type: SlideData['type']) => {
    if (type === 'discover') {
      return (
        <View style={styles.visualContainer}>
          {/* Radar Locality Orbit */}
          <View style={styles.radarRingOuter} />
          <View style={styles.radarRingInner} />

          {/* Central Worker Avatar */}
          <View style={styles.centerWorkerBadge}>
            <Ionicons name="person" size={28} color={Colors.brandBlack} />
          </View>

          {/* Floating Job Opportunity Badges */}
          <View style={[styles.jobPinCard, styles.pinTopRight]}>
            <Ionicons name="briefcase" size={14} color={Colors.brandBlack} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.jobPinTitle}>Daily Helper</Text>
              <Text style={styles.jobPinWage}>₹750 / day</Text>
            </View>
          </View>

          <View style={[styles.jobPinCard, styles.pinBottomLeft]}>
            <Ionicons name="construct" size={14} color={Colors.brandBlack} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.jobPinTitle}>Electrician</Text>
              <Text style={styles.jobPinWage}>₹850 / day</Text>
            </View>
          </View>

          <View style={[styles.locationBadge, styles.pinTopLeft]}>
            <Ionicons name="location" size={12} color={Colors.brandBlack} />
            <Text style={styles.locationBadgeText}>Madurai</Text>
          </View>
        </View>
      );
    }

    if (type === 'earn') {
      return (
        <View style={styles.visualContainer}>
          {/* Direct Connection & Zero Middleman Card */}
          <View style={styles.earningCard}>
            <View style={styles.earningHeader}>
              <View style={styles.walletIconCircle}>
                <Ionicons name="wallet-outline" size={24} color={Colors.brandBlack} />
              </View>
              <View style={styles.directPill}>
                <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                <Text style={styles.directPillText}>0% Middleman Fee</Text>
              </View>
            </View>

            <View style={styles.wageHighlightBox}>
              <Text style={styles.wageLabel}>Direct Earnings</Text>
              <Text style={styles.wageValue}>100% Goes To Worker</Text>
            </View>

            {/* Skill tags */}
            <View style={styles.skillChipsRow}>
              {['Masonry', 'Plumbing', 'Carpentry', 'Painting'].map((s, idx) => (
                <View key={idx} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }

    // type === 'connect': Workers walking toward yellow skyline
    return (
      <View style={styles.visualContainer}>
        <View style={styles.skylineCard}>
          {/* Golden Sun & Skyline Silhouette */}
          <View style={styles.sunCircle} />

          <View style={styles.skylineBuildings}>
            <View style={[styles.building, { height: 70, width: 34 }]} />
            <View style={[styles.building, { height: 100, width: 42, backgroundColor: '#FDE047' }]} />
            <View style={[styles.templeTower, { height: 120, width: 48 }]} />
            <View style={[styles.building, { height: 90, width: 38, backgroundColor: '#FDE047' }]} />
            <View style={[styles.building, { height: 60, width: 32 }]} />
          </View>

          {/* Golden Forward Pathway */}
          <View style={styles.forwardPathway} />

          {/* Silhouettes of Workers Moving Forward */}
          <View style={styles.workersGroup}>
            <View style={styles.workerFigure}>
              <View style={styles.figureHead} />
              <View style={styles.figureBody} />
            </View>
            <View style={[styles.workerFigure, { transform: [{ scale: 1.15 }] }]}>
              <View style={[styles.figureHead, { backgroundColor: Colors.brandBlack }]} />
              <View style={[styles.figureBody, { backgroundColor: Colors.brandBlack }]} />
            </View>
            <View style={styles.workerFigure}>
              <View style={styles.figureHead} />
              <View style={styles.figureBody} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Bar with Logo, Language Switcher, and Skip Option */}
      <View style={styles.topBar}>
        <Logo size="sm" showSubtitle={false} />

        <View style={styles.topRightActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleLanguage}
            style={styles.langPill}
          >
            <Text style={styles.langText}>
              {language === 'ta' ? 'English' : 'தமிழ்'}
            </Text>
          </TouchableOpacity>

          {currentIndex < SLIDES.length - 1 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleFinishOnboarding}
              style={styles.skipBtn}
            >
              <Text style={styles.skipText}>
                {language === 'ta' ? 'தவிர்' : 'Skip'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>
      </View>

      {/* Horizontal Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slideItem, { width }]}>
            {/* Minimalist Graphic Area */}
            <View style={styles.graphicArea}>
              {renderVisual(item.type)}
            </View>

            {/* Typography Content */}
            <View style={styles.textArea}>
              <View style={styles.taglineBadge}>
                <Text style={styles.taglineText}>
                  {language === 'ta' ? item.tagline_ta : item.tagline_en}
                </Text>
              </View>

              <Text style={styles.headline}>
                {language === 'ta' ? item.title_ta : item.title_en}
              </Text>

              <Text style={styles.supportingText}>
                {language === 'ta' ? item.desc_ta : item.desc_en}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Navigation Footer */}
      <View style={styles.footer}>
        {/* Three Visible Progress Indicators */}
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.dot,
                  isActive ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsRow}>
          {currentIndex > 0 ? (
            <Button
              title={language === 'ta' ? 'பின்செல்ல' : 'Back'}
              onPress={handleBack}
              variant="outline"
              size="lg"
              style={styles.backButton}
              textStyle={styles.backButtonText}
            />
          ) : null}

          <Button
            title={
              currentIndex === SLIDES.length - 1
                ? language === 'ta'
                  ? 'தொடங்குங்கள்'
                  : 'Get Started'
                : language === 'ta'
                ? 'அடுத்து'
                : 'Next'
            }
            onPress={handleNext}
            variant="primary"
            size="lg"
            style={[
              styles.primaryButton,
              currentIndex === 0 && { width: '100%' },
            ]}
            textStyle={styles.primaryButtonText}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 48,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondaryBg,
  },
  langText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  skipText: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  slideItem: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  graphicArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
    marginBottom: 20,
  },
  visualContainer: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  // Slide 1 Visuals
  radarRingOuter: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  radarRingInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FEF08A',
    opacity: 0.35,
  },
  centerWorkerBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  jobPinCard: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...Shadows.subtle,
  },
  pinTopRight: {
    top: 20,
    right: 0,
  },
  pinBottomLeft: {
    bottom: 24,
    left: 0,
  },
  jobPinTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  jobPinWage: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  locationBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pinTopLeft: {
    top: 28,
    left: 10,
  },
  locationBadgeText: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  // Slide 2 Visuals
  earningCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  earningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  directPillText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.success,
  },
  wageHighlightBox: {
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  wageLabel: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  wageValue: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '900',
    color: Colors.brandBlack,
    marginTop: 2,
  },
  skillChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillChipText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  // Slide 3 Visuals
  skylineCard: {
    width: 250,
    height: 250,
    backgroundColor: '#FFFBEB',
    borderRadius: 125,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FEF08A',
  },
  sunCircle: {
    position: 'absolute',
    top: 36,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brandYellow,
    opacity: 0.9,
  },
  skylineBuildings: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    position: 'absolute',
    bottom: 54,
  },
  building: {
    backgroundColor: '#FACC15',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    opacity: 0.85,
  },
  templeTower: {
    backgroundColor: Colors.brandYellowDark,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  forwardPathway: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 54,
    backgroundColor: Colors.brandYellow,
    borderTopWidth: 2,
    borderColor: Colors.brandYellowDark,
  },
  workersGroup: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  workerFigure: {
    alignItems: 'center',
  },
  figureHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#171717',
    marginBottom: 2,
  },
  figureBody: {
    width: 14,
    height: 22,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#171717',
  },
  // Typography
  textArea: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  taglineBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: 10,
  },
  taglineText: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '800',
    color: Colors.brandBlack,
    letterSpacing: 0.6,
  },
  headline: {
    fontFamily: FontFamilies.primary,
    fontSize: 24,
    fontWeight: '900',
    color: Colors.brandBlack,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 30,
  },
  supportingText: {
    fontFamily: FontFamilies.primary,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 320,
  },
  // Footer & Navigation
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.brandYellow,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: Colors.border,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
    height: 52,
    minHeight: 52,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  primaryButton: {
    flex: 2,
    height: 52,
    minHeight: 52,
    borderRadius: Radius.lg,
    backgroundColor: Colors.brandYellow,
  },
  primaryButtonText: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
});
