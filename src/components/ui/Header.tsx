import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontFamilies } from '../../constants/colors';
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
      {/* Top Navigation Row */}
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
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
              activeOpacity={0.75}
              onPress={toggleLanguage}
              style={styles.langPill}
            >
              <Ionicons
                name="globe-outline"
                size={13}
                color={Colors.textPrimary}
                style={{ marginRight: 4 }}
              />
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
              <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
              <View style={styles.badgeDot} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Compact Location Selector */}
      {showLocation && !title && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setLocationModalVisible(true)}
          style={styles.locationBar}
        >
          <Ionicons
            name="location-outline"
            size={16}
            color={Colors.brandBlack}
            style={{ marginRight: 6 }}
          />
          <View style={styles.locationTexts}>
            <View style={styles.locationTitleRow}>
              <Text style={styles.locationMainText} numberOfLines={1}>
                {localityName}, {language === 'ta' ? 'மதுரை' : 'Madurai'}
              </Text>
              <Ionicons name="chevron-down" size={13} color={Colors.textSecondary} style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.landmarkSubtitle} numberOfLines={1}>
              {currentLocality.landmark} • {currentLocality.postalCode}
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
    minHeight: 38,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
    marginLeft: -4,
  },
  titleText: {
    fontFamily: FontFamilies.primary,
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.round,
    marginRight: 6,
  },
  langText: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
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
    paddingVertical: 7,
    marginTop: 8,
  },
  locationTexts: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationMainText: {
    fontFamily: FontFamilies.primary,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  landmarkSubtitle: {
    fontFamily: FontFamilies.primary,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  changeTag: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 6,
  },
  changeTagText: {
    fontFamily: FontFamilies.primary,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.brandBlack,
  },
});

export const AppHeader = Header;
