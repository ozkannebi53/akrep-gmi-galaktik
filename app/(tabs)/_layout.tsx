import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BG = '#0D0025';
const ACTIVE = '#C084FC';
const INACTIVE = '#4B3B6B';
const TAB_H = 60;

function TabIcon({
  name,
  color,
  library = 'feather',
}: {
  name: string;
  color: string;
  library?: 'feather' | 'mci' | 'ionicons';
}) {
  if (library === 'mci') {
    return <MaterialCommunityIcons name={name as any} size={22} color={color} />;
  }
  if (library === 'ionicons') {
    return <Ionicons name={name as any} size={22} color={color} />;
  }
  return <Feather name={name as any} size={22} color={color} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const extraBottom = Platform.OS === 'web' ? 34 : 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          height: TAB_H + insets.bottom + extraBottom,
          paddingBottom: insets.bottom + extraBottom,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: 'Inter_600SemiBold',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'AKREP ÜSÜ',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="koleksiyon"
        options={{
          title: 'KOLEKSİYON',
          tabBarIcon: ({ color }) => (
            <TabIcon name="grid" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ansiklopedi"
        options={{
          title: 'ANSİKLOPEDİ',
          tabBarIcon: ({ color }) => (
            <TabIcon name="book-open" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="liderlik"
        options={{
          title: 'LİDERLİK',
          tabBarIcon: ({ color }) => (
            <TabIcon name="bar-chart-2" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ayarlar"
        options={{
          title: 'AYARLAR',
          tabBarIcon: ({ color }) => (
            <TabIcon name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
