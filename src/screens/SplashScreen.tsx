import React, {Dispatch, SetStateAction, useRef} from 'react';
import { View } from 'react-native';
import LottieView from "lottie-react-native";
import {StatusBar} from "expo-status-bar";

interface SplashProps {
    setIsLoading: Dispatch<SetStateAction<boolean>>
    isDarkMode: boolean
}

export default function SplashScreen({setIsLoading, isDarkMode}: SplashProps) {
    const animation = useRef<LottieView>(null);
    return (
        <View style={{flex: 1, alignItems: 'center', margin: 0}}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <LottieView
                autoPlay
                ref={animation}
                loop={false}
                style={{flex: 1, width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center'}}
                source={require('@/assets/splashCordillera.json')}
                onAnimationFinish={() => {
                    setIsLoading(false);
                }}
            />
        </View>
    )
}