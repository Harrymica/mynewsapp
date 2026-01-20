import React from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { Loader } from 'lucide-react-native';

export function LoadingSpinner() {
    const rotation = useSharedValue(0);

    React.useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 2000,
                easing: Easing.linear,
            }),
            -1, // Infinite repeat
            false // No reverse
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <View className="absolute inset-0 items-center justify-center bg-slate-100 dark:bg-slate-900 z-10">
            <Animated.View style={animatedStyle}>
                <Loader size={32} color="#2563eb" />
            </Animated.View>
        </View>
    );
}
