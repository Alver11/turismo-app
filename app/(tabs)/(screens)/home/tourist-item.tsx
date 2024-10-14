import { TouristPlaceDetails } from '../../../../src/components/TouristPlaceDetails';  // Importa tu componente
import { Stack, useLocalSearchParams } from 'expo-router';
import { Screen } from "../../../../src/components/Screen";

export default function TouristItemScreen() {
    const { place } = useLocalSearchParams();

    const parsedPlace = place ? JSON.parse(place as string) : null;

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle:"",
                    headerShown: true,
                }}
            />
            <TouristPlaceDetails parametro={parsedPlace} />
        </Screen>
    );
}
