import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable,StyleSheet,
  Animated,SafeAreaView,ScrollView,Platform,ImageBackground,Image,TouchableOpacity} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { apiUrl } from "../../../ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0,${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [translateX] = useState(new Animated.Value(0)); 
  const url = apiUrl;
  const navigation = useNavigation();

  const closeDrawer = () => {
    // Assuming you have a state variable to track the drawer state, 
    // set it to false to close the drawer.
    setIsDrawerOpen(false);
  };
  // useEffect(() => {
  //   // Close the drawer when the screen is focused
  //   if (isFocused) {
  //     closeDrawer();
  //   }
  // }, [isFocused]);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    closeDrawer();
  };
  const drawerStyles = {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 200,
    zIndex: 2,
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("name");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("role");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      // Call checkLoginStatus from App.js to update the isLoggedIn state
      // Assuming that onLogout is a prop passed from App.js to HomeScreen
      if (typeof onLogout === "function") {
        onLogout();
      }
    } catch (error) {
      console.log("Error occurred while logging out:", error);
    }
  };
  return (
    <SafeAreaView
    style={{
      alignSelf: "stretch",
      paddingTop: Platform.OS === "android" ? 10 : 0,
      flex: 1,
      backgroundColor: "#FFE4B5",
    }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end", // Align items to the right
            }}
          >
              <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
      <Entypo name="menu" size={24} color="white" />
    </TouchableOpacity> 
    <Pressable onPress={handleLogout}>
              <AntDesign name="logout" size={24} color="white" />
            </Pressable>
          </View>
          <ImageBackground
            source={require("../../../assets/bg.png")}
            style={{ flex: 1, height:124 }}
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
                style={{ width: 100, height: 100, marginRight: 0 }} // Adjust size as needed
                source={require("../../../assets/logo.png")}
              />
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0, marginRight: 10
                  
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
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
                    style={{ fontSize: 10, color: "#FFF6E0", marginTop: 5 }}
                  >
                    North Poblacion, Bucay, Abra, Philippines
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Admin Dashboard</Text>

      <View style={{ marginTop: 20 }}>
        <BarChart
          data={data}
          width={350}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>
    </View>
    </ScrollView>
    <Animated.View
  style={[
    drawerStyles,
    {
      transform: [{ translateX }], // Apply translation animation
      display: isDrawerOpen ? "flex" : "none", 
      backgroundColor: "#4c4436",
       // Hide/show the drawer
    },
  ]}
>
<View style={styles.overlay}>
  {/* Close Drawer Button */}
  <Pressable
    style={{
      position: "absolute",
      top: 20,
      left: 0,
      flexDirection: "row",
      alignItems: "center",
    }}
    onPress={toggleDrawer}
  >
   
    <AntDesign name="close" size={24} color="white" style={{ marginLeft: 175 }} />
  </Pressable>
  
  </View>
  <View>
    
  </View>
  <ImageBackground
            source={require("../../../assets/bg.png")}
            style={{ flex: 1, position: 'absolute',
            top: 54,
            left: 0,
            right: 0,
          height: 123 }}
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
                style={{ width: 100, height: 100, marginRight: 0 }} // Adjust size as needed
                source={require("../../../assets/logo.png")}
              />
            </View>
          </ImageBackground>
  {/* Navigation Items */}
  <View style={styles.drawerItemContainer}>
    <TouchableOpacity onPress={() => navigateToScreen('Home')}>
      <Text style={styles.drawerItem}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigateToScreen('Cart')}>
      <Text style={styles.drawerItem}>Cart</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigateToScreen('Profile')}>
      <Text style={styles.drawerItem}>Profile</Text>
    </TouchableOpacity>
  </View>

  


</Animated.View>
    </SafeAreaView>
  );
};

export default Dashboard;
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10, // Adjust the height to control how much of the drawer is cut
    backgroundColor: '#FFE4B5', // Semi-transparent black color
  },
  drawerItemContainer: {
    position: 'absolute',
    top: 220,
    left: 0,
    right: 0,
    paddingBottom: 10,
    marginBottom: 10,
  },
  drawerItem: {
    marginTop:10,
    fontSize: 20,
    color: 'white',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    marginBottom:0
  },
  menuButton: {
    position: 'absolute',
    left: 0,
    top: 0, // Adjust top position as needed
    zIndex: 999, // Adjust z-index as needed
    paddingHorizontal: 7, // Adjust padding as needed
    paddingVertical: 9, // Adjust padding as needed
  },
});