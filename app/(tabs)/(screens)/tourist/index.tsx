import { useState, useEffect } from 'react'
import {View, FlatList, TextInput, TouchableOpacity, Text, Image, useColorScheme} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Screen } from '../../../../src/components/Screen'
import { useDataContext } from '../../../../src/context/DataContext'
import { Stack, useRouter } from 'expo-router'
import TouristPlaceCard from '../../../../src/components/TouristPlaceCard'
import AsyncStorage from "@react-native-async-storage/async-storage"
import HeaderWithSOS from "../../../../src/components/HeaderWithSOS";

export default function TouristListScreen() {
    const { touristPlaces } = useDataContext()  // Obtén los lugares turísticos del contexto
    const [searchText, setSearchText] = useState('')
    const [filteredTouristPlaces, setFilteredTouristPlaces] = useState(touristPlaces)
    const [sortAscending, setSortAscending] = useState(true)
    const [filterLiked, setFilterLiked] = useState(false)
    const colorScheme = useColorScheme();
    const router = useRouter()

    useEffect(() => {
        filterAndSortPlaces()
    }, [searchText, touristPlaces, sortAscending, filterLiked])

    const filterAndSortPlaces = async () => {
        let filtered = touristPlaces.filter((place:any) => {
            const searchLower = searchText.toLowerCase()
            const matchesName = place.name.toLowerCase().includes(searchLower)
            const matchesAddress = place.address ? place.address.toLowerCase().includes(searchLower) : false
            const matchesDistrict = place.districtName ? place.districtName.toLowerCase().includes(searchLower) : false
            return matchesName || matchesAddress || matchesDistrict
        });

        // Si está activado el filtro de "me gusta"
        if (filterLiked) {
            filtered = await filterLikedPlaces(filtered)
        }

        // Ordenar por nombre de lugar
        filtered.sort((a: any, b: any) => {
            if (sortAscending) {
                return a.name.localeCompare(b.name)
            } else {
                return b.name.localeCompare(a.name)
            }
        });

        setFilteredTouristPlaces(filtered)
    };

    const filterLikedPlaces = async (places: any[]) => {
        const likedPlaces = [];
        for (const place of places) {
            const likeStatus = await AsyncStorage.getItem(`like_${place.id}`)
            if (likeStatus && JSON.parse(likeStatus)) {
                likedPlaces.push(place)
            }
        }
        return likedPlaces
    };

    const navigateToTouristPlace = (place: any) => {
        router.push({
            pathname: '/tourist/tourist-item',
            params: { place: JSON.stringify(place) },
        });
    };

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            {/* Cabecera Reutilizable con Botón SOS */}
            <HeaderWithSOS />

            {/* Barra de búsqueda y controles de orden */}
            <View className="flex-row items-center justify-between px-4 pt-2">
                <View className="flex-row items-center rounded-lg border bg-white dark:bg-gray-700 border-blue-100 dark:border-gray-500 shadow-sm p-3 mr-2 flex-1">
                    <Ionicons name="search" size={24} color="#555" />
                    <TextInput
                        placeholder="Buscar por distrito, nombre, descripción..."
                        value={searchText}
                        onChangeText={setSearchText}
                        className="flex-1 px-3 text-base text-black dark:text-gray-300"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity className="mr-1" onPress={() => setSortAscending(!sortAscending)}>
                    <Ionicons name={sortAscending ? "arrow-up" : "arrow-down"} size={24} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterLiked(!filterLiked)}>
                    <Ionicons name="heart" size={24} color={filterLiked ? "red" : "#555"} />
                </TouchableOpacity>
            </View>

            {/* Mostrar texto de resultado de búsqueda */}
            {searchText ? (
                <Text className="px-4 pb-1 pt-1 mb-2 text-gray-500 dark:text-gray-300">
                    Total de resultado: {filteredTouristPlaces.length} lugares turísticos
                </Text>
            ) : (
                <Text className="px-4 pb-1 pt-1 mb-2 text-gray-500 dark:text-gray-300">
                    Visitamos {touristPlaces.length} lugares turísticos
                </Text>
            )}

            {/* Lista de lugares turísticos */}
            <FlatList
                data={filteredTouristPlaces}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouristPlaceCard
                        place={item}
                        onPress={() => navigateToTouristPlace(item)}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
        </Screen>
    );
}
