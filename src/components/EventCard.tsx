import { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useColorScheme } from 'react-native';


const EventCard = ({ item, onPress }: { item: any, onPress: () => void }) => {
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const frontImage = item.images?.[0]?.filePath;

    return (
        <TouchableOpacity
            style={{
                width: Dimensions.get('window').width * 0.85,
                marginRight: 10,
                padding: 10,
                backgroundColor: colorScheme === 'dark' ? '#2d2d2d' : '#ffffff',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colorScheme === 'dark' ? '#444' : '#ccc',
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 5,
            }}
            onPress={onPress}
        >
            <View style={{ width: '100%', height: 200, borderRadius: 10, overflow: 'hidden', backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }}>
                {loading && <ActivityIndicator size="large" color="#ff6600" />}
                <Image
                    source={{ uri: frontImage }}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    transition={300}
                    placeholder={null}
                />
            </View>
            <Text style={{ marginVertical: 8, fontSize: 16, fontWeight: 'bold', color: colorScheme === 'dark' ? '#ffffff' : '#333' }}>
                {item.name}
            </Text>
            <Text style={{ fontSize: 14, color: colorScheme === 'dark' ? '#aaaaaa' : '#666' }}>
                {item.description?.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
            </Text>
            <Text style={{ fontSize: 12, color: colorScheme === 'dark' ? '#cccccc' : '#999', marginTop: 5 }}>
                {item.date}
            </Text>
        </TouchableOpacity>
    );
};

export default EventCard;