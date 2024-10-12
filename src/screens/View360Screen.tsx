import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Gyroscope } from 'expo-sensors';

export default function View360Screen() {
    const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        const subscription = Gyroscope.addListener((result) => {
            setGyroscopeData(result);
            // Aquí puedes manejar la lógica para manipular la WebView según el giroscopio
        });

        Gyroscope.setUpdateInterval(100); // Actualiza cada 100 ms

        return () => {
            subscription.remove(); // Limpia el listener cuando el componente se desmonta
        };
    }, []);

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: 'https://tourmkr.com/F1ymBWxLMo' }}
                style={{ flex: 1 }}
                // Aquí podrías pasar los valores del giroscopio a la WebView si tu visor soporta giroscopio
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 85
    },
});
