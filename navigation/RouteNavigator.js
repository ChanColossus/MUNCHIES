import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    function BottomTabs() {
        return (
            <Tab.Navigator
            tabBarStyle={{ backgroundColor: 'black' }} // Set background color to black
            tabBarActiveTintColor="white" // Set active tab label color to white
            tabBarInactiveTintColor="black" // Set inactive tab label color to black
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarLabel: 'Home',
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
                tabBarLabel: 'Profile',
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
              component={HomeScreen}
              options={{
                tabBarLabel: 'Cart',
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Ionicons name="cart-sharp" size={24} color="#0F0F0F" />
                  ) : (
                    <Ionicons name="cart-outline" size={24} color="black" />
                  ),
              }}
            />
          </Tab.Navigator>
          
          
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
        
    )
}

export default StackNavigator

const styles = StyleSheet.create({})