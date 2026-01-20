import * as React from 'react'
import { Text, TextInput, View, SafeAreaView, Alert } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Button } from '@/ui/Button'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    const onSignUpPress = async () => {
        if (!isLoaded) return

        try {
            await signUp.create({
                emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err: any) {
            Alert.alert('Error', err.errors ? err.errors[0].message : 'Something went wrong')
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) return

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            Alert.alert('Error', err.errors ? err.errors[0].message : 'Something went wrong')
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 justify-center px-6">
            {!pendingVerification && (
                <View>
                    <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</Text>
                    <Text className="text-slate-500 mb-8">Join to explore the world of news.</Text>

                    <View className="mb-4">
                        <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Email</Text>
                        <TextInput
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="name@example.com"
                            placeholderTextColor="#94a3b8"
                            onChangeText={setEmailAddress}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white"
                        />
                    </View>

                    <View className="mb-8">
                        <Text className="text-slate-700 dark:text-slate-300 font-medium mb-2">Password</Text>
                        <TextInput
                            value={password}
                            placeholder="Enter password"
                            placeholderTextColor="#94a3b8"
                            secureTextEntry={true}
                            onChangeText={setPassword}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white"
                        />
                    </View>

                    <Button title="Sign Up" onPress={onSignUpPress} />

                    <View className="flex-row justify-center mt-6">
                        <Text className="text-slate-500">Already have an account? </Text>
                        <Text className="text-blue-600 font-bold" onPress={() => router.push('/(auth)/sign-in')}>Sign In</Text>
                    </View>
                </View>
            )}

            {pendingVerification && (
                <View>
                    <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Verify Email</Text>
                    <Text className="text-slate-500 mb-8">enter the code sent to your email.</Text>

                    <View className="mb-8">
                        <TextInput
                            value={code}
                            placeholder="Code..."
                            placeholderTextColor="#94a3b8"
                            onChangeText={setCode}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white text-center text-lg tracking-widest"
                        />
                    </View>

                    <Button title="Verify Email" onPress={onPressVerify} />
                </View>
            )}
        </SafeAreaView>
    )
}
