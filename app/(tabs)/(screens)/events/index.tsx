import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Dimensions, useColorScheme } from 'react-native';
import { Screen } from '../../../../src/components/Screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from "expo-router";
import { Image } from 'expo-image';
import { getEvents } from '../../../../src/composable/useApi';
import HeaderWithSOS from "../../../../src/components/HeaderWithSOS";

const EventsScreen = () => {
    const colorScheme = useColorScheme();
    const { width: viewportWidth } = Dimensions.get('window');
    const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryEvents, setCategoryEvents] = useState<{ [key: string]: any[] }>({});
    const [eventsToday, setEventsToday] = useState<any[]>([]);
    const [allValidEvents, setAllValidEvents] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await getEvents();
            const today = new Date().toISOString().split('T')[0];

            const validEvents = data.filter((event: any) => {
                const hasCategory = event.categories && event.categories.length > 0;
                const hasDistrict = !!event.district;
                const isNotExpired = !event.publication_end_date || new Date(event.publication_end_date) >= new Date();
                return hasCategory && hasDistrict && isNotExpired;
            });

            const grouped: { [key: string]: any[] } = {};
            const todayList: any[] = [];

            validEvents.forEach((event: any) => {
                const eventDate = event.event_date?.split('T')[0];
                if (eventDate === today) {
                    todayList.push(event);
                }
                event.categories.forEach((category: any) => {
                    const name = category.name;
                    if (!grouped[name]) grouped[name] = [];
                    grouped[name].push(event);
                });
            });

            const sortedEvents = [...validEvents].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

            setAllValidEvents(sortedEvents);
            setCategoryEvents(grouped);
            setEventsToday(todayList);
            const keys = Object.keys(grouped);
            setCategories(keys);
            setActiveFilter('all');
            setFilteredEvents(sortedEvents);

        } catch (error) {
            console.error('Error al obtener eventos:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEvents();
        setRefreshing(false);
    };

    const handleFilter = (filter: string) => {
        setActiveFilter(filter);
        if (filter === 'today') {
            setFilteredEvents(eventsToday);
        } else if (filter === 'all') {
            setFilteredEvents(allValidEvents);
        } else {
            setFilteredEvents(categoryEvents[filter] || []);
        }
    };

    const navigateToEventDetail = (event: any) => {
        router.push({ pathname: '/events/event-detail', params: { event: JSON.stringify(event) } });
    };

    const renderEventItem = ({ item }: { item: any }) => {
        const frontImage = item.images?.[0]?.filePath || null;
        return frontImage && (
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
                    style={{ width: '100%', height: 200, borderRadius: 10, backgroundColor: '#ffffff' }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                />
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

    return (
        <Screen>
            <Stack.Screen options={{ headerTitle: '', headerShown: false }} />
            <HeaderWithSOS />

            <View className="p-4 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white">Eventos</Text>
                <Ionicons name="calendar-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </View>

            <View className="flex-row flex-wrap px-4 gap-2 pb-4">
                <TouchableOpacity
                    onPress={() => handleFilter('all')}
                    className={`px-4 py-2 rounded-full ${activeFilter === 'all' ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                    <Text className={`font-semibold ${activeFilter === 'all' ? 'text-white' : 'text-black dark:text-white'}`}>Todos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleFilter('today')}
                    className={`px-4 py-2 rounded-full ${activeFilter === 'today' ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                    <Text className={`font-semibold ${activeFilter === 'today' ? 'text-white' : 'text-black dark:text-white'}`}>Eventos de hoy</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => handleFilter(cat)}
                        className={`px-4 py-2 rounded-full ${activeFilter === cat ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                    >
                        <Text className={`font-semibold ${activeFilter === cat ? 'text-white' : 'text-black dark:text-white'}`}>{cat[0].toUpperCase() + cat.slice(1)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEventItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colorScheme === 'dark' ? 'white' : 'black']} />}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-500 dark:text-gray-400 text-lg">No hay eventos para esta categoría</Text>
                    </View>
                }
            />
        </Screen>
    );
};

export default EventsScreen;
