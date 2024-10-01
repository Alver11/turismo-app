import React, {useEffect, useState} from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../App";

// Definir tipo de navegación
type CategoryDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryDetailScreen'>;

export default function CategoryDetailScreen({ route }: any) {
    const { category } = route.params;
    const colorScheme = useColorScheme();
    const navigation = useNavigation<CategoryDetailScreenNavigationProp>();

    const [searchText, setSearchText] = useState('');
    const [filteredTouristPlaces, setFilteredTouristPlaces] = useState(category.touristPlaces);

    useEffect(() => {
        const filtered = category.touristPlaces.filter((place: any) =>
            place.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredTouristPlaces(filtered);
    }, [searchText, category.touristPlaces]);

    const navigateToTouristPlaceDetail = (touristPlace: any) => {
        navigation.navigate('TouristPlaceScreen', { touristPlace });
    };

    const renderTouristPlace = ({ item }: { item: any }) => {
        const frontImage = item.images.find((img: any) => img.frontPage)?.filePath;

        return (
            <TouchableOpacity onPress={() => navigateToTouristPlaceDetail(item)}>
                <View className="mb-5 bg-white rounded-xl shadow-md overflow-hidden">
                    {frontImage && (
                        <Image
                            source={{ uri: frontImage }}
                            className="w-full h-40 rounded-t-xl"
                        />
                    )}
                    <View className="p-4">
                        <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                        {item.address && (
                            <Text className="text-gray-600">Address: {item.address}</Text>
                        )}
                        {item.districtName && (
                            <Text className="text-gray-600">District: {item.districtName}</Text>
                        )}
                        {/*<Text className="text-gray-600 mt-2">{item.description}</Text>*/}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className={`flex-1 p-5 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'}`}>
            <FlatList
                data={filteredTouristPlaces}
                renderItem={renderTouristPlace}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <>
                        <Image
                            source={{ uri: category.image }}
                            className="w-full h-48 rounded-xl"
                        />
                        <Text className="text-xl font-bold p-4 text-center">{category.name}</Text>
                        <TextInput
                            placeholder="Buscar lugares turísticos..."
                            value={searchText}
                            onChangeText={setSearchText}
                            className="p-3 mb-4 bg-white rounded-lg"
                        />
                    </>
                }
            />
        </View>
    );
}
