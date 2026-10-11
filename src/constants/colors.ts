export const Colors = {
  // Official MY VELAI Brand Identity
  brandYellow: '#FACC15',
  brandYellowDark: '#EAB308', // Pressed / active yellow
  brandYellowLight: '#FEF08A',
  brandYellowSoft: '#FEF9C3',

  brandBlack: '#171717',
  brandBlackPure: '#0A0A0A',
  brandCharcoal: '#262626',
  brandDarkCard: '#1E1E1E',

  // Backgrounds: 75-85% neutral dominance
  primaryBg: '#FFFFFF',
  mainBg: '#FFFFFF',
  secondaryBg: '#F7F7F7',
  cardBg: '#FFFFFF',
  cardMuted: '#F7F7F7',

  // Typography
  textPrimary: '#171717',
  textSecondary: '#737373',
  textMuted: '#A3A3A3',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E5E5E5',
  borderStrong: '#D4D4D4',
  borderLight: '#F0F0F0',

  // Status & Feedback
  success: '#16A34A',
  successBg: '#F0FDF4',
  successBorder: '#DCFCE7',

  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FEE2E2',

  warning: '#D97706',
  warningBg: '#FFFBEB',
  warningBorder: '#FEF3C7',

  info: '#2563EB',
  infoBg: '#EFF6FF',
  infoBorder: '#DBEAFE',

  // Interactive
  touchHighlight: 'rgba(250, 204, 21, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadowColor: '#000000',
};

// 8-point spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  screenPadding: 16,
};

// Border radii
export const Radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  round: 9999,
  pill: 9999,
  full: 9999,
};

export { Typography, FontFamilies, FontWeights, FontSizes } from './typography';

// Button & Input Dimensions
export const ButtonDimensions = {
  heightPrimary: 50,
  heightSecondary: 44,
  heightSmall: 36,
  radius: Radius.lg,
};

export const InputDimensions = {
  height: 48,
  radius: Radius.lg,
  paddingHorizontal: 14,
};

// Minimal/near-flat shadows
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  lifted: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
};
