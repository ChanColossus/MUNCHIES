import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import RoutesNavigator from "./navigation/AdminNavigator";
import RouteNavigator from "./navigation/RouteNavigator";
import { PaperProvider } from "react-native-paper";
import { NativeBaseProvider } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  return (
    <NativeBaseProvider>
      <PaperProvider>
        <RoutesNavigator />
      </PaperProvider>
    </NativeBaseProvider>
  );
}
