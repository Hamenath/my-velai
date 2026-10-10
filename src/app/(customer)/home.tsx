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
import { Colors, Radius } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { CategoryCard } from '../../components/cards/CategoryCard';
import { WorkerCard } from '../../components/cards/WorkerCard';
import { JobCard } from '../../components/cards/JobCard';
import { Button } from '../../components/ui/Button';

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
    <ScreenWrapper scrollable backgroundColor="#F8F8F6">
      {/* Top Header */}
      <Header />

      {/* Greeting & Post Job Quick Banner */}
      <View style={styles.heroSection}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingText}>
              {language === 'ta' ? 'வணக்கம் மதுரை!' : 'Vanakkam Madurai!'}
            </Text>
            <Text style={styles.subGreeting}>
              {language === 'ta'
                ? `${currentLocality.name_ta} பகுதியில் வேலைகளைக் கண்டறியுங்கள்`
                : `Need trusted workers around ${currentLocality.name_en}?`}
            </Text>
          </View>
        </View>

        {/* Prominent Search Bar */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(customer)/search')}
          style={styles.searchBar}
        >
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            style={styles.searchInput}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSearchSubmit}
            style={styles.searchActionBtn}
          >
            <Ionicons name="arrow-forward" size={16} color={Colors.brandBlack} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Post a Job Banner */}
        <View style={styles.postJobBanner}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeBanner}>
              <Text style={styles.badgeBannerText}>
                {language === 'ta' ? 'உடனடி உதவி' : 'Fast Response'}
              </Text>
            </View>
            <Text style={styles.postBannerTitle}>{t('postAJob')}</Text>
            <Text style={styles.postBannerDesc}>{t('postAJobDesc')}</Text>
          </View>
          <Button
            title={language === 'ta' ? 'பதிவிட' : 'Post'}
            onPress={() => router.push('/(customer)/post-job')}
            variant="secondary"
            size="sm"
            style={styles.bannerBtn}
          />
        </View>
      </View>

      {/* Service Categories Section */}
      <SectionHeader
        title={t('categories')}
        subtitle={
          language === 'ta'
            ? 'தேவையான சேவையைத் தேர்ந்தெடுக்கவும்'
            : 'Select the service you need'
        }
        actionTitle={t('viewAll')}
        onAction={() => router.push('/(customer)/search')}
      />
      <View style={styles.categoriesGrid}>
        {categories.slice(0, 6).map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onPress={() => router.push(`/category/${cat.id}` as any)}
          />
        ))}
      </View>

      {/* Nearby Verified Workers */}
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

      {/* Recent Job Openings */}
      <SectionHeader
        title={t('recentJobs')}
        subtitle={
          language === 'ta'
            ? 'வாடிக்கையாளர்கள் தற்போது பதிவிட்ட வேலைகள்'
            : 'Recently posted jobs in Madurai'
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
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.brandBlack,
    letterSpacing: 0.2,
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
    borderWidth: 1.2,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 14,
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
  postJobBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1.5,
    borderColor: Colors.brandYellow,
    borderRadius: Radius.lg,
    padding: 14,
  },
  badgeBanner: {
    backgroundColor: Colors.brandYellow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeBannerText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  postBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  postBannerDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bannerBtn: {
    paddingHorizontal: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});
