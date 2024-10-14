import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native'
import { Screen } from '../../../../src/components/Screen'
import { Stack, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import {Image} from "expo-image"

const districts = [
    {
        name: 'Caacupé',
        id: 1,
        places: [
            { id: 1, name: 'Lugar del 360', link: 'https://tourmkr.com/F1ymBWxLMo' },
            { id: 2, name: 'Lugar del 360', link: 'https://tourmkr.com/F1gRHjZjlm' },
            { id: 3, name: 'Lugar del 360', link: 'https://tourmkr.com/F1JVMoH8SM' },
        ],
    },
    {
        name: 'San Bernardino',
        id: 2,
        places: [
            { id: 4, name: 'Lugar del 360', link: 'https://tourmkr.com/F1d4sJPsQ5' },
            { id: 5, name: 'Lugar del 360', link: 'https://tourmkr.com/F1JKR7L83A' },
        ],
    },
]

export default function StreetView() {
    const router = useRouter()

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

    // Navegación al detalle del lugar 360°
    const navigateToView360 = (item: PlaceListItem) => {
        router.push({
            pathname: '/street/view-360',
            params: { url: item.link },
        });
    };

    // Renderizar los lugares turísticos con sus enlaces
    const renderPlaceItem = ({ item }: { item: PlaceListItem }) => (
        <TouchableOpacity onPress={() => navigateToView360(item)}>
            <View style={{
                backgroundColor: '#F3F4F6',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                marginBottom: 10,
                borderRadius: 8
            }}>
                {/* Título del lugar */}
                <Text style={{ fontSize: 16, color: '#4B5563' }}>{item.name}</Text>
                {/* Ícono del lugar 360° */}
                <Ionicons name="cube-outline" size={24} color="#008c9e" />
            </View>
        </TouchableOpacity>
    );

    // Renderizar los distritos y sus lugares
    const renderDistrictItem = ({ item }: { item: PlaceList }) => (
        <View>
            {/* Título del distrito */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#111827' }}>
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
            {/* Lista de distritos con sus lugares */}
            <FlatList
                data={districts}
                renderItem={renderDistrictItem}
                keyExtractor={(district) => district.id.toString()}  // Usamos el `id` único de cada distrito
                contentContainerStyle={{ padding: 16 }}
            />
        </Screen>
    );
}
