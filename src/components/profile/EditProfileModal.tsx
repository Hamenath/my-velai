import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserProfileDoc } from '../../types';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfileDoc | null;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  profile,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {visible ? (
        <EditProfileContent
          key={profile?.uid || 'edit-profile'}
          profile={profile}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
};

const EditProfileContent: React.FC<{
  profile: UserProfileDoc | null;
  onClose: () => void;
}> = ({ profile, onClose }) => {
  const { localities, language, t } = useApp();
  const { user, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(
    profile?.displayName || (language === 'ta' ? 'மதுரை பயனர்' : 'Madurai User')
  );
  const [phone, setPhone] = useState(profile?.phone || '');
  const [localityId, setLocalityId] = useState(
    profile?.localityId || localities[0]?.id || 'loc-mattuthavani'
  );
  const [trade, setTrade] = useState(
    language === 'ta'
      ? profile?.trade_ta || profile?.trade_en || 'பொது பணியாளர்'
      : profile?.trade_en || 'General Worker'
  );
  const [dailyRate, setDailyRate] = useState(
    profile?.dailyRate ? String(profile.dailyRate) : '750'
  );
  const [hourlyRate, setHourlyRate] = useState(
    profile?.hourlyRate ? String(profile.hourlyRate) : '120'
  );
  const [skillsStr, setSkillsStr] = useState(profile?.skills?.join(', ') || '');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isWorker = profile ? profile.role === 'worker' : false;

  const handleSave = async () => {
    setErrorMessage(null);

    // Security check: Must be signed in to write private profile data
    if (!user) {
      setErrorMessage(
        language === 'ta'
          ? 'அங்கீகாரம் தேவை: சுயவிவரத்தை மாற்ற நீங்கள் உள்நுழைய வேண்டும். விருந்தினர் பயன்முறையில் கிளவுட் மாற்றம் நிராகரிக்கப்பட்டது (Permission Denied).'
          : 'Permission Denied: You must be authenticated to write private profile data. Guest write operations are blocked by security rules.'
      );
      return;
    }

    // Validation
    const trimmedName = displayName.trim();
    if (trimmedName.length < 2) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து சரியான பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துகள்).'
          : 'Please enter a valid name (at least 2 characters).'
      );
      return;
    }

    const trimmedPhone = phone.trim();
    const cleanPhoneDigits = trimmedPhone.replace(/\D/g, '');
    if (trimmedPhone && cleanPhoneDigits.length < 10) {
      setErrorMessage(
        language === 'ta'
          ? 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    const selectedLocality = localities.find((l) => l.id === localityId) || localities[0];

    let numDailyRate = Number(dailyRate);
    let numHourlyRate = Number(hourlyRate);
    if (isWorker) {
      if (isNaN(numDailyRate) || numDailyRate <= 0) {
        setErrorMessage(
          language === 'ta'
            ? 'தயவுசெய்து சரியான தினக்கூலியை உள்ளிடவும்.'
            : 'Please enter a valid daily wage rate.'
        );
        return;
      }
      if (isNaN(numHourlyRate) || numHourlyRate <= 0) {
        numHourlyRate = Math.round(numDailyRate / 8);
      }
    }

    setIsSaving(true);
    try {
      const skillsArray = skillsStr
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await updateProfile({
        displayName: trimmedName,
        phone: trimmedPhone || null,
        localityId: selectedLocality.id,
        locality_en: selectedLocality.name_en,
        locality_ta: selectedLocality.name_ta,
        trade_en: isWorker ? trade.trim() : undefined,
        trade_ta: isWorker ? trade.trim() : undefined,
        dailyRate: isWorker ? numDailyRate : undefined,
        hourlyRate: isWorker ? numHourlyRate : undefined,
        skills: isWorker ? skillsArray : undefined,
      });

      Alert.alert(
        language === 'ta' ? 'வெற்றி' : 'Success',
        language === 'ta'
          ? 'சுயவிவர மாற்றங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன!'
          : 'Profile updated successfully!'
      );
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.overlay}
    >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>
                {language === 'ta' ? 'சுயவிவரத்தைத் திருத்து' : 'Edit Profile'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {language === 'ta'
                  ? 'உங்கள் விவரங்களை புதுப்பிக்கவும்'
                  : 'Update your official profile details'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              disabled={isSaving}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Display Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {language === 'ta' ? 'முழு பெயர்' : 'Full Name'} *
              </Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder={language === 'ta' ? 'எ.கா. முருகன் கருப்பையா' : 'e.g. Murugan Karuppiah'}
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
              />
            </View>

            {/* Phone Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {language === 'ta' ? 'மொபைல் எண்' : 'Mobile Number'} *
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="e.g. +91 94432 10000"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            {/* Locality Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {language === 'ta' ? 'மதுரை பகுதி (Locality)' : 'Madurai Locality'} *
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.localityScroll}>
                {localities.map((loc) => {
                  const selected = loc.id === localityId;
                  return (
                    <TouchableOpacity
                      key={loc.id}
                      onPress={() => setLocalityId(loc.id)}
                      style={[styles.localityChip, selected && styles.localityChipSelected]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.localityChipText, selected && styles.localityChipTextSelected]}>
                        {language === 'ta' ? loc.name_ta : loc.name_en}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Worker Specific Fields */}
            {isWorker ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    {language === 'ta' ? 'தொழில் பெயர் / வகை' : 'Trade / Title'}
                  </Text>
                  <TextInput
                    value={trade}
                    onChangeText={setTrade}
                    placeholder={language === 'ta' ? 'எ.கா. எலக்ட்ரீஷியன் & வயரிங்' : 'e.g. Electrician & Wiring'}
                    placeholderTextColor={Colors.textMuted}
                    style={styles.input}
                  />
                </View>

                <View style={styles.rowFields}>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>
                      {language === 'ta' ? 'தினக்கூலி (₹)' : 'Daily Wage (₹)'} *
                    </Text>
                    <TextInput
                      value={dailyRate}
                      onChangeText={setDailyRate}
                      placeholder="850"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>

                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>
                      {language === 'ta' ? 'மணிநேர கூலி (₹)' : 'Hourly Rate (₹)'}
                    </Text>
                    <TextInput
                      value={hourlyRate}
                      onChangeText={setHourlyRate}
                      placeholder="150"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    {language === 'ta' ? 'திறன்கள் (கமாவால் பிரிக்கவும்)' : 'Skills (comma separated)'}
                  </Text>
                  <TextInput
                    value={skillsStr}
                    onChangeText={setSkillsStr}
                    placeholder={
                      language === 'ta'
                        ? 'வீட்டு வயரிங், மின்விசிறி சரிசெய்தல், MCB'
                        : 'House Wiring, Fan Repair, MCB Panels'
                    }
                    placeholderTextColor={Colors.textMuted}
                    style={styles.input}
                  />
                </View>
              </>
            ) : null}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onClose}
              disabled={isSaving}
              style={styles.cancelBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>
                {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.brandBlack} />
              ) : (
                <Text style={styles.saveBtnText}>
                  {t('saveChanges')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    ...Shadows.lifted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorBg,
    borderColor: Colors.errorBorder,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 10,
    borderRadius: Radius.md,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    flex: 1,
    fontWeight: '600',
  },
  scroll: {
    maxHeight: 460,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  localityScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  localityChip: {
    backgroundColor: Colors.secondaryBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.round,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  localityChipSelected: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellowDark,
  },
  localityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  localityChipTextSelected: {
    color: Colors.brandBlack,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandYellow,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
});
