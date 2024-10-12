import React from "react";
import {View} from "react-native";

export function Screen({ children }: { children: React.ReactNode } ) {
    return <View className="flex-1 bg-white">{ children}</View>
}