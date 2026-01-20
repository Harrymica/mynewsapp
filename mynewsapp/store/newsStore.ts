import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '@/services/newsApi';

interface NewsState {
    category: string;
    setCategory: (category: string) => void;

    isMenuOpen: boolean;
    toggleMenu: () => void;

    bookmarks: Article[];
    addBookmark: (article: Article) => void;
    removeBookmark: (url: string) => void;
    isBookmarked: (url: string) => boolean;

    selectedArticle: Article | null;
    setSelectedArticle: (article: Article | null) => void;
}

export const useNewsStore = create<NewsState>()(
    persist(
        (set, get) => ({
            category: 'general',
            setCategory: (category) => set({ category }),

            isMenuOpen: false,
            toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

            bookmarks: [],
            addBookmark: (article) => set((state) => {
                const exists = state.bookmarks.find((a) => a.url === article.url);
                if (exists) return state;
                return { bookmarks: [...state.bookmarks, article] };
            }),
            removeBookmark: (url) => set((state) => ({
                bookmarks: state.bookmarks.filter((a) => a.url !== url)
            })),
            isBookmarked: (url) => {
                return !!get().bookmarks.find((a) => a.url === url);
            },

            selectedArticle: null,
            setSelectedArticle: (article) => set({ selectedArticle: article }),
        }),
        {
            name: 'news-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ bookmarks: state.bookmarks }), // Only persist bookmarks
        }
    )
);
