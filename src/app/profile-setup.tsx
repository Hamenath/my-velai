import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { profileService } from '../services/profileService';
import { UserRole } from '../types';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; name?: string; role?: string }>();
  const { localities, currentLocality, language, setHasSeenOnboarding } = useApp();
  const { user, refreshProfile } = useAuth();

  const role = (params.role as UserRole) || 'customer';
  const verifiedPhone = params.phone || user?.phoneNumber || '+91 94432 10000';

  // Common Profile Fields
  const [displayName, setDisplayName] = useState(params.name || (role === 'worker' ? 'தொழிலாளி' : 'வாடிக்கையாளர்'));
  const [selectedLocalityId, setSelectedLocalityId] = useState(currentLocality.id);

  // Worker-Specific Fields
  const [selectedTrade, setSelectedTrade] = useState('Daily Wage Helper');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['General Assistance', 'Loading/Unloading']);
  const [experienceYears, setExperienceYears] = useState(2);
  const [dailyRate, setDailyRate] = useState('750');
  const [isAvailable, setIsAvailable] = useState(true);

  // Customer-Specific Fields
  const [preferredNeeds, setPreferredNeeds] = useState<string[]>(['Daily Helper', 'Electrical']);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedLocality =
    localities.find((l) => l.id === selectedLocalityId) || localities[0] || currentLocality;

  // Pre-configured trade categories for Madurai workers
  const workerTrades = [
    { id: 'cat-helper', name_en: 'Daily Wage Helper', name_ta: 'தினக்கூலி பணியாளர்', defaultRate: 700 },
    { id: 'cat-electrician', name_en: 'Electrician', name_ta: 'எலக்ட்ரீஷியன்', defaultRate: 850 },
    { id: 'cat-plumber', name_en: 'Plumber', name_ta: 'பிளம்பர்', defaultRate: 800 },
    { id: 'cat-mason', name_en: 'Mason', name_ta: 'மேஸ்திரி / கொத்தனார்', defaultRate: 900 },
    { id: 'cat-carpenter', name_en: 'Carpenter', name_ta: 'தச்சர்', defaultRate: 850 },
    { id: 'cat-painter', name_en: 'Painter', name_ta: 'பெயிண்டர்', defaultRate: 750 },
    { id: 'cat-cleaning', name_en: 'Deep Cleaner', name_ta: 'தூய்மைப் பணியாளர்', defaultRate: 650 },
  ];

  // Available skill chips based on selected trade
  const availableSkillsByTrade: Record<string, string[]> = {
    'Daily Wage Helper': ['General Assistance', 'Loading/Unloading', 'Material Shifting', 'Site Cleaning'],
    Electrician: ['House Wiring', 'Fan Fitting', 'Inverter Service', 'Switchboard Repair'],
    Plumber: ['Pipe Leakage', 'Tap Fitting', 'Motor Installation', 'Sanitary Work'],
    Mason: ['Brickwork', 'Plastering', 'Flooring', 'Wall Tiling'],
    Carpenter: ['Door Fitting', 'Furniture Repair', 'Modular Work', 'Lock Fixing'],
    Painter: ['Wall Painting', 'Primer Coating', 'Waterproofing', 'Wood Polishing'],
    'Deep Cleaner': ['Home Cleaning', 'Kitchen Cleaning', 'Water Tank Cleaning', 'Bathroom Deep Clean'],
  };

  const currentAvailableSkills = availableSkillsByTrade[selectedTrade] || availableSkillsByTrade['Daily Wage Helper'];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleNeed = (need: string) => {
    setPreferredNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleTradeSelect = (trade: typeof workerTrades[0]) => {
    setSelectedTrade(trade.name_en);
    setDailyRate(String(trade.defaultRate));
    const newTradeSkills = availableSkillsByTrade[trade.name_en] || [];
    setSelectedSkills(newTradeSkills.slice(0, 2));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!displayName.trim() || displayName.trim().length < 2) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.'
          : 'Please enter your full name.'
      );
      return;
    }

    if (!user) {
      setErrorMessage('User session not found. Please restart registration.');
      return;
    }

    setIsLoading(true);

    try {
      const activeTrade = workerTrades.find((t) => t.name_en === selectedTrade) || workerTrades[0];
      const rateNum = Number(dailyRate) || 750;

      await profileService.createProfile(user.uid, {
        displayName: displayName.trim(),
        phone: verifiedPhone,
        role,
        language,
        localityId: selectedLocality.id,
        locality_en: selectedLocality.name_en,
        locality_ta: selectedLocality.name_ta,
        trade_en: role === 'worker' ? activeTrade.name_en : undefined,
        trade_ta: role === 'worker' ? activeTrade.name_ta : undefined,
        categoryId: role === 'worker' ? activeTrade.id : undefined,
        categoryName_en: role === 'worker' ? activeTrade.name_en : undefined,
        categoryName_ta: role === 'worker' ? activeTrade.name_ta : undefined,
        dailyRate: role === 'worker' ? rateNum : undefined,
        hourlyRate: role === 'worker' ? Math.round(rateNum / 8) : undefined,
        skills: role === 'worker' ? selectedSkills : preferredNeeds,
        experienceYears: role === 'worker' ? experienceYears : undefined,
      });

      // Synchronize in-memory auth profile
      await refreshProfile();
      setHasSeenOnboarding(true);

      // Navigate to respective role home screen
      if (role === 'worker') {
        router.replace('/(worker)/home');
      } else {
        router.replace('/(customer)/home');
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (language === 'ta'
            ? 'சுயவிவரத்தை சேமிப்பதில் தோல்வி. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
            : 'Failed to create profile in Firestore. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor="#FFFFFF">
      <Header
        showLocation={false}
        title={language === 'ta' ? 'சுயவிவர அமைப்பு' : 'Complete Profile'}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Description */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>
              {role === 'worker'
                ? language === 'ta'
                  ? 'தொழிலாளர் சுயவிவரம்'
                  : 'Worker Profile Details'
                : language === 'ta'
                ? 'வாடிக்கையாளர் விவரங்கள்'
                : 'Customer Profile Details'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'ta'
                ? 'உங்கள் அனுபவத்தை சிறப்பாக்க தேவையான விவரங்களை உள்ளிடவும்.'
                : 'Just a few quick details to personalize your MY VELAI experience.'}
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Verified Mobile Card (Read-Only) */}
          <View style={styles.verifiedPhoneCard}>
            <View style={styles.phoneLeft}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
              <View>
                <Text style={styles.phoneLabel}>
                  {language === 'ta' ? 'சரிபார்க்கப்பட்ட கைபேசி எண்' : 'Verified Mobile'}
                </Text>
                <Text style={styles.phoneValue}>{verifiedPhone}</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color={Colors.success} />
              <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
            </View>
          </View>

          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {language === 'ta' ? 'முழு பெயர்' : 'Full Name'}{' '}
              <Text style={{ color: Colors.error }}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={18}
                color={Colors.textSecondary}
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Your Name"
                placeholderTextColor={Colors.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* City & Locality Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {language === 'ta' ? 'உங்கள் பகுதி (மதுரை)' : 'Your Locality (Madurai)'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.localityScroll}
            >
              {localities.map((loc) => {
                const isSelected = loc.id === selectedLocalityId;
                return (
                  <TouchableOpacity
                    key={loc.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedLocalityId(loc.id)}
                    style={[
                      styles.localityChip,
                      isSelected && styles.localityChipSelected,
                    ]}
                  >
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color={isSelected ? Colors.brandBlack : Colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.localityChipText,
                        isSelected && styles.localityChipTextSelected,
                      ]}
                    >
                      {language === 'ta' ? loc.name_ta : loc.name_en}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ============================================================= */}
          {/* WORKER-SPECIFIC SECTIONS                                      */}
          {/* ============================================================= */}
          {role === 'worker' ? (
            <>
              {/* Trade Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {language === 'ta' ? 'முக்கிய வேலை வகை' : 'Primary Trade / Work Category'}
                </Text>
                <View style={styles.tradeGrid}>
                  {workerTrades.map((t) => {
                    const isSelected = selectedTrade === t.name_en;
                    return (
                      <TouchableOpacity
                        key={t.id}
                        activeOpacity={0.7}
                        onPress={() => handleTradeSelect(t)}
                        style={[styles.tradeCard, isSelected && styles.tradeCardSelected]}
                      >
                        <Text
                          style={[
                            styles.tradeCardTitle,
                            isSelected && styles.tradeCardTitleSelected,
                          ]}
                        >
                          {language === 'ta' ? t.name_ta : t.name_en}
                        </Text>
                        <Text style={styles.tradeCardRate}>₹{t.defaultRate}/day</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Skill Chips */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {language === 'ta' ? 'திறன்கள் (Skills)' : 'Skills & Specializations'}
                </Text>
                <View style={styles.skillsRow}>
                  {currentAvailableSkills.map((skill, idx) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.7}
                        onPress={() => toggleSkill(skill)}
                        style={[styles.skillChip, isSelected && styles.skillChipSelected]}
                      >
                        <Ionicons
                          name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                          size={14}
                          color={isSelected ? Colors.brandBlack : Colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.skillChipText,
                            isSelected && styles.skillChipTextSelected,
                          ]}
                        >
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Experience & Daily Rate Row */}
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>
                    {language === 'ta' ? 'அனுபவம்' : 'Experience'}
                  </Text>
                  <View style={styles.experienceRow}>
                    {[1, 2, 3, 5].map((yr) => (
                      <TouchableOpacity
                        key={yr}
                        activeOpacity={0.7}
                        onPress={() => setExperienceYears(yr)}
                        style={[
                          styles.expPill,
                          experienceYears === yr && styles.expPillSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.expPillText,
                            experienceYears === yr && styles.expPillTextSelected,
                          ]}
                        >
                          {yr}+ Yrs
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>
                    {language === 'ta' ? 'தினக்கூலி (₹)' : 'Daily Rate (₹)'}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      value={dailyRate}
                      onChangeText={setDailyRate}
                    />
                  </View>
                </View>
              </View>

              {/* Availability Toggle */}
              <View style={styles.availabilityCard}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.availabilityTitle}>
                    {language === 'ta' ? 'இன்று வேலைக்கு தயார்' : 'Available for Work'}
                  </Text>
                  <Text style={styles.availabilitySub}>
                    {language === 'ta'
                      ? 'வாடிக்கையாளர்கள் உங்களை நேரடியாக அழைக்கலாம்'
                      : 'Customers can see you active and request service'}
                  </Text>
                </View>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: Colors.border, true: Colors.brandYellow }}
                  thumbColor={isAvailable ? Colors.brandBlack : '#FFFFFF'}
                />
              </View>
            </>
          ) : (
            /* ============================================================= */
            /* CUSTOMER-SPECIFIC SECTIONS                                    */
            /* ============================================================= */
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {language === 'ta' ? 'தேவையான சேவைகள்' : 'Services You Usually Need'}
              </Text>
              <View style={styles.skillsRow}>
                {[
                  'Daily Wage Helper',
                  'Electrician',
                  'Plumber',
                  'Mason',
                  'Painting',
                  'Carpentry',
                  'Cleaning',
                ].map((need, idx) => {
                  const isSelected = preferredNeeds.includes(need);
                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.7}
                      onPress={() => toggleNeed(need)}
                      style={[styles.skillChip, isSelected && styles.skillChipSelected]}
                    >
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                        size={14}
                        color={isSelected ? Colors.brandBlack : Colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.skillChipText,
                          isSelected && styles.skillChipTextSelected,
                        ]}
                      >
                        {need}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Complete Profile Button */}
          <View style={styles.submitSection}>
            <Button
              title={
                isLoading
                  ? language === 'ta'
                    ? 'சுயவிவரம் சேமிக்கப்படுகிறது...'
                    : 'Saving Profile...'
                  : language === 'ta'
                  ? 'சுயவிவரத்தை நிறைவுசெய்க'
                  : 'Complete & Enter App'
              }
              onPress={handleSubmit}
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              style={styles.submitBtn}
              textStyle={styles.submitBtnText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headingSection: {
    marginBottom: 20,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 22,
    fontWeight: '900',
    color: Colors.brandBlack,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    color: Colors.error,
    flex: 1,
    fontWeight: '600',
  },
  verifiedPhoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 20,
  },
  phoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  phoneLabel: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  phoneValue: {
    fontFamily: FontFamilies.primary,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  verifiedBadgeText: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: FontFamilies.primary,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  currencyPrefix: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
    marginRight: 6,
  },
  localityScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  localityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondaryBg,
  },
  localityChipSelected: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellowDark,
  },
  localityChipText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  localityChipTextSelected: {
    color: Colors.brandBlack,
  },
  tradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tradeCard: {
    width: '48%',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 12,
  },
  tradeCardSelected: {
    backgroundColor: '#FEFCE8',
    borderColor: Colors.brandYellow,
  },
  tradeCardTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  tradeCardTitleSelected: {
    color: Colors.brandBlack,
  },
  tradeCardRate: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondaryBg,
  },
  skillChipSelected: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellowDark,
  },
  skillChipText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  skillChipTextSelected: {
    color: Colors.brandBlack,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  experienceRow: {
    flexDirection: 'row',
    gap: 4,
  },
  expPill: {
    flex: 1,
    height: 50,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expPillSelected: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellowDark,
  },
  expPillText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  expPillTextSelected: {
    color: Colors.brandBlack,
  },
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 24,
    ...Shadows.subtle,
  },
  availabilityTitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  availabilitySub: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  submitSection: {
    marginTop: 8,
  },
  submitBtn: {
    height: 54,
    minHeight: 54,
    borderRadius: Radius.lg,
    backgroundColor: Colors.brandYellow,
  },
  submitBtnText: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
});
