import { View, Text } from "react-native";
import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  Feather,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  NativeBaseProvider,
  Button,
  Box,
  HamburgerIcon,
  Pressable,
  Heading,
  VStack,
  Text,
  Center,
  HStack,
  Divider,
  Icon,
  View,
} from "native-base";
import AdminNavigator from "./AdminNavigator";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
global.__reanimatedWorkletInit = () => {};

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <View>
      <Text>DrawerNavigator</Text>
    </View>
  );
};

export default DrawerNavigator;
