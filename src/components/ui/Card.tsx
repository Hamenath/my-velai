import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, Radius, Shadows } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  highlight?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  highlight = false,
}) => {
  const containerStyle = [
    styles.card,
    highlight && styles.highlighted,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={containerStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    ...Shadows.subtle,
  },
  highlighted: {
    borderColor: Colors.brandYellow,
    backgroundColor: '#FFFFFF',
  },
});
