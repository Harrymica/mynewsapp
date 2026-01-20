import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export interface Article {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
}

export const getTopHeadlines = async (category: string = 'general'): Promise<Article[]> => {
    if (!API_KEY) {
        console.warn('News API Key is missing. Please set EXPO_PUBLIC_NEWS_API_KEY in your .env file.');
        return [];
    }
    try {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
            params: {
                country: 'us',
                category,
                apiKey: API_KEY,
            },
        });
        return response.data.articles;
    } catch (error) {
        console.error('Error fetching top headlines:', error);
        return [];
    }
};

export const searchNews = async (query: string): Promise<Article[]> => {
    if (!API_KEY) {
        console.warn('News API Key is missing.');
        return [];
    }
    try {
        const articleResponse = await axios.get(`${BASE_URL}/everything`, {
            params: {
                q: query,
                apiKey: API_KEY,
            },
        });
        return articleResponse.data.articles;
    } catch (error) {
        console.error('Error searching news:', error);
        return [];
    }
};
