import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Dimensions, RefreshControl } from 'react-native';
import { useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useDataContext } from '../../../../src/context/DataContext';
import { Screen } from '../../../../src/components/Screen';

export default function Home() {
    const { events, categories, isDarkMode, toggleDarkMode, refreshData } = useDataContext();  // Incluye refreshData desde el contexto
    const colorScheme = useColorScheme();
    const { width: viewportWidth } = Dimensions.get('window');
    const [searchText, setSearchText] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [refreshing, setRefreshing] = useState(false);  // Estado para manejar el refresco

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
            <View className="bg-gray-200 dark:bg-gray-800 p-2 shadow-md rounded-lg items-center">
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
            <View className="pl-4 pb-1 mt-10 shadow-md rounded-lg items-start">
                <Image
                    source={require('../../../../assets/logo.png')}
                    style={{ width: 90, height: 60, resizeMode: 'contain' }}
                />
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
                                            className="mr-2 bg-white dark:bg-gray-800 rounded-lg p-2">
                                            {/* Imagen con bordes redondeados */}
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

                                            {/* Contenido debajo de la imagen */}
                                            <View style={{ padding: 10, flexDirection: 'row' }}>
                                                {/* Línea vertical */}
                                                <View className="bg-black dark:bg-gray-300 mr-2" style={{ width: 3 }} />

                                                {/* Texto de la noticia */}
                                                <View style={{ flex: 1 }}>
                                                    <Text className="text-lg font-bold text-gray-700 dark:text-gray-300">
                                                        {item.name}
                                                    </Text>
                                                    <Text className="text-sm text-gray-700 dark:text-gray-400" style={{ marginVertical: 5 }}>
                                                        {item.description.length > 100
                                                            ? `${item.description.substring(0, 100)}...`
                                                            : item.description}
                                                    </Text>

                                                    {/* Fecha y ver más */}
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
