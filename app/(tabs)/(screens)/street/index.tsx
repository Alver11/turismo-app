import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    useColorScheme,
    ActivityIndicator,
    RefreshControl,
    TextInput
} from 'react-native';
import { useEffect, useState } from 'react';
import { Screen } from '../../../../src/components/Screen';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import HeaderWithSOS from '../../../../src/components/HeaderWithSOS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTourist } from '../../../../src/composable/useApi';
import NetInfo from '@react-native-community/netinfo';

interface PlaceListItem {
    id: number;
    name: string;
    link: string;
}

interface PlaceList {
    id: number;
    name: string;
    places: PlaceListItem[];
}

export default function StreetView() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [districts, setDistricts] = useState<PlaceList[]>([]);
    const [filteredDistricts, setFilteredDistricts] = useState<PlaceList[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [search, setSearch] = useState('');

    const groupByDistrict = (data: any[]): PlaceList[] => {
        const grouped: Record<string, PlaceList> = {};

        data.forEach((item) => {
            const district = item.districtName ?? 'Sin Distrito';
            if (!grouped[district]) {
                grouped[district] = {
                    id: Object.keys(grouped).length + 1,
                    name: district,
                    places: [],
                };
            }
            if (item.streetView) {
                grouped[district].places.push({
                    id: item.id,
                    name: item.name,
                    link: item.streetView,
                });
            }
        });

        return Object.values(grouped).filter((d) => d.places.length > 0);
    };

    const fetchData = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const net = await NetInfo.fetch();
            setIsOffline(!net.isConnected);

            const response = await getTourist();
            if (response) {
                const grouped = groupByDistrict(response);
                setDistricts(grouped);
                await AsyncStorage.setItem('cachedTouristData', JSON.stringify(grouped));
            } else {
                throw new Error('Respuesta vacía');
            }
        } catch (error) {
            console.warn('Error en fetchData:', error);
            const cached = await AsyncStorage.getItem('cachedTouristData');
            if (cached) {
                setDistricts(JSON.parse(cached));
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredDistricts(districts);
            return;
        }

        const searchLower = search.toLowerCase();

        const filtered = districts
            .map((district) => {
                const matchedPlaces = district.places.filter((place) =>
                    place.name.toLowerCase().includes(searchLower)
                );

                return {
                    ...district,
                    places: matchedPlaces,
                };
            })
            .filter((d) => d.places.length > 0);

        setFilteredDistricts(filtered);
    }, [search, districts]);

    const navigateToView360 = (item: PlaceListItem) => {
        router.push({
            pathname: '/street/view-360',
            params: { url: item.link },
        });
    };

    const renderPlaceItem = ({ item }: { item: PlaceListItem }) => (
        <TouchableOpacity onPress={() => navigateToView360(item)}>
            <View
                className="bg-white dark:bg-gray-800 flex-row justify-between items-center"
                style={{
                    alignItems: 'center',
                    padding: 12,
                    marginBottom: 10,
                    borderRadius: 8,
                }}
            >
                <Text className="text-sm text-gray-800 dark:text-gray-300">{item.name}</Text>
                <FontAwesome6 name="street-view" size={24} color="#008c9e" />
            </View>
        </TouchableOpacity>
    );

    const renderDistrictItem = ({ item }: { item: PlaceList }) => (
        <View>
            <Text className="font-bold mb-2 text-gray-600 dark:text-gray-300" style={{ fontSize: 18 }}>
                {item.name}
            </Text>
            <FlatList
                data={item.places}
                renderItem={renderPlaceItem}
                keyExtractor={(place) => place.id.toString()}
            />
        </View>
    );

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerShown: false,
                }}
            />
            <HeaderWithSOS />
            {isOffline && (
                <Text style={{ textAlign: 'center', padding: 10, color: 'red' }}>
                    Estás viendo datos en modo offline
                </Text>
            )}

            <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                <TextInput
                    placeholder="Buscar lugar..."
                    placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#999'}
                    value={search}
                    onChangeText={setSearch}
                    style={{
                        backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#fff',
                        color: colorScheme === 'dark' ? '#eee' : '#000',
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 8,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: '#ccc',
                    }}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#008c9e" style={{ marginTop: 32 }} />
            ) : (
                <FlatList
                    data={filteredDistricts}
                    renderItem={renderDistrictItem}
                    keyExtractor={(district) => district.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#008c9e']} />
                    }
                />
            )}
        </Screen>
    );
}