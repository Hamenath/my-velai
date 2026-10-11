import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Typography, Spacing, Shadows, FontFamilies } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';

export default function WorkerEarningsScreen() {
  const router = useRouter();
  const { language } = useApp();
  const { profile } = useAuth();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountName, setAccountName] = useState(profile?.displayName || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBankVerified, setIsBankVerified] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleVerifyBank = () => {
    if (!accountNumber || !ifsc) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsBankVerified(true);
      setBankModalVisible(false);
    }, 1200);
  };

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.mainBg}>
      {/* 1. Header with Back, Title, Refresh */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.brandBlack} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {language === 'ta' ? 'பணப்பை' : 'Wallet'}
        </Text>

        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color={isRefreshing ? Colors.brandYellowDark : Colors.brandBlack}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* 2. Dark Wallet Balance Card */}
        <View style={styles.darkBalanceCard}>
          <View style={styles.darkBalanceTop}>
            <View>
              <Text style={styles.darkBalanceLabel}>
                {language === 'ta' ? 'பணப்பை இருப்பு' : 'WALLET BALANCE'}
              </Text>
              <Text style={styles.darkBalanceAmount}>₹0</Text>
              <View style={styles.trendRow}>
                <Ionicons name="trending-up" size={14} color={Colors.success} />
                <Text style={styles.trendText}>+12.4% this month</Text>
              </View>
            </View>

            <View style={styles.walletIconBox}>
              <Ionicons name="wallet-outline" size={26} color={Colors.brandYellow} />
            </View>
          </View>
        </View>

        {/* 3. Verify Bank Account Action Button */}
        <TouchableOpacity
          style={styles.verifyActionBtn}
          onPress={() => setBankModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="business-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.verifyActionText}>
            {isBankVerified
              ? (language === 'ta' ? 'வங்கி கணக்கு சரிபார்க்கப்பட்டது' : 'Bank Account Verified')
              : (language === 'ta' ? 'வங்கி கணக்கை சரிபார்க்க' : 'Verify Bank Account')}
          </Text>
          {isBankVerified && (
            <Ionicons name="checkmark-circle" size={16} color={Colors.brandYellow} style={{ marginLeft: 6 }} />
          )}
        </TouchableOpacity>

        {/* 4. 2-Column Stats Grid: Available & Pending */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statCardLabel}>
              {language === 'ta' ? 'கிடைக்கும் தொகை' : 'AVAILABLE'}
            </Text>
            <Text style={styles.statCardValue}>₹0</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statCardLabel}>
              {language === 'ta' ? 'நிலுவையில்' : 'PENDING'}
            </Text>
            <Text style={styles.statCardValue}>₹0</Text>
          </View>
        </View>

        {/* 5. Bank Account Details Card */}
        <View style={styles.bankDetailsCard}>
          <View style={styles.bankHeaderRow}>
            <View style={styles.bankTitleGroup}>
              <Ionicons name="business" size={20} color={Colors.brandBlack} style={{ marginRight: 8 }} />
              <Text style={styles.bankCardTitle}>
                {language === 'ta' ? 'வங்கி கணக்கு விவரங்கள்' : 'Bank Account Details'}
              </Text>
            </View>

            <View
              style={[
                styles.verificationBadge,
                isBankVerified ? styles.verifiedBadgeBg : styles.notVerifiedBadgeBg,
              ]}
            >
              <Ionicons
                name={isBankVerified ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                size={13}
                color={isBankVerified ? Colors.success : Colors.error}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.verificationBadgeText,
                  { color: isBankVerified ? Colors.success : Colors.error },
                ]}
              >
                {isBankVerified
                  ? (language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified')
                  : (language === 'ta' ? 'சரிபார்க்கப்படவில்லை' : 'Not Verified')}
              </Text>
            </View>
          </View>

          <Text style={styles.bankDesc}>
            {isBankVerified
              ? (language === 'ta'
                  ? 'உங்கள் வங்கி கணக்கு வெற்றிகரமாக இணைக்கப்பட்டுள்ளது. வருமானங்கள் நேரடியாக செலுத்தப்படும்.'
                  : `Your bank account (${accountNumber ? `••••${accountNumber.slice(-4)}` : 'Active'}) is verified. Daily payouts are automatically credited.`)
              : (language === 'ta'
                  ? 'உங்கள் வங்கி கணக்கை இணைத்து சரிபார்க்கவும். உடனடி சரிபார்ப்பிற்கு ₹1 பென்னி டிராப் பரிவர்த்தனை தொடங்கப்படும்.'
                  : 'Please add and verify your bank account. A ₹1 Penny Drop transaction will be initiated to verify your account details instantly.')}
          </Text>

          {!isBankVerified && (
            <TouchableOpacity
              style={styles.verifyBankBtn}
              onPress={() => setBankModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.verifyBankBtnText}>
                {language === 'ta' ? 'வங்கி கணக்கை சரிபார்க்க' : 'Verify Bank Account'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 6. Recent Transactions Section */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>
            {language === 'ta' ? 'சமீபத்திய பரிவர்த்தனைகள்' : 'RECENT TRANSACTIONS'}
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>
              {language === 'ta' ? 'அனைத்தும்' : 'See all'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 7. Clean Empty State Card */}
        <View style={styles.emptyCard}>
          <View style={styles.receiptIconCircle}>
            <Ionicons name="receipt-outline" size={38} color={Colors.brandBlack} />
          </View>
          <Text style={styles.emptyTitle}>
            {language === 'ta' ? 'பரிவர்த்தனைகள் எதுவும் இல்லை' : 'No Transactions Yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {language === 'ta'
              ? 'உங்கள் வரவு மற்றும் திரும்பப் பெறுதல் வரலாறு இங்கே தோன்றும்.'
              : 'Your deposit and withdrawal history will appear here.'}
          </Text>
        </View>
      </View>

      {/* Bank Account Verification Modal */}
      <Modal
        visible={bankModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBankModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {language === 'ta' ? 'வங்கி கணக்கு சரிபார்ப்பு' : 'Bank Account Verification'}
              </Text>
              <TouchableOpacity onPress={() => setBankModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.brandBlack} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {language === 'ta'
                ? 'நேரடி வங்கி பரிமாற்றத்திற்கு ₹1 பென்னி டிராப் சரிபார்ப்பு பயன்படுத்தப்படுகிறது.'
                : 'Instant ₹1 Penny Drop verification for secure bank settlements.'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {language === 'ta' ? 'கணக்கு வைத்திருப்பவர் பெயர்' : 'Account Holder Name'}
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Hamenath B"
                placeholderTextColor={Colors.textMuted}
                value={accountName}
                onChangeText={setAccountName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {language === 'ta' ? 'வங்கி கணக்கு எண்' : 'Bank Account Number'}
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 50100234567890"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {language === 'ta' ? 'IFSC குறியீடு' : 'IFSC Code'}
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. HDFC0001234"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="characters"
                value={ifsc}
                onChangeText={setIfsc}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.modalSubmitBtn,
                (!accountNumber || !ifsc) && { opacity: 0.6 },
              ]}
              onPress={handleVerifyBank}
              disabled={isVerifying || !accountNumber || !ifsc}
            >
              {isVerifying ? (
                <ActivityIndicator color={Colors.brandBlack} size="small" />
              ) : (
                <Text style={styles.modalSubmitBtnText}>
                  {language === 'ta' ? '₹1 சரிபார்ப்பை தொடங்கவும்' : 'Initiate ₹1 Verification'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.mainBg,
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: 40,
  },
  darkBalanceCard: {
    backgroundColor: Colors.brandDarkCard,
    borderRadius: Radius.xl,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#262626',
    ...Shadows.subtle,
  },
  darkBalanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  darkBalanceLabel: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: '#A3A3A3',
    letterSpacing: 0.6,
  },
  darkBalanceAmount: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.size['4xl'],
    fontWeight: Typography.weight.black,
    color: '#FFFFFF',
    marginTop: 6,
    marginBottom: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.success,
  },
  walletIconBox: {
    width: 50,
    height: 50,
    borderRadius: Radius.lg,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandBlack,
    borderRadius: Radius.md,
    height: 48,
    marginBottom: 14,
  },
  verifyActionText: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  statCardLabel: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  statCardValue: {
    fontFamily: FontFamilies.primary,
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.black,
    color: Colors.brandBlack,
    marginTop: 6,
  },
  bankDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    ...Shadows.subtle,
  },
  bankHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankCardTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.black,
    color: Colors.brandBlack,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  notVerifiedBadgeBg: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  verifiedBadgeBg: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  verificationBadgeText: {
    fontSize: 11,
    fontWeight: Typography.weight.bold,
  },
  bankDesc: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  verifyBankBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandBlack,
    borderRadius: Radius.md,
    height: 48,
  },
  verifyBankBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: '#FFFFFF',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },
  seeAllText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  receiptIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.black,
    color: Colors.brandBlack,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 240,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.black,
    color: Colors.brandBlack,
  },
  modalSubtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  modalInput: {
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.brandBlack,
    backgroundColor: Colors.secondaryBg,
  },
  modalSubmitBtn: {
    backgroundColor: Colors.brandYellow,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalSubmitBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.brandBlack,
  },
});
