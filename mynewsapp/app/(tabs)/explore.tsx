import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { searchNews, Article } from '@/services/newsApi';
import { NewsCard } from '@/components/NewsCard';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const data = await searchNews(query);
    setArticles(data);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Discover</Text>
        <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 mb-6">
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search for news..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-2 text-slate-900 dark:text-white text-base font-medium"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
        ) : (
          <>
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))
            ) : (
              <View className="items-center justify-center mt-10 opacity-50">
                {query ? <Text className="text-slate-500">No results found.</Text> : <Text className="text-slate-500">Search for something interesting today.</Text>}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
