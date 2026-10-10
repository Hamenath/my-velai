import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Chip } from '../../components/ui/Chip';
import { WorkerCard } from '../../components/cards/WorkerCard';
import { JobCard } from '../../components/cards/JobCard';
import { EmptyState } from '../../components/ui/EmptyState';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const { workers, jobs, categories, t, language } = useApp();

  const [query, setQuery] = useState(params.q || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category || 'all');
  const [activeTab, setActiveTab] = useState<'workers' | 'jobs'>('workers');

  // Filter Workers
  const filteredWorkers = workers.filter((worker) => {
    const matchesCat =
      selectedCategory === 'all' || worker.categoryId === selectedCategory;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      worker.name_en.toLowerCase().includes(q) ||
      worker.name_ta.toLowerCase().includes(q) ||
      worker.categoryName_en.toLowerCase().includes(q) ||
      worker.categoryName_ta.toLowerCase().includes(q) ||
      worker.locality_en.toLowerCase().includes(q) ||
      worker.locality_ta.toLowerCase().includes(q) ||
      worker.skills_en.some((s) => s.toLowerCase().includes(q)) ||
      worker.skills_ta.some((s) => s.toLowerCase().includes(q));

    return matchesCat && matchesQuery;
  });

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesCat =
      selectedCategory === 'all' || job.categoryId === selectedCategory;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      job.title_en.toLowerCase().includes(q) ||
      job.title_ta.toLowerCase().includes(q) ||
      job.categoryName_en.toLowerCase().includes(q) ||
      job.categoryName_ta.toLowerCase().includes(q) ||
      job.locality_en.toLowerCase().includes(q) ||
      job.locality_ta.toLowerCase().includes(q);

    return matchesCat && matchesQuery;
  });

  return (
    <ScreenWrapper backgroundColor={Colors.secondaryBg}>
      <Header showLocation={false} title={language === 'ta' ? 'தேடல் & வடிகட்டிகள்' : 'Search & Filters'} />

      {/* Search Input Box */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
            autoFocus={!params.q}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Segmented Control: Workers vs Jobs */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('workers')}
            style={[
              styles.segmentBtn,
              activeTab === 'workers' && styles.activeSegmentBtn,
            ]}
          >
            <Ionicons
              name="people-outline"
              size={14}
              color={activeTab === 'workers' ? Colors.brandBlack : Colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'workers' && styles.activeSegmentText,
              ]}
            >
              {language === 'ta' ? 'தொழிலாளர்கள்' : 'Workers'} ({filteredWorkers.length})
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
            <Ionicons
              name="briefcase-outline"
              size={14}
              color={activeTab === 'jobs' ? Colors.brandBlack : Colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'jobs' && styles.activeSegmentText,
              ]}
            >
              {language === 'ta' ? 'வேலைகள்' : 'Job Openings'} ({filteredJobs.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <Chip
            label={language === 'ta' ? 'அனைத்தும்' : 'All'}
            selected={selectedCategory === 'all'}
            onPress={() => setSelectedCategory('all')}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={language === 'ta' ? cat.name_ta.split(' ')[0] : cat.name_en}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results View */}
      {activeTab === 'workers' ? (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <WorkerCard
              worker={item}
              onPress={() => router.push(`/worker/${item.id}` as any)}
              onBook={() => router.push(`/worker/${item.id}` as any)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title={
                language === 'ta'
                  ? 'தொழிலாளர்கள் கிடைக்கவில்லை'
                  : 'No workers found'
              }
              description={
                language === 'ta'
                  ? 'வேறு வார்த்தைகளைத் தேடவும் அல்லது வடிகட்டியை மாற்றவும்.'
                  : 'Try adjusting your search terms or selecting another category.'
              }
              actionTitle={language === 'ta' ? 'அனைத்தையும் காட்டு' : 'Clear Filters'}
              onAction={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
            />
          }
        />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push(`/job/${item.id}` as any)}
              showApplyButton={false}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title={
                language === 'ta'
                  ? 'வேலைகள் எதுவும் கிடைக்கவில்லை'
                  : 'No jobs found'
              }
              description={
                language === 'ta'
                  ? 'தேடல் அளவுகோல்களை மாற்றி முயற்சிக்கவும்.'
                  : 'Try searching with different keywords.'
              }
              actionTitle={language === 'ta' ? 'அனைத்தையும் காட்டு' : 'Clear Filters'}
              onAction={() => {
                setQuery('');
                setSelectedCategory('all');
              }}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    padding: 2,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: Radius.sm,
    gap: 6,
  },
  activeSegmentBtn: {
    backgroundColor: '#FFFFFF',
    ...Shadows.subtle,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeSegmentText: {
    color: Colors.brandBlack,
    fontWeight: '700',
  },
  categoryScroll: {
    paddingBottom: 8,
  },
  resultsList: {
    padding: 16,
    paddingBottom: 40,
  },
});
