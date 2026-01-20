import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Text, View, TextInput, SafeAreaView, Alert } from 'react-native';
import React from 'react';
import { Button } from '@/ui/Button';

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) return;

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (completeSignIn.status === 'complete') {
                await setActive({ session: completeSignIn.createdSessionId });
                router.replace('/');
            } else {
                // Use console.log for debugging or handle other statuses
                console.log(JSON.stringify(completeSignIn, null, 2));
            }
        } catch (err: any) {
            Alert.alert('Error', err.errors ? err.errors[0].message : 'Something went wrong');
        }
    }, [isLoaded, emailAddress, password]);

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 justify-center px-6">
            <View>
                <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</Text>
                <Text className="text-slate-500 mb-8">Sign in to continue reading premium news.</Text>

                <View className="mb-4">
                    <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Email</Text>
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white"
                        placeholder="name@example.com"
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Password</Text>
                    <TextInput
                        value={password}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white"
                        placeholder="Enter your password"
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                <Button title="Sign In" onPress={onSignInPress} />

                <View className="flex-row justify-center mt-6">
                    <Text className="text-slate-500">Don't have an account? </Text>
                    <Text className="text-blue-600 font-bold" onPress={() => router.push('/(auth)/sign-up')}>Sign Up</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
