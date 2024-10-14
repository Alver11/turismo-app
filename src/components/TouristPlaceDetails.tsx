import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Linking, RefreshControl, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TouristPlaceDetailsProps {
    parameter: any;
}

export const TouristPlaceDetails = ({ parameter }: TouristPlaceDetailsProps) => {
    const { width: viewportWidth } = Dimensions.get('window');
    const parsedPlace = parameter;
    const [liked, setLiked] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);  // Para almacenar la imagen seleccionada
    const paddingHorizontal = 16;
    const imageWidth = viewportWidth - paddingHorizontal * 2;

    useEffect(() => {
        // Cargar el estado de 'me gusta' desde AsyncStorage
        const loadLikeStatus = async () => {
            const likeStatus = await AsyncStorage.getItem(`like_${parsedPlace.id}`);
            if (likeStatus) {
                setLiked(JSON.parse(likeStatus));
            }
        };
        loadLikeStatus();
    }, [parsedPlace]);

    const toggleLike = async () => {
        const newLikeStatus = !liked;
        setLiked(newLikeStatus);
        await AsyncStorage.setItem(`like_${parsedPlace.id}`, JSON.stringify(newLikeStatus));  // Guardar en AsyncStorage
    };

    const handleNavigate = () => {
        const lat = parsedPlace.lat;
        const lng = parsedPlace.lng;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Aquí puedes agregar lógica para recargar datos o refrescar la pantalla
        setRefreshing(false);
    };

    const openImageModal = (imageUri: string) => {
        setSelectedImage(imageUri);
        setModalVisible(true);
    };

    const closeImageModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View className="p-5">
                {/* Título del lugar */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View className="bg-orange-600 mr-2" style={{ width: 3, height: 50 }} />
                        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">{parsedPlace?.name}</Text>
                    </View>
                </View>
            </View>

            {/* Imagen principal (hace clic para ver en tamaño completo) */}
            {parsedPlace?.images && parsedPlace.images.length > 0 && (
                <TouchableOpacity onPress={() => openImageModal(parsedPlace.images[0].filePath)}>
                    <Image
                        source={{ uri: parsedPlace.images[0].filePath }}
                        className="w-full ml-4 mr-4 mb-4 rounded-lg"
                        style={{ width: imageWidth, height: 250, borderRadius: 10 }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                    />
                </TouchableOpacity>
            )}

            {/* Imágenes adicionales (cada una puede abrirse en tamaño completo) */}
            {parsedPlace?.images?.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="ml-4">
                    {parsedPlace.images.slice(1).map((image: any) => (
                        <TouchableOpacity key={image.id} onPress={() => openImageModal(image.filePath)}>
                            <Image
                                source={{ uri: image.filePath }}
                                style={{ width: 100, height: 100, borderRadius: 10, marginRight: 10 }}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Listado de categorías como chips */}
            {parsedPlace?.categories?.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10, marginLeft: 15 }}>
                    {parsedPlace.categories.map((category: any) => (
                        <View
                            key={category.id}
                            style={{
                                backgroundColor: '#008c9e',
                                borderRadius: 20,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                marginRight: 8,
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 14 }}>{category.name}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Información del lugar */}
            <View className="pl-5 pr-5">
                {/* Dirección */}
                {parsedPlace?.address && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                            <Ionicons name="location-outline" size={20} color="gray" />
                            <Text className="ml-2 text-base text-gray-600 dark:text-gray-300">{parsedPlace.address}</Text>
                        </View>
                        <TouchableOpacity onPress={toggleLike}>
                            <Ionicons name="heart" size={24} color={liked ? 'red' : 'gray'} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Distrito */}
                {parsedPlace?.districtName && (
                    <Text className="text-base mt-2 text-gray-600 dark:text-gray-300">{parsedPlace.districtName}
                        <Text className="font-bold">Distrito: </Text>{parsedPlace.districtName}
                    </Text>
                )}

                {/* Descripción */}
                <Text className="text-base mt-2 text-gray-600 dark:text-gray-300">{parsedPlace?.description}</Text>

                {/* Atributos adicionales como el número de celular */}
                {parsedPlace?.attribute?.length > 0 && parsedPlace.attribute.map((attr: any) => (
                    <Text key={attr.id} className="text-base mt-2 text-gray-600">
                        <Text className="font-bold">{attr.name}: </Text>{attr.info}
                    </Text>
                ))}

                {/* Botón para navegar */}
                {parsedPlace?.lat && parsedPlace?.lng && (
                    <TouchableOpacity
                        onPress={handleNavigate}
                        className="mt-4 mb-5 p-3 bg-blue-500 rounded-lg items-center"
                    >
                        <Text className="text-white font-bold">Ver en Google Maps</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Modal para ver imágenes en pantalla completa */}
            {selectedImage && (
                <Modal visible={isModalVisible} transparent={true}>
                    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={closeImageModal} style={{ position: 'absolute', top: 30, right: 20 }}>
                            <Ionicons name="close-circle" size={40} color="white" />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: viewportWidth, height: viewportWidth }}
                            contentFit="contain"
                        />
                    </View>
                </Modal>
            )}
        </ScrollView>
    );
};
