import { TouristPlaceDetails } from '../../../../src/components/TouristPlaceDetails';  // Importa tu componente
import {Stack, useLocalSearchParams} from 'expo-router';  // Para recibir parámetros
import { Screen } from '../../../../src/components/Screen';
import { useColorScheme } from 'react-native';

export default function TouristItemScreen() {
    const { place } = useLocalSearchParams();
    const colorScheme = useColorScheme();

    const parsedPlace = place ? JSON.parse(place as string) : null;

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: "Detalle del Sitio Turístico",
                    headerShadowVisible: false,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#4b5563' : '#f3f4f6',  // Colores de Tailwind
                    },
                    headerTitleStyle: {
                        color: colorScheme === 'dark' ? '#ffffff' : '#000000',
                    },
                    headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
                }}
            />
            <TouristPlaceDetails parameter={parsedPlace} />
        </Screen>
    );
}
