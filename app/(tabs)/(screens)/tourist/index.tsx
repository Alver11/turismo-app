import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../../../src/components/Screen';
import { useDataContext } from '../../../../src/context/DataContext';
import { Image } from 'expo-image';

export default function TouristListScreen() {
    const { touristPlaces } = useDataContext(); // Obtén los lugares turísticos del contexto
    const { width: viewportWidth } = Dimensions.get('window');
    const colorScheme = useColorScheme();
    const [searchText, setSearchText] = useState('');
    const [filteredTouristPlaces, setFilteredTouristPlaces] = useState(touristPlaces);
    const router = useRouter();

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
        router.push({
            pathname: '/tourist/place-detail',
            params: { place: JSON.stringify(place) },
        });
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
                            contentFit="cover"
                            cachePolicy="memory-disk"
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
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: "Lugares Turísticos",
                    headerShown: false,
                }}
            />
            <View className="pl-4 pb-1 mt-10 shadow-md rounded-lg items-start">
                <Image
                    source={require('../../../../assets/logo.png')}
                    style={{ width: 90, height: 60, resizeMode: 'contain' }}
                />
            </View>

            <FlatList
                data={filteredTouristPlaces}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTouristPlace}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                className="p-4"
                ListHeaderComponent={
                    <View className="flex-row items-center px-4 mb-4 bg-white rounded-lg border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600">
                        <Ionicons name="search" size={24} color={colorScheme === 'dark' ? '#888' : '#555'} />
                        <TextInput
                            placeholder="Buscar por nombre, dirección o distrito"
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
                }
            />
        </Screen>
    );
}
