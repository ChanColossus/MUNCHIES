import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Dashboard from "../screens/Admin/Dashboard/Dashboard";
import BevviesScreen from "../screens/Admin/Bevvies/BevviesScreen";
import BevviesCreate from "../screens/Admin/Bevvies/BevviesCreate";
import MunchiesScreen from "../screens/Admin/Munchies/MunchiesScreen";
import MunchiesCreate from "../screens/Admin/Munchies/MunchiesCreate";
import InventoryScreen from "../screens/Admin/Inventory/InventoryScreen";
import InventoryCreate from "../screens/Admin/Inventory/InventoryCreate";

export default function AdminNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      {/* 
      <Stack.Screen
        name="ProductsList"
        component={ProductsList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductCreate"
        component={ProductCreate}
        options={{
          title: "Add New Product",
          headerShown: true,
          headerStyle: { height: 40 },
          headerTitleStyle: { fontSize: 16, marginLeft: -15 },
        }}
      /> */}

      <Stack.Screen
        name="MunchiesScreen"
        component={MunchiesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MunchiesCreate"
        component={MunchiesCreate}
        options={{
          title: "Add New Munchies",
          headerShown: true,
          headerStyle: { height: 40 },
          headerTitleStyle: { fontSize: 16, marginLeft: -15 },
        }}
      />

      <Stack.Screen
        name="BevviesScreen"
        component={BevviesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BevviesCreate"
        component={BevviesCreate}
        options={{
          title: "Add New Bevvies",
          headerShown: true,
          headerStyle: { height: 40 },
          headerTitleStyle: { fontSize: 16, marginLeft: -15 },
        }}
      />

      <Stack.Screen
        name="InventoryScreen"
        component={InventoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InventoryCreate"
        component={InventoryCreate}
        options={{
          title: "Add New Inventory",
          headerShown: true,
          headerStyle: { height: 40 },
          headerTitleStyle: { fontSize: 16, marginLeft: -15 },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
