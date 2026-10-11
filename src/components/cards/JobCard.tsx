import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../../types';
import { Colors, Radius, Shadows, FontFamilies } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onApply?: () => void;
  showApplyButton?: boolean;
  buttonVariant?: 'dark' | 'yellow';
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  onApply,
  showApplyButton = true,
  buttonVariant = 'dark',
}) => {
  const { language, t } = useApp();

  const title = language === 'ta' ? job.title_ta : job.title_en;
  const localityName = language === 'ta' ? job.locality_ta : job.locality_en;

  const wageSuffix =
    job.wageType === 'per_day'
      ? `/ ${t('perDay')}`
      : job.wageType === 'per_hour'
      ? `/ ${t('perHour')}`
      : `(${t('fixedPrice')})`;

  return (
    <Card style={styles.card} onPress={onPress}>
      {/* 1. Job Title */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {job.isUrgent ? (
          <Badge
            label={language === 'ta' ? 'அவசரம்' : 'Urgent'}
            variant="urgent"
            icon={<Ionicons name="flame-outline" size={11} color={Colors.error} />}
          />
        ) : null}
      </View>

      {/* 2. Location & Address */}
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={15} color={Colors.textSecondary} style={styles.iconStyle} />
        <Text style={styles.metaText} numberOfLines={2}>
          {job.landmark ? `${job.landmark}, ` : ''}{localityName}, Tamil Nadu
        </Text>
      </View>

      {/* 3. Calendar Date */}
      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} style={styles.iconStyle} />
        <Text style={styles.metaText}>
          {job.date}
        </Text>
      </View>

      {/* 4. Clock Time */}
      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={15} color={Colors.textSecondary} style={styles.iconStyle} />
        <Text style={styles.metaText}>
          {job.time}
        </Text>
      </View>

      {/* 5. Bottom Row: Wage + Apply Action */}
      <View style={styles.bottomRow}>
        <View style={styles.wageContainer}>
          <Ionicons name="cash-outline" size={16} color={Colors.brandYellowDark} style={{ marginRight: 6 }} />
          <Text style={styles.wageValue}>
            ₹{job.wageRate}
          </Text>
          <Text style={styles.wageSuffix}>
            {' '}{wageSuffix}
          </Text>
        </View>

        {showApplyButton && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onApply || onPress}
            style={[
              styles.applyBtn,
              buttonVariant === 'yellow' ? styles.applyBtnYellow : styles.applyBtnDark,
            ]}
          >
            <Text
              style={[
                styles.applyBtnText,
                buttonVariant === 'yellow' ? styles.applyBtnTextDark : styles.applyBtnTextWhite,
              ]}
            >
              {t('applyNow')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    ...Shadows.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 22,
    flex: 1,
    marginRight: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconStyle: {
    width: 20,
  },
  metaText: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
  },
  wageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wageValue: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  wageSuffix: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  applyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDark: {
    backgroundColor: Colors.brandBlack,
  },
  applyBtnYellow: {
    backgroundColor: Colors.brandYellow,
  },
  applyBtnText: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  applyBtnTextWhite: {
    color: '#FFFFFF',
  },
  applyBtnTextDark: {
    color: Colors.brandBlack,
  },
});
