import { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, Dimensions, TextInput, RefreshControl, ScrollView} from 'react-native';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { ActivityIndicator } from 'react-native';
import { useDataContext } from '../../../../src/context/DataContext';
import { Screen } from '../../../../src/components/Screen';
import TouristPlaceCard from "../../../../src/components/TouristPlaceCard";
import HeaderWithSOS from "../../../../src/components/HeaderWithSOS";
import EventCard from "../../../../src/components/EventCard";

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
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    margin: 8,
                    borderRadius: 8,
                    backgroundColor: isActive ? 'green' : colorScheme === 'dark' ? '#444' : '#ddd',
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        color: isActive ? 'white' : colorScheme === 'dark' ? '#ccc' : '#000',
                        textAlign: 'center',
                    }}
                >
                    {item.question}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderEventItem = ({ item }: { item: any }) => (
        <EventCard item={item} onPress={() => navigateToEventDetail(item)} />
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

            {/* Cabecera Reutilizable con Botón SOS */}
            <HeaderWithSOS />

            {/* FlatList Principal */}
            <FlatList
                key={activeQuestion ? 'list-single-column' : 'list-multi-column'}
                data={activeQuestion ? filteredTouristPlaces : filteredCategories}
                keyExtractor={(item: any) => item.id.toString()}
                numColumns={activeQuestion ? 1 : 2} // Si hay pregunta activa, mostrar en una columna
                renderItem={({ item }) =>
                    activeQuestion ? (
                        <TouristPlaceCard
                            place={item}
                            onPress={() => navigateToTouristPlace(item)}
                        />
                    ) : (
                        renderCategoryItem({ item })
                    )
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
                nestedScrollEnabled={true} // Habilita el desplazamiento interno

                // Agregar encabezados antes de la lista de elementos
                ListHeaderComponent={
                    <>
                        {/* Chat Section */}
                        <View className="p-4 dark:bg-gray-800">
                            <Text className="text-lg font-bold text-black dark:text-white mb-2">
                                Selecciona una de las opciones
                            </Text>
                            <FlatList
                                data={questions}
                                renderItem={renderChatQuestion}
                                keyExtractor={(item) => item.question}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                showsHorizontalScrollIndicator={false}
                                nestedScrollEnabled={true} // Permite scroll dentro de FlatList
                            />
                        </View>

                        {/* Noticias y Eventos */}
                        {!activeQuestion && (
                            <View className="p-4 dark:bg-gray-800">
                                <Text className="text-lg font-bold text-black dark:text-white mb-0">
                                    Noticias y Eventos
                                </Text>
                                {/* Línea Naranja */}
                                <View className="h-1 w-11/12 bg-orange-500 mb-4" />
                                <FlatList
                                    data={events}
                                    horizontal
                                    renderItem={renderEventItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                />
                            </View>
                        )}

                        {/* Categorías (Si no hay pregunta activa) */}
                        {!activeQuestion && (
                            <View className="p-4 dark:bg-gray-800">
                                <Text className="text-lg font-bold text-black dark:text-white mb-0">
                                    Busca aqui tu destino
                                </Text>
                                <View className="h-1 w-11/12 bg-orange-500 mb-4" />
                                <View className="flex-row items-center px-4 mb-0 bg-white rounded-lg border border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600">
                                    <Ionicons
                                        name="search"
                                        size={24}
                                        color={colorScheme === 'dark' ? '#888' : '#555'}
                                    />
                                    <TextInput
                                        placeholder="Fitre la categoría"
                                        placeholderTextColor={colorScheme === 'dark' ? '#888' : '#555'}
                                        value={searchText}
                                        onChangeText={setSearchText}
                                        className="flex-1 px-3 py-3.5 text-base text-black dark:text-white"
                                    />
                                    {searchText.length > 0 && (
                                        <TouchableOpacity onPress={() => setSearchText('')}>
                                            <Ionicons
                                                name="close-circle"
                                                size={24}
                                                color={colorScheme === 'dark' ? 'white' : 'black'}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}
                    </>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colorScheme === 'dark' ? 'white' : 'black']}
                    />
                }
            />
        </Screen>
    );
}
