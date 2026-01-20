import React, { useEffect } from 'react';
import { View, Text, Pressable, StatusBar, Dimensions, Share } from 'react-native';
import { useNewsContext } from '@/context/NewsContext';
import { Image } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMG_HEIGHT = SCREEN_HEIGHT * 0.5;

export default function ArticleDetailScreen() {
    const { selectedArticle, isBookmarked, addBookmark, removeBookmark } = useNewsContext();
    const router = useRouter();
    const scrollY = useSharedValue(0);

    // Redirect if no article
    useEffect(() => {
        if (!selectedArticle) {
            router.replace('/(tabs)');
        }
    }, [selectedArticle]);

    if (!selectedArticle) return null;

    const bookmarked = isBookmarked(selectedArticle.url);

    const toggleBookmark = () => {
        if (bookmarked) {
            removeBookmark(selectedArticle.url);
        } else {
            addBookmark(selectedArticle);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this article: ${selectedArticle.title}\n\n${selectedArticle.url}`,
                url: selectedArticle.url, // iOS
                title: selectedArticle.title, // Android
            });
        } catch (error) {
            console.error('Error sharing article:', error);
        }
    };

    const openOriginal = () => {
        Linking.openURL(selectedArticle.url);
    };

    // Animation: Only scale on pull-down (negative scroll). 
    // No translation on positive scroll means image stays fixed behind content.
    const imageAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollY.value,
            [-IMG_HEIGHT, 0],
            [2, 1],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ scale }],
        };
    });

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />

            {/* Fixed Background Image */}
            <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width: '100%', height: IMG_HEIGHT, zIndex: 0 }, imageAnimatedStyle]}>
                <Image
                    source={{ uri: selectedArticle.urlToImage || '' }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    className="absolute inset-0 w-full h-full justify-end p-6 pb-12"
                >
                    <View className="bg-blue-600 self-start px-3 py-1 rounded-full mb-3">
                        <Text className="text-white text-xs font-bold">{selectedArticle.source.name}</Text>
                    </View>
                    <Text className="text-white text-3xl font-bold leading-tight shadow-md mb-2">
                        {selectedArticle.title}
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-slate-300 text-xs font-medium mr-4">
                            By {selectedArticle.author || 'Unknown'}
                        </Text>
                        <Text className="text-slate-300 text-xs font-medium">
                            {selectedArticle.publishedAt ? formatDistanceToNow(new Date(selectedArticle.publishedAt), { addSuffix: true }) : ''}
                        </Text>
                    </View>
                </LinearGradient>
            </Animated.View>

            {/* Header Buttons */}
            <View className="absolute top-12 left-0 right-0 z-50 flex-row justify-between items-center px-4">
                <Pressable onPress={() => router.back()} className="bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/10">
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <View className="flex-row gap-3">
                    <Pressable onPress={toggleBookmark} className="bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/10">
                        <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={24} color="#fff" />
                    </Pressable>
                    <Pressable onPress={handleShare} className="bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/10">
                        <Ionicons name="share-social-outline" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>

            {/* Scrollable Sheet */}
            <Animated.ScrollView
                scrollEventThrottle={16}
                onScroll={scrollHandler}
                contentContainerStyle={{ paddingTop: IMG_HEIGHT - 32, paddingBottom: 0 }} // Remove bottom padding to fix gap
                showsVerticalScrollIndicator={false}
                snapToOffsets={[0, IMG_HEIGHT - 100]}
                decelerationRate="fast"
            >
                {/* Content Container - Ensure minHeight covers full screen */}
                <View className="bg-white dark:bg-black rounded-t-[32px] px-5 py-8 shadow-2xl shadow-black relative" style={{ minHeight: SCREEN_HEIGHT }}>
                    {/* Drag Handle */}
                    <View className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full self-center mb-6" />

                    <Text className="text-xl text-slate-800 dark:text-slate-200 font-medium leading-8 mb-6">
                        {selectedArticle.description}
                    </Text>

                    <Text className="text-base text-slate-600 dark:text-slate-400 leading-7 mb-8">
                        {selectedArticle.content?.replace(/\[\+\d+ chars\]$/, '')}

                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>

                    <Pressable onPress={openOriginal} className="bg-slate-100 dark:bg-[#111] p-4 rounded-xl flex-row items-center justify-between mb-8">
                        <View>
                            <Text className="text-slate-900 dark:text-white font-bold mb-1">Read Full Article</Text>
                            <Text className="text-slate-500 text-xs">Visit {selectedArticle.source.name} website</Text>
                        </View>
                        <Ionicons name="open-outline" size={20} color="#64748b" />
                    </Pressable>

                    {/* Add extra padding at bottom equivalent to tab bar or just safe area */}
                    <View className="h-20" />
                </View>
            </Animated.ScrollView>
        </View>
    );
}
