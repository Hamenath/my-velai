import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Booking } from '../../types';

export default function BookingsScreen() {
  const router = useRouter();
  const { bookings, t, language } = useApp();

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'on_the_way':
        return {
          label: language === 'ta' ? 'கிளம்பிவிட்டார்' : 'On The Way',
          variant: 'yellow' as const,
        };
      case 'in_progress':
        return {
          label: language === 'ta' ? 'வேலை நடக்கிறது' : 'In Progress',
          variant: 'info' as const,
        };
      case 'completed':
        return {
          label: language === 'ta' ? 'முடிந்தது' : 'Completed',
          variant: 'success' as const,
        };
      case 'cancelled':
        return {
          label: language === 'ta' ? 'ரத்து செய்யப்பட்டது' : 'Cancelled',
          variant: 'urgent' as const,
        };
      case 'confirmed':
      default:
        return {
          label: language === 'ta' ? 'உறுதியானது' : 'Confirmed',
          variant: 'neutral' as const,
        };
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert(language === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number', phone);
    });
  };

  return (
    <ScreenWrapper backgroundColor={Colors.secondaryBg}>
      <Header
        showLocation={false}
        title={language === 'ta' ? 'என் முன்பதிவுகள்' : 'My Bookings'}
      />

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const statusInfo = getStatusBadge(item.status);
          const serviceTitle =
            language === 'ta' ? item.serviceTitle_ta : item.serviceTitle_en;
          const locality = language === 'ta' ? item.locality_ta : item.locality_en;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/booking/${item.id}` as any)}
              style={styles.bookingCard}
            >
              {/* Top Row */}
              <View style={styles.topRow}>
                <View>
                  <Text style={styles.bookingId}>ID: {item.id}</Text>
                  <Text style={styles.dateText}>
                    {item.date} • {item.time}
                  </Text>
                </View>
                <Badge label={statusInfo.label} variant={statusInfo.variant} />
              </View>

              {/* Service Title */}
              <Text style={styles.serviceTitle}>{serviceTitle}</Text>

              {/* Location */}
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
                <Text style={styles.metaText} numberOfLines={1}>
                  {locality}
                </Text>
              </View>

              {/* Worker & Contact */}
              <View style={styles.workerRow}>
                <View style={styles.workerAvatar}>
                  <Text style={styles.avatarText}>
                    {item.workerName.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.workerName}>{item.workerName}</Text>
                  <Text style={styles.otpNotice}>
                    {t('otpCode')}: <Text style={styles.otpValue}>{item.otp}</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCall(item.workerPhone)}
                  style={styles.callCircle}
                >
                  <Ionicons name="call-outline" size={15} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* Bottom: Amount & Track Link */}
              <View style={styles.bottomRow}>
                <Text style={styles.amountText}>₹{item.amount}</Text>
                <View style={styles.trackLink}>
                  <Text style={styles.trackLinkText}>
                    {language === 'ta' ? 'கண்காணிப்பு' : 'Track Status'}
                  </Text>
                  <Ionicons name="chevron-forward" size={13} color={Colors.brandBlack} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title={language === 'ta' ? 'முன்பதிவுகள் இல்லை' : 'No Bookings Found'}
            description={
              language === 'ta'
                ? 'தொழிலாளர்களை அழைக்க அல்லது வேலை பதிவு செய்ய முகப்புப் பக்கத்திற்குச் செல்லவும்.'
                : 'Browse workers on the home screen to make your first booking.'
            }
            actionTitle={language === 'ta' ? 'தொழிலாளர்களைக் காண்க' : 'Find Workers'}
            onAction={() => router.push('/(customer)/home')}
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  workerName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  otpNotice: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  otpValue: {
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  callCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
  amountText: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  trackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trackLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
});
