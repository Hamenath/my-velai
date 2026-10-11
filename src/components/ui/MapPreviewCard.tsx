import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

interface MapPreviewCardProps {
  onPress?: () => void;
  jobCount?: number;
  localityName?: string;
  style?: ViewStyle;
}

export const MapPreviewCard: React.FC<MapPreviewCardProps> = ({
  onPress,
  jobCount = 5,
  localityName,
  style,
}) => {
  const { currentLocality, language } = useApp();
  const activeLocality = localityName || (language === 'ta' ? currentLocality.name_ta : currentLocality.name_en);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.container, style]}
    >
      {/* Map Graphic Canvas Simulation */}
      <View style={styles.mapCanvas}>
        {/* Stylized Road Lines */}
        <View style={styles.roadHorizontal} />
        <View style={styles.roadDiagonal} />
        <View style={styles.roadVertical} />

        {/* Map Location Pins */}
        <View style={[styles.mapPin, { top: 28, left: '30%' }]}>
          <View style={styles.pinBubble}>
            <Ionicons name="location" size={20} color={Colors.brandYellowDark} />
          </View>
        </View>

        <View style={[styles.mapPin, { top: 45, right: '35%' }]}>
          <View style={styles.pinBubble}>
            <Ionicons name="location" size={24} color={Colors.error} />
          </View>
        </View>

        <View style={[styles.mapPin, { bottom: 35, left: '48%' }]}>
          <View style={styles.userDotPulse} />
          <View style={styles.userDot} />
        </View>

        {/* Floating Tag: Nearby Jobs Count */}
        <View style={styles.floatingBadge}>
          <Ionicons name="flame" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.floatingBadgeText}>
            {jobCount} {language === 'ta' ? 'அருகிலுள்ள வேலைகள்' : 'Nearby Jobs'}
          </Text>
        </View>

        {/* GPS Crosshair Target Button */}
        <View style={styles.gpsButton}>
          <Ionicons name="locate" size={18} color={Colors.textPrimary} />
        </View>

        {/* Bottom Location Tag */}
        <View style={styles.bottomTag}>
          <Ionicons name="map-outline" size={12} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.bottomTagText}>
            {activeLocality}, Madurai • {jobCount} {language === 'ta' ? 'வாய்ப்புகள்' : 'Opportunities'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  mapCanvas: {
    height: 180,
    backgroundColor: '#E8ECEF',
    position: 'relative',
    overflow: 'hidden',
  },
  roadHorizontal: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  roadDiagonal: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    left: '40%',
    width: 14,
    backgroundColor: '#FFFFFF',
    opacity: 0.75,
    transform: [{ rotate: '35deg' }],
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '25%',
    width: 10,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.round,
    padding: 2,
    ...Shadows.subtle,
  },
  userDotPulse: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
  },
  userDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.info,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  floatingBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C', // Clean energetic orange badge from screenshot
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.round,
    ...Shadows.card,
  },
  floatingBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gpsButton: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: Radius.round,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  bottomTag: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  bottomTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
