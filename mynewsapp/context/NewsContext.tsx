import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '@/services/newsApi';

// Types
interface NewsState {
    category: string;
    isMenuOpen: boolean;
    bookmarks: Article[];
    selectedArticle: Article | null;
}

type Action =
    | { type: 'SET_CATEGORY'; payload: string }
    | { type: 'TOGGLE_MENU' }
    | { type: 'ADD_BOOKMARK'; payload: Article }
    | { type: 'REMOVE_BOOKMARK'; payload: string }
    | { type: 'SET_BOOKMARKS'; payload: Article[] }
    | { type: 'SET_SELECTED_ARTICLE'; payload: Article | null };

interface NewsContextType extends NewsState {
    setCategory: (category: string) => void;
    toggleMenu: () => void;
    addBookmark: (article: Article) => void;
    removeBookmark: (url: string) => void;
    isBookmarked: (url: string) => boolean;
    setSelectedArticle: (article: Article | null) => void;
}

// Initial State
const initialState: NewsState = {
    category: 'general',
    isMenuOpen: false,
    bookmarks: [],
    selectedArticle: null,
};

// Reducer
function newsReducer(state: NewsState, action: Action): NewsState {
    switch (action.type) {
        case 'SET_CATEGORY':
            return { ...state, category: action.payload };
        case 'TOGGLE_MENU':
            return { ...state, isMenuOpen: !state.isMenuOpen };
        case 'ADD_BOOKMARK':
            if (state.bookmarks.find(a => a.url === action.payload.url)) return state;
            return { ...state, bookmarks: [...state.bookmarks, action.payload] };
        case 'REMOVE_BOOKMARK':
            return { ...state, bookmarks: state.bookmarks.filter(a => a.url !== action.payload) };
        case 'SET_BOOKMARKS':
            return { ...state, bookmarks: action.payload };
        case 'SET_SELECTED_ARTICLE':
            return { ...state, selectedArticle: action.payload };
        default:
            return state;
    }
}

// Context
const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Provider
export function NewsProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(newsReducer, initialState);

    // Load bookmarks from storage on mount
    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                const stored = await AsyncStorage.getItem('news-bookmarks');
                if (stored) {
                    dispatch({ type: 'SET_BOOKMARKS', payload: JSON.parse(stored) });
                }
            } catch (e) {
                console.error('Failed to load bookmarks', e);
            }
        };
        loadBookmarks();
    }, []);

    // Save bookmarks to storage on change
    useEffect(() => {
        const saveBookmarks = async () => {
            try {
                await AsyncStorage.setItem('news-bookmarks', JSON.stringify(state.bookmarks));
            } catch (e) {
                console.error('Failed to save bookmarks', e);
            }
        }
        // Simple debounce/check could be added but for now saving on every change is fine
        if (state.bookmarks.length > 0 || (state.bookmarks.length === 0 && initialState.bookmarks.length !== 0)) {
            saveBookmarks();
        }
    }, [state.bookmarks]);


    const value: NewsContextType = {
        ...state,
        setCategory: (category) => dispatch({ type: 'SET_CATEGORY', payload: category }),
        toggleMenu: () => dispatch({ type: 'TOGGLE_MENU' }),
        addBookmark: (article) => dispatch({ type: 'ADD_BOOKMARK', payload: article }),
        removeBookmark: (url) => dispatch({ type: 'REMOVE_BOOKMARK', payload: url }),
        isBookmarked: (url) => !!state.bookmarks.find((a) => a.url === url),
        setSelectedArticle: (article) => dispatch({ type: 'SET_SELECTED_ARTICLE', payload: article }),
    };

    return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

// Hook
export function useNewsContext() {
    const context = useContext(NewsContext);
    if (context === undefined) {
        throw new Error('useNewsContext must be used within a NewsProvider');
    }
    return context;
}
