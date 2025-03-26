import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Dimensions, useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Screen } from '../../../../src/components/Screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from "expo-router";
import { Image } from 'expo-image';
import { getEvents } from '../../../../src/composable/useApi';
import HeaderWithSOS from "../../../../src/components/HeaderWithSOS";

const EventsScreen = () => {
    const colorScheme = useColorScheme();
    const { width: viewportWidth } = Dimensions.get('window');
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(0); // 0 representa "Ver todos"
    const router = useRouter();

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEventsByMonth(selectedMonth);
    }, [events, selectedMonth]);

    const fetchEvents = async () => {
        try {
            const data = await getEvents();
            const formattedEvents = data.map((event: any) => {
                const parsedDate = parseDate(event.updated_at);
                return parsedDate
                    ? { ...event, parsedDate }
                    : null; // Si la fecha no es válida, ignoramos el evento
            }).filter((event: any) => event !== null); // Filtramos los eventos inválidos

            setEvents(formattedEvents);
            setFilteredEvents(formattedEvents); // Mostrar todos los eventos inicialmente
        } catch (error) {
            console.error('Error al obtener eventos:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEvents();
        setRefreshing(false);
    };

    // Función para convertir "21/06/2024 14:48:52" a Date
    const parseDate = (dateString: string) => {
        if (!dateString) return null; // Si no hay fecha, retornamos null

        const parts = dateString.split(" ");
        if (parts.length < 2) return null; // Verificamos que la fecha tenga el formato esperado

        const [day, month, year] = parts[0].split("/");
        if (!day || !month || !year) return null; // Verificamos que tenga los tres valores

        return new Date(`${year}-${month}-${day}`);
    };


    const filterEventsByMonth = (month: number) => {
        if (month === 0) {
            setFilteredEvents(events); // Mostrar todos los eventos
            return;
        }

        const filtered = events.filter((event: any) => {
            return event.parsedDate instanceof Date && !isNaN(event.parsedDate.getTime()) &&
                event.parsedDate.getMonth() + 1 === month;
        });

        setFilteredEvents(filtered);
    };

    const navigateToEventDetail = (event: any) => {
        router.push({
            pathname: '/events/event-detail',
            params: { event: JSON.stringify(event) },
        });
    };

    const renderEventItem = ({ item }: { item: any }) => {
        const frontImage = item.images && item.images.length > 0 ? item.images[0].filePath : null;

        return (
            frontImage && (
                <TouchableOpacity
                    style={{
                        width: viewportWidth * 0.9,
                        alignSelf: 'center',
                        marginBottom: 15,
                        padding: 10,
                        backgroundColor: colorScheme === 'dark' ? '#2d2d2d' : '#ffffff',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colorScheme === 'dark' ? '#444' : '#ccc',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                    onPress={() => navigateToEventDetail(item)}
                >
                    <Image
                        source={{ uri: frontImage }}
                        style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 10,
                            backgroundColor: '#ffffff',
                        }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                    />
                    <Text
                        style={{
                            marginVertical: 8,
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: colorScheme === 'dark' ? '#ffffff' : '#333',
                        }}
                    >
                        {item.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: colorScheme === 'dark' ? '#aaaaaa' : '#666',
                        }}
                    >
                        {item.description.length > 100
                            ? `${item.description.substring(0, 100)}...`
                            : item.description}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: colorScheme === 'dark' ? '#cccccc' : '#999',
                            marginTop: 5,
                        }}
                    >
                        {item.updated_at} {/* Mostramos la fecha original */}
                    </Text>
                </TouchableOpacity>
            )
        );
    };

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

            {/* Título y filtro por mes */}
            <View className="p-4 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white">Eventos</Text>
                <Ionicons name="calendar-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </View>

            {/* Selector de Mes */}
            <View className="px-4 pb-2">
                <Text className="text-lg font-semibold text-gray-800 dark:text-white">Filtrar por Mes</Text>
                <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                    style={{ color: colorScheme === 'dark' ? 'white' : 'black' }}
                >
                    <Picker.Item label="Ver todos" value={0} />
                    <Picker.Item label="Enero" value={1} />
                    <Picker.Item label="Febrero" value={2} />
                    <Picker.Item label="Marzo" value={3} />
                    <Picker.Item label="Abril" value={4} />
                    <Picker.Item label="Mayo" value={5} />
                    <Picker.Item label="Junio" value={6} />
                    <Picker.Item label="Julio" value={7} />
                    <Picker.Item label="Agosto" value={8} />
                    <Picker.Item label="Septiembre" value={9} />
                    <Picker.Item label="Octubre" value={10} />
                    <Picker.Item label="Noviembre" value={11} />
                    <Picker.Item label="Diciembre" value={12} />
                </Picker>
            </View>

            {/* Lista de eventos filtrados */}
            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEventItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colorScheme === 'dark' ? 'white' : 'black']}
                    />
                }
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-500 dark:text-gray-400 text-lg">
                            No hay eventos en este mes
                        </Text>
                    </View>
                }
            />
        </Screen>
    );
};

export default EventsScreen;
