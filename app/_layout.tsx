import { useState, useEffect } from 'react';
import {Stack } from 'expo-router';
import SplashScreen from './splash';
import { getCategories, getEvents, getTourist } from "../src/composable/useApi";
import { DataContextProvider } from "../src/context/DataContext";

export default function Layout() {
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [events, setEvents] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const [touristPlaces, setTouristPlaces] = useState<any>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsResponse, categoriesResponse, touristPlacesResponse] = await Promise.all([
                    getEvents(),
                    getCategories(),
                    getTourist(),
                ]);

                setEvents(eventsResponse);
                setCategories(categoriesResponse);
                setTouristPlaces(touristPlacesResponse);
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) {
        return <SplashScreen setIsLoading={setIsLoading} isDarkMode={isDarkMode} />;
    }

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    return (
        <DataContextProvider
            events={events}
            categories={categories}
            touristPlaces={touristPlaces}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
        >
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </DataContextProvider>
    );
}
