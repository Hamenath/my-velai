import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

export default function WorkerTabsLayout() {
  const { t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brandBlack,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 82 : 62,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.03,
          shadowRadius: 2,
        },
        tabBarIconStyle: {
          marginBottom: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabHome'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'briefcase' : 'briefcase-outline'}
              size={20}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: t('tabJobs'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={20}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: t('tabApplications'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'document-text' : 'document-text-outline'}
              size={20}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: t('tabEarnings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'wallet' : 'wallet-outline'}
              size={20}
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
              size={20}
              color={focused ? Colors.brandBlack : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
