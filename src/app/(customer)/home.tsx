import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { CategoryCard } from '../../components/cards/CategoryCard';
import { WorkerCard } from '../../components/cards/WorkerCard';
import { JobCard } from '../../components/cards/JobCard';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { categories, workers, jobs, t, language, currentLocality } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/(customer)/search?q=${encodeURIComponent(searchQuery)}` as any);
    } else {
      router.push('/(customer)/search' as any);
    }
  };

  const nearbyWorkers = workers.slice(0, 3);
  const recentJobs = jobs.slice(0, 3);

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      {/* 1. Compact Location Header with Notification Action */}
      <Header />

      {/* 2. Friendly, Simple Greeting & 3. Clean Search Field */}
      <View style={styles.topSection}>
        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>
            {language === 'ta' ? 'வணக்கம் மதுரை!' : 'Vanakkam Madurai!'}
          </Text>
          <Text style={styles.subGreeting}>
            {language === 'ta'
              ? `${currentLocality.name_ta} பகுதியில் வேலைகளைக் கண்டறியுங்கள்`
              : `Find trusted local workers around ${currentLocality.name_en}`}
          </Text>
        </View>

        {/* Clean Minimalist Search Field */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(customer)/search')}
          style={styles.searchBar}
        >
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            style={styles.searchInput}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSearchSubmit}
            style={styles.searchActionBtn}
          >
            <Ionicons name="arrow-forward" size={14} color={Colors.brandBlack} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* 4. Service Categories in a Balanced Grid */}
      <SectionHeader
        title={t('categories')}
        subtitle={
          language === 'ta'
            ? 'தேவையான சேவையைத் தேர்ந்தெடுக்கவும்'
            : 'Explore services across Madurai'
        }
        actionTitle={t('viewAll')}
        onAction={() => router.push('/(customer)/search')}
      />
      <View style={styles.categoriesGrid}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            variant="tile"
            onPress={() => router.push(`/category/${cat.id}` as any)}
          />
        ))}
      </View>

      {/* 5. One Clear Post a Job Action (Minimalist White Surface) */}
      <View style={styles.postJobWrapper}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(customer)/post-job')}
          style={styles.postJobCard}
        >
          <View style={styles.postIconCircle}>
            <Ionicons name="megaphone-outline" size={20} color={Colors.brandBlack} />
          </View>
          <View style={styles.postTextCol}>
            <Text style={styles.postTitle}>{t('postAJob')}</Text>
            <Text style={styles.postDesc}>
              {language === 'ta'
                ? '1 நிமிடத்தில் பதிவிடுங்கள் • விரைவான பதில்'
                : 'Get quotes from verified workers in 1 minute'}
            </Text>
          </View>
          <View style={styles.postCtaBtn}>
            <Ionicons name="add" size={15} color={Colors.brandBlack} style={{ marginRight: 2 }} />
            <Text style={styles.postCtaText}>
              {language === 'ta' ? 'பதிவிட' : 'Post'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 6. Nearby Workers in Compact List */}
      <SectionHeader
        title={t('nearbyWorkers')}
        subtitle={
          language === 'ta'
            ? `${currentLocality.name_ta} பகுதியிலுள்ள சிறந்த தொழிலாளர்கள்`
            : `Top rated professionals near ${currentLocality.name_en}`
        }
        actionTitle={t('viewAll')}
        onAction={() => router.push('/(customer)/search')}
      />
      <View style={styles.listContainer}>
        {nearbyWorkers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onPress={() => router.push(`/worker/${worker.id}` as any)}
            onBook={() => router.push(`/worker/${worker.id}` as any)}
          />
        ))}
      </View>

      {/* 7. Relevant Local Job Recommendations */}
      <SectionHeader
        title={t('recentJobs')}
        subtitle={
          language === 'ta'
            ? 'வாடிக்கையாளர்கள் தற்போது பதிவிட்ட வேலைகள்'
            : 'Recently posted opportunities'
        }
        actionTitle={t('viewAll')}
        onAction={() => router.push('/(customer)/search')}
      />
      <View style={styles.listContainer}>
        {recentJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onPress={() => router.push(`/job/${job.id}` as any)}
            showApplyButton={false}
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
  greetingText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.1,
  },
  subGreeting: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  searchActionBtn: {
    backgroundColor: Colors.brandYellow,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  postJobWrapper: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 6,
  },
  postJobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 12,
    ...Shadows.subtle,
  },
  postIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  postTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  postDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  postCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandYellow,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.sm,
  },
  postCtaText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});
