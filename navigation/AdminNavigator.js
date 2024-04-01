import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import HomeScreen from "../screens/HomeScreen";
import Reset from "../screens/resetPassword";
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
import Dashboard from "../screens/Admin/Dashboard/Dashboard";
import Orders from "../screens/Admin/Dashboard/Orders";
import Profile from "../screens/User/Profile";
import Review from "../screens/CreateReview";
import MunchiesReviews from "../screens/Admin/Munchies/Review"
import BevviesReviews from "../screens/Admin/Bevvies/Review"
import Location from "../screens/StoreLocation";
import UserScreen from "../screens/Admin/User/UserScreen"

const AdminNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  
  function BottomTabs() {
    return (
      <Tab.Navigator
        tabBarStyle={{ color: "black" }} // Set background color to black
        tabBarActiveTintColor="white" // Set active tab label color to white
        tabBarInactiveTintColor="black" // Set inactive tab label color to black
      >
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarLabel: "Dashboard",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="analytics" size={18} color="black" />
              ) : (
                <MaterialIcons name="analytics" size={18} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Orders"
          component={Orders}
          options={{
            tabBarLabel: "Orders",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="shopping-cart" size={18} color="black" />
              ) : (
                <MaterialIcons name="shopping-cart" size={18} color="black" />
              ),
          }}
        />
        {/* <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={18} color="#0F0F0F" />
              ) : (
                <AntDesign name="home" size={18} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome name="user-circle" size={18} color="#0F0F0F" />
              ) : (
                <FontAwesome name="user-circle-o" size={18} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: "Cart",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="cart-sharp" size={18} color="#0F0F0F" />
              ) : (
                <Ionicons name="cart-outline" size={18} color="black" />
              ),
          }}
        /> */}
        <Tab.Screen
          name="Munchies"
          component={MunchiesScreen}
          options={{
            tabBarLabel: "Munchies",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="restaurant" size={18} color="black" />
              ) : (
                <MaterialIcons name="restaurant" size={18} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Bevvies"
          component={BevviesScreen}
          options={{
            tabBarLabel: "Bevvies",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="local-bar" size={18} color="black" />
              ) : (
                <MaterialIcons name="local-bar" size={18} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            tabBarLabel: "Inventory",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="inventory" size={18} color="black" />
              ) : (
                <MaterialIcons name="inventory" size={18} color="black" />
              ),
          }}
        />
         <Tab.Screen
          name="User"
          component={UserScreen}
          options={{
            tabBarLabel: "User",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="person" size={18} color="black" />
              ) : (
                <MaterialIcons name="person" size={18} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  function BottomTabsUser() {
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
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={18} color="#0F0F0F" />
              ) : (
                <AntDesign name="home" size={18} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome name="user-circle" size={18} color="#0F0F0F" />
              ) : (
                <FontAwesome name="user-circle-o" size={18} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: "Cart",
            tabBarLabelStyle: { color: "black",fontSize:5 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="cart-sharp" size={18} color="#0F0F0F" />
              ) : (
                <Ionicons name="cart-outline" size={18} color="black" />
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
        {/* <Stack.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Review"
          component={Review}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Location"
          component={Location}
          options={{ headerShown: false }}
        />
<Stack.Screen
          name="Profile"
          component={Profile}
          options
          ={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPass"
          component={Reset}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabsUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminMain"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
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
        {/* <Stack.Screen
          name="Bevvies"
          component={BevviesScreen}
          options={{ headerShown: false }}
        /> */}
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
          name="MunchiesReviews"
          component={MunchiesReviews}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserBevvies"
          component={UserBevvies}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BevviesReviews"
          component={BevviesReviews}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="MunchiesScreen"
          component={MunchiesScreen}
          options={{ headerShown: false }}
        /> */}
         <Stack.Screen
          name="InventoryScreen"
          component={InventoryScreen}
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
     
      </Stack.Navigator>
      {/* <Drawer/> */}
    </NavigationContainer>
  );
};

export default AdminNavigator;

const styles = StyleSheet.create({});