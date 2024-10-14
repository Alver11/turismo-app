import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import {Stack, useLocalSearchParams} from 'expo-router';
import { Screen } from '../../../../src/components/Screen';

export default function View360Screen() {
    const { url } = useLocalSearchParams();

    const validUrl = Array.isArray(url) ? url[0] : url;

    if (!validUrl || typeof validUrl !== 'string') {
        return (
            <View style={styles.container}>
                <Text>Error: URL no encontrada o no válida</Text>
            </View>
        );
    }

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: "Vista 360",
                    headerShown: true,
                }}
            />
            <View style={styles.container}>
                <WebView
                    source={{ uri: validUrl }}
                    style={{ flex: 1 }}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
