import React, { createContext, useState, useEffect, useContext } from 'react';
import { getEvents, getCategories, getTourist } from '../composable/useApi';

const DataContext = createContext<any>(null);

export const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [touristPlaces, setTouristPlaces] = useState<any[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);  // Establecer la carga como finalizada
        }
    };

    // Cargar datos cuando el componente se monta
    useEffect(() => {
        loadData();
    }, []);

    const refreshData = async () => {
        setLoading(true);
        await loadData();
    };

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    return (
        <DataContext.Provider value={{ events, categories, touristPlaces, isDarkMode, toggleDarkMode, refreshData, loading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => useContext(DataContext);