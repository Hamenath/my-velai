import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../../types';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onApply?: () => void;
  showApplyButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  onApply,
  showApplyButton = true,
}) => {
  const { language, t } = useApp();

  const title = language === 'ta' ? job.title_ta : job.title_en;
  const categoryName = language === 'ta' ? job.categoryName_ta : job.categoryName_en;
  const localityName = language === 'ta' ? job.locality_ta : job.locality_en;

  const wageSuffix =
    job.wageType === 'per_day'
      ? t('perDay')
      : job.wageType === 'per_hour'
      ? t('perHour')
      : ` (${t('fixedPrice')})`;

  return (
    <Card style={styles.card} onPress={onPress}>
      {/* Top row: Category + Urgent / Status */}
      <View style={styles.topRow}>
        <Badge
          label={categoryName}
          variant="neutral"
          icon={<Ionicons name="briefcase-outline" size={11} color={Colors.textSecondary} />}
        />

        <View style={styles.rightBadges}>
          {job.isUrgent && (
            <Badge
              label={language === 'ta' ? 'அவசரம்' : 'Urgent'}
              variant="urgent"
              icon={<Ionicons name="flame-outline" size={11} color={Colors.error} />}
            />
          )}
          <Text style={styles.timeAgo}>{job.postedAt}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {/* Location & Landmark */}
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.metaText} numberOfLines={1}>
          {localityName} • {job.landmark}
        </Text>
      </View>

      {/* Date & Time */}
      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.metaText} numberOfLines={1}>
          {job.date} • {job.time}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Row: Wage & Action */}
      <View style={styles.bottomRow}>
        <View style={styles.wagePill}>
          <Text style={styles.wageLabel}>{t('wageOffered')}</Text>
          <Text style={styles.wageValue}>
            ₹{job.wageRate}
            <Text style={styles.wageSuffix}>{wageSuffix}</Text>
          </Text>
        </View>

        <View style={styles.actionGroup}>
          <View style={styles.applicantsBadge}>
            <Ionicons name="people-outline" size={11} color={Colors.textSecondary} />
            <Text style={styles.applicantsText}>
              {job.applicantsCount}/{job.workersNeeded}
            </Text>
          </View>

          {showApplyButton && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onApply || onPress}
              style={styles.applyBtn}
            >
              <Text style={styles.applyBtnText}>{t('applyNow')}</Text>
            </TouchableOpacity>
          )}
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeAgo: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 5,
    flex: 1,
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
  wagePill: {
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  wageLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  wageValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  wageSuffix: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  applicantsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 3,
  },
  applicantsText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  applyBtn: {
    backgroundColor: Colors.brandYellow,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.brandYellow,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
});
