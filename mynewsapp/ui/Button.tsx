import { Text, Pressable, PressableProps } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends PressableProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    textClassName?: string;
}

export function Button({ title, variant = 'primary', className, textClassName, ...props }: ButtonProps) {
    const baseStyle = "py-3.5 px-6 rounded-xl flex-row justify-center items-center active:opacity-80 transition-opacity";

    const variants = {
        primary: "bg-blue-600 shadow-lg shadow-blue-500/30",
        secondary: "bg-slate-800 dark:bg-slate-700",
        outline: "bg-transparent border border-blue-600",
    };

    const textBaseStyle = "font-bold text-base text-center";
    const textVariants = {
        primary: "text-white",
        secondary: "text-white",
        outline: "text-blue-600 dark:text-blue-400",
    };

    const combinedContainer = twMerge(baseStyle, variants[variant], className);
    const combinedText = twMerge(textBaseStyle, textVariants[variant], textClassName);

    return (
        <Pressable className={combinedContainer} {...props}>
            <Text className={combinedText}>
                {title}
            </Text>
        </Pressable>
    );
}
