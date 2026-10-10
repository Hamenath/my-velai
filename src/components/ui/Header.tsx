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

  return (
    <View style={styles.container}>
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
          <Logo size="sm" showSubtitle={false} />
        )}

        {title ? (
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        ) : showLocation ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLocationModalVisible(true)}
            style={styles.locationPill}
          >
            <Ionicons name="location-sharp" size={14} color={Colors.brandBlack} />
            <Text style={styles.locationText} numberOfLines={1}>
              {language === 'ta'
                ? `${currentLocality.name_ta}, மதுரை`
                : `${currentLocality.name_en}, Madurai`}
            </Text>
            <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <View style={styles.rightActions}>
          {showLanguageToggle && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleLanguage}
              style={styles.langPill}
            >
              <Text style={styles.langText}>
                {language === 'ta' ? 'EN' : 'தமிழ்'}
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
    paddingVertical: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  titleText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: '52%',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langPill: {
    backgroundColor: Colors.brandYellowSoft,
    borderWidth: 1,
    borderColor: Colors.brandYellowDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.round,
    marginRight: 8,
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.brandBlack,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
});
