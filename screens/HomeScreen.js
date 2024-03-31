import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { apiUrl } from "../ip";
import axios from "axios";

const HomeScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        {item.products.map((product, index) => (
          <Text key={index}>{product.name}</Text>
        ))}
      </View>
      <Text style={styles.cell}>{item.totalPrice}</Text>
      <Text style={styles.cell}>{formattedDate(item.createdAt)}</Text>

    </View>
  );
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [translateX] = useState(new Animated.Value(0)); // Define translateX here
  const url = apiUrl;

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userName = await AsyncStorage.getItem("name");
        const userId = await AsyncStorage.getItem("userId");
        const role = await AsyncStorage.getItem("role");
        setUserName(userName);
        const keys = await AsyncStorage.getAllKeys();
        console.log("Keys in AsyncStorage:", keys);

        // Use Axios instead of fetch
        const response = await axios.get(
          `${url}/orders/${userId}`
        );
        setUserOrders(response.data.orders);
        console.log(userOrders);
        console.log(role);
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
  const formattedDate = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();

    // Add leading zeros if necessary
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
  };
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    closeDrawer();
  };

  const handleLocation = async () => {
    navigation.navigate("Location");
  }
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
        <ScrollView>
         
        
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
    <Pressable onPress={handleLocation}>
              <MaterialIcons
                name="pin-drop"
                size={24}
                color="white"
                marginRight= {10}
              />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <AntDesign name="logout" size={24} color="white" />
            </Pressable>
          </View>
          <ImageBackground
            source={require("../assets/bg.png")}
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
                source={require("../assets/logo.png")}
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("UserBevvies")}
            >
              <MaterialIcons name="local-bar" size={24} color="white" />
              <Text style={styles.buttonText}>Bevvies</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.containertable}>
          <FlatList
            style={{ width: "100%" }}
            data={userOrders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort orders by date in descending order
              .slice(0, 3)} // Slice the latest 3 orders
            renderItem={renderItem}
            keyExtractor={(item) => item._id} // Use a unique identifier for keys
            ListHeaderComponent={() => (
              <View>
                <Text style={styles.header}>Recent Orders</Text>
                <View style={styles.row}>
                  <Text style={styles.cell}>Products</Text>
                  <Text style={styles.cell}>Total Price</Text>
                  <Text style={styles.cell}>Date</Text>
                </View>
              </View>
            )}
          />
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
            source={require("../assets/bg.png")}
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
                source={require("../assets/logo.png")}
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 40, // Increased margin top for better spacing
  },
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
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10, // Increased padding vertically for bigger buttons
    paddingHorizontal: 10,

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
    padding: 5,
    alignItems: "center",
    marginTop: 40,
    marginLeft: 50,
    marginRight: 50,
    borderWidth: 3,
    borderColor: "black",
    // Adjust border color as needed
  },
  menuButton: {
    position: 'absolute',
    left: 0,
    top: 0, // Adjust top position as needed
    zIndex: 999, // Adjust z-index as needed
    paddingHorizontal: 7, // Adjust padding as needed
    paddingVertical: 9, // Adjust padding as needed
  },
  text: {
    fontSize: 10,
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
    fontSize: 20,
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
    fontSize:10
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 10, // Increase font size for better visibility
    fontWeight: "bold",
    paddingVertical: 5, // Adjust vertical padding to increase cell height
    paddingHorizontal: 5,
  },
});
