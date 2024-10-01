import React from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';

export default function EventDetailScreen({ route }: any) {
    const { event } = route.params;
    const { width: viewportWidth } = Dimensions.get('window');
    const colorScheme = useColorScheme();

    return (
        <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }}>
            <ScrollView contentContainerStyle={{ paddingTop: 60 }}>
                {event.images && event.images.length > 0 && (
                    <Image
                        source={{ uri: event.images[0].filePath }}
                        style={{ width: viewportWidth, height: 300, resizeMode: 'cover' }}
                    />
                )}
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: colorScheme === 'dark' ? 'white' : 'black' }}>
                        {event.name}
                    </Text>
                    <Text style={{ fontSize: 16, marginTop: 10, color: colorScheme === 'dark' ? 'white' : 'black' }}>
                        {event.description}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
