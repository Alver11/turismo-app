import {View, Text, Dimensions, FlatList, ScrollView, Linking, TouchableOpacity} from 'react-native';
import { useColorScheme } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../../../src/components/Screen';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';

export default function EventDetail() {
    const { event } = useLocalSearchParams();
    const parsedEvent = event ? JSON.parse(event as string) : null;
    const { width: viewportWidth } = Dimensions.get('window');
    const paddingHorizontal = 16;
    const imageWidth = viewportWidth - paddingHorizontal * 2;
    const colorScheme = useColorScheme();

    const [showFullDescription, setShowFullDescription] = useState(false);

    interface ImageItem {
        id: number;
        filePath: string;
    }

    const renderItem = ({ item }: { item: ImageItem }) => (
        <Image
            source={{ uri: item.filePath }}
            className="w-full m-1 rounded-lg"
            style={{ height: 300, width: imageWidth }}
            contentFit="cover"
            cachePolicy="memory-disk"
        />
    );

    const handleNavigate = () => {
        const lat = parsedEvent.lat;
        const lng = parsedEvent.lng;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerLeft: () => null,
                    headerTitle: "Noticias / Eventos",
                    headerShadowVisible: false,
                    headerShown: true
                }}
            />
            <ScrollView>
                {/* Mueve el título y la fecha aquí, antes de las imágenes */}
                <View className="p-5">
                    {/* Título y Fecha */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 3, height: 30, backgroundColor: 'red', marginRight: 10 }} />
                            <Text className={`text-2xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                {parsedEvent.name}
                            </Text>
                        </View>
                        <Text className={`text-sm ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                            {parsedEvent.updated_at ? parsedEvent.updated_at : 'Fecha no disponible'}
                        </Text>
                    </View>
                </View>

                {/* Luego renderiza las imágenes después del título */}
                <FlatList
                    data={parsedEvent.images}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    style={{ paddingHorizontal }}
                />

                {/* Información adicional */}
                <View className="p-5">
                    <Text
                        className={`text-base mt-2 leading-6 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}
                    >
                        {parsedEvent.description}
                    </Text>

                    {/* Distrito */}
                    {parsedEvent.districtName && (
                        <Text className={`text-base mt-5 leading-6 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                            Distrito: {parsedEvent.districtName}
                        </Text>
                    )}

                    {/* Dirección con icono */}
                    {parsedEvent.address && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Ionicons name="location-outline" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                            <Text className={`ml-1 text-base leading-6 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
                                Lugar del evento: {parsedEvent.address}
                            </Text>
                        </View>
                    )}

                    {/* Botón de navegación */}
                    {parsedEvent.lat && parsedEvent.lng && (
                        <View className="w-full flex items-center mt-4">
                            <TouchableOpacity
                                onPress={handleNavigate}
                                className="flex-row items-center justify-center p-5 bg-cyan-700 rounded-lg"
                                style={{ width: '50%' }}
                            >
                                <Ionicons name="map-outline" size={20} color="white" className="mr-2" />
                                <Text className="text-white text-2xl mr-2 pl-1">Ir</Text>
                                <Ionicons name="arrow-forward-outline" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </Screen>
    );
}
