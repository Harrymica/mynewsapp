import { View, Text, Pressable, Modal, TouchableWithoutFeedback, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNewsContext } from '@/context/NewsContext'; // CHANGED import
import { useRouter } from 'expo-router';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { useColorScheme } from '@/hooks/use-color-scheme';

const CATEGORIES = [
    { name: 'General', icon: 'newspaper' },
    { name: 'Business', icon: 'briefcase' },
    { name: 'Technology', icon: 'hardware-chip' },
    { name: 'Entertainment', icon: 'film' },
    { name: 'Health', icon: 'heart' },
    { name: 'Science', icon: 'flask' },
    { name: 'Sports', icon: 'football' },
];

export function Header() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useUser();
    const { category, setCategory, isMenuOpen, toggleMenu } = useNewsContext(); // CHANGED usage
    const { toggleColorScheme, colorScheme } = useColorScheme();

    const handleSelectCategory = (cat: string) => {
        setCategory(cat);
        toggleMenu();
        router.push('/(tabs)');
    };

    return (
        <>
            <View
                style={{ paddingTop: insets.top }}
                className="bg-white/95 dark:bg-black/95 backdrop-blur-md px-4 pb-3 border-b border-slate-100 dark:border-[#222] flex-row justify-between items-center z-50 shadow-sm"
            >
                <View className="flex-row items-center gap-3">
                    <Pressable onPress={toggleMenu} className="p-2 -ml-2 rounded-full active:bg-slate-100 dark:active:bg-[#111]">
                        <Ionicons name="menu" size={26} color={colorScheme === 'dark' ? '#fff' : '#0f172a'} />
                    </Pressable>

                    <View>
                        <Text className="text-xs font-bold text-blue-600 uppercase tracking-wider">{category}</Text>
                        <Text className="text-xl font-black text-slate-900 dark:text-white leading-5">NewsApp</Text>
                    </View>
                </View>

                <View className="flex-row items-center gap-2">
                    {/* Theme Toggle Button */}
                    <Pressable
                        onPress={toggleColorScheme}
                        className="p-2 rounded-full active:bg-slate-100 dark:active:bg-[#111] border-slate-200 dark:border-[#222]"
                    >
                        {colorScheme === 'dark' ? (
                            <Ionicons name="sunny" size={22} color="#fbbf24" />
                        ) : (
                            <Ionicons name="moon" size={22} color="#64748b" />
                        )}
                    </Pressable>

                    <Pressable onPress={() => router.push('/(tabs)/explore')} className="p-2 rounded-full active:bg-slate-100 dark:active:bg-[#111]">
                        <Ionicons name="search" size={22} color={colorScheme === 'dark' ? '#cbd5e1' : '#475569'} />
                    </Pressable>

                    <Pressable className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 dark:border-[#222] bg-slate-200" onPress={() => router.push('/(tabs)/profile')}>
                        {user?.imageUrl ? (
                            <Image source={{ uri: user.imageUrl }} className="h-full w-full" />
                        ) : (
                            <View className="h-full w-full items-center justify-center bg-blue-600">
                                <Text className="text-white font-bold text-xs">{user?.firstName?.[0] || 'U'}</Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>

            {/* Dropdown Menu Modal */}
            <Modal transparent visible={isMenuOpen} animationType="fade" onRequestClose={toggleMenu}>
                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <View className="flex-1 bg-black/40 backdrop-blur-sm relative">
                        <TouchableWithoutFeedback>
                            <View
                                style={{ marginTop: insets.top + 60 }}
                                className="absolute left-2 w-64 bg-white dark:bg-[#111] rounded-2xl shadow-2xl p-2 overflow-hidden"
                            >
                                <Text className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Categories</Text>
                                {CATEGORIES.map((cat) => (
                                    <Pressable
                                        key={cat.name}
                                        onPress={() => handleSelectCategory(cat.name.toLowerCase())}
                                        className={`flex-row items-center px-4 py-3 rounded-xl mb-1 ${category === cat.name.toLowerCase() ? 'bg-blue-50 dark:bg-blue-900/20' : 'active:bg-slate-50 dark:active:bg-[#222]'}`}
                                    >
                                        <Ionicons
                                            name={cat.icon as any}
                                            size={18}
                                            color={category === cat.name.toLowerCase() ? '#2563eb' : (colorScheme === 'dark' ? '#94a3b8' : '#64748b')}
                                        />
                                        <Text className={`ml-3 font-medium ${category === cat.name.toLowerCase() ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {cat.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}
