import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Screen } from '../../../../src/components/Screen';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// Datos de Street View organizados por distrito
const districts = [
    {
        name: 'Caacupé',
        places: [
            { name: 'CAACUPE Street View', link: 'https://www.google.com/maps/@-25.3854894,-57.1407747,3a,75y,213.36h,93.61t/data=!3m8!1e1!3m6!1sAF1QipPk964mrQPpim3nXDZILe44ncpAu2g_YyDnQTuv!2e10!3e11' },
            { name: 'Museo de La Basílica', link: 'https://tourmkr.com/F1ymBWxLMo' },
            { name: 'Kurusu Peregrino', link: 'https://tourmkr.com/F1gRHjZjlm' },
            { name: 'Cerro Kavaju', link: 'https://tourmkr.com/F1JVMoH8SM' },
            // Otros lugares de Caacupé...
        ],
    },
    {
        name: 'San Bernardino',
        places: [
            { name: 'SAN BERNARDINO Street View', link: 'https://www.google.com/maps/@-25.3146826,-57.2929926,3a,75y,184.74h,71.68t/data=!3m8!1e1' },
            { name: 'Casa Hussler', link: 'https://tourmkr.com/F1d4sJPsQ5' },
            { name: 'Casa Buttner', link: 'https://tourmkr.com/F1JKR7L83A' },
            // Otros lugares de San Bernardino...
        ],
    },
    {
        name: 'Altos',
        places: [
            { name: 'ALTOS Street View', link: 'https://www.google.com/maps/@-25.260595,-57.2495618,3a,75y,256.51h,77.34t/data=!3m8!1e1' },
            { name: 'Parroquia San Pedro y San Pablo', link: 'https://tourmkr.com/F18dx9F6ep' },
            // Otros lugares de Altos...
        ],
    },
    // Añade otros distritos aquí...
];

export default function StreetView() {
    const colorScheme = useColorScheme();

    // Renderizar los lugares turísticos con sus enlaces
    const renderPlaceItem = ({ item }) => (
        <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
            <View className="bg-white shadow-md rounded-lg p-4 mb-4">
                <Text className="text-lg font-bold">{item.name}</Text>
                <Ionicons name="location-outline" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </View>
        </TouchableOpacity>
    );

    // Renderizar los distritos y sus lugares
    const renderDistrictItem = ({ item }) => (
        <View>
            <Text className="text-xl font-bold mb-2">{item.name}</Text>
            <FlatList
                data={item.places}
                renderItem={renderPlaceItem}
                keyExtractor={(place) => place.name}
            />
        </View>
    );

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: 'Street View',
                    headerShadowVisible: false,
                }}
            />
            <FlatList
                data={districts}
                renderItem={renderDistrictItem}
                keyExtractor={(district) => district.name}
                contentContainerStyle={{ padding: 16 }}
            />
        </Screen>
    );
}
