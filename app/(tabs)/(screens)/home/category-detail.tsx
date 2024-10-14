import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { useColorScheme } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../../../src/components/Screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import TouristPlaceCard from '../../../../src/components/TouristPlaceCard';

export default function CategoryDetailScreen() {
    const { category } = useLocalSearchParams();
    const parsedCategory = category ? JSON.parse(category as string) : null;
    const colorScheme = useColorScheme();
    const [searchText, setSearchText] = useState('');
    const [filteredTouristPlaces, setFilteredTouristPlaces] = useState(parsedCategory?.touristPlaces || []);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const filtered = parsedCategory?.touristPlaces?.filter((place: any) =>
            place.name.toLowerCase().includes(searchText.toLowerCase()) ||
            place.categories.some((cat: any) => cat.name.toLowerCase().includes(searchText.toLowerCase()))
        );

        if (JSON.stringify(filtered) !== JSON.stringify(filteredTouristPlaces)) {
            setFilteredTouristPlaces(filtered);
        }
    }, [searchText, parsedCategory?.touristPlaces]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Aquí podrías recargar los datos
        setRefreshing(false);
    }, []);

    const renderTouristPlace = ({ item }: { item: any }) => (
        <TouristPlaceCard
            place={item}
            onPress={() => {
                router.push({
                    pathname: '/home/tourist-item',
                    params: { place: JSON.stringify(item) },
                });
            }}
            //refreshList={() => {}}
        />
    );

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: parsedCategory?.name,
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

            <FlatList
                data={filteredTouristPlaces}
                renderItem={renderTouristPlace}  // Usamos el componente TouristPlaceCard para renderizar cada lugar
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={
                    <>
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={{ uri: parsedCategory.image }}
                                className="w-full h-48"
                                contentFit="cover"
                                cachePolicy="memory-disk"
                            />
                            {/*<View style={{*/}
                            {/*    position: 'absolute',*/}
                            {/*    bottom: 0,*/}
                            {/*    width: '100%',*/}
                            {/*    backgroundColor: 'rgba(0, 0, 0, 0.5)',*/}
                            {/*    padding: 10,*/}
                            {/*}}>*/}
                            {/*    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>*/}
                            {/*        {parsedCategory.name}*/}
                            {/*    </Text>*/}
                            {/*</View>*/}
                        </View>
                        <View className="flex-row items-center px-4 m-5 mb-4 bg-white rounded-lg border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600">
                            <Ionicons name="search" size={24} color={colorScheme === 'dark' ? '#888' : '#555'} />
                            <TextInput
                                placeholder="Buscar..."
                                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#555'}
                                value={searchText}
                                onChangeText={setSearchText}
                                className="flex-1 px-3 py-3.5 text-base text-black dark:text-white"
                            />
                            {searchText.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchText('')}>
                                    <Ionicons name="close-circle" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                }
            />
        </Screen>
    );
}
