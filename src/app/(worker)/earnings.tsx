import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Badge } from '../../components/ui/Badge';

export default function WorkerEarningsScreen() {
  const { t, language } = useApp();

  const weeklyData = [
    { day_en: 'Mon', day_ta: 'திங்கள்', amount: 800, pct: '80%' },
    { day_en: 'Tue', day_ta: 'செவ்வாய்', amount: 950, pct: '95%' },
    { day_en: 'Wed', day_ta: 'புதன்', amount: 800, pct: '80%' },
    { day_en: 'Thu', day_ta: 'வியாழன்', amount: 600, pct: '60%' },
    { day_en: 'Fri', day_ta: 'வெள்ளி', amount: 900, pct: '90%' },
    { day_en: 'Sat', day_ta: 'சனி', amount: 800, pct: '80%' },
    { day_en: 'Sun', day_ta: 'ஞாயிறு', amount: 0, pct: '0%' },
  ];

  const recentPayouts = [
    {
      id: 'tx-1',
      title_en: 'Vegetable Crate Loading',
      title_ta: 'காய்கறி கூடைகள் ஏற்றுதல்',
      customer: 'M. Selvakumar',
      locality_en: 'Mattuthavani',
      locality_ta: 'மாட்டுத்தாவணி',
      amount: 800,
      date: 'Yesterday / நேற்று',
    },
    {
      id: 'tx-2',
      title_en: 'Motor Pump & CPVC Fitting',
      title_ta: 'மோட்டார் பம்ப் & பிட்டிங்',
      customer: 'R. Meenakshi Sundaram',
      locality_en: 'Goripalayam',
      locality_ta: 'கோரிப்பாளையம்',
      amount: 600,
      date: '08 Oct 2026',
    },
    {
      id: 'tx-3',
      title_en: 'House Wiring & Fan Setup',
      title_ta: 'வீட்டு வயரிங் & மின்விசிறி',
      customer: 'K. Anand',
      locality_en: 'Anna Nagar',
      locality_ta: 'அண்ணா நகர்',
      amount: 950,
      date: '06 Oct 2026',
    },
  ];

  return (
    <ScreenWrapper scrollable backgroundColor="#F8F8F6">
      <Header
        showLocation={false}
        title={language === 'ta' ? 'வருமானம் & வரலாறு' : 'Earnings & History'}
      />

      <View style={styles.container}>
        {/* Main Stat Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardHeaderLabel}>{t('earningsSummary')}</Text>
          <Text style={styles.mainAmount}>₹4,850</Text>
          <Text style={styles.mainSub}>
            {language === 'ta'
              ? 'இந்த வாரம் முடித்த 6 வேலைகளில் பெறப்பட்டது'
              : 'Earned from 6 completed jobs this week'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('totalEarned')}</Text>
              <Text style={styles.statVal}>₹32,500</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('completedJobsCount')}</Text>
              <Text style={styles.statVal}>38</Text>
            </View>
          </View>
        </View>

        {/* Weekly Breakdown Chart Bar */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {language === 'ta' ? 'இந்த வார தினசரி வருமானம்' : 'Daily Income Breakdown'}
          </Text>

          <View style={styles.barGraphRow}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.barCol}>
                <Text style={styles.barVal}>₹{item.amount}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: item.amount > 0 ? (item.amount / 1000) * 80 : 4,
                        backgroundColor:
                          item.amount > 0 ? Colors.brandYellow : Colors.borderStrong,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barDay}>
                  {language === 'ta' ? item.day_ta.slice(0, 3) : item.day_en}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Work Schedule */}
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <Text style={styles.upcomingTitle}>{t('upcomingJobs')}</Text>
            <Badge
              label={language === 'ta' ? 'நாளை' : 'Tomorrow'}
              variant="yellow"
            />
          </View>
          <Text style={styles.upcomingJobName}>
            {language === 'ta'
              ? '2 படுக்கையறை எமல்ஷன் பெயிண்டிங் வேலை'
              : '2 Rooms Wall Painting (Emulsion Roller Work)'}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {language === 'ta' ? 'கே.கே. நகர், மதுரை' : 'KK Nagar, Madurai'} • 8:30 AM
            </Text>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.upcomingRate}>₹950 / {language === 'ta' ? 'நாள்' : 'day'}</Text>
          </View>
        </View>

        {/* Recent Work History */}
        <Text style={styles.historyTitle}>
          {language === 'ta' ? 'சமீபத்திய வேலைகள்' : 'Recent Work History'}
        </Text>

        <View style={styles.historyList}>
          {recentPayouts.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyIconCircle}>
                <Ionicons name="cash-outline" size={18} color={Colors.brandBlack} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.historyJobTitle}>
                  {language === 'ta' ? item.title_ta : item.title_en}
                </Text>
                <Text style={styles.historyMeta}>
                  {item.customer} • {language === 'ta' ? item.locality_ta : item.locality_en}
                </Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <Text style={styles.historyAmount}>+₹{item.amount}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  cardHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.brandBlack,
    marginVertical: 4,
  },
  mainSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  vDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  barGraphRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingBottom: 4,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barVal: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  barTrack: {
    width: 16,
    height: 80,
    backgroundColor: Colors.secondaryBg,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barDay: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 6,
  },
  upcomingCard: {
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1.5,
    borderColor: Colors.brandYellowDark,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 20,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  upcomingJobName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
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
  rateRow: {
    alignItems: 'flex-end',
  },
  upcomingRate: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  historyList: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  historyIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.brandYellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyJobTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historyMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  historyDate: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.success,
  },
});
