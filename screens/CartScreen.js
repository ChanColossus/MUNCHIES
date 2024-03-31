import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
  Pressable,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {apiUrl} from "../ip"
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("onlineBanking");
  const navigation = useNavigation();
  const url = apiUrl
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [translateX] = useState(new Animated.Value(0));
  const [role, setUserRole] = useState("");
  // Function to load cart items from AsyncStorage
  const loadCartItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cartItems");
      const role = await AsyncStorage.getItem("role");
 
        setUserRole(role);
      if (jsonValue !== null) {
        setCartItems(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  // Function to clear cart items from AsyncStorage
  const clearCartItems = async () => {
    try {
      await AsyncStorage.removeItem("cartItems");
      setCartItems([]); // Clear cart items from state
    } catch (error) {
      console.error("Error clearing cart items:", error);
    }
  };

  useEffect(() => {
    // Load cart items when the component mounts
    loadCartItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCartItems();
    }, [])
  );

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  const handleCheckout = async () => {
    // Prepare the order data
    const userId = await AsyncStorage.getItem("userId");
    const orderData = {
      user: userId,
      products: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      paymentMethod,
    };

    try {
      // Send a POST request to the backend to checkout
      const response = await fetch(`${url}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Clear cart items after successful checkout
        await clearCartItems();
        Alert.alert("Cart", "You have successfully placed the order");
        navigation.replace("Main");
      } else {
        throw new Error("Failed to checkout");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to place order. Please try again later.");
    }
  };
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const closeDrawer = () => {
    // Assuming you have a state variable to track the drawer state, 
    // set it to false to close the drawer.
    setIsDrawerOpen(false);
  };
  const handleAdmin = async () => {
    navigation.navigate("AdminMain");
  }
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
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    closeDrawer();
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
      <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
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
    {role === 'admin' && (
            <Pressable onPress={handleAdmin}>
            <MaterialIcons
              name="supervisor-account"
              size={24}
              color="white"
              marginRight= {10}
            />
          </Pressable>
          )}
            </View>
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
              style={{ width: 100, height: 100 }}
              source={require("../assets/logo.png")}
            />
          </View>
        </ImageBackground>
        <View style={styles.container}>
          <Text style={styles.header}>Cart Items</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearCartItems}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>No items in the cart</Text>
          ) : (
            <>
              <View style={styles.columnHeader}>
                <Text style={styles.columnHeaderText}>Name</Text>
                <Text style={styles.columnHeaderText}>Quantity</Text>
                <Text style={styles.columnHeaderText}>Price</Text>
                <Text style={styles.columnHeaderText}>Subtotal</Text>
              </View>
              <FlatList
                data={cartItems}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>{item.quantity}</Text>
                    <Text style={styles.itemPrice}>₱ {item.price}</Text>
                    <Text style={styles.subtotal}>
                      ₱ {item.quantity * item.price}
                    </Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <View style={styles.paymentContainer}>
                <Text style={styles.paymentLabel}>Choose Payment Method:</Text>
                <View style={styles.radioButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      paymentMethod === "onlineBanking"
                        ? styles.radioButtonSelected
                        : null,
                    ]}
                    onPress={() => setPaymentMethod("onlineBanking")}
                  >
                    <Text
                      style={
                        paymentMethod === "onlineBanking"
                          ? styles.radioButtonTextSelected
                          : styles.radioButtonText
                      }
                    >
                      Online Banking
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      paymentMethod === "cash"
                        ? styles.radioButtonSelected
                        : null,
                    ]}
                    onPress={() => setPaymentMethod("cash")}
                  >
                    <Text
                      style={
                        paymentMethod === "cash"
                          ? styles.radioButtonTextSelected
                          : styles.radioButtonText
                      }
                    >
                      Cash
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.totalContainer}>
                <Text style={styles.total}>Total: ₱ {totalPrice}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </>
          )}
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
          height: 119 }}
          >
           
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              {/* <Image
                style={{ width: 100, height: 100, marginRight: 0 }} // Adjust size as needed
                source={require("../assets/logo.png")}
              /> */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFE4B5",
  },
  menuButton: {
    position: 'absolute',
    left: 0,
    top: 0, // Adjust top position as needed
    zIndex: 999, // Adjust z-index as needed
    paddingHorizontal: 7, // Adjust padding as needed
    paddingVertical: 9, // Adjust padding as needed
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
  totalContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  paymentContainer: {
    marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  paymentLabel: {
    marginRight: 10,
    fontWeight: "bold",
  },
  radioButtonContainer: {
    marginTop: 10, // Adjust the spacing between label and options
    flexDirection: "column", // Align options vertically
  },
  radioButtonText: {
    color: "black", // Default text color
  },
  radioButtonTextSelected: {
    color: "white", // Text color when selected
  },
  radioButton: {
    marginBottom: 10, // Adjust spacing between options
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    borderRadius: 5,
  },
  radioButtonSelected: {
    backgroundColor: "#000",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  columnHeader: {
    flexDirection: "row",
    justifyContent: "space-between", // Align column headers with items
    paddingHorizontal: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Add a border to separate headers from items
  },
  columnHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
    flex: 1, // Make headers take up equal space
    textAlign: "center", // Center-align header text
  },
  item: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Add a border to separate items
  },
  itemName: {
    flex: 1, // Adjust based on your content
    fontWeight: "bold",
    textAlign: "center", // Center-align item text
  },
  itemQuantity: {
    flex: 1, // Adjust based on your content
    textAlign: "center", // Center-align item text
  },
  itemPrice: {
    flex: 1, // Adjust based on your content
    fontWeight: "bold",
    textAlign: "center", // Center-align item text
  },
  subtotal: {
    flex: 1, // Adjust based on your content
    fontWeight: "bold",
    textAlign: "center", // Center-align item text
  },

  total: {
    fontSize: 18,
    textAlign: "right",
    marginTop: 10,
  },
  clearButton: {
    position: "absolute",
    top: 27,
    right: 5,
    backgroundColor: "red",
    padding: 3,
    borderRadius: 5,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CartScreen;
