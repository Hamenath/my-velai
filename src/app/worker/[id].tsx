import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Button } from '../../components/ui/Button';

export default function WorkerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workers, createBooking, t, language } = useApp();

  const worker = workers.find((w) => w.id === id);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [newBookingId, setNewBookingId] = useState<string | null>(null);

  if (!worker) {
    return (
      <ScreenWrapper backgroundColor="#FFFFFF">
        <Header showLocation={false} onBack={() => router.back()} title="Worker Profile" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>
            {language === 'ta' ? 'தொழிலாளி விவரம் கிடைக்கவில்லை' : 'Worker not found'}
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

  const name = language === 'ta' ? worker.name_ta : worker.name_en;
  const categoryName = language === 'ta' ? worker.categoryName_ta : worker.categoryName_en;
  const locality = language === 'ta' ? worker.locality_ta : worker.locality_en;
  const skills = language === 'ta' ? worker.skills_ta : worker.skills_en;
  const bio = language === 'ta' ? worker.bio_ta : worker.bio_en;

  const handleCall = () => {
    Linking.openURL(`tel:${worker.phone}`).catch(() => {
      Alert.alert(
        language === 'ta' ? 'தொலைபேசி எண்' : 'Worker Phone',
        worker.phone
      );
    });
  };

  const handleBook = () => {
    const booking = createBooking(
      worker.id,
      categoryName,
      worker.dailyRate
    );
    setNewBookingId(booking.id);
    setBookingSuccessModal(true);
  };

  const handleViewBooking = () => {
    setBookingSuccessModal(false);
    if (newBookingId) {
      router.push(`/booking/${newBookingId}` as any);
    } else {
      router.push('/(customer)/bookings');
    }
  };

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      <Header
        showLocation={false}
        title={categoryName}
        onBack={() => router.back()}
      />

      <View style={styles.container}>
        {/* Profile Header Card */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name.charAt(0)}</Text>
              {worker.isAvailable && <View style={styles.onlineDot} />}
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{name}</Text>
                {worker.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={Colors.success}
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>

              <Text style={styles.categorySub}>{categoryName}</Text>

              <View style={styles.ratingRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color="#EAB308" />
                  <Text style={styles.ratingText}>{worker.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.reviewsCount}>
                  ({worker.reviewsCount} {language === 'ta' ? 'மதிப்பீடுகள்' : 'reviews'})
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{worker.experienceYears} Years</Text>
              <Text style={styles.statLbl}>
                {language === 'ta' ? 'அனுபவம்' : 'Experience'}
              </Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{worker.jobsCompleted}+</Text>
              <Text style={styles.statLbl}>
                {language === 'ta' ? 'வேலைகள்' : 'Jobs Done'}
              </Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{worker.distanceKm} km</Text>
              <Text style={styles.statLbl}>
                {language === 'ta' ? 'தொலைவு' : 'Distance'}
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            {language === 'ta' ? 'சேவை கட்டண விவரம்' : 'Service Charges'}
          </Text>
          <View style={styles.priceRow}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>
                {language === 'ta' ? 'தினசரி கூலி' : 'Daily Wage'}
              </Text>
              <Text style={styles.priceValue}>
                ₹{worker.dailyRate}
                <Text style={styles.priceUnit}> {t('perDay')}</Text>
              </Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>
                {language === 'ta' ? 'மணிநேர கூலி' : 'Hourly Rate'}
              </Text>
              <Text style={styles.priceValue}>
                ₹{worker.hourlyRate}
                <Text style={styles.priceUnit}> {t('perHour')}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Skills Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            {language === 'ta' ? 'சிறப்பு திறன்கள்' : 'Skills & Services'}
          </Text>
          <View style={styles.skillsRow}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillPill}>
                <Ionicons name="construct-outline" size={11} color={Colors.textPrimary} />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bio / About */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            {language === 'ta' ? 'தொழிலாளி பற்றி' : 'About Worker'}
          </Text>
          <Text style={styles.bioText}>{bio}</Text>
          <View style={styles.localityMeta}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.localityText}>
              {locality}, Madurai
            </Text>
          </View>
        </View>

        {/* Verification Tag */}
        <View style={styles.verifiedCard}>
          <Ionicons name="shield-checkmark-outline" size={18} color={Colors.success} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.verifiedTitle}>
              {language === 'ta' ? 'சரிபார்க்கப்பட்ட தொழிலாளி' : 'Verified Professional'}
            </Text>
            <Text style={styles.verifiedDesc}>
              {language === 'ta'
                ? 'அடையாள அட்டை மற்றும் மதுரை முகவரி சரிபார்க்கப்பட்டது.'
                : 'Identity and Madurai local address confirmed.'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCall}
            style={styles.callButton}
          >
            <Ionicons name="call-outline" size={16} color={Colors.textPrimary} />
            <Text style={styles.callButtonText}>{t('callNow')}</Text>
          </TouchableOpacity>

          <Button
            title={t('hireNow')}
            onPress={handleBook}
            variant="primary"
            size="lg"
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Booking Confirmation Modal */}
      <Modal visible={bookingSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="checkmark-done" size={28} color={Colors.success} />
            </View>
            <Text style={styles.modalBoxTitle}>
              {language === 'ta' ? 'முன்பதிவு உறுதியானது!' : 'Booking Confirmed!'}
            </Text>
            <Text style={styles.modalBoxDesc}>
              {language === 'ta'
                ? `${name} உங்களுடன் விரைவில் தொடர்புகொள்வார். முன்பதிவு நிலை மற்றும் OTP எண்ணைக் காண்க.`
                : `${name} has been notified and is preparing to assist you.`}
            </Text>

            <Button
              title={language === 'ta' ? 'முன்பதிவைக் காண்க' : 'View Booking Details'}
              onPress={handleViewBooking}
              variant="primary"
              size="md"
              fullWidth
              style={{ marginTop: 14 }}
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
    fontSize: 15,
    color: Colors.textSecondary,
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  categorySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.xs,
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E',
  },
  reviewsCount: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    marginTop: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  statLbl: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  vDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  cardSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priceItem: {
    flex: 1,
    backgroundColor: Colors.secondaryBg,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginTop: 1,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bioText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 6,
  },
  localityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  localityText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 12,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  verifiedTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.success,
  },
  verifiedDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    minHeight: 48,
    gap: 6,
  },
  callButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  modalIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  modalBoxTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalBoxDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
});
