/*import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Dimensions, RefreshControl } from 'react-native';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useDataContext } from '../../../../src/context/DataContext';
import { Screen } from '../../../../src/components/Screen';

export default function Home() {
    const { events, categories, isDarkMode, refreshData } = useDataContext();
    const colorScheme = useColorScheme();
    const { width: viewportWidth } = Dimensions.get('window');
    const [searchText, setSearchText] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();

    // Función para manejar la recarga de datos
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshData();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        if (categories && categories.length > 0) {
            const filtered = categories.filter((category: any) =>
                category.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [searchText, categories]);

    const navigateToEventDetail = (event: any) => {
        router.push({
            pathname: '/home/event-detail',
            params: { event: JSON.stringify(event) },
        });
    };

    const navigateToCategoryDetail = (category: any) => {
        router.push({
            pathname: '/home/category-detail',
            params: { category: JSON.stringify(category) },
        });
    };

    const renderCategoryItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => navigateToCategoryDetail(item)} style={{ flex: 1, margin: 5 }}>
            <View className="p-2 shadow-md rounded-lg items-center bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
                <Image
                    source={{ uri: item.image }}
                    style={{ width: viewportWidth * 0.4, height: viewportWidth * 0.4, borderRadius: 10 }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
                <Text className="text-lg font-bold text-center dark:text-gray-300 mt-2">{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: "",
                    headerShown: false,
                }}
            />
            <View className="pl-4 pb-1 mt-11 shadow-md rounded-lg items-start">
                { colorScheme == 'dark' ?
                    <Image
                        source={require('../../../../assets/logo-black.png')}
                        style={{ width: 90, height: 60, resizeMode: 'contain' }}
                    /> :
                    <Image
                        source={require('../../../../assets/logo.png')}
                        style={{ width: 90, height: 60, resizeMode: 'contain' }}
                    />
                }
            </View>
            <FlatList
                data={filteredCategories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
                className="p-4"
                numColumns={2}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[isDarkMode ? 'white' : 'black']}
                    />
                }
                ListHeaderComponent={
                    <>
                        <FlatList
                            data={events}
                            horizontal
                            renderItem={({ item }) => {
                                const frontImage = item.images && item.images.length > 0 ? item.images[0].filePath : null;

                                return (
                                    frontImage && (
                                        <View
                                            style={{ width: viewportWidth * 0.85 }}
                                            className="mr-2 rounded-lg p-2 bg-white  border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600">

                                            <Image
                                                source={{ uri: frontImage }}
                                                style={{
                                                    width: '100%',
                                                    height: 200,
                                                    borderRadius: 15,
                                                    backgroundColor: '#ffffff'
                                                }}
                                                contentFit="cover"
                                                cachePolicy="memory-disk"
                                            />


                                            <View style={{ padding: 10, flexDirection: 'row' }}>

                                                <View className="bg-black dark:bg-gray-300 mr-2" style={{ width: 3 }} />


                                                <View style={{ flex: 1 }}>
                                                    <Text className="text-lg font-bold text-gray-700 dark:text-gray-300">
                                                        {item.name}
                                                    </Text>
                                                    <Text className="text-sm text-gray-700 dark:text-gray-400" style={{ marginVertical: 5 }}>
                                                        {item.description.length > 100
                                                            ? `${item.description.substring(0, 100)}...`
                                                            : item.description}
                                                    </Text>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text className="text-sm text-gray-700 dark:text-gray-400">
                                                            { item.updated_at }
                                                        </Text>
                                                        <TouchableOpacity onPress={() => navigateToEventDetail(item)}>
                                                            <Text className="text-lg font-bold text-orange-700">
                                                                ver más...
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                );
                            }}
                            keyExtractor={(item) => item.id.toString()}
                            showsHorizontalScrollIndicator={false}
                        />

                        <Text className="text-lg pt-2">
                            Categorías
                        </Text>

                        <View className="flex-row items-center px-4 mb-4 bg-white rounded-lg border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600">
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
*/

import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, TextInput, RefreshControl } from 'react-native';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useDataContext } from '../../../../src/context/DataContext';
import { Screen } from '../../../../src/components/Screen';
import TouristPlaceCard from "../../../../src/components/TouristPlaceCard";

export default function Home() {
    const { touristPlaces, events, categories, refreshData } = useDataContext(); // Obtén datos del contexto
    const colorScheme = useColorScheme();
    const { width: viewportWidth } = Dimensions.get('window');
    const [filteredTouristPlaces, setFilteredTouristPlaces] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null); // Rastrea la pregunta activa
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories);

    const questions = [
        { question: '¿Qué puedo hacer hoy?', category: null }, // Muestra todos los lugares
        { question: 'Lugares para hacer deporte', category: 'Club' },
        { question: '¿Dónde puedo alojarme?', category: 'Hotel' },
        { question: '¿Dónde puedo comer?', category: 'Restaurante' },
    ];

    const handleChatQuestion = (question: string) => {
        if (activeQuestion === question) {
            // Si la pregunta ya está activa, desactívala y vuelve a mostrar eventos/categorías
            setActiveQuestion(null);
            setFilteredTouristPlaces([]);
        } else {
            // Activa la pregunta seleccionada y filtra los lugares turísticos
            setActiveQuestion(question);

            const selectedCategory = questions.find((q) => q.question === question)?.category;

            if (selectedCategory) {
                console.log("Filtrando por categoría:", selectedCategory); // Depuración
                setFilteredTouristPlaces(
                    touristPlaces.filter((place: any) =>
                        place.categories.some((category: any) => {
                            console.log("Comparando:", category.name, "con", selectedCategory); // Depuración
                            return category.name === selectedCategory;
                        })
                    )
                );
            } else {
                setFilteredTouristPlaces(touristPlaces); // Muestra todos los lugares si no hay categoría
            }
        }
    };


    const onRefresh = async () => {
        setRefreshing(true);
        await refreshData();
        setRefreshing(false);
    };

    useEffect(() => {
        if (categories && categories.length > 0) {
            const filtered = categories.filter((category: any) =>
                category.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [searchText, categories]);

    const navigateToTouristPlace = (place: any) => {
        router.push({
            pathname: '/home/tourist-item',
            params: { place: JSON.stringify(place) },
        });
    };

    const navigateToEventDetail = (event: any) => {
        router.push({
            pathname: '/home/event-detail',
            params: { event: JSON.stringify(event) },
        });
    };

    const navigateToCategoryDetail = (category: any) => {
        router.push({
            pathname: '/home/category-detail',
            params: { category: JSON.stringify(category) },
        });
    };

    const renderChatQuestion = ({ item }: { item: any }) => {
        const isActive = activeQuestion === item.question; // Verifica si la pregunta está activa
        return (
            <TouchableOpacity
                onPress={() => handleChatQuestion(item.question)}
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    marginRight: 8,
                    borderRadius: 8,
                    backgroundColor: isActive ? 'green' : colorScheme === 'dark' ? '#444' : '#ddd',
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        color: isActive ? 'white' : colorScheme === 'dark' ? '#ccc' : '#000',
                    }}
                >
                    {item.question}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderTouristPlace = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => navigateToTouristPlace(item)} style={{ flex: 1, margin: 5 }}>
            <View className="p-2 shadow-md rounded-lg items-center bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
                <Image
                    source={{ uri: item.image }}
                    style={{ width: viewportWidth * 0.4, height: viewportWidth * 0.4, borderRadius: 10 }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
                <Text className="text-lg font-bold text-center dark:text-gray-300 mt-2">{item.name}</Text>
                <Text className="text-sm text-center dark:text-gray-400">{item.address}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderCategoryItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => navigateToCategoryDetail(item)} style={{ flex: 1, margin: 5 }}>
            <View className="p-2 shadow-md rounded-lg items-center bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
                <Image
                    source={{ uri: item.image }}
                    style={{ width: viewportWidth * 0.4, height: viewportWidth * 0.4, borderRadius: 10 }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
                <Text className="text-lg font-bold text-center dark:text-gray-300 mt-2">{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: "",
                    headerShown: false,
                }}
            />
            <View className="pl-4 pb-1 mt-11 shadow-md rounded-lg items-start">
                {colorScheme == 'dark' ? (
                    <Image
                        source={require('../../../../assets/logo-black.png')}
                        style={{ width: 90, height: 60, resizeMode: 'contain' }}
                    />
                ) : (
                    <Image
                        source={require('../../../../assets/logo.png')}
                        style={{ width: 90, height: 60, resizeMode: 'contain' }}
                    />
                )}
            </View>

            {/* Chat Section */}
            <View className="p-4 dark:bg-gray-800">
                <Text className="text-lg font-bold text-black dark:text-white mb-2">
                    Selecciona qué puedes hacer hoy
                </Text>
                <FlatList
                    data={questions}
                    horizontal
                    renderItem={renderChatQuestion}
                    keyExtractor={(item) => item.question}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Tourist Places or Events/Categories */}
            {activeQuestion ? (
                <FlatList
                    data={filteredTouristPlaces}
                    keyExtractor={(item) => item.id.toString() }
                    renderItem={({ item }) => (
                        <TouristPlaceCard
                            place={item}
                            onPress={() => navigateToTouristPlace(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
                /*<FlatList
                    data={filteredCategories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    className="p-4"
                    numColumns={2}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />*/
            ) : (
                <FlatList
                    data={filteredCategories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    className="p-4"
                    numColumns={2}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colorScheme === 'dark' ? 'white' : 'black']}
                        />
                    }
                    ListHeaderComponent={
                    <>
                        <FlatList
                            data={events}
                            horizontal
                            renderItem={({ item }) => {
                                const frontImage = item.images && item.images.length > 0 ? item.images[0].filePath : null;

                                return (
                                    frontImage && (
                                        <View
                                            style={{ width: viewportWidth * 0.85 }}
                                            className="mr-2 rounded-lg p-2 bg-white  border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600">
                                            <Image
                                                source={{ uri: frontImage }}
                                                style={{
                                                    width: '100%',
                                                    height: 200,
                                                    borderRadius: 15,
                                                    backgroundColor: '#ffffff'
                                                }}
                                                contentFit="cover"
                                                cachePolicy="memory-disk"
                                            />
                                            <View style={{ padding: 10, flexDirection: 'row' }}>
                                                <View className="bg-black dark:bg-gray-300 mr-2" style={{ width: 3 }} />
                                                <View style={{ flex: 1 }}>
                                                    <Text className="text-lg font-bold text-gray-700 dark:text-gray-300">
                                                        {item.name}
                                                    </Text>
                                                    <Text className="text-sm text-gray-700 dark:text-gray-400" style={{ marginVertical: 5 }}>
                                                        {item.description.length > 100
                                                            ? `${item.description.substring(0, 100)}...`
                                                            : item.description}
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text className="text-sm text-gray-700 dark:text-gray-400">
                                                            { item.updated_at }
                                                        </Text>
                                                        <TouchableOpacity onPress={() => navigateToEventDetail(item)}>
                                                            <Text className="text-lg font-bold text-orange-700">
                                                                ver más...
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                );
                            }}
                            keyExtractor={(item) => item.id.toString()}
                            showsHorizontalScrollIndicator={false}
                        />

                        <Text className="text-lg pt-2">
                            Categorías
                        </Text>

                        <View className="flex-row items-center px-4 mb-4 bg-white rounded-lg border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600">
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
            )}
        </Screen>
    );
}


