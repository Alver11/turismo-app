import React, { useEffect } from "react"
import { useColorScheme as nativeUseColorScheme } from "react-native"
import { View } from "react-native"
import { useColorScheme } from "nativewind"

export function Screen({ children }: { children: React.ReactNode }) {
    const systemColorScheme = nativeUseColorScheme()
    const { colorScheme, setColorScheme } = useColorScheme()

    // Sincroniza el esquema de color con el del sistema
    useEffect(() => {
        setColorScheme(systemColorScheme || 'light')
    }, [systemColorScheme, colorScheme])

    return (
        <View className="flex-1 bg-gray-100 dark:bg-gray-600">
            {children}
        </View>
    );
}