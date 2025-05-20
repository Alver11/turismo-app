import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, Linking, useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from "expo-image";
import { getServices } from "../composable/useApi";  // Asegúrate de importar correctamente

const HeaderWithSOS = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [emergencies, setEmergencies] = useState([]);
    const colorScheme = useColorScheme();

    useEffect(() => {
        const fetchEmergencies = async () => {
            try {
                const data = await getServices();
                const filteredEmergencies = data.filter((item: any) => item.type_data === "Emergencia");
                setEmergencies(filteredEmergencies);
            } catch (error) {
                console.error("Error al obtener emergencias:", error);
            }
        };

        fetchEmergencies();
    }, []);

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    return (
        <>
            {/* Cabecera con Logo y Botón SOS */}
            <View className="pl-4 pb-1 mt-12 rounded-lg flex-row justify-between items-center">
                {/* Logo */}
                {colorScheme === "dark" ? (
                    <Image source={require("../../assets/logo-black.png")} style={{ width: 90, height: 60, resizeMode: "contain" }} />
                ) : (
                    <Image source={require("../../assets/logo.png")} style={{ width: 90, height: 60, resizeMode: "contain" }} />
                )}

                {/* Botón SOS */}
                <TouchableOpacity onPress={() => setModalVisible(true)} className="mr-4 bg-red-500 p-2 rounded-full">
                    <MaterialIcons name="contact-emergency" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Modal de Emergencias */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View className="flex-1 bg-black bg-opacity-70 justify-center items-center">
                    <View className="bg-white dark:bg-gray-800 p-5 rounded-lg w-4/5">
                        <Text className="text-lg font-bold text-black dark:text-white mb-3">Emergencias</Text>

                        <FlatList
                            data={emergencies}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg my-2">
                                    <Text className="text-black dark:text-white font-bold">{item.name}</Text>
                                    <TouchableOpacity onPress={() => handleCall(item.phone)} className="flex-row items-center mt-1">
                                        <Ionicons name="call" size={18} color="blue" />
                                        <Text className="text-blue-700 ml-1">{item.phone}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />

                        {/* Cerrar Modal */}
                        <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-3 p-2 bg-red-500 rounded-lg items-center">
                            <Text className="text-white font-bold">Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default HeaderWithSOS;
