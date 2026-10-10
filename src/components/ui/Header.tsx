import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { LocationModal } from './LocationModal';

interface HeaderProps {
  showLocation?: boolean;
  showLanguageToggle?: boolean;
  title?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  showLocation = true,
  showLanguageToggle = true,
  title,
  onBack,
  rightAction,
}) => {
  const { currentLocality, language, toggleLanguage } = useApp();
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const localityName = language === 'ta' ? currentLocality.name_ta : currentLocality.name_en;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <Logo size="md" showSubtitle={false} />
        )}

        {title && (
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        )}

        {!title && <View style={{ flex: 1 }} />}

        <View style={styles.rightActions}>
          {showLanguageToggle && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleLanguage}
              style={styles.langPill}
            >
              <Ionicons name="language" size={13} color={Colors.brandBlack} style={{ marginRight: 4 }} />
              <Text style={styles.langText}>
                {language === 'ta' ? 'English' : 'தமிழ்'}
              </Text>
            </TouchableOpacity>
          )}

          {rightAction ? (
            rightAction
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.iconBtn}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              <View style={styles.badgeDot} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Prominent Consumer-App Location Bar */}
      {showLocation && !title && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setLocationModalVisible(true)}
          style={styles.locationBar}
        >
          <View style={styles.locationPinBox}>
            <Ionicons name="location" size={16} color={Colors.brandBlack} />
          </View>
          <View style={styles.locationTexts}>
            <View style={styles.locationTitleRow}>
              <Text style={styles.locationMainText} numberOfLines={1}>
                {localityName}, {language === 'ta' ? 'மதுரை' : 'Madurai'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textPrimary} style={{ marginLeft: 3 }} />
            </View>
            <Text style={styles.landmarkSubtitle} numberOfLines={1}>
              {currentLocality.landmark} ({currentLocality.postalCode})
            </Text>
          </View>
          <View style={styles.changeTag}>
            <Text style={styles.changeTagText}>
              {language === 'ta' ? 'மாற்றுக' : 'Change'}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1,
    borderColor: Colors.brandYellowDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.round,
    marginRight: 8,
  },
  langText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  locationPinBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brandYellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  locationTexts: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationMainText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  landmarkSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  changeTag: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 6,
  },
  changeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
});
