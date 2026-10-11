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
import { Colors, Radius, FontFamilies } from '../../constants/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
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
      case 'dark':
        return {
          container: {
            backgroundColor: Colors.brandBlack,
            borderColor: Colors.brandBlack,
            borderWidth: 1,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'secondary':
      case 'outline':
        return {
          container: {
            backgroundColor: '#FFFFFF',
            borderColor: Colors.border,
            borderWidth: 1,
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
            borderWidth: 0,
          },
          text: {
            color: Colors.textPrimary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: Colors.errorBg,
            borderColor: Colors.errorBorder,
            borderWidth: 1,
          },
          text: {
            color: Colors.error,
          },
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: Colors.brandYellow,
            borderColor: Colors.brandYellowDark,
            borderWidth: 1,
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
            paddingVertical: 7,
            paddingHorizontal: 12,
            minHeight: 34,
            borderRadius: Radius.sm,
          },
          text: {
            fontSize: 12,
            fontWeight: '700',
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 13,
            paddingHorizontal: 20,
            minHeight: 48,
            borderRadius: Radius.md,
          },
          text: {
            fontSize: 15,
            fontWeight: '800',
          },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: 10,
            paddingHorizontal: 16,
            minHeight: 42,
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
      activeOpacity={0.8}
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
          color={variant === 'primary' ? Colors.brandBlack : Colors.textPrimary}
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
    fontFamily: FontFamilies.primary,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});

export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const DarkButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="dark" />
);
