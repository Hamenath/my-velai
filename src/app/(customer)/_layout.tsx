import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

export default function CustomerTabsLayout() {
  const { t } = useApp();
  const insets = useSafeAreaInsets();

  const isWeb = Platform.OS === 'web';
  const bottomInset = insets.bottom;
  // Adaptive safe area calculation: ensures labels sit completely above Android gesture/button navigation and iOS home indicator
  const bottomPadding = isWeb ? 4 : (bottomInset > 0 ? bottomInset : 8);
  const tabHeight = isWeb ? 62 : 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.brandBlack,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: tabHeight,
          paddingTop: 4,
          paddingBottom: bottomPadding,
          elevation: 4,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 1,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamilies.primary,
          fontSize: 10.5,
          fontWeight: '700',
          letterSpacing: 0.1,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabHome'),
          tabBarLabel: t('tabHome'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={21}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('tabSearch'),
          tabBarLabel: t('tabSearch'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={21}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="post-job"
        options={{
          title: t('tabPost'),
          tabBarLabel: t('tabPost'),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={23}
              color={focused ? Colors.brandBlack : Colors.brandYellowDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('tabBookings'),
          tabBarLabel: t('tabBookings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={21}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabProfile'),
          tabBarLabel: t('tabProfile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={21}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

