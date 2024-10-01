import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import EventDetailScreen from '@/screens/EventDetailScreen';
import CategoryDetailScreen from '@/screens/CategoryDetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackScreen({ events, categories, toggleDarkMode, isDarkMode }: any) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Home"
                children={() => (
                    <HomeScreen
                        events={events}
                        categories={categories}
                        toggleDarkMode={toggleDarkMode}
                        isDarkMode={isDarkMode}
                    />
                )}
            />
            <Stack.Screen
                name="EventDetailScreen"
                component={EventDetailScreen}
            />
            <Stack.Screen
                name="CategoryDetailScreen"
                component={CategoryDetailScreen}
            />
        </Stack.Navigator>
    );
}
