import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import BevviesScreen from "../screens/Admin/Bevvies/BevviesScreen";
import BevviesCreate from "../screens/Admin/Bevvies/BevviesCreate";
import BevviesUpdate from "../screens/Admin/Bevvies/BevviesUpdate";
import MunchiesScreen from "../screens/Admin/Munchies/MunchiesScreen";
import MunchiesCreate from "../screens/Admin/Munchies/MunchiesCreate";
import MunchiesUpdate from "../screens/Admin/Munchies/MunchiesUpdate";
import UserMunchies from "../screens/Admin/Munchies/UserMunchies";
import UserBevvies from "../screens/Admin/Bevvies/UserBevvies";
import InventoryScreen from "../screens/Admin/Inventory/InventoryScreen";
import InventoryCreate from "../screens/Admin/Inventory/InventoryCreate";
import InventoryUpdate from "../screens/Admin/Inventory/InventoryUpdate";
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator
        tabBarStyle={{ backgroundColor: "black" }} // Set background color to black
        tabBarActiveTintColor="white" // Set active tab label color to white
        tabBarInactiveTintColor="black" // Set inactive tab label color to black
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#0F0F0F" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={HomeScreen}
          options={{
            tabBarLabel: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome name="user-circle" size={24} color="#0F0F0F" />
              ) : (
                <FontAwesome name="user-circle-o" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: "Cart",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="cart-sharp" size={24} color="#0F0F0F" />
              ) : (
                <Ionicons name="cart-outline" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Munchies"
          component={MunchiesScreen}
          options={{
            tabBarLabel: "Munchies",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="restaurant" size={24} color="black" />
              ) : (
                <MaterialIcons name="restaurant" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Bevvies"
          component={BevviesScreen}
          options={{
            tabBarLabel: "Bevvies",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="local-bar" size={24} color="black" />
              ) : (
                <MaterialIcons name="local-bar" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            tabBarLabel: "Inventory",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="inventory" size={24} color="black" />
              ) : (
                <MaterialIcons name="inventory" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BevviesCreate"
          component={BevviesCreate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BevviesUpdate"
          component={BevviesUpdate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Bevvies"
          component={BevviesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MunchiesCreate"
          component={MunchiesCreate}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "black", // Set header background color
            },
            headerTitleStyle: {
              color: "white", // Set header text color
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="MunchiesUpdate"
          component={MunchiesUpdate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserMunchies"
          component={UserMunchies}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserBevvies"
          component={UserBevvies}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MunchiesScreen"
          component={MunchiesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InventoryCreate"
          component={InventoryCreate}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "black", // Set header background color
            },
            headerTitleStyle: {
              color: "white", // Set header text color
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="InventoryUpdate"
          component={InventoryUpdate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InventoryScreen"
          component={InventoryScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
