import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#f4661e',
                tabBarInactiveTintColor: '#666',
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                tabBarStyle: {
                    backgroundColor: '#f9f9f9',
                    height: 80,
                    paddingBottom: 25,
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    elevation: 3, // Suaviza la sombra
                },
                tabBarItemStyle: {
                    paddingVertical: 5,
                    marginHorizontal: 5,
                },
                tabBarButton: (props) => (
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'transparent', // Fondo transparente en lugar de blanco
                            borderRadius: 10, // Ajusta el borde redondeado
                            paddingVertical: 5,
                        }}
                        {...props}
                    />
                ),
            }}
        >
            <Tabs.Screen
                name="(screens)/home"
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="home" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(screens)/tourist"
                options={{
                    tabBarLabel: 'Turismo',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="map" size={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(screens)/street"
                options={{
                    tabBarLabel: 'Street View',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="street-view" size={20} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
