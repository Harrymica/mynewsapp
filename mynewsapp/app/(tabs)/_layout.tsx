import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Header } from '@/components/Header';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        header: () => <Header />,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 0,
            height: 60,
            borderRadius: 30,
            backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
          },
          default: {
            height: 60,
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
            borderTopWidth: 0,
            elevation: 10, // Shadow for android
            marginBottom: 0,
          },
        }),
        tabBarItemStyle: {
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          display: 'none', // Modern apps often hide labels or minimal
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center h-10 w-10 rounded-full ${focused ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}>
              <Ionicons size={22} name={focused ? 'home' : 'home-outline'} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center h-10 w-10 rounded-full ${focused ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}>
              <Ionicons size={22} name={focused ? 'search' : 'search-outline'} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center h-10 w-10 rounded-full ${focused ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}>
              <Ionicons size={22} name={focused ? 'bookmark' : 'bookmark-outline'} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center h-10 w-10 rounded-full ${focused ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}>
              <Ionicons size={22} name={focused ? 'person' : 'person-outline'} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
