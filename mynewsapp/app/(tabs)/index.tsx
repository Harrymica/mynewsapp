import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { getTopHeadlines, Article } from '@/services/newsApi';
import { FeaturedCard } from '@/components/FeaturedCard';
import { NewsCard } from '@/components/NewsCard';
import { useRouter } from 'expo-router';
import { SignedOut } from '@clerk/clerk-expo';
import { useNewsContext } from '@/context/NewsContext'; // CHANGED import

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Use Global Context
  const { category, setSelectedArticle } = useNewsContext(); // CHANGED usage

  const fetchNews = async () => {
    setLoading(true);
    const data = await getTopHeadlines(category);
    setArticles(data);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  const handleArticlePress = (article: Article) => {
    setSelectedArticle(article);
    router.push(`/article/${encodeURIComponent(article.title)}`);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />}
      >
        <View className="px-4 pb-4">
          <SignedOut>
            <View className="bg-slate-100 dark:bg-[#111] p-4 rounded-2xl mb-6 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-white font-bold text-lg mb-1">Join Premium</Text>
                <Text className="text-slate-500 text-xs">Sign in to save articles and get personalized content.</Text>
              </View>
              <Pressable onPress={() => router.push('/(auth)/sign-in')} className="bg-blue-600 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/30">
                <Text className="text-white font-bold text-xs">Sign In</Text>
              </Pressable>
            </View>
          </SignedOut>

          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {category.charAt(0).toUpperCase() + category.slice(1)} News
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
        ) : (
          <>
            {articles.length > 0 && (
              <View>
                <Text className="px-4 text-lg font-bold text-slate-900 dark:text-white mb-3">Featured</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  className="mb-8"
                >
                  {articles.slice(0, 5).map((article, index) => (
                    <View key={index} style={{ width: 320, marginRight: 16 }}>
                      <FeaturedCard article={article} onPress={() => handleArticlePress(article)} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text className="px-4 text-lg font-bold text-slate-900 dark:text-white mb-3">Latest Stories</Text>
            {articles.slice(5).map((article, index) => (
              <NewsCard key={index} article={article} onPress={() => handleArticlePress(article)} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
