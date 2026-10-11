import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Booking } from '../../types';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings, updateBookingStatus, t, language } = useApp();

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <ScreenWrapper backgroundColor="#FFFFFF">
        <Header showLocation={false} onBack={() => router.back()} title="Booking" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>
            {language === 'ta' ? 'முன்பதிவு விவரம் கிடைக்கவில்லை' : 'Booking not found'}
          </Text>
          <Button
            title={language === 'ta' ? 'பின்செல்ல' : 'Go Back'}
            onPress={() => router.back()}
            variant="secondary"
          />
        </View>
      </ScreenWrapper>
    );
  }

  const steps: { key: Booking['status']; label_en: string; label_ta: string; icon: any }[] = [
    {
      key: 'confirmed',
      label_en: 'Booking Confirmed',
      label_ta: 'முன்பதிவு உறுதியானது',
      icon: 'receipt-outline',
    },
    {
      key: 'on_the_way',
      label_en: 'Worker En Route',
      label_ta: 'பணியாளர் கிளம்பிவிட்டார்',
      icon: 'bicycle-outline',
    },
    {
      key: 'in_progress',
      label_en: 'Work In Progress',
      label_ta: 'வேலை நடக்கிறது',
      icon: 'construct-outline',
    },
    {
      key: 'completed',
      label_en: 'Work Completed',
      label_ta: 'வேலை நிறைவடைந்தது',
      icon: 'checkmark-circle-outline',
    },
  ];

  const getStepIndex = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'on_the_way':
        return 1;
      case 'in_progress':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(booking.status);

  const handleAdvanceStep = () => {
    if (booking.status === 'confirmed') {
      updateBookingStatus(booking.id, 'on_the_way');
    } else if (booking.status === 'on_the_way') {
      updateBookingStatus(booking.id, 'in_progress');
    } else if (booking.status === 'in_progress') {
      updateBookingStatus(booking.id, 'completed');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      language === 'ta' ? 'முன்பதிவை ரத்து செய்யவா?' : 'Cancel Booking?',
      language === 'ta'
        ? 'இந்த முன்பதிவை நிச்சயமாக ரத்து செய்ய விரும்புகிறீர்களா?'
        : 'Are you sure you want to cancel this booking?',
      [
        { text: language === 'ta' ? 'இல்லை' : 'No', style: 'cancel' },
        {
          text: language === 'ta' ? 'ஆம், ரத்து செய்' : 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            updateBookingStatus(booking.id, 'cancelled');
          },
        },
      ]
    );
  };

  const handleCallWorker = () => {
    Linking.openURL(`tel:${booking.workerPhone}`).catch(() => {
      Alert.alert(
        language === 'ta' ? 'தொழிலாளி எண்' : 'Worker Phone',
        booking.workerPhone
      );
    });
  };

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      <Header
        showLocation={false}
        title={t('bookingDetailsTitle')}
        onBack={() => router.back()}
      />

      <View style={styles.container}>
        {/* Status Header Banner */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.bookingIdText}>ID: {booking.id}</Text>
              <Text style={styles.serviceTitle}>
                {language === 'ta' ? booking.serviceTitle_ta : booking.serviceTitle_en}
              </Text>
            </View>
            <Badge
              label={booking.status.toUpperCase()}
              variant={booking.status === 'completed' ? 'success' : 'neutral'}
            />
          </View>
        </View>

        {/* Live OTP Card */}
        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <View style={styles.otpCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.otpTitle}>{t('otpCode')}</Text>
              <Text style={styles.otpDesc}>{t('otpDesc')}</Text>
            </View>
            <View style={styles.otpBadge}>
              <Text style={styles.otpNumber}>{booking.otp}</Text>
            </View>
          </View>
        )}

        {/* Live Progress Stepper */}
        <View style={styles.stepperCard}>
          <Text style={styles.cardTitle}>{t('trackStatus')}</Text>

          <View style={styles.stepperContainer}>
            {steps.map((step, idx) => {
              const isDone = currentStepIdx >= idx;
              const isCurrent = currentStepIdx === idx;

              return (
                <View key={step.key} style={styles.stepRow}>
                  <View style={styles.stepLeftCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isDone && styles.stepDotDone,
                        isCurrent && styles.stepDotCurrent,
                      ]}
                    >
                      <Ionicons
                        name={step.icon}
                        size={13}
                        color={isDone ? Colors.textPrimary : Colors.textMuted}
                      />
                    </View>
                    {idx < steps.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          currentStepIdx > idx && styles.stepLineDone,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepRightCol}>
                    <Text
                      style={[
                        styles.stepLabel,
                        isDone && styles.stepLabelDone,
                        isCurrent && styles.stepLabelCurrent,
                      ]}
                    >
                      {language === 'ta' ? step.label_ta : step.label_en}
                    </Text>
                    {isCurrent && (
                      <Text style={styles.stepSub}>
                        {language === 'ta' ? 'தற்போது நடப்பில் உள்ளது' : 'In Progress now'}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Interactive Step Simulator */}
          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAdvanceStep}
              style={styles.simulateStepBtn}
            >
              <Ionicons name="play-forward-outline" size={13} color={Colors.brandBlack} />
              <Text style={styles.simulateStepText}>
                {booking.status === 'confirmed'
                  ? language === 'ta'
                    ? 'பணியாளர் கிளம்பியதாக குறிக்க'
                    : 'Mark: Worker En Route'
                  : booking.status === 'on_the_way'
                  ? language === 'ta'
                    ? 'வேலை தொடங்கியதாக குறிக்க'
                    : 'Mark: Work Started'
                  : language === 'ta'
                  ? 'வேலை முடிந்ததாக குறிக்க'
                  : 'Mark: Work Completed'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Worker Contact Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('serviceProvider')}</Text>
          <View style={styles.workerRow}>
            <View style={styles.workerAvatar}>
              <Text style={styles.workerAvatarText}>
                {booking.workerName.charAt(0)}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.workerNameText}>{booking.workerName}</Text>
              <Text style={styles.workerPhoneText}>{booking.workerPhone}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCallWorker}
              style={styles.callCircle}
            >
              <Ionicons name="call-outline" size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Work Location */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('serviceAddress')}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.addressText}>
              {language === 'ta' ? booking.locality_ta : booking.locality_en}
            </Text>
          </View>
          <Text style={styles.landmarkText}>{booking.landmark}</Text>
        </View>

        {/* Payment & Amount Summary */}
        <View style={styles.card}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>{t('totalAmount')}</Text>
            <Text style={styles.amountValue}>₹{booking.amount}</Text>
          </View>
          <Text style={styles.paymentNote}>
            {language === 'ta'
              ? 'வேலை முடிந்ததும் தொழிலாளரிடம் ரொக்கம் அல்லது UPI மூலமாக நேரடியாக செலுத்தலாம்.'
              : 'Direct payment to worker via UPI or Cash upon job completion.'}
          </Text>
        </View>

        {/* Cancellation */}
        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <Button
            title={t('cancelBooking')}
            onPress={handleCancel}
            variant="danger"
            size="md"
          />
        )}
      </View>
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
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingIdText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  serviceTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  otpTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  otpDesc: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  otpBadge: {
    backgroundColor: Colors.brandYellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    marginLeft: 10,
  },
  otpNumber: {
    fontFamily: FontFamilies.primary,
    fontSize: 18,
    fontWeight: '900',
    color: Colors.brandBlack,
    letterSpacing: 2,
  },
  stepperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  cardTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  stepperContainer: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepLeftCol: {
    alignItems: 'center',
    width: 26,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellow,
  },
  stepDotCurrent: {
    borderWidth: 1.5,
    borderColor: Colors.brandBlack,
  },
  stepLine: {
    width: 2,
    height: 28,
    backgroundColor: Colors.border,
  },
  stepLineDone: {
    backgroundColor: Colors.brandYellow,
  },
  stepRightCol: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 2,
    paddingBottom: 18,
  },
  stepLabel: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepLabelDone: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  stepLabelCurrent: {
    color: Colors.brandBlack,
    fontWeight: '800',
  },
  stepSub: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  simulateStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 9,
    gap: 6,
    marginTop: 2,
  },
  simulateStepText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workerAvatarText: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  workerNameText: {
    fontFamily: FontFamilies.primary,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  workerPhoneText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  callCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  landmarkText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginLeft: 19,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  amountValue: {
    fontFamily: FontFamilies.primary,
    fontSize: 18,
    fontWeight: '900',
    color: Colors.brandBlack,
  },
  paymentNote: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
});
