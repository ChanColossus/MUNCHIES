import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  ImageBackground,
  Alert,
} from "react-native";
import { Box, Text, Button } from "native-base";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {apiUrl} from "../../../ip"
const UserBevvies = () => {
  const [bevvies, setBevvies] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const url = apiUrl
  // Function to load cart items from AsyncStorage
  const loadCartItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cartItems");
      if (jsonValue !== null) {
        setCartItems(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  // Function to save cart items to AsyncStorage
  const saveCartItems = async (items) => {
    try {
      const jsonValue = JSON.stringify(items);
      console.log("JSON value to be saved:", jsonValue); // Log JSON value before saving
      await AsyncStorage.setItem("cartItems", jsonValue);
      console.log("Cart items saved successfully.");

      // Retrieve the saved data from AsyncStorage for verification
      const savedValue = await AsyncStorage.getItem("cartItems");
      console.log("Retrieved value from AsyncStorage:", savedValue);
    } catch (error) {
      console.error("Error saving cart items:", error.message); // Log error message
    }
  };

  const handleNextImage = (itemId) => {
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [itemId]:
        (prevIndexes[itemId] + 1) %
        bevvies.find((item) => item._id === itemId).images.length,
    }));
  };

  const handlePreviousImage = (itemId) => {
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [itemId]:
        prevIndexes[itemId] === 0
          ? bevvies.find((item) => item._id === itemId).images.length - 1
          : prevIndexes[itemId] - 1,
    }));
  };

  const handleSearch = (keyword) => {
    const regex = new RegExp(keyword, "i");
    const filteredItems = bevvies.filter((item) => regex.test(item.category));
    setFilteredItems(filteredItems);
  };

  useEffect(() => {
    // Fetch munchies data from API
    const fetchBevvies = async () => {
      try {
        const { data } = await axios.get(`${url}/bevvies`);
        setBevvies(data.bevvies);
        // Initialize current image indexes for each munchies item
        const initialIndexes = {};
        data.bevvies.forEach((item) => {
          initialIndexes[item._id] = 0;
        });
        setCurrentImageIndexes(initialIndexes);
      } catch (error) {
        console.error("Error fetching Bevvies:", error);
      }
    };

    fetchBevvies();
  }, []);

  useEffect(() => {
    // Initialize filtered items with all munchies initially
    setFilteredItems(bevvies);
    // Load cart items from AsyncStorage
    loadCartItems();
  }, [bevvies]);

  const categories = [
    "Smoothie",
    "Juice",
    "Cocktails",
    "1 shot",
    "Coffee",
    "Chocolates & Non-Coffee",
    "All",
  ];

  const handleCategorySelect = (category) => {
    if (category === "All") {
      setFilteredItems(bevvies); // Set all items when "All" category is selected
    } else {
      const regex = new RegExp(category, "i");
      const filteredItems = bevvies.filter((item) => regex.test(item.category));
      setFilteredItems(filteredItems);
    }
    setSelectedCategory(category);
  };

  // Function to add an item to the cart with a specified quantity
  const addToCart = async (item, quantity) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      // If item already exists in the cart, update its quantity
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
      setCartItems(updatedCartItems);
      saveCartItems(updatedCartItems);
      console.log(updatedCartItems);
    } else {
      // If item is not in the cart, add it with the specified quantity
      const newItem = { ...item, quantity };
      const updatedCartItems = [...cartItems, newItem];
      setCartItems(updatedCartItems);
      saveCartItems(updatedCartItems);
      console.log(updatedCartItems);
    }
    Alert.alert("Munchies", "You have added the munchies to cart");
  };

  // Function to update the quantity of an item in the cart
  const updateQuantity = (itemId, newQuantity) => {
    console.log("Updating quantity for item with ID:", itemId);
    console.log("New quantity:", newQuantity);

    const updatedCartItems = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    console.log("Updated cart items:", updatedCartItems);

    setCartItems(updatedCartItems); // Update the state with the new cart items
    saveCartItems(updatedCartItems); // Save the updated cart items to AsyncStorage
  };

  // Function to handle quantity updates during onPress events
  const handleQuantityUpdate = (itemId, operation) => {
    const item = cartItems.find((item) => item._id === itemId);
    if (!item) return; // If item not found in cart, do nothing
    const currentQuantity = item.quantity || 0;
    let newQuantity;
    if (operation === "increment") {
      newQuantity = currentQuantity + 1;
    } else if (operation === "decrement") {
      newQuantity = Math.max(0, currentQuantity - 1);
    }
    updateQuantity(itemId, newQuantity);
  };

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
        <ImageBackground
          source={require("../../../assets/bg.png")}
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
              style={{ width: 100, height: 100 }}
              source={require("../../../assets/logo.png")}
            />
          </View>
        </ImageBackground>
        <View
          style={{
            flexDirection: "row",
            marginLeft: 5,
            marginRight: 5,
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "black",
            justifyContent: "center",
          }}
        >
          {/* Render category buttons */}
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={{ color: "white" }}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          {/* Render munchies items */}
          {filteredItems.map((bevviesItem) => (
            <View key={bevviesItem._id} style={styles.card}>
              <ImageBackground
                source={require("../../../assets/pbg.jpg")}
                style={{ flex: 1, borderRadius: 15, overflow: "hidden" }}
              >
                <Box style={styles.box}>
                  <View style={styles.imageContainer}>
                    <TouchableOpacity
                      onPress={() => handlePreviousImage(bevviesItem._id)}
                    >
                      <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <TouchableOpacity
                        onPress={() => console.log("Image clicked")}
                      >
                        <Image
                          source={{
                            uri:
                              bevviesItem.images[
                                currentImageIndexes[bevviesItem._id]
                              ]?.url || "https://via.placeholder.com/300",
                          }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity
                      onPress={() => handleNextImage(bevviesItem._id)}
                    >
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.name}>{bevviesItem.name}</Text>
                  <Text style={styles.description}>
                    {bevviesItem.description}
                  </Text>
                  <Text style={styles.price}>₱ {bevviesItem.price}</Text>
                  {/* Render quantity selector */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        handleQuantityUpdate(bevviesItem._id, "decrement")
                      }
                    >
                      <MaterialIcons
                        name="remove"
                        size={24}
                        color="black"
                        style={styles.quantityIcon}
                      />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>
                      {cartItems.find((item) => item._id === bevviesItem._id)
                        ?.quantity || 0}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleQuantityUpdate(bevviesItem._id, "increment")
                      }
                    >
                      <MaterialIcons
                        name="add"
                        size={24}
                        color="black"
                        style={styles.quantityIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  <Box style={styles.footer}>
                    <Button
                      style={styles.button}
                      onPress={() =>
                        addToCart(bevviesItem, bevviesItem.quantity || 1)
                      }
                    >
                      <Text style={{ color: "white" }}>Add to Cart</Text>
                    </Button>
                  </Box>
                </Box>
              </ImageBackground>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    borderRadius: 10,
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  card: {
    width: "45%", // Adjust as needed
    marginVertical: 10,
  },
  box: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "black",
    padding: 10,
  },
  image: {
    width: 205, // Adjust image width as needed
    height: 150, // Adjust image height as needed
    resizeMode: "cover",
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 22, // Adjust font size as needed
    textAlign: "center",
  },
  price: {
    fontWeight: "bold",
    fontSize: 18, // Adjust font size as needed
    textAlign: "center",
    paddingTop: 10,
  },
  description: {
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  categoryButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    margin: 5,
    backgroundColor: "black",
    borderRadius: 5,
  },
  selectedCategoryButton: {
    backgroundColor: "white",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  quantityIcon: {
    marginHorizontal: 10,
  },
  quantity: {
    fontSize: 18,
  },
});

export default UserBevvies;
