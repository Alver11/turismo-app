import {View, Text, FlatList, TouchableOpacity, useColorScheme} from 'react-native'
import { Screen } from '../../../../src/components/Screen'
import { Stack, useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import {Image} from "expo-image"
import {FontAwesome6} from "@expo/vector-icons";
import HeaderWithSOS from "../../../../src/components/HeaderWithSOS";

const districts = [
    {
        name: 'Caacupé',
        id: 1,
        places: [
            { id: 1, name: 'Museo de La Basílica', link: 'https://tourmkr.com/F1ymBWxLMo' },
            { id: 2, name: 'Kurusu Peregrino', link: 'https://tourmkr.com/F1gRHjZjlm' },
            { id: 3, name: 'Cerro Kavaju', link: 'https://tourmkr.com/F1JVMoH8SM' },
            { id: 4, name: 'El Escondido', link: 'https://tourmkr.com/F1Whd3fpbQ' },
            { id: 5, name: 'Basílica de Caacupé', link: 'https://tourmkr.com/F1wHgb1Nm2' },
            { id: 6, name: 'Viveros Cabaña', link: 'https://tourmkr.com/F1V83TIMMA' },
            { id: 7, name: 'Tupasy Ykua', link: 'https://tourmkr.com/F1YQ6ul6NX' },
            { id: 8, name: 'Mural Artístico Colegio Cristo Rey', link: 'https://tourmkr.com/F1jgyJgnMY' },
            { id: 9, name: 'Cerro Cristo Rey', link: 'https://tourmkr.com/F1ZGrA2wgg' },
        ],
    },
    {
        name: 'San Bernardino',
        id: 2,
        places: [
            { id: 10, name: 'Casa Hussler', link: 'https://tourmkr.com/F1d4sJPsQ5' },
            { id: 11, name: 'Casa Buttner', link: 'https://tourmkr.com/F1JKR7L83A' },
            { id: 12, name: 'Mirador Virgen Aparecida', link: 'https://tourmkr.com/F1XvSh9fiu' },
            { id: 13, name: 'Escalinata', link: 'https://tourmkr.com/F1daLfOzL3' },
            { id: 14, name: 'Paseo del Recuerdo', link: 'https://tourmkr.com/F1nlCnNC1T' },
            { id: 15, name: 'Capilla Nuestra Señora de La Asunción', link: 'https://tourmkr.com/F1NGGOm3Y1' },
            { id: 16, name: 'Mirador El Principito', link: 'https://tourmkr.com/F1TO5vq7tx' },
            { id: 17, name: 'Arbol de la vida', link: 'https://tourmkr.com/F1yQnfEOE9' },
            { id: 18, name: 'Anfiteatro José Asunción Flores', link: 'https://tourmkr.com/F1XHDRBLDO' },
            { id: 19, name: 'Monumento Al Soldado Desconocido', link: 'https://tourmkr.com/F1Eq2YhHeC' },
        ],
    },
    {
        name: 'Altos',
        id: 3,
        places: [
            { id: 20, name: 'Parroquia San Pedro y San Pablo', link: 'https://tourmkr.com/F18dx9F6ep' },
            { id: 21, name: 'Granja Don Papalo', link: 'https://tourmkr.com/F1TdcgK3Da' },
            { id: 22, name: 'Plaza de Los Héroes', link: 'https://tourmkr.com/F1gYcaZ5GD' },
            { id: 23, name: 'Centro Cultural Museo y Biblioteca Municipal', link: 'https://tourmkr.com/F1TMZI7bNy' },
            { id: 24, name: 'Quinta Tajy Cañada', link: 'https://tourmkr.com/F1u9w4Wixv' },
            { id: 25, name: 'Casa José Escobar Artesanía', link: 'https://tourmkr.com/F1ECqVUiVE' },
            { id: 26, name: 'Iglesia Franciscana', link: 'https://tourmkr.com/F1yZOIqH2n' },
            { id: 27, name: 'Acuña de Figueroa Agricultura', link: 'https://tourmkr.com/F12YH9BY0J' },
        ],
    },
    {
        name: 'Atyra',
        id: 4,
        places: [
            { id: 28, name: 'Kurusu Cerro', link: 'https://tourmkr.com/F1JVMoH8SM' },
            { id: 29, name: 'Mirador Divino Niño', link: 'https://tourmkr.com/F1RECuqtMV' },
            { id: 30, name: 'Plaza de Los Héroes', link: 'https://tourmkr.com/F1elsUXiqv' },
            { id: 31, name: 'Pombero Roga', link: 'https://tourmkr.com/F1tSfuMqOa' },
            { id: 32, name: 'Casa de Retiro Marianela', link: 'https://tourmkr.com/F1jsYfnzYH' },
            { id: 33, name: 'Centro Recreativo 25 de Noviembre', link: 'https://tourmkr.com/F177ET4lfV' },
            { id: 34, name: 'Paseo Peatonal Indio José', link: 'https://tourmkr.com/F1MdtKv6NQ' },
            { id: 35, name: 'Iglesia San Francisco de Asís', link: 'https://tourmkr.com/F14UGiwleQ' },
        ],
    },
    {
        name: 'Nueva Colombia',
        id: 5,
        places: [
            { id: 36, name: 'Iglesia San Miguel Arcángel', link: 'https://tourmkr.com/F15u8VlSm8' },
            { id: 37, name: 'Granja Vy´a Renda', link: 'https://tourmkr.com/F1KFdELZjM' },
            { id: 38, name: 'Cabañas Los Pinares', link: 'https://tourmkr.com/F1zgs0aQuD' },
            { id: 39, name: 'Quinta Los Abuelos', link: 'https://tourmkr.com/F1AakE44Oi' },
            { id: 40, name: 'Plaza 29 de Septiembre', link: 'https://tourmkr.com/F1azAbxxeq' },
        ],
    },
];

export default function StreetView() {
    const router = useRouter()
    const colorScheme = useColorScheme();

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
            <View className="bg-white dark:bg-gray-800 flex-row justify-between items-center" style={{
                alignItems: 'center',
                padding: 12,
                marginBottom: 10,
                borderRadius: 8
            }}>
                {/* Título del lugar */}
                <Text className="text-sm text-gray-800 dark:text-gray-300">{item.name}</Text>
                {/* Ícono del lugar 360° */}
                <FontAwesome6 name="street-view" size={24} color="#008c9e" />
            </View>
        </TouchableOpacity>
    );

    // Renderizar los distritos y sus lugares
    const renderDistrictItem = ({ item }: { item: PlaceList }) => (
        <View>
            {/* Título del distrito */}
            <Text className="font-bold mb-2 text-gray-600 dark:text-gray-300" style={{ fontSize: 18}}>
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
            {/* Cabecera Reutilizable con Botón SOS */}
            <HeaderWithSOS />
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
