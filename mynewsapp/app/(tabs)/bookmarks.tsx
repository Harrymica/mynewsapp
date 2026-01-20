import React from 'react';
import { View, Text, SafeAreaView, ScrollView, RefreshControl, Image, Pressable } from 'react-native';
import { useNewsContext } from '@/context/NewsContext'; // CHANGED
import { NewsCard } from '@/components/NewsCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookmarksScreen() {
    const { bookmarks, removeBookmark } = useNewsContext(); // CHANGED
    const router = useRouter();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />}
            >
                <View className="px-4 pt-4 pb-2">
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        Saved Articles
                    </Text>
                    <Text className="text-slate-500 text-sm mb-6">Read them later, anytime.</Text>
                </View>

                {bookmarks.length === 0 ? (
                    <View className="items-center justify-center mt-20 px-10">
                        <View className="bg-slate-100 dark:bg-[#111] p-6 rounded-full mb-4">
                            <Ionicons name="bookmark-outline" size={48} color="#cbd5e1" />
                        </View>
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">No bookmarks yet</Text>
                        <Text className="text-center text-slate-500 mb-6">
                            Save articles you want to read later by tapping the bookmark icon on any news card.
                        </Text>
                        <Pressable onPress={() => router.push('/(tabs)')} className="bg-blue-600 px-6 py-3 rounded-xl">
                            <Text className="text-white font-bold">Go to Feed</Text>
                        </Pressable>
                    </View>
                ) : (
                    bookmarks.map((article, index) => (
                        <View key={index} className="relative">
                            <NewsCard article={article} />
                            <Pressable
                                onPress={() => removeBookmark(article.url)}
                                className="absolute top-2 right-6 p-2 bg-white/50 backdrop-blur-md rounded-full"
                            >
                                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                            </Pressable>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
