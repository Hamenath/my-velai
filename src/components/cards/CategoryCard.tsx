import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceCategory } from '../../types';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
  variant?: 'tile' | 'card' | 'compact';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  variant = 'tile',
}) => {
  const { language } = useApp();
  const name = language === 'ta' ? category.name_ta : category.name_en;

  if (variant === 'tile') {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={styles.tileContainer}
      >
        <View style={styles.tileIconBox}>
          <Ionicons
            name={(category.icon as any) || 'construct-outline'}
            size={24}
            color={Colors.brandBlack}
          />
          {category.popular && (
            <View style={styles.popularDot} />
          )}
        </View>

        <Text style={styles.tileName} numberOfLines={2}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, variant === 'compact' && styles.compactCard]}
    >
      <View style={styles.iconCircle}>
        <Ionicons
          name={(category.icon as any) || 'construct-outline'}
          size={22}
          color={Colors.brandBlack}
        />
      </View>

      <Text style={styles.cardName} numberOfLines={2}>
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
  tileContainer: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  tileIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.subtle,
  },
  popularDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brandYellowDark,
  },
  tileName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
    minHeight: 28,
  },
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
    minHeight: 120,
    ...Shadows.subtle,
  },
  compactCard: {
    width: 110,
    minHeight: 110,
    marginRight: 10,
    marginBottom: 0,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1,
    borderColor: Colors.brandYellowLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 16,
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
