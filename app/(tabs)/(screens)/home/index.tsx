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
            <View className="bg-gray-200 p-2 shadow-md rounded-lg items-center">
                <Image
                    source={{ uri: item.image }}
                    style={{ width: viewportWidth * 0.4, height: viewportWidth * 0.4, borderRadius: 10 }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
                <Text className="text-lg font-bold text-center dark:text-white mt-2">{item.name}</Text>
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
                contentContainerStyle={{ paddingBottom: 110 }}
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
                                        <TouchableOpacity onPress={() => navigateToEventDetail(item)}>
                                            <View style={{ marginRight: 10, position: 'relative' }}>
                                                <Image
                                                    source={{ uri: frontImage }}
                                                    style={{
                                                        width: viewportWidth * 0.8,
                                                        height: 200,
                                                        borderRadius: 15,
                                                    }}
                                                    contentFit="cover"
                                                    cachePolicy="memory-disk"
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
                                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
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
