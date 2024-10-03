import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TouristListScreen from '@/screens/TouristListScreen';
import TouristPlaceScreen from '@/screens/TouristPlaceScreen';

export type TouristStackParamList = {
    TouristListScreen: undefined;
    TouristPlaceScreen: { touristPlace: any };
};

const Stack = createNativeStackNavigator<TouristStackParamList>();

export default function TouristStackScreen({ touristPlaces }: any) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="TouristListScreen"
                children={() => <TouristListScreen touristPlaces={touristPlaces} />}
            />
            <Stack.Screen
                name="TouristPlaceScreen"
                component={TouristPlaceScreen}
            />
        </Stack.Navigator>
    );
}
