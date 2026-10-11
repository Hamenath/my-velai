import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../constants/colors';

const APP_LOGO = require('../../../assets/images/app-logo.png');

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  light?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  light = false,
  style,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: 84, height: 28, subSize: 9 };
      case 'lg':
        return { width: 156, height: 52, subSize: 11 };
      case 'hero':
        return { width: 228, height: 76, subSize: 12 };
      case 'md':
      default:
        return { width: 114, height: 38, subSize: 10 };
    }
  };

  const dims = getDimensions();

  return (
    <View style={[styles.container, style]}>
      <Image
        source={APP_LOGO}
        style={{
          width: dims.width,
          height: dims.height,
        }}
        resizeMode="contain"
        accessibilityLabel="MY VELAI"
      />

      {showSubtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              fontSize: dims.subSize,
              color: light ? '#E5E5E5' : Colors.textSecondary,
            },
          ]}
        >
          என் வேலை • MADURAI
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});

