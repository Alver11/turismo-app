import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="event-detail" />
            <Stack.Screen name="category-detail" />
            <Stack.Screen name="tourist-item" />
        </Stack>
    );
}