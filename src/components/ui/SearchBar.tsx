import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../../constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  onSubmit,
  style,
  autoFocus = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={18} color={Colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.clearBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={17} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    height: 48,
    ...Shadows.subtle,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    fontFamily: FontFamilies.primary,
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 4,
  },
});
