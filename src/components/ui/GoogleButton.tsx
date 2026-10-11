import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows, FontFamilies } from '../../constants/colors';

interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  loadingText?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
  title = 'Continue with Google',
  loadingText = 'Connecting to Google...',
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={loading ? loadingText : title}
      style={[
        styles.button,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <View style={styles.contentRow}>
          <ActivityIndicator size="small" color={Colors.brandBlack} style={styles.spinner} />
          <Text style={[styles.title, textStyle]}>{loadingText}</Text>
        </View>
      ) : (
        <View style={styles.contentRow}>
          {/* Official Google Icon badge */}
          <View style={styles.iconWrapper}>
            <Ionicons name="logo-google" size={20} color="#EA4335" />
          </View>
          <Text style={[styles.title, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    minHeight: 54,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    ...Shadows.subtle,
  },
  disabled: {
    opacity: 0.65,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.brandBlack,
    letterSpacing: 0.2,
  },
  spinner: {
    marginRight: 10,
  },
});
