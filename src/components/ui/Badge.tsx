import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radius } from '../../constants/colors';

export type BadgeVariant = 'yellow' | 'success' | 'urgent' | 'neutral' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  style,
  textStyle,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: Colors.successBg,
          border: Colors.successBorder,
          text: Colors.success,
        };
      case 'urgent':
        return {
          bg: Colors.errorBg,
          border: Colors.errorBorder,
          text: Colors.error,
        };
      case 'info':
        return {
          bg: Colors.infoBg,
          border: Colors.infoBorder,
          text: Colors.info,
        };
      case 'yellow':
        return {
          bg: Colors.secondaryBg,
          border: Colors.border,
          text: Colors.textPrimary,
        };
      case 'neutral':
      default:
        return {
          bg: Colors.secondaryBg,
          border: Colors.border,
          text: Colors.textSecondary,
        };
    }
  };

  const current = getStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: current.text,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});

export const StatusBadge = Badge;
