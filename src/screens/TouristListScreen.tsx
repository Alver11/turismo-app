import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type TouristListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TouristListScreen'>;

interface TouristListScreenProps {
    touristPlaces: Array<{
        id: number;
        name: string;
        address: string | null;
        districtName: string | null;
        images: Array<{ id: number; filePath: string; frontPage: boolean }>;
    }>;
}

export default function TouristListScreen({ touristPlaces }: TouristListScreenProps) {
    const navigation = useNavigation<TouristListScreenNavigationProp>();
    const { width: viewportWidth } = Dimensions.get('window');

    const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
    const [filteredTouristPlaces, setFilteredTouristPlaces] = useState(touristPlaces); // Estado para lugares filtrados

    // Filtrar lugares turísticos solo por nombre, dirección o distrito
    useEffect(() => {
        const filtered = touristPlaces.filter(place => {
            const searchLower = searchText.toLowerCase();
            const matchesName = place.name.toLowerCase().includes(searchLower);
            const matchesAddress = place.address ? place.address.toLowerCase().includes(searchLower) : false;
            const matchesDistrict = place.districtName ? place.districtName.toLowerCase().includes(searchLower) : false;

            return matchesName || matchesAddress || matchesDistrict;
        });

        setFilteredTouristPlaces(filtered);
    }, [searchText, touristPlaces]);

    const navigateToTouristPlace = (place: any) => {
        navigation.navigate('TouristPlaceScreen', { touristPlace: place });
    };

    const renderTouristPlace = ({ item }: { item: any }) => {
        const frontImage = item.images.find((img: any) => img.frontPage)?.filePath;

        return (
            <TouchableOpacity onPress={() => navigateToTouristPlace(item)}>
                <View className="bg-white shadow-md rounded-lg mb-4 p-4 border border-gray-200">
                    {frontImage && (
                        <Image
                            source={{ uri: frontImage }}
                            className="w-[80vw] h-48 rounded-md mb-4"
                        />
                    )}
                    <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                    {item.address && <Text className="text-gray-600">Address: {item.address}</Text>}
                    {item.districtName && <Text className="text-gray-600">District: {item.districtName}</Text>}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 p-4 bg-gray-100">
            {/* Buscador */}
            <TextInput
                placeholder="Buscar por nombre, dirección o distrito"
                value={searchText}
                onChangeText={setSearchText}
                className="border border-gray-300 p-3 rounded-lg mb-5 bg-white"
            />

            {/* Lista de lugares turísticos filtrados */}
            <FlatList
                data={filteredTouristPlaces}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTouristPlace}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
