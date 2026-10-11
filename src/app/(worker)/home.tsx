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
import { Colors, Radius, Shadows, FontFamilies } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  ScreenWrapper,
  SectionHeader,
  JobCard,
  Chip,
  MapPreviewCard,
} from '../../components';

export default function WorkerHomeScreen() {
  const router = useRouter();
  const {
    jobs,
    isWorkerAvailable,
    toggleWorkerAvailability,
    t,
    language,
    currentLocality,
  } = useApp();
  const { user, profile } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'all' | 'daily_wage' | 'urgent' | 'part_time'>('all');

  const filteredJobs = jobs.filter((j) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return j.isUrgent;
    return j.jobType === activeFilter;
  });

  const workerDisplayName = profile?.displayName || user?.displayName || (language === 'ta' ? 'மதுரை தொழிலாளி' : 'Worker Partner');
  const avatarLetter = (workerDisplayName[0] || 'W').toUpperCase();

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      <View style={styles.container}>
        {/* ================================================================= */}
        {/* 1. Header: Worker Greeting, Badge & Notification Bell             */}
        {/* ================================================================= */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/(worker)/profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </TouchableOpacity>

          <View style={styles.greetingCol}>
            <View style={styles.helloBadgeRow}>
              <Text style={styles.helloText}>{language === 'ta' ? 'வணக்கம்,' : 'Hello,'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Worker</Text>
              </View>
            </View>
            <Text style={styles.workerName} numberOfLines={1}>
              {workerDisplayName}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => router.push('/(worker)/applications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* ================================================================= */}
        {/* 2. Notice Card: Bank Account Verification Required (Reference UI) */}
        {/* ================================================================= */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <View style={styles.noticeIconWrap}>
              <Ionicons name="card-outline" size={20} color={Colors.brandYellow} />
            </View>
            <View style={styles.noticeTextCol}>
              <Text style={styles.noticeTitle}>
                {language === 'ta' ? 'வங்கி கணக்கு சரிபார்ப்பு தேவை' : 'Bank Account Verification Required'}
              </Text>
              <Text style={styles.noticeSubtitle}>
                {language === 'ta'
                  ? 'உங்கள் தினக்கூலி பெற வங்கி கணக்கை இணைக்கவும்.'
                  : 'Verify your bank account to receive payouts.'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.verifyNowBtn}
            onPress={() => router.push('/(worker)/earnings')}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={16} color={Colors.brandBlack} style={{ marginRight: 6 }} />
            <Text style={styles.verifyNowText}>
              {language === 'ta' ? 'வங்கி கணக்கை சரிபார்க்க' : 'VERIFY BANK ACCOUNT NOW'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================= */}
        {/* 3. Available Balance Banner (Reference UI)                        */}
        {/* ================================================================= */}
        <TouchableOpacity
          style={styles.balanceCard}
          onPress={() => router.push('/(worker)/earnings')}
          activeOpacity={0.85}
        >
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet-outline" size={16} color={Colors.brandYellow} style={{ marginRight: 6 }} />
            <Text style={styles.balanceLabel}>
              {language === 'ta' ? 'கிடைக்கக்கூடிய இருப்பு' : 'Available balance'}
            </Text>
          </View>
          <Text style={styles.balanceAmount}>₹0</Text>
        </TouchableOpacity>

        {/* ================================================================= */}
        {/* 4. Three Quick Action Tiles (Reference UI)                        */}
        {/* ================================================================= */}
        <View style={styles.quickActionsRow}>
          {/* Tile 1: My Jobs / My Zigs */}
          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => router.push('/(worker)/applications')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Ionicons name="briefcase-outline" size={22} color={Colors.textPrimary} />
            </View>
            <Text style={styles.actionTileLabel}>
              {language === 'ta' ? 'என் வேலைகள்' : 'My Zigs'}
            </Text>
          </TouchableOpacity>

          {/* Tile 2: Payouts */}
          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => router.push('/(worker)/earnings')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Ionicons name="wallet-outline" size={22} color={Colors.textPrimary} />
            </View>
            <Text style={styles.actionTileLabel}>
              {language === 'ta' ? 'கட்டணங்கள்' : 'Payouts'}
            </Text>
          </TouchableOpacity>

          {/* Tile 3: Performance */}
          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => router.push('/(worker)/profile')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Ionicons name="bar-chart-outline" size={22} color={Colors.textPrimary} />
            </View>
            <Text style={styles.actionTileLabel}>
              {language === 'ta' ? 'செயல்திறன்' : 'Performance'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================= */}
        {/* 5. Availability Status Toggle                                    */}
        {/* ================================================================= */}
        <View style={styles.availabilityRow}>
          <View style={styles.availTextWrap}>
            <View
              style={[
                styles.availDot,
                { backgroundColor: isWorkerAvailable ? Colors.success : Colors.textMuted },
              ]}
            />
            <Text style={styles.availStatusTitle}>
              {isWorkerAvailable ? t('availableNow') : t('busyNow')}
            </Text>
          </View>
          <Switch
            value={isWorkerAvailable}
            onValueChange={toggleWorkerAvailability}
            trackColor={{ false: Colors.border, true: Colors.brandYellow }}
            thumbColor={isWorkerAvailable ? Colors.brandBlack : '#FFFFFF'}
          />
        </View>

        {/* ================================================================= */}
        {/* 6. Find Nearby Zigs (Interactive Map Preview Card)               */}
        {/* ================================================================= */}
        <SectionHeader
          title={language === 'ta' ? 'அருகிலுள்ள வேலைகளைக் கண்டறியவும்' : 'Find nearby zigs'}
          subtitle={
            language === 'ta'
              ? `${currentLocality.name_ta} பகுதியில் நேரடி வேலைகள்`
              : `Active opportunities around ${currentLocality.name_en}`
          }
        />

        <MapPreviewCard
          jobCount={filteredJobs.length}
          localityName={language === 'ta' ? currentLocality.name_ta : currentLocality.name_en}
          onPress={() => router.push('/(worker)/jobs')}
          style={{ marginBottom: 20 }}
        />

        {/* ================================================================= */}
        {/* 7. Nearby Zigs / Jobs Feed (Reference UI)                        */}
        {/* ================================================================= */}
        <SectionHeader
          title={language === 'ta' ? 'அருகிலுள்ள வேலைகள்' : 'Nearby Zigs'}
          actionTitle={language === 'ta' ? 'வடிகட்டிகள் ⊶' : 'Filters ⊶'}
          onAction={() => {}}
        />

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
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

        {/* Job Cards Feed */}
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

        <View style={{ height: 30 }} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: Radius.round,
    backgroundColor: Colors.brandBlack,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greetingCol: {
    flex: 1,
  },
  helloBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helloText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  roleBadge: {
    backgroundColor: Colors.brandCharcoal,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: Radius.xs,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  workerName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.round,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.subtle,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.error,
  },
  noticeCard: {
    backgroundColor: Colors.brandBlack,
    borderRadius: Radius.xl,
    padding: 16,
    marginBottom: 12,
    ...Shadows.card,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  noticeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  noticeTextCol: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  noticeSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  verifyNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandYellow,
    borderRadius: Radius.md,
    height: 44,
  },
  verifyNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandBlack,
    letterSpacing: 0.3,
  },
  balanceCard: {
    backgroundColor: Colors.brandDarkCard,
    borderRadius: Radius.xl,
    padding: 16,
    marginBottom: 14,
    ...Shadows.card,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  balanceLabel: {
    fontSize: 12,
    color: Colors.brandYellow,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  actionIconBox: {
    marginBottom: 6,
  },
  actionTileLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    ...Shadows.subtle,
  },
  availTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availStatusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  filterScroll: {
    gap: 6,
    paddingBottom: 12,
  },
  jobsList: {
    gap: 2,
  },
});
