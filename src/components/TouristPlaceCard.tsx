import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';  // Importa useFocusEffect

interface TouristPlaceCardProps {
    place: any;
    onPress: () => void;
}

export default function TouristPlaceCard({ place, onPress }: TouristPlaceCardProps) {
    const frontImage = place.images.find((img: any) => img.frontPage)?.filePath;
    const [liked, setLiked] = useState(false);

    // useFocusEffect se ejecuta cada vez que la pantalla toma el foco
    useFocusEffect(
        useCallback(() => {
            const loadLikeStatus = async () => {
                const likeStatus = await AsyncStorage.getItem(`like_${place.id}`);
                if (likeStatus) {
                    setLiked(JSON.parse(likeStatus));
                }
            };
            loadLikeStatus();
        }, [place.id])
    );

    const toggleLike = async () => {
        const newLikeStatus = !liked;
        setLiked(newLikeStatus);
        await AsyncStorage.setItem(`like_${place.id}`, JSON.stringify(newLikeStatus));  // Guardar en AsyncStorage
    };

    return (
        <View className="bg-white shadow-md rounded-xl m-2 border dark:bg-gray-800 border-gray-200 dark:border-gray-900" style={{ padding: 10 }}>
            {/* Imagen */}
            {frontImage && (
                <Image
                    source={{ uri: frontImage }}
                    className="w-full h-48 rounded-md"
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
            )}

            <View className="pt-2 pb-2 flex-row justify-between items-center">
                {/* Título y botón de me gusta */}
                <View className="flex-1">
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View className="bg-orange-600 mr-2" style={{ width: 3, height: 40 }} />
                        <Text className="text-lg mr-4 font-bold text-gray-800 dark:text-gray-300">{place.name}</Text>
                    </View>
                </View>

                {/* Botón de me gusta */}
                <TouchableOpacity onPress={toggleLike}>
                    <Ionicons name="heart" size={24} color={liked ? 'red' : 'gray'} />
                </TouchableOpacity>
            </View>

            {/* Categorías debajo del nombre */}
            {place?.categories?.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
                    {place.categories.map((category: any) => (
                        <View
                            key={category.id}
                            style={{
                                backgroundColor: '#008c9e',
                                borderRadius: 20,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                marginRight: 5,
                                marginBottom: 5,
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 12 }}>{category.name}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View className="pt-2">
                {/* Distrito */}
                <Text className="text-gray-600 dark:text-gray-300">
                    <Text className="font-bold">Distrito: </Text>{place.districtName}
                </Text>

                {/* Dirección y Ver información en la misma línea */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Ionicons name="location-outline" size={18} color="gray" />
                        <Text className="text-gray-600 dark:text-gray-300 ml-2" style={{ flex: 1 }}>
                            {place.address}
                        </Text>
                    </View>

                    {/* Botón Ver información */}
                    <TouchableOpacity onPress={onPress}>
                        <Text className="text-green-600 font-bold text-lg">Ver más...</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
