import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
// import { Image } from 'expo-image';
import { Image } from 'react-native';
import { Article } from '@/services/newsApi';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useNewsContext } from '@/context/NewsContext';
import { LoadingSpinner } from './LoadingSpinner';

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQf3fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ';

export function NewsCard({ article, onPress }: { article: Article; onPress?: () => void }) {
    const { addBookmark, removeBookmark, isBookmarked } = useNewsContext();
    const bookmarked = isBookmarked(article.url);
    const [isLoading, setIsLoading] = useState(true);

    const toggleBookmark = () => {
        if (bookmarked) {
            removeBookmark(article.url);
        } else {
            addBookmark(article);
        }
    };

    return (
        <Pressable onPress={onPress} className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden mb-4 shadow-sm border border-slate-100 dark:border-[#222] mx-4 active:scale-95 transition-transform relative">
            <Pressable onPress={toggleBookmark} className="absolute top-2 right-2 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
                <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={20} color={bookmarked ? "#2563eb" : "#94a3b8"} />
            </Pressable>

            {article.urlToImage && (
                <View className="w-full h-48 relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                    {/* Show Spinner while Loading */}
                    {isLoading && <LoadingSpinner />}

                    <Image
                        source={{ uri: article.urlToImage }}
                        className="w-full h-48"
                        onLoadStart={() => setIsLoading(true)}
                        onLoadEnd={() => setIsLoading(false)}
                    />
                </View>
            )}
            <View className="p-4">
                <Text className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-2">
                    {article.source.name}
                </Text>
                <Text className="text-lg font-semibold text-slate-900 dark:text-white mb-2 leading-7" numberOfLines={2}>
                    {article.title}
                </Text>
                <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-xs text-slate-500 dark:text-slate-400 flex-1 mr-2" numberOfLines={1}>
                        {article.author || 'Unknown Author'}
                    </Text>
                    <Text className="text-xs text-slate-400 dark:text-slate-500">
                        {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : ''}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
