import React from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

const ServiceDetailScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { service } = router.query;
    const serviceData = JSON.parse(service || '{}');

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }}>
            <Image
                source={{ uri: serviceData.images[0]?.file_path ? `https://your-api-url.com/${serviceData.images[0]?.file_path}` : undefined }}
                style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
            />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colorScheme === 'dark' ? '#fff' : '#000' }}>
                {serviceData.type_service?.name}
            </Text>
            <Text style={{ fontSize: 16, color: colorScheme === 'dark' ? '#ccc' : '#333', marginTop: 8 }}>
                {serviceData.description || 'Sin descripción disponible'}
            </Text>
        </View>
    );
};

export default ServiceDetailScreen;