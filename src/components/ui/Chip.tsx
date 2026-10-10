import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../constants/colors';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.chip,
        selected ? styles.selectedChip : styles.unselectedChip,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected ? styles.selectedLabel : styles.unselectedLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: Radius.round,
    marginRight: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedChip: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellow,
  },
  unselectedChip: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedLabel: {
    color: Colors.brandBlack,
    fontWeight: '700',
  },
  unselectedLabel: {
    color: Colors.textSecondary,
  },
});
