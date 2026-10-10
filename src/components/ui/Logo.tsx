import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../constants/colors';

const APP_LOGO = require('../../../assets/images/app-logo.png');

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  light = false,
}) => {
  const getBadgeDimensions = () => {
    switch (size) {
      case 'sm':
        return { box: 28, fontSize: 16, subSize: 9 };
      case 'lg':
        return { box: 48, fontSize: 24, subSize: 12 };
      case 'hero':
        return { box: 76, fontSize: 32, subSize: 14 };
      case 'md':
      default:
        return { box: 36, fontSize: 19, subSize: 10 };
    }
  };

  const dims = getBadgeDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={APP_LOGO}
        style={[
          styles.badge,
          {
            width: dims.box,
            height: dims.box,
            borderRadius: dims.box * 0.22,
          },
        ]}
        resizeMode="contain"
      />

      <View style={styles.textWrapper}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.brandName,
              {
                fontSize: dims.fontSize,
                color: light ? '#FFFFFF' : Colors.brandBlack,
              },
            ]}
          >
            MY{' '}
            <Text
              style={{
                color: light ? Colors.brandYellow : Colors.brandBlack,
                fontWeight: '900',
              }}
            >
              VELAI
            </Text>
          </Text>
          <View style={styles.dot} />
        </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: 9,
  },
  textWrapper: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.brandYellow,
    marginLeft: 3,
    marginTop: 2,
  },
  subtitle: {
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 1,
  },
});

