import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
const HomeScreen = () => {
  const data = [
    { id: "1", order: "Order 1", details: "Details 1", price: "$10" },
    { id: "2", order: "Order 2", details: "Details 2", price: "$15" },
    { id: "3", order: "Order 3", details: "Details 3", price: "$20" },
  ];
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.order}</Text>
      <Text style={styles.cell}>{item.details}</Text>
      <Text style={styles.cell}>{item.price}</Text>
    </View>
  );
  let [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    // Add more variants if necessary (e.g., italic)
  });
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error occurred while logging out:", error);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userName = await AsyncStorage.getItem("name");
        setUserName(userName);
        const keys = await AsyncStorage.getAllKeys();
        console.log("Keys in AsyncStorage:", keys);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const banners = [
    require("../assets/1.jpg"),
    require("../assets/2.jpg"),
    require("../assets/3.jpg"),
    require("../assets/4.jpg"),
    require("../assets/5.jpg"),
  ];

  return (
    <SafeAreaView
      style={{
        alignSelf: "stretch",
        paddingTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "#FFE4B5",
      }}
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
        <ScrollView>
          <ImageBackground
            source={require("../assets/bg.png")}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <Image
                style={{ width: 100, height: 100, marginRight: 20 }} // Adjust size as needed
                source={require("../assets/logo.png")}
              />
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    fontFamily: "Roboto-Bold",
                    color: "#FFF6E0",
                    marginTop: 10,
                  }}
                >
                  Munchies and Bevvies
                </Text>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{ fontSize: 16, color: "#FFF6E0", marginTop: 5 }}
                  >
                    North Poblacion, Bucay, Abra, Philippines
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end", // Align items to the right
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#FFF6E0",
                marginTop: 0,
                marginRight: 5,
              }}
            >
              Logout
            </Text>
            <Pressable onPress={handleLogout}>
              <AntDesign name="logout" size={24} color="white" />
            </Pressable>
          </View>

          <SliderBox
            images={banners}
            autoPlay
            circleLoop
            dotColor={"white"}
            inactiveDotColor={"#FFF6E0"}
            ImageComponentStyle={{ width: "100%" }}
          />
          {userName ? (
            <View style={styles.containertext}>
              <Text style={styles.text}>Welcome, {userName}!</Text>
            </View>
          ) : null}
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("UserMunchies")}
            >
              <MaterialIcons name="restaurant-menu" size={24} color="white" />
              <Text style={styles.buttonText}>Munchies</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <MaterialIcons name="local-bar" size={24} color="white" />
              <Text style={styles.buttonText}>Bevvies</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.containertable}>
          <FlatList
            style={{ width: "100%" }}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => (
              <Text style={styles.header}>Recent Orders</Text>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 50, // Increased margin top for better spacing
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 30, // Increased padding vertically for bigger buttons
    paddingHorizontal: 40,

    borderWidth: 3,
    borderColor: "black",

    borderRadius: 10, // Increased border radius for rounded corners
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Align icon and text vertically
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10, // Added margin left to create space between icon and text
  },
  containertext: {
    backgroundColor: "#D2B48C",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 40,
    marginLeft: 50,
    marginRight: 50,
    borderWidth: 3,
    borderColor: "black",
    // Adjust border color as needed
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
    color: "#3B2F2F", // Text color inside the container
  },
  containertable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
    marginTop: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 20, // Increase font size for better visibility
    fontWeight: "bold",
    paddingVertical: 15, // Adjust vertical padding to increase cell height
    paddingHorizontal: 20,
  },
});
