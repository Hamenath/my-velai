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

// Typography hierarchy
export const Typography = {
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
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },
  display: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
    color: Colors.textPrimary,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 14,
    color: Colors.textSecondary,
  },
  button: {
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 0.2,
  },
};

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
