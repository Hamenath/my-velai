import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Radius } from '../../constants/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: Colors.brandBlack,
            borderColor: Colors.brandBlack,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: Colors.primaryBg,
            borderWidth: 1.5,
            borderColor: Colors.borderStrong,
          },
          text: {
            color: Colors.textPrimary,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          text: {
            color: Colors.textPrimary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: Colors.error,
            borderColor: Colors.error,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: Colors.brandYellow,
            borderColor: Colors.brandYellowDark,
          },
          text: {
            color: Colors.brandBlack,
          },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            minHeight: 36,
            borderRadius: Radius.sm,
          },
          text: {
            fontSize: 13,
            fontWeight: '600',
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 14,
            paddingHorizontal: 20,
            minHeight: 52,
            borderRadius: Radius.md,
          },
          text: {
            fontSize: 16,
            fontWeight: '700',
          },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: 11,
            paddingHorizontal: 16,
            minHeight: 46,
            borderRadius: Radius.md,
          },
          text: {
            fontSize: 14,
            fontWeight: '700',
          },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        sStyles.container,
        vStyles.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.brandBlack : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[styles.textBase, sStyles.text, vStyles.text, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBase: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
