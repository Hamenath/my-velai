import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Application } from '../../types';

export default function WorkerApplicationsScreen() {
  const router = useRouter();
  const { applications, t, language } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'hired':
        return {
          label: language === 'ta' ? 'தேர்வு செய்யப்பட்டது' : 'Hired',
          variant: 'success' as const,
        };
      case 'shortlisted':
        return {
          label: language === 'ta' ? 'பரிசீலனையில்' : 'Shortlisted',
          variant: 'yellow' as const,
        };
      case 'rejected':
        return {
          label: language === 'ta' ? 'நிராகரிக்கப்பட்டது' : 'Declined',
          variant: 'urgent' as const,
        };
      case 'applied':
      default:
        return {
          label: language === 'ta' ? 'விண்ணப்பிக்கப்பட்டது' : 'Applied',
          variant: 'neutral' as const,
        };
    }
  };

  return (
    <ScreenWrapper backgroundColor={Colors.secondaryBg}>
      <Header
        showLocation={false}
        title={t('myApplications')}
      />

      {/* Status Segment Tabs */}
      <View style={styles.tabBar}>
        {[
          { id: 'all', label_en: 'All', label_ta: 'அனைத்தும்' },
          { id: 'applied', label_en: 'Applied', label_ta: 'அனுப்பப்பட்டது' },
          { id: 'shortlisted', label_en: 'Shortlisted', label_ta: 'பரிசீலனை' },
          { id: 'hired', label_en: 'Hired', label_ta: 'தேர்வு' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.8}
            onPress={() => setFilterStatus(tab.id)}
            style={[
              styles.tabBtn,
              filterStatus === tab.id && styles.activeTabBtn,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                filterStatus === tab.id && styles.activeTabText,
              ]}
            >
              {language === 'ta' ? tab.label_ta : tab.label_en}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const statusInfo = getStatusBadge(item.status);
          const jobTitle =
            language === 'ta' ? item.jobTitle_ta : item.jobTitle_en;
          const locality =
            language === 'ta' ? item.locality_ta : item.locality_en;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/job/${item.jobId}` as any)}
              style={styles.card}
            >
              <View style={styles.topRow}>
                <Text style={styles.timeAgo}>{item.appliedAt}</Text>
                <Badge label={statusInfo.label} variant={statusInfo.variant} />
              </View>

              <Text style={styles.jobTitle} numberOfLines={2}>
                {jobTitle}
              </Text>

              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{locality}, Madurai</Text>
              </View>

              {item.note ? (
                <View style={styles.noteBox}>
                  <Text style={styles.noteLabel}>
                    {language === 'ta' ? 'என் குறிப்பு:' : 'My Note:'}
                  </Text>
                  <Text style={styles.noteText}>{item.note}</Text>
                </View>
              ) : null}

              <View style={styles.divider} />

              <View style={styles.bottomRow}>
                <View>
                  <Text style={styles.rateLabel}>
                    {language === 'ta' ? 'எதிர்பார்க்கும் கூலி' : 'Expected Wage'}
                  </Text>
                  <Text style={styles.rateValue}>₹{item.expectedWage}</Text>
                </View>

                <View style={styles.viewJobLink}>
                  <Text style={styles.linkText}>
                    {language === 'ta' ? 'வேலை விவரம்' : 'View Job'}
                  </Text>
                  <Ionicons name="chevron-forward" size={13} color={Colors.brandBlack} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title={t('noApplications')}
            description={t('noApplicationsDesc')}
            actionTitle={language === 'ta' ? 'வேலைகளைத் தேடுங்கள்' : 'Browse Jobs'}
            onAction={() => router.push('/(worker)/jobs')}
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  tabBtn: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: Radius.round,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeTabBtn: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellow,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.brandBlack,
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeAgo: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  noteBox: {
    backgroundColor: Colors.secondaryBg,
    padding: 8,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  noteText: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  rateValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  viewJobLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
});
