import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

import { enableScreens } from 'react-native-screens';
enableScreens();

import HomeStackScreen from '@/navigation/HomeStackScreen';
import TouristListScreen from '@/screens/TouristListScreen';
import { getCategories, getEvents, getTourist } from '@/composable/useApi';
import {Ionicons} from "@expo/vector-icons";
import TouristStackScreen from "./src/navigation/TouristStackScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [events, setEvents] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [touristPlaces, setTouristPlaces] = useState<any>([]);

  const systemColorScheme = useColorScheme();

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
    return null;  // Mostrar una pantalla de carga mientras se cargan los datos
  }

  return (
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Tab.Navigator>
          {/* Primer Tab: Inicio */}
          <Tab.Screen
              name="Inicio"
              children={() => (
                  <HomeStackScreen
                      events={events}
                      categories={categories}
                      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                      isDarkMode={isDarkMode}
                  />
              )}
              options={{
                tabBarLabel: 'Inicio',
                tabBarIcon: ({ color, size }) => {
                  return <Ionicons name={'home'} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray'
              }}
          />

          {/* Segundo Tab: Turismo */}
            <Tab.Screen
                name="Turismo"
                children={() => <TouristStackScreen touristPlaces={touristPlaces} />}  // <-- Usamos TouristStackScreen
                options={{
                    tabBarLabel: 'Turismo',
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name={'map'} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray' }}
            />
        </Tab.Navigator>
      </NavigationContainer>
  );
}
