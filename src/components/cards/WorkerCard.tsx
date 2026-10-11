import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Worker } from '../../types';
import { Colors, Radius, Shadows, FontFamilies } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

interface WorkerCardProps {
  worker: Worker;
  onPress: () => void;
  onBook?: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onPress,
  onBook,
}) => {
  const { language, t } = useApp();

  const name = language === 'ta' ? worker.name_ta : worker.name_en;
  const categoryName = language === 'ta' ? worker.categoryName_ta : worker.categoryName_en;
  const localityName = language === 'ta' ? worker.locality_ta : worker.locality_en;
  const skills = language === 'ta' ? worker.skills_ta : worker.skills_en;

  const handleCall = () => {
    Linking.openURL(`tel:${worker.phone}`).catch(() => {
      Alert.alert(
        language === 'ta' ? 'அழைப்பு தோல்வியடைந்தது' : 'Call Failed',
        `${worker.phone}`
      );
    });
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        {/* Avatar Initials with Online Status */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          {worker.isAvailable && <View style={styles.onlineDot} />}
        </View>

        {/* Worker Info */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {worker.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={Colors.success}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>

          <Text style={styles.category}>{categoryName}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={11} color="#EAB308" />
              <Text style={styles.ratingText}>{worker.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({worker.reviewsCount})</Text>
            </View>

            <Text style={styles.dotSeparator}>•</Text>

            <Text style={styles.metaText} numberOfLines={1}>
              {localityName} ({worker.distanceKm} {t('distance')})
            </Text>
          </View>
        </View>
      </View>

      {/* Skills chips */}
      <View style={styles.skillsRow}>
        {skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillPill}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Bottom: Rate & Direct Actions */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.rateLabel}>
            {language === 'ta' ? 'தினசரி கூலி' : 'Daily Rate'}
          </Text>
          <Text style={styles.rateValue}>
            ₹{worker.dailyRate}
            <Text style={styles.rateUnit}> {t('perDay')}</Text>
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleCall}
            style={styles.callBtn}
          >
            <Ionicons name="call-outline" size={13} color={Colors.textPrimary} />
            <Text style={styles.callText}>{t('callNow')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBook || onPress}
            style={styles.bookBtn}
          >
            <Text style={styles.bookText}>{t('hireNow')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    ...Shadows.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  category: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.xs,
  },
  ratingText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 2,
  },
  reviewCount: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  dotSeparator: {
    fontSize: 11,
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
  metaText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
  },
  skillPill: {
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillText: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  rateValue: {
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  rateUnit: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  callText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bookBtn: {
    backgroundColor: Colors.brandYellow,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.brandYellow,
  },
  bookText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
});
