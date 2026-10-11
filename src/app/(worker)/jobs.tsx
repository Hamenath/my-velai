import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Chip } from '../../components/ui/Chip';
import { SearchBar } from '../../components/ui/SearchBar';
import { JobCard } from '../../components/cards/JobCard';
import { EmptyState } from '../../components/ui/EmptyState';

export default function WorkerJobsScreen() {
  const router = useRouter();
  const { jobs, categories, t, language } = useApp();

  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesCat =
      selectedCategory === 'all' || job.categoryId === selectedCategory;
    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'urgent' ? job.isUrgent : job.jobType === selectedType);

    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      job.title_en.toLowerCase().includes(q) ||
      job.title_ta.toLowerCase().includes(q) ||
      job.categoryName_en.toLowerCase().includes(q) ||
      job.categoryName_ta.toLowerCase().includes(q) ||
      job.locality_en.toLowerCase().includes(q) ||
      job.locality_ta.toLowerCase().includes(q) ||
      job.landmark.toLowerCase().includes(q);

    return matchesCat && matchesType && matchesQuery;
  });

  return (
    <ScreenWrapper backgroundColor={Colors.mainBg}>
      {/* 1. Reference Screen Header: Title + Filters Button */}
      <View style={styles.topHeader}>
        <Text style={styles.screenTitle}>
          {language === 'ta' ? 'அருகிலுள்ள வேலைகள்' : 'Nearby Zigs'}
        </Text>

        <TouchableOpacity
          style={styles.filtersBtn}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Text style={styles.filtersBtnText}>
            {language === 'ta' ? 'வடிகட்டி' : 'Filters'}
          </Text>
          <Ionicons
            name={showFilters ? 'options' : 'options-outline'}
            size={16}
            color={Colors.brandBlack}
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>

      {/* 2. Search & Expandable Filters */}
      <View style={styles.filterSection}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={
            language === 'ta'
              ? 'வேலை, பகுதி அல்லது திறனைத் தேடுங்கள்...'
              : 'Search jobs, locality, keywords...'
          }
          style={styles.searchBar}
        />

        {showFilters && (
          <View style={styles.filterChipsContainer}>
            {/* Types Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollRow}
            >
              <Chip
                label={t('allJobs')}
                selected={selectedType === 'all'}
                onPress={() => setSelectedType('all')}
              />
              <Chip
                label={t('urgent')}
                selected={selectedType === 'urgent'}
                onPress={() => setSelectedType('urgent')}
              />
              <Chip
                label={t('dailyWage')}
                selected={selectedType === 'daily_wage'}
                onPress={() => setSelectedType('daily_wage')}
              />
              <Chip
                label={t('partTime')}
                selected={selectedType === 'part_time'}
                onPress={() => setSelectedType('part_time')}
              />
            </ScrollView>

            {/* Category Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.scrollRow, { marginTop: 6 }]}
            >
              <Chip
                label={language === 'ta' ? 'அனைத்தும்' : 'All Categories'}
                selected={selectedCategory === 'all'}
                onPress={() => setSelectedCategory('all')}
              />
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={language === 'ta' ? c.name_ta.split(' ')[0] : c.name_en}
                  selected={selectedCategory === c.id}
                  onPress={() => setSelectedCategory(c.id)}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* 3. Jobs List Matching Screen 3 & 5 Reference */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => router.push(`/job/${item.id}` as any)}
            onApply={() => router.push(`/job/${item.id}` as any)}
            showApplyButton={true}
            buttonVariant="dark"
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title={
              language === 'ta'
                ? 'பொருத்தமான வேலைகள் இல்லை'
                : 'No matching jobs found'
            }
            description={
              language === 'ta'
                ? 'வடிகட்டிகளை மாற்றி மீண்டும் முயற்சிக்கவும்'
                : 'Try clearing your search query or filters'
            }
            actionTitle={language === 'ta' ? 'அனைத்து வேலைகள்' : 'Reset Filters'}
            onAction={() => {
              setQuery('');
              setSelectedCategory('all');
              setSelectedType('all');
            }}
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.mainBg,
  },
  screenTitle: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.black,
    color: Colors.brandBlack,
    letterSpacing: -0.3,
  },
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  filtersBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.mainBg,
  },
  searchBar: {
    marginBottom: Spacing.xs,
  },
  filterChipsContainer: {
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  scrollRow: {
    flexDirection: 'row',
    gap: 8,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 40,
  },
});
