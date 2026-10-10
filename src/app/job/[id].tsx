import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { jobs, applications, applyToJob, t, language } = useApp();

  const job = jobs.find((j) => j.id === id);

  // Application Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [expectedWage, setExpectedWage] = useState(
    job ? String(job.wageRate) : '800'
  );
  const [note, setNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!job) {
    return (
      <ScreenWrapper backgroundColor="#FFFFFF">
        <Header showLocation={false} onBack={() => router.back()} title="Job Details" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>
            {language === 'ta' ? 'வேலை விவரம் கிடைக்கவில்லை' : 'Job not found'}
          </Text>
          <Button
            title={language === 'ta' ? 'பின்செல்ல' : 'Go Back'}
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </ScreenWrapper>
    );
  }

  const title = language === 'ta' ? job.title_ta : job.title_en;
  const categoryName = language === 'ta' ? job.categoryName_ta : job.categoryName_en;
  const locality = language === 'ta' ? job.locality_ta : job.locality_en;
  const description = language === 'ta' ? job.description_ta : job.description_en;

  const existingApp = applications.find((a) => a.jobId === job.id);

  const handleCallCustomer = () => {
    Linking.openURL(`tel:${job.customerPhone}`).catch(() => {
      Alert.alert(
        language === 'ta' ? 'வாடிக்கையாளர் எண்' : 'Customer Phone',
        job.customerPhone
      );
    });
  };

  const handleConfirmApply = () => {
    const numWage = Number(expectedWage);
    if (!expectedWage || isNaN(numWage) || numWage <= 0) {
      Alert.alert(
        language === 'ta' ? 'கூலி தொகையை உள்ளிடவும்' : 'Invalid Wage',
        t('invalidAmount')
      );
      return;
    }

    const ok = applyToJob(job.id, numWage, note);
    if (ok) {
      setModalVisible(false);
      setAppliedSuccess(true);
    }
  };

  return (
    <ScreenWrapper scrollable backgroundColor="#F8F8F6">
      <Header
        showLocation={false}
        title={t('jobDetailsTitle')}
        onBack={() => router.back()}
      />

      <View style={styles.container}>
        {/* Main Job Header Card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Badge label={categoryName} variant="yellow" />
            {job.isUrgent && (
              <Badge
                label={language === 'ta' ? 'அவசர வேலை' : 'Urgent'}
                variant="urgent"
              />
            )}
            <Text style={styles.postedTime}>{job.postedAt}</Text>
          </View>

          <Text style={styles.jobTitle}>{title}</Text>

          {/* Wage Highlight Box */}
          <View style={styles.wageBox}>
            <View>
              <Text style={styles.wageBoxLabel}>{t('wageOffered')}</Text>
              <Text style={styles.wageBoxAmount}>
                ₹{job.wageRate}
                <Text style={styles.wageBoxUnit}>
                  {' '}
                  {job.wageType === 'per_day'
                    ? t('perDay')
                    : job.wageType === 'per_hour'
                    ? t('perHour')
                    : ` (${t('fixedPrice')})`}
                </Text>
              </Text>
            </View>
            <View style={styles.workersNeededBadge}>
              <Ionicons name="people" size={16} color={Colors.brandBlack} />
              <Text style={styles.workersNeededText}>
                {job.workersNeeded} {language === 'ta' ? 'நபர்கள் தேவை' : 'Workers'}
              </Text>
            </View>
          </View>
        </View>

        {/* Location & Landmark */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('workLocation')}</Text>
          <View style={styles.locationRow}>
            <View style={styles.iconBox}>
              <Ionicons name="location" size={20} color={Colors.brandBlack} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.locName}>{locality}, Madurai</Text>
              <Text style={styles.landmarkText}>{job.landmark}</Text>
            </View>
          </View>
        </View>

        {/* Timing & Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('workSchedule')}</Text>
          <View style={styles.locationRow}>
            <View style={styles.iconBox}>
              <Ionicons name="time" size={20} color={Colors.brandBlack} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.locName}>{job.date}</Text>
              <Text style={styles.landmarkText}>{job.time}</Text>
            </View>
          </View>
        </View>

        {/* Work Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('jobDescription')}</Text>
          <Text style={styles.descText}>{description}</Text>
        </View>

        {/* Customer Information & Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('postedBy')}</Text>
          <View style={styles.customerRow}>
            <View style={styles.customerAvatar}>
              <Text style={styles.custAvatarText}>
                {job.customerName.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.customerName}>{job.customerName}</Text>
              <Text style={styles.customerPhone}>{job.customerPhone}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCallCustomer}
              style={styles.callCircleBtn}
            >
              <Ionicons name="call" size={18} color={Colors.brandBlack} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Applied Status Banner */}
        {existingApp || appliedSuccess ? (
          <View style={styles.appliedBanner}>
            <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.appliedBannerTitle}>{t('alreadyApplied')}</Text>
              <Text style={styles.appliedBannerSub}>
                {language === 'ta'
                  ? 'வாடிக்கையாளர் விரைவில் உங்களைத் தொடர்புகொள்வார்.'
                  : 'Customer will call you directly.'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Action Button */}
        {!existingApp && !appliedSuccess && (
          <View style={styles.bottomActions}>
            <Button
              title={t('applyNow')}
              onPress={() => setModalVisible(true)}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        )}
      </View>

      {/* Worker Application Modal (Step 11) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('applyModalTitle')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>{title}</Text>

            <Input
              label={t('expectedWage') + ' *'}
              placeholder="800"
              keyboardType="numeric"
              value={expectedWage}
              onChangeText={setExpectedWage}
            />

            <Input
              label={t('noteToCustomer')}
              placeholder={
                language === 'ta'
                  ? 'எ.கா: என்னிடம் தேவையான கருவிகள் உள்ளன, உடனே வர முடியும்.'
                  : 'e.g. I have my tools ready, available immediately.'
              }
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />

            <Button
              title={t('submitApplication')}
              onPress={handleConfirmApply}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>

      {/* Applied Success Modal */}
      <Modal visible={appliedSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successBox}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={32} color={Colors.success} />
            </View>
            <Text style={styles.successTitle}>{t('applicationSuccess')}</Text>
            <Text style={styles.successDesc}>{t('applicationSuccessDesc')}</Text>
            <Button
              title={language === 'ta' ? 'சரி' : 'Done'}
              onPress={() => setAppliedSuccess(false)}
              variant="primary"
              size="md"
              fullWidth
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  notFound: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.subtle,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  postedTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 14,
  },
  wageBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1,
    borderColor: Colors.brandYellow,
    padding: 12,
    borderRadius: Radius.md,
  },
  wageBoxLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  wageBoxAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.brandBlack,
  },
  wageBoxUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  workersNeededBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  workersNeededText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  landmarkText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  descText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  custAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  customerPhone: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  callCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.brandYellowDark,
  },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    borderWidth: 1.5,
    borderColor: Colors.successBorder,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 16,
  },
  appliedBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.success,
  },
  appliedBannerSub: {
    fontSize: 12,
    color: '#15803D',
    marginTop: 2,
  },
  bottomActions: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  successBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    margin: 24,
    alignSelf: 'center',
    maxWidth: 320,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
