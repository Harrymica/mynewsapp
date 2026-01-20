import { ScrollView, Pressable, Text, View } from 'react-native';

const CATEGORIES = ['General', 'Business', 'Technology', 'Entertainment', 'Health', 'Science', 'Sports'];

export function CategorySelector({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
    return (
        <View className="mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {CATEGORIES.map((cat) => (
                    <Pressable
                        key={cat}
                        onPress={() => onSelect(cat.toLowerCase())}
                        className={`mr-3 px-5 py-2.5 rounded-full border ${selected === cat.toLowerCase() ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-500/30' : 'bg-transparent border-slate-200 dark:border-slate-700'}`}
                    >
                        <Text className={`${selected === cat.toLowerCase() ? 'text-white font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
                            {cat}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}


