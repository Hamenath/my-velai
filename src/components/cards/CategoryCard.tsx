import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory } from '../../types';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
  compact?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  compact = false,
}) => {
  const { language } = useApp();
  const name = language === 'ta' ? category.name_ta : category.name_en;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, compact && styles.compactCard]}
    >
      <View style={styles.iconCircle}>
        <Ionicons
          name={(category.icon as any) || 'construct-outline'}
          size={24}
          color={Colors.brandBlack}
        />
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>

      <View style={styles.badge}>
        <Text style={styles.countText}>
          {category.activeWorkersCount}{' '}
          {language === 'ta' ? 'தொழிலாளர்கள்' : 'workers'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '48%',
    marginBottom: 12,
    minHeight: 128,
    ...Shadows.subtle,
  },
  compactCard: {
    width: 110,
    minHeight: 110,
    marginRight: 10,
    marginBottom: 0,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1,
    borderColor: Colors.brandYellowLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 17,
  },
  badge: {
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
