import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Chip } from '../../components/ui/Chip';
import { JobCard } from '../../components/cards/JobCard';
import { EmptyState } from '../../components/ui/EmptyState';

export default function WorkerJobsScreen() {
  const router = useRouter();
  const { jobs, categories, t, language } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesCat =
      selectedCategory === 'all' || job.categoryId === selectedCategory;
    const matchesLoc =
      selectedLocality === 'all' || job.localityId === selectedLocality;
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

    return matchesCat && matchesLoc && matchesType && matchesQuery;
  });

  return (
    <ScreenWrapper backgroundColor="#F8F8F6">
      <Header
        showLocation={false}
        title={language === 'ta' ? 'வேலை தேடல்' : 'Find Local Jobs'}
      />

      <View style={styles.filterHeader}>
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            placeholder={
              language === 'ta'
                ? 'வேலை பெயர், பகுதி, இடம்...'
                : 'Search job title, locality, keywords...'
            }
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

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
          contentContainerStyle={[styles.scrollRow, { paddingTop: 0 }]}
        >
          <Chip
            label={language === 'ta' ? 'அனைத்து பிரிவுகள்' : 'All Categories'}
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

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => router.push(`/job/${item.id}` as any)}
            onApply={() => router.push(`/job/${item.id}` as any)}
            showApplyButton={true}
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
                ? 'வடிகட்டிகளை மாற்றி அல்லது வேறு வார்த்தைகளை உள்ளிட்டு தேடவும்.'
                : 'Try adjusting your filters or search terms.'
            }
            actionTitle={language === 'ta' ? 'அனைத்து வேலைகள்' : 'Reset Filters'}
            onAction={() => {
              setQuery('');
              setSelectedCategory('all');
              setSelectedType('all');
              setSelectedLocality('all');
            }}
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  filterHeader: {
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
    height: 46,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  scrollRow: {
    paddingBottom: 6,
    gap: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});
