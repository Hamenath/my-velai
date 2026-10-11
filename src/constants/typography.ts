import { Platform, TextStyle } from 'react-native';

const BRAND_BLACK = '#171717';
const TEXT_PRIMARY = '#171717';
const TEXT_SECONDARY = '#737373';

/**
 * Official MY VELAI Typography System
 *
 * 1. App Typography: Proxima Nova as primary typeface across screens,
 *    headings, cards, inputs, buttons, with geometric sans-serif +
 *    Tamil fallbacks (Tamil Sangam MN on iOS, Noto Sans Tamil on Android/Web).
 *
 * 2. Logo Typography: Modified Futura sans-serif wordmark preserved exclusively
 *    for the official MY VELAI logo asset.
 */

// Platform-aware font family stack targeting Proxima Nova with native Tamil fallback
export const FontFamilies = {
  // Primary App Font: Proxima Nova -> Platform System -> Tamil Font
  primary: Platform.select({
    ios: 'Proxima Nova, -apple-system, BlinkMacSystemFont, "Tamil Sangam MN", "Helvetica Neue", sans-serif',
    android: 'Proxima Nova, Roboto, "Noto Sans Tamil", sans-serif',
    web: '"Proxima Nova", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Tamil", sans-serif',
    default: 'Proxima Nova, sans-serif',
  }),

  // Logo Wordmark Typography: Modified Futura (exclusively for logo brand asset)
  logo: Platform.select({
    ios: '"Futura-Bold", "Futura", "Trebuchet MS", sans-serif',
    android: '"Futura", sans-serif',
    web: '"Futura", "Century Gothic", sans-serif',
    default: 'Futura, sans-serif',
  }),

  // Explicit Tamil fallback font family
  tamil: Platform.select({
    ios: '"Tamil Sangam MN", sans-serif',
    android: '"Noto Sans Tamil", sans-serif',
    web: '"Noto Sans Tamil", "Latha", sans-serif',
    default: 'sans-serif',
  }),
};

// Font weights with strict TypeScript typing
export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '800' as const,
};

// Font size scale
export const FontSizes = {
  tiny: 10,
  caption: 12,
  body: 14,
  bodyLarge: 15,
  cardTitle: 16,
  sectionTitle: 18,
  subheading: 20,
  screenTitle: 24,
  display: 28,
  hero: 32,
};

// Complete Typography Tokens
export const Typography: {
  family: typeof FontFamilies;
  weight: typeof FontWeights;
  size: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  display: TextStyle;
  screenTitle: TextStyle;
  sectionTitle: TextStyle;
  cardTitle: TextStyle;
  body: TextStyle;
  bodyMedium: TextStyle;
  caption: TextStyle;
  tiny: TextStyle;
  button: TextStyle;
  input: TextStyle;
} = {
  family: FontFamilies,
  weight: FontWeights,
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  display: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.display,
    fontWeight: FontWeights.black,
    lineHeight: 36,
    color: BRAND_BLACK,
    letterSpacing: -0.4,
  },
  screenTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.screenTitle,
    fontWeight: FontWeights.bold,
    lineHeight: 32,
    color: BRAND_BLACK,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.sectionTitle,
    fontWeight: FontWeights.bold,
    lineHeight: 25,
    color: BRAND_BLACK,
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.cardTitle,
    fontWeight: FontWeights.bold,
    lineHeight: 22,
    color: BRAND_BLACK,
  },
  body: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: 21,
    color: TEXT_PRIMARY,
  },
  bodyMedium: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
    lineHeight: 21,
    color: TEXT_PRIMARY,
  },
  caption: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    lineHeight: 17,
    color: TEXT_SECONDARY,
  },
  tiny: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.tiny,
    fontWeight: FontWeights.semibold,
    lineHeight: 15,
    color: TEXT_SECONDARY,
  },
  button: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.bodyLarge,
    fontWeight: FontWeights.bold,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  input: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    lineHeight: 20,
    color: BRAND_BLACK,
  },
};
