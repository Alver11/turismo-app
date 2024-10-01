import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "../../App";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    events: Array<{
        id: number;
        name: string;
        images: Array<{ id: number; filePath: string; frontPage: boolean }>;
    }>;
    categories: Array<{
        id: number;
        name: string;
        image: string;
        touristPlaces: Array<{
            id: number;
            name: string;
            address: string | null;
            districtName: string | null;
            description: string;
            images: Array<{ id: number; filePath: string; frontPage: boolean }>;
        }>;
    }>;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

export default function HomeScreen({ events, categories, toggleDarkMode, isDarkMode }: HomeScreenProps) {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const colorScheme = useColorScheme(); // Detecta si está en modo oscuro o claro
    const { width: viewportWidth } = Dimensions.get('window');

    const [searchText, setSearchText] = useState(''); // Para almacenar el texto del buscador
    const [filteredCategories, setFilteredCategories] = useState(categories); // Para almacenar las categorías filtradas

    useEffect(() => {
        if (categories && categories.length > 0) {
            const filtered = categories.filter((category: any) =>
                category.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [searchText, categories]);

    const navigateToEventDetail = (event: any) => {
        navigation.navigate('EventDetailScreen', { event });
    };

    const navigateToCategoryDetail = (category: any) => {
        navigation.navigate('CategoryDetailScreen', { category });
    };

    const renderCategoryItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity onPress={() => navigateToCategoryDetail(item)}>
                <View className="mb-5">
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: viewportWidth * 0.8, height: 150, borderRadius: 10, marginBottom: 10 }}
                    />
                    <Text className="text-xl font-bold text-black dark:text-white">{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={filteredCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            className={`flex-1 p-4 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
            ListHeaderComponent={
                <>
                    {/* Logo en la parte superior izquierda */}
                    <View className="flex-row justify-start items-center p-4">
                        <Image
                            source={require('../assets/logo.png')}
                            style={{ width: 90, height: 60, resizeMode: 'contain' }}
                        />
                    </View>

                    {/* Carrusel de imágenes */}
                    <FlatList
                        data={events}
                        horizontal
                        renderItem={({ item }) => {
                            const frontImage = item.images && item.images.length > 0 ? item.images[0].filePath : null;

                            return (
                                frontImage && (
                                    <TouchableOpacity onPress={() => navigateToEventDetail(item)}>
                                        <View style={{ marginRight: 10, position: 'relative' }}>
                                            <Image
                                                source={{ uri: frontImage }}
                                                style={{
                                                    width: viewportWidth * 0.8,
                                                    height: 200,
                                                    borderRadius: 15,
                                                    resizeMode: 'cover',
                                                }}
                                            />
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    width: '100%',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    padding: 10,
                                                    borderBottomLeftRadius: 15,
                                                    borderBottomRightRadius: 15,
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            );
                        }}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                    />
                    <Text className="text-2xl font-bold mt-10 text-black dark:text-white">Categorías</Text>
                    {/* Barra de búsqueda */}
                    <View className="px-4 mb-4">
                        <TextInput
                            placeholder="Buscar categorías..."
                            placeholderTextColor={colorScheme === 'dark' ? '#888' : '#555'}
                            value={searchText}
                            onChangeText={setSearchText}
                            className={`p-3 rounded-lg border ${
                                colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'
                            }`}
                        />
                    </View>
                </>
            }
        />
    );
}
