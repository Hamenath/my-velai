import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { JobCard } from '../../components/cards/JobCard';
import { Chip } from '../../components/ui/Chip';

export default function WorkerHomeScreen() {
  const router = useRouter();
  const {
    jobs,
    applications,
    isWorkerAvailable,
    toggleWorkerAvailability,
    t,
    language,
    currentLocality,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'daily_wage' | 'urgent' | 'part_time'>('all');

  const filteredJobs = jobs.filter((j) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return j.isUrgent;
    return j.jobType === activeFilter;
  });

  const appliedCount = applications.filter((a) => a.status === 'applied').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  return (
    <ScreenWrapper scrollable backgroundColor="#F8F8F6">
      <Header />

      {/* Hero Availability Card */}
      <View style={styles.heroSection}>
        <View style={styles.topGreetingRow}>
          <View>
            <Text style={styles.greetingTitle}>
              {language === 'ta' ? 'வணக்கம் தோழரே!' : 'Vanakkam Worker!'}
            </Text>
            <Text style={styles.localitySub}>
              {language === 'ta'
                ? `${currentLocality.name_ta} பகுதியில் புதிய வேலைகள் உள்ளன`
                : `Active jobs waiting in ${currentLocality.name_en}`}
            </Text>
          </View>
        </View>

        {/* Availability Switcher */}
        <View
          style={[
            styles.availabilityCard,
            isWorkerAvailable ? styles.availableBorder : styles.busyBorder,
          ]}
        >
          <View style={styles.availLeft}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isWorkerAvailable ? Colors.success : Colors.error },
              ]}
            />
            <View>
              <Text style={styles.availTitle}>
                {isWorkerAvailable ? t('availableNow') : t('busyNow')}
              </Text>
              <Text style={styles.availDesc}>
                {isWorkerAvailable
                  ? language === 'ta'
                    ? 'வாடிக்கையாளர்கள் உங்களை அழைக்கலாம்'
                    : 'Customers can call & book you directly'
                  : language === 'ta'
                    ? 'புதிய வேலை அழைப்புகள் வராது'
                    : 'You will not appear in search results'}
              </Text>
            </View>
          </View>

          <Switch
            value={isWorkerAvailable}
            onValueChange={toggleWorkerAvailability}
            trackColor={{ false: '#D4D4D4', true: Colors.brandYellow }}
            thumbColor={isWorkerAvailable ? Colors.brandBlack : '#F5F5F5'}
          />
        </View>

        {/* Earnings & Applications Summary Grid */}
        <View style={styles.summaryGrid}>
          {/* Earnings card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(worker)/earnings')}
            style={styles.summaryCard}
          >
            <View style={styles.cardIconCircle}>
              <Ionicons name="wallet-outline" size={18} color={Colors.brandBlack} />
            </View>
            <Text style={styles.summaryNumber}>₹4,850</Text>
            <Text style={styles.summaryLabel}>{t('thisWeek')}</Text>
          </TouchableOpacity>

          {/* Applications status card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(worker)/applications')}
            style={styles.summaryCard}
          >
            <View style={[styles.cardIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="document-text-outline" size={18} color={Colors.success} />
            </View>
            <Text style={styles.summaryNumber}>
              {appliedCount + shortlistedCount + hiredCount}
            </Text>
            <Text style={styles.summaryLabel}>
              {language === 'ta' ? 'விண்ணப்பங்கள்' : 'Applications'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Filters */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          <Chip
            label={t('allJobs')}
            selected={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <Chip
            label={t('urgent')}
            selected={activeFilter === 'urgent'}
            onPress={() => setActiveFilter('urgent')}
          />
          <Chip
            label={t('dailyWage')}
            selected={activeFilter === 'daily_wage'}
            onPress={() => setActiveFilter('daily_wage')}
          />
          <Chip
            label={t('partTime')}
            selected={activeFilter === 'part_time'}
            onPress={() => setActiveFilter('part_time')}
          />
        </ScrollView>
      </View>

      {/* Nearby Jobs Listing */}
      <SectionHeader
        title={
          language === 'ta'
            ? 'அருகிலுள்ள வேலை வாய்ப்புகள்'
            : 'Nearby Job Openings'
        }
        subtitle={
          language === 'ta'
            ? 'உடனே விண்ணப்பிக்கவும் அல்லது வாடிக்கையாளரை அழைக்கவும்'
            : 'Apply now or contact customers directly'
        }
        actionTitle={t('viewAll')}
        onAction={() => router.push('/(worker)/jobs')}
      />

      <View style={styles.jobsList}>
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onPress={() => router.push(`/job/${job.id}` as any)}
            onApply={() => router.push(`/job/${job.id}` as any)}
            showApplyButton={true}
          />
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topGreetingRow: {
    marginBottom: 12,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.brandBlack,
  },
  localitySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: 12,
    marginBottom: 14,
  },
  availableBorder: {
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  busyBorder: {
    borderColor: Colors.border,
    backgroundColor: Colors.secondaryBg,
  },
  availLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  availTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  availDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  cardIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.brandBlack,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 4,
  },
  jobsList: {
    paddingHorizontal: 16,
  },
});
