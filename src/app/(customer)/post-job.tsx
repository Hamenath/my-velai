import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/ui/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { JobType, WageType } from '../../types';

export default function PostJobScreen() {
  const router = useRouter();
  const { categories, localities, currentLocality, addJob, t, language } = useApp();

  // Form State
  const [title, setTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id);
  const [selectedLocalityId, setSelectedLocalityId] = useState(currentLocality.id);
  const [landmark, setLandmark] = useState('');
  const [jobType, setJobType] = useState<JobType>('daily_wage');
  const [wageRate, setWageRate] = useState('800');
  const [wageType, setWageType] = useState<WageType>('per_day');
  const [workersNeeded, setWorkersNeeded] = useState('2');
  const [date, setDate] = useState(language === 'ta' ? 'இன்று' : 'Today');
  const [time, setTime] = useState('8:30 AM - 5:00 PM');
  const [description, setDescription] = useState('');

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!title.trim()) {
      errs.title = t('fieldRequired');
    }
    if (!landmark.trim()) {
      errs.landmark = t('fieldRequired');
    }
    const numWage = Number(wageRate);
    if (!wageRate || isNaN(numWage) || numWage <= 0) {
      errs.wageRate = t('invalidAmount');
    }
    const numWorkers = Number(workersNeeded);
    if (!workersNeeded || isNaN(numWorkers) || numWorkers <= 0) {
      errs.workersNeeded = t('fieldRequired');
    }
    if (!description.trim()) {
      errs.description = t('fieldRequired');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert(
        language === 'ta' ? 'விவரங்களை சரிபார்க்கவும்' : 'Incomplete Form',
        language === 'ta'
          ? 'தயவுசெய்து அனைத்து தேவையான விவரங்களையும் உள்ளிடவும்.'
          : 'Please fill all required fields before posting.'
      );
      return;
    }

    const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
    const selectedLocality = localities.find((l) => l.id === selectedLocalityId) || currentLocality;

    const newJob = addJob({
      title_en: title,
      title_ta: title,
      categoryId: selectedCategoryId,
      categoryName_en: selectedCategory.name_en,
      categoryName_ta: selectedCategory.name_ta,
      customerName: language === 'ta' ? 'என் கணக்கு' : 'My Account',
      customerPhone: '+91 94432 10000',
      localityId: selectedLocality.id,
      locality_en: selectedLocality.name_en,
      locality_ta: selectedLocality.name_ta,
      landmark,
      jobType,
      wageRate: Number(wageRate),
      wageType,
      date,
      time,
      description_en: description,
      description_ta: description,
      workersNeeded: Number(workersNeeded),
      isUrgent: jobType === 'urgent',
    });

    setCreatedJobId(newJob.id);
    setSuccessModalVisible(true);
  };

  const handleModalClose = () => {
    setSuccessModalVisible(false);
    if (createdJobId) {
      router.push(`/job/${createdJobId}` as any);
    } else {
      router.push('/(customer)/home');
    }
  };

  return (
    <ScreenWrapper scrollable backgroundColor={Colors.secondaryBg}>
      <Header showLocation={false} title={t('postJobTitle')} />

      <View style={styles.formContainer}>
        {/* Intro */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>{t('postJobTitle')}</Text>
          <Text style={styles.introSub}>{t('postJobSubtitle')}</Text>
        </View>

        {/* Job Title */}
        <Input
          label={t('jobTitleLabel') + ' *'}
          placeholder={t('jobTitlePlaceholder')}
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        {/* Category Selector */}
        <Text style={styles.sectionLabel}>{t('categoryLabel')} *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={language === 'ta' ? cat.name_ta.split(' ')[0] : cat.name_en}
              selected={selectedCategoryId === cat.id}
              onPress={() => setSelectedCategoryId(cat.id)}
            />
          ))}
        </ScrollView>

        {/* Locality Selector */}
        <Text style={styles.sectionLabel}>{t('localityLabel')} *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {localities.map((loc) => (
            <Chip
              key={loc.id}
              label={language === 'ta' ? loc.name_ta : loc.name_en}
              selected={selectedLocalityId === loc.id}
              onPress={() => setSelectedLocalityId(loc.id)}
            />
          ))}
        </ScrollView>

        {/* Street / Landmark */}
        <Input
          label={t('landmarkLabel') + ' *'}
          placeholder={t('landmarkPlaceholder')}
          value={landmark}
          onChangeText={setLandmark}
          error={errors.landmark}
        />

        {/* Job Type Selector */}
        <Text style={styles.sectionLabel}>{t('jobTypeLabel')}</Text>
        <View style={styles.typesRow}>
          {[
            { id: 'daily_wage', label_en: 'Daily Wage', label_ta: 'தினக்கூலி' },
            { id: 'urgent', label_en: 'Urgent', label_ta: 'அவசரம்' },
            { id: 'part_time', label_en: 'Part-Time', label_ta: 'பகுதி நேரம்' },
            { id: 'one_time', label_en: 'One-Time Task', label_ta: 'ஒற்றை வேலை' },
          ].map((typeItem) => (
            <Chip
              key={typeItem.id}
              label={language === 'ta' ? typeItem.label_ta : typeItem.label_en}
              selected={jobType === typeItem.id}
              onPress={() => setJobType(typeItem.id as JobType)}
            />
          ))}
        </View>

        {/* Wage & Wage Type Row */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              label={t('wageRateLabel') + ' *'}
              placeholder="800"
              keyboardType="numeric"
              value={wageRate}
              onChangeText={setWageRate}
              error={errors.wageRate}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.sectionLabel}>{t('wageTypeLabel')}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
              <TouchableOpacity
                onPress={() => setWageType('per_day')}
                style={[
                  styles.wageTypeBtn,
                  wageType === 'per_day' && styles.wageTypeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.wageTypeText,
                    wageType === 'per_day' && styles.wageTypeTextActive,
                  ]}
                >
                  {t('perDay')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setWageType('fixed')}
                style={[
                  styles.wageTypeBtn,
                  wageType === 'fixed' && styles.wageTypeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.wageTypeText,
                    wageType === 'fixed' && styles.wageTypeTextActive,
                  ]}
                >
                  {t('fixedPrice')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Workers Needed & Date Row */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Input
              label={t('workersNeededLabel') + ' *'}
              placeholder="1"
              keyboardType="numeric"
              value={workersNeeded}
              onChangeText={setWorkersNeeded}
              error={errors.workersNeeded}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Input
              label={t('dateLabel')}
              placeholder="Today / இன்று"
              value={date}
              onChangeText={setDate}
            />
          </View>
        </View>

        {/* Timing */}
        <Input
          label={t('timeLabel')}
          placeholder={t('timePlaceholder')}
          value={time}
          onChangeText={setTime}
        />

        {/* Description */}
        <Input
          label={t('descLabel') + ' *'}
          placeholder={t('descPlaceholder')}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        {/* Submit Button */}
        <Button
          title={t('submitJobPost')}
          onPress={handleSubmit}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.submitBtn}
        />
      </View>

      {/* Post Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={32} color={Colors.success} />
            </View>
            <Text style={styles.modalSuccessTitle}>{t('postSuccess')}</Text>
            <Text style={styles.modalSuccessDesc}>{t('postSuccessDesc')}</Text>

            <Button
              title={language === 'ta' ? 'பதிவைக் காண்க' : 'View Job Post'}
              onPress={handleModalClose}
              variant="primary"
              size="md"
              fullWidth
              style={{ marginTop: 14 }}
            />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  introSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  chipsScroll: {
    paddingBottom: 10,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  wageTypeBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wageTypeBtnActive: {
    backgroundColor: Colors.brandYellow,
    borderColor: Colors.brandYellow,
  },
  wageTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  wageTypeTextActive: {
    color: Colors.brandBlack,
    fontWeight: '700',
  },
  submitBtn: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    ...Shadows.card,
  },
  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.successBorder,
  },
  modalSuccessTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSuccessDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
