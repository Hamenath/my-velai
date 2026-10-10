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
    <ScreenWrapper scrollable backgroundColor="#F8F8F6">
      {/* Top Header with Logo and Location Bar */}
      <Header />

      {/* Hero Search Section */}
      <View style={styles.heroSection}>
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
            activeOpacity={0.8}
            onPress={handleSearchSubmit}
            style={styles.searchActionBtn}
          >
            <Ionicons name="arrow-forward" size={16} color={Colors.brandBlack} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* High-Converting Post a Job Action Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(customer)/post-job')}
          style={styles.postJobBanner}
        >
          <View style={styles.postBannerIconBox}>
            <Ionicons name="megaphone" size={22} color={Colors.brandBlack} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.bannerTagRow}>
              <View style={styles.badgeBanner}>
                <Text style={styles.badgeBannerText}>
                  {language === 'ta' ? 'உடனடி உதவி' : 'Fast Response'}
                </Text>
              </View>
              <Text style={styles.timeTag}>
                {language === 'ta' ? '1 நிமிடத்தில்' : 'In 1 minute'}
              </Text>
            </View>
            <Text style={styles.postBannerTitle}>{t('postAJob')}</Text>
            <Text style={styles.postBannerDesc}>{t('postAJobDesc')}</Text>
          </View>

          <View style={styles.bannerCta}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.bannerCtaText}>
              {language === 'ta' ? 'பதிவிட' : 'Post'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Service Categories 4-Column Grid */}
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

      <View style={{ height: 24 }} />
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
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 22,
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
    backgroundColor: '#F5F5F3',
    borderRadius: Radius.lg,
    borderWidth: 1.2,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 50,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.brandYellowDark,
  },
  postJobBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1.5,
    borderColor: Colors.brandYellowDark,
    borderRadius: Radius.lg,
    padding: 14,
    ...Shadows.subtle,
  },
  postBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.brandYellow,
    borderWidth: 1.5,
    borderColor: Colors.brandBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  badgeBanner: {
    backgroundColor: Colors.brandYellow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.brandYellowDark,
  },
  badgeBannerText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  timeTag: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  postBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  postBannerDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandBlack,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    gap: 3,
    marginLeft: 6,
  },
  bannerCtaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
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
