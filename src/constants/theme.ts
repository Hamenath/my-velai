import { Platform } from 'react-native';
import {
  Colors,
  Spacing,
  Radius,
  Typography,
  FontFamilies,
  FontWeights,
  FontSizes,
  ButtonDimensions,
  InputDimensions,
  Shadows,
} from './colors';

export {
  Colors,
  Spacing,
  Radius,
  Typography,
  FontFamilies,
  FontWeights,
  FontSizes,
  ButtonDimensions,
  InputDimensions,
  Shadows,
};

// Platform-aware layout constants
export const Layout = {
  window: {
    maxWidth: 480, // Recommended mobile constraint on web
  },
  bottomTabHeight: Platform.select({ ios: 60, android: 58, web: 62 }) ?? 58,
  headerHeight: Platform.select({ ios: 54, android: 56, web: 56 }) ?? 56,
  cardRadius: Radius.lg,
  buttonRadius: Radius.lg,
  pillRadius: Radius.pill,
};

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  radius: Radius,
  typography: Typography,
  button: ButtonDimensions,
  input: InputDimensions,
  shadows: Shadows,
  layout: Layout,
};

export default Theme;
