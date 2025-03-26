import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Linking, TextInput, useColorScheme } from 'react-native';
import { Screen } from '../../../../src/components/Screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getServices } from "../../../../src/composable/useApi";
import { Stack } from "expo-router";
import HeaderWithSOS from "../../../../src/components/HeaderWithSOS";

const ServicesScreen = () => {
    const [services, setServices] = useState([]);
    const [searchText, setSearchText] = useState('');
    const colorScheme = useColorScheme();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                const filteredServices = data.filter((item: any) => item.type_data === 'Servicio');
                setServices(filteredServices);
            } catch (error) {
                console.error('Error al obtener servicios:', error);
            }
        };

        fetchServices();
    }, []);

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleNavigate = (lat: string, lng: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        Linking.openURL(url);
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderServiceItem = ({ item }: { item: any }) => {
        const imageUrl = item.images?.length > 0 ? `https://api.cordillera.gov.py/storage/${item.images[0].file_path}` : null;

        return (
            <View className="bg-gray-300 p-3 rounded-lg shadow-md flex-row items-center m-2">
                {/* Imagen */}
                {imageUrl && (
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 70, height: 70, borderRadius: 10, marginRight: 10 }}
                        resizeMode="cover"
                    />
                )}

                {/* Información del servicio */}
                <View style={{ flex: 1 }}>
                    <Text className="text-lg font-bold text-black">{item.name}</Text>
                    <Text className="text-gray-700">{item.description}</Text>

                    {/* Botones */}
                    <View className="flex-row items-center mt-2">
                        {/* Teléfono */}
                        {item.phone && (
                            <TouchableOpacity onPress={() => handleCall(item.phone)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                <Ionicons name="call" size={18} color="blue" />
                                <Text className="text-blue-700 ml-1">{item.phone}</Text>
                            </TouchableOpacity>
                        )}

                        {/* Ubicación */}
                        {item.lat && item.lng && (
                            <TouchableOpacity onPress={() => handleNavigate(item.lat, item.lng)}>
                                <Text className="text-green-600 font-bold">Ir al lugar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <Screen>
            <Stack.Screen options={{ headerTitle: "", headerShown: false }} />
            {/* Cabecera Reutilizable con Botón SOS */}
            <HeaderWithSOS />

            {/* Título */}
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colorScheme === 'dark' ? '#fff' : '#000' }}>
                    Servicios
                </Text>
            </View>

            {/* Barra de búsqueda */}
            <View className="flex-row items-center px-4 m-2 my-3 bg-white rounded-lg border border-gray-300 shadow-sm">
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

            {/* Lista de servicios */}
            <FlatList
                data={filteredServices}
                renderItem={renderServiceItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
                        No hay servicios disponibles.
                    </Text>
                }
            />
        </Screen>
    );
};

export default ServicesScreen;
