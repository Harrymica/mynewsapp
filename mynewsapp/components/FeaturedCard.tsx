import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
// import { Image } from 'expo-image';
import { Image } from "react-native";
import { Article } from '@/services/newsApi';
import { LinearGradient } from 'expo-linear-gradient';
import { LoadingSpinner } from './LoadingSpinner';

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQf3fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ';

export function FeaturedCard({ article, onPress }: { article: Article; onPress?: () => void }) {
    const [isLoading, setIsLoading] = useState(true);

    if (!article.urlToImage) return null;

    return (
        <Pressable onPress={onPress} className="w-full h-80 rounded-[32px] overflow-hidden mb-8 relative shadow-lg shadow-blue-900/20 active:opacity-90 bg-slate-200 dark:bg-slate-800">
            {/* Show Spinner while Loading */}
            {isLoading && <LoadingSpinner />}

            <Image
                source={{ uri: article.urlToImage }}
                className="absolute inset-0 w-full h-full"
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
            />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                className="absolute inset-0 h-full w-full"
            />
            <View className="flex-1 justify-end p-6">
                <View className="flex-row items-center mb-3 space-x-2">
                    <View className="bg-blue-600 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">{article.source.name}</Text>
                    </View>
                    <Text className="text-gray-300 text-xs font-medium">Featured</Text>
                </View>
                <Text className="text-white text-2xl font-bold leading-tight mb-2 shadow-sm">
                    {article.title}
                </Text>
                <Text className="text-slate-200 text-sm leading-5 opacity-90" numberOfLines={2}>
                    {article.description}
                </Text>
            </View>
        </Pressable>
    )
}
