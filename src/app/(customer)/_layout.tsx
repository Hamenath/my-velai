import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

export default function CustomerTabsLayout() {
  const { t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brandBlack,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabHome'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('tabSearch'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={22}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="post-job"
        options={{
          title: t('tabPost'),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={26}
              color={Colors.brandYellowDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('tabBookings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={22}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabProfile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
