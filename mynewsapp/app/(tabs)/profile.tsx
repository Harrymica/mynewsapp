import React from 'react';
import { View, Text, SafeAreaView, Pressable, Switch, ScrollView } from 'react-native';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(auth)/sign-in');
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="px-4 pt-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile</Text>

                    <View className="flex-row items-center">
                        <View className="h-20 w-20 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-200 mr-4">
                            {user?.imageUrl ? (
                                <Image source={{ uri: user.imageUrl }} className="h-full w-full" />
                            ) : (
                                <View className="h-full w-full items-center justify-center bg-blue-600">
                                    <Text className="text-white font-bold text-2xl">{user?.firstName?.[0] || 'U'}</Text>
                                </View>
                            )}
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-slate-900 dark:text-white">
                                {user?.fullName || user?.firstName || 'User'}
                            </Text>
                            <Text className="text-slate-500">
                                {user?.primaryEmailAddress?.emailAddress}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="px-4 py-6">
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Settings</Text>

                    <View className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden">
                        <Pressable className="flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 active:bg-slate-100 dark:active:bg-slate-700">
                            <View className="flex-row items-center">
                                <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                                    <Ionicons name="notifications-outline" size={20} color="#2563eb" />
                                </View>
                                <Text className="text-slate-700 dark:text-slate-200 font-medium">Notifications</Text>
                            </View>
                            <Switch value={true} trackColor={{ true: '#2563eb', false: '#cbd5e1' }} />
                        </Pressable>

                        <Pressable className="flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 active:bg-slate-100 dark:active:bg-slate-700">
                            <View className="flex-row items-center">
                                <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3">
                                    <Ionicons name="moon-outline" size={20} color="#9333ea" />
                                </View>
                                <Text className="text-slate-700 dark:text-slate-200 font-medium">Dark Mode</Text>
                            </View>
                            <Text className="text-slate-400 text-sm">System</Text>
                        </Pressable>

                        <Pressable className="flex-row items-center justify-between p-4 active:bg-slate-100 dark:active:bg-slate-700" onPress={() => router.push('/(tabs)/bookmarks')}>
                            <View className="flex-row items-center">
                                <View className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg mr-3">
                                    <Ionicons name="bookmark-outline" size={20} color="#d97706" />
                                </View>
                                <Text className="text-slate-700 dark:text-slate-200 font-medium">Bookmarks</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                        </Pressable>
                    </View>

                    <Pressable onPress={handleSignOut} className="mt-8 flex-row items-center justify-center p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 active:opacity-80">
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" className="mr-2" />
                        <Text className="text-red-600 dark:text-red-400 font-bold ml-2">Sign Out</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
