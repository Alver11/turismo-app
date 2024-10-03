import React from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';

export default function TouristPlaceScreen({ route }: any) {
    const { touristPlace } = route.params;
    const { width: viewportWidth } = Dimensions.get('window');
    const colorScheme = useColorScheme();

    const frontImage = touristPlace.images.find((img: any) => img.frontPage)?.filePath;
    const { lat, lng } = touristPlace;  // Las coordenadas

    // Función para abrir la app de navegación
    const openMaps = () => {
        const url = Platform.select({
            ios: `maps:0,0?q=${touristPlace.name}@${lat},${lng}`,
            android: `geo:0,0?q=${lat},${lng}(${touristPlace.name})`,
        });

        if (url) {
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
        }
    };

    // Renderizar imágenes en el carrusel
    const renderCarouselImage = ({ item }: { item: any }) => (
        <View style={{ marginRight: 10 }}>
            <Image
                source={{ uri: item.filePath }}
                style={{ width: viewportWidth * 0.8, height: 200, borderRadius: 10 }}
            />
        </View>
    );

    return (
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: colorScheme === 'dark' ? '#1a202c' : '#f7fafc' }}>
            {/* Imagen principal (portada) */}
            {frontImage && (
                <Image
                    source={{ uri: frontImage }}
                    style={{ width: '100%', height: 200, marginBottom: 20, borderRadius: 15 }}
                />
            )}

            {/* Carrusel de imágenes */}
            <FlatList
                data={touristPlace.images.filter((img: any) => !img.frontPage)}
                renderItem={renderCarouselImage}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />

            {/* Detalles del lugar turístico */}
            <View style={{ marginTop: 20, backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1a202c' }}>{touristPlace.name}</Text>
                {touristPlace.districtName && (
                    <Text style={{ color: '#4a5568', marginTop: 5 }}>Distrito: {touristPlace.districtName}</Text>
                )}
                {touristPlace.address && (
                    <Text style={{ color: '#4a5568', marginTop: 5 }}>Dirección: {touristPlace.address}</Text>
                )}
                <Text style={{ color: '#4a5568', marginTop: 10 }}>{touristPlace.description}</Text>

                {/* Botón para abrir Google Maps */}
                <TouchableOpacity
                    onPress={openMaps}
                    style={{ marginTop: 20, backgroundColor: '#4299e1', padding: 15, borderRadius: 10 }}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Ir</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
