import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'daily_wage' | 'urgent' | 'part_time'>('all');

  const filteredJobs = jobs.filter((j) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'urgent'
        ? j.isUrgent
        : j.jobType === activeFilter;

    if (!matchesFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (language === 'ta' ? j.title_ta : j.title_en).toLowerCase();
      const loc = (language === 'ta' ? j.locality_ta : j.locality_en).toLowerCase();
      return title.includes(q) || loc.includes(q);
    }
    return true;
  });

  const appliedCount = applications.filter((a) => a.status === 'applied').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;
  const totalApps = appliedCount + shortlistedCount + hiredCount;

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      {/* Location Bar with Notification */}
      <Header />

      {/* 1. Compact Greeting & Availability Toggle */}
      <View style={styles.topSection}>
        <View style={styles.greetingRow}>
          <Text style={styles.greetingTitle}>
            {language === 'ta' ? 'வணக்கம் தோழரே!' : 'Vanakkam Worker!'}
          </Text>
          <Text style={styles.localitySub}>
            {language === 'ta'
              ? `${currentLocality.name_ta} பகுதியில் வேலை வாய்ப்புகள்`
              : `Active opportunities in ${currentLocality.name_en}`}
          </Text>
        </View>

        {/* Minimalist Availability Card */}
        <View style={styles.availabilityCard}>
          <View style={styles.availLeft}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isWorkerAvailable ? Colors.success : Colors.textMuted },
              ]}
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.availTitle}>
                {isWorkerAvailable ? t('availableNow') : t('busyNow')}
              </Text>
              <Text style={styles.availDesc}>
                {isWorkerAvailable
                  ? (language === 'ta' ? 'வாடிக்கையாளர்கள் உங்களை அழைக்கலாம்' : 'Customers can call directly')
                  : (language === 'ta' ? 'அழைப்புகள் தற்காலிகமாக நிறுத்தப்பட்டது' : 'Calls paused')}
              </Text>
            </View>
          </View>

          <Switch
            value={isWorkerAvailable}
            onValueChange={toggleWorkerAvailability}
            trackColor={{ false: Colors.border, true: Colors.brandYellow }}
            thumbColor={isWorkerAvailable ? Colors.brandBlack : '#FFFFFF'}
          />
        </View>

        {/* 2. Job Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            placeholder={
              language === 'ta'
                ? 'வேலைகளைத் தேடுங்கள்...'
                : 'Search job title or area...'
            }
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* 6. Application Status Summary & 7. Recorded Earnings Summary */}
        <View style={styles.summaryGrid}>
          {/* Applications Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(worker)/applications')}
            style={styles.summaryCard}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={18} color={Colors.textPrimary} />
              <Ionicons name="chevron-forward" size={13} color={Colors.textMuted} />
            </View>
            <Text style={styles.summaryNumber}>{totalApps}</Text>
            <Text style={styles.summaryLabel}>
              {language === 'ta' ? 'விண்ணப்பங்கள்' : 'Applications'}
            </Text>
          </TouchableOpacity>

          {/* Earnings Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(worker)/earnings')}
            style={styles.summaryCard}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="wallet-outline" size={18} color={Colors.textPrimary} />
              <Ionicons name="chevron-forward" size={13} color={Colors.textMuted} />
            </View>
            <Text style={styles.summaryNumber}>₹4,850</Text>
            <Text style={styles.summaryLabel}>{t('thisWeek')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Simple Category Filter Chips */}
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

      {/* 4. Relevant Nearby Job List */}
      <SectionHeader
        title={
          language === 'ta'
            ? 'அருகிலுள்ள வேலை வாய்ப்புகள்'
            : 'Nearby Job Openings'
        }
        subtitle={
          language === 'ta'
            ? `${filteredJobs.length} வேலைகள் உள்ளன`
            : `${filteredJobs.length} active opportunities`
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

      <View style={{ height: 20 }} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greetingRow: {
    marginBottom: 10,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
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
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    ...Shadows.subtle,
  },
  availLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  availDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    ...Shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
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
