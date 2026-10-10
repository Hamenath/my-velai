import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { WorkerCard } from '../../components/cards/WorkerCard';
import { JobCard } from '../../components/cards/JobCard';
import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/EmptyState';

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories, workers, jobs, localities, language } = useApp();

  const category = categories.find((c) => c.id === id) || categories[0];
  const [activeTab, setActiveTab] = useState<'workers' | 'jobs'>('workers');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');

  const catName = language === 'ta' ? category.name_ta : category.name_en;
  const catDesc = language === 'ta' ? category.description_ta : category.description_en;

  const categoryWorkers = workers.filter(
    (w) =>
      w.categoryId === category.id &&
      (selectedLocality === 'all' || w.localityId === selectedLocality)
  );

  const categoryJobs = jobs.filter(
    (j) =>
      j.categoryId === category.id &&
      (selectedLocality === 'all' || j.localityId === selectedLocality)
  );

  return (
    <ScreenWrapper backgroundColor="#F8F8F6">
      <Header
        showLocation={false}
        title={catName}
        onBack={() => router.back()}
      />

      {/* Category Overview Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={(category.icon as any) || 'construct-outline'}
              size={28}
              color={Colors.brandBlack}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.catTitle}>{catName}</Text>
            <Text style={styles.catDesc}>{catDesc}</Text>
          </View>
        </View>

        <View style={styles.statsPillRow}>
          <View style={styles.statsPill}>
            <Text style={styles.statsPillLabel}>
              {language === 'ta' ? 'சராசரி தினக்கூலி:' : 'Avg. Daily Wage:'}
            </Text>
            <Text style={styles.statsPillVal}>₹{category.averageDailyRate}</Text>
          </View>

          <View style={styles.statsPill}>
            <Text style={styles.statsPillLabel}>
              {language === 'ta' ? 'தொழிலாளர்கள்:' : 'Active Workers:'}
            </Text>
            <Text style={styles.statsPillVal}>{category.activeWorkersCount}</Text>
          </View>
        </View>
      </View>

      {/* Segment Switcher */}
      <View style={styles.segmentContainer}>
        <View style={styles.segmentBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('workers')}
            style={[
              styles.segmentBtn,
              activeTab === 'workers' && styles.activeSegmentBtn,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'workers' && styles.activeSegmentText,
              ]}
            >
              {language === 'ta' ? 'தொழிலாளர்கள்' : 'Workers'} ({categoryWorkers.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('jobs')}
            style={[
              styles.segmentBtn,
              activeTab === 'jobs' && styles.activeSegmentBtn,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'jobs' && styles.activeSegmentText,
              ]}
            >
              {language === 'ta' ? 'வேலைகள்' : 'Job Openings'} ({categoryJobs.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Madurai Locality Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.localityScroll}
        >
          <Chip
            label={language === 'ta' ? 'அனைத்து பகுதிகள்' : 'All Areas'}
            selected={selectedLocality === 'all'}
            onPress={() => setSelectedLocality('all')}
          />
          {localities.map((loc) => (
            <Chip
              key={loc.id}
              label={language === 'ta' ? loc.name_ta : loc.name_en}
              selected={selectedLocality === loc.id}
              onPress={() => setSelectedLocality(loc.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Listings */}
      {activeTab === 'workers' ? (
        <FlatList
          data={categoryWorkers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <WorkerCard
              worker={item}
              onPress={() => router.push(`/worker/${item.id}` as any)}
              onBook={() => router.push(`/worker/${item.id}` as any)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title={
                language === 'ta'
                  ? 'இந்த பகுதியில் தொழிலாளர்கள் இல்லை'
                  : 'No workers in this locality'
              }
              description={
                language === 'ta'
                  ? 'வடிகட்டியை மாற்றி அல்லது அனைத்து பகுதியையும் தேர்ந்தெடுக்கவும்.'
                  : 'Try selecting "All Areas" to see workers nearby.'
              }
              actionTitle={language === 'ta' ? 'அனைத்து பகுதிகள்' : 'Show All Areas'}
              onAction={() => setSelectedLocality('all')}
            />
          }
        />
      ) : (
        <FlatList
          data={categoryJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push(`/job/${item.id}` as any)}
              showApplyButton={false}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="briefcase-outline"
              title={
                language === 'ta'
                  ? 'இந்த பகுதியில் வேலைகள் இல்லை'
                  : 'No jobs in this area'
              }
              description={
                language === 'ta'
                  ? 'மற்ற பகுதிகளை தேர்ந்தெடுக்கவும் அல்லது ஒரு வேலையை நீங்களே பதிவிடவும்.'
                  : 'Try choosing another locality or post a new job.'
              }
              actionTitle={language === 'ta' ? 'வேலை பதிவு செய்க' : 'Post a Job'}
              onAction={() => router.push('/(customer)/post-job')}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1.5,
    borderColor: Colors.brandYellowDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  catDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  statsPillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statsPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsPillLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  statsPillVal: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  segmentContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: Radius.sm,
  },
  activeSegmentBtn: {
    backgroundColor: Colors.brandYellow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  activeSegmentText: {
    color: Colors.brandBlack,
  },
  localityScroll: {
    paddingBottom: 6,
    gap: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});
