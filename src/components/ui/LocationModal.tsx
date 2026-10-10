import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { Locality } from '../../types';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
}) => {
  const { localities, currentLocality, setCurrentLocality, language } = useApp();
  const [search, setSearch] = useState('');

  const filteredLocalities = localities.filter((loc) => {
    const q = search.toLowerCase();
    return (
      loc.name_en.toLowerCase().includes(q) ||
      loc.name_ta.toLowerCase().includes(q) ||
      loc.landmark.toLowerCase().includes(q) ||
      loc.postalCode.includes(q)
    );
  });

  const handleSelect = (loc: Locality) => {
    setCurrentLocality(loc);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>
                    {language === 'ta' ? 'மதுரை பகுதி தேர்வு' : 'Select Madurai Area'}
                  </Text>
                  <Text style={styles.subtitle}>
                    {language === 'ta'
                      ? 'அருகிலுள்ள வேலைகள் மற்றும் தொழிலாளர்களைக் காணவும்'
                      : 'Find jobs and workers near your exact area'}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Search */}
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={Colors.textSecondary} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={
                    language === 'ta'
                      ? 'பகுதி பெயர் அல்லது அஞ்சல் குறியீடு...'
                      : 'Search area or pin code...'
                  }
                  placeholderTextColor={Colors.textMuted}
                  style={styles.searchInput}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Localities list */}
              <FlatList
                data={filteredLocalities}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => {
                  const isSelected = item.id === currentLocality.id;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleSelect(item)}
                      style={[
                        styles.localityRow,
                        isSelected && styles.selectedRow,
                      ]}
                    >
                      <View style={styles.iconCircle}>
                        <Ionicons
                          name="location"
                          size={18}
                          color={isSelected ? Colors.brandBlack : Colors.textSecondary}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.localityName}>
                          {language === 'ta' ? item.name_ta : item.name_en}{' '}
                          <Text style={styles.pinCode}>({item.postalCode})</Text>
                        </Text>
                        <Text style={styles.landmarkText} numberOfLines={1}>
                          {item.landmark}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={Colors.brandYellowDark}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  localityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  selectedRow: {
    backgroundColor: Colors.brandYellowSoft,
    borderColor: Colors.brandYellow,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  localityName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pinCode: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  landmarkText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
