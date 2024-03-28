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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("onlineBanking");
  const navigation = useNavigation();
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
    const orderData = {
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
      const response = await fetch("http://192.168.0.130:8000/checkout", {
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
        navigation.navigate("HomeScreen");
      } else {
        throw new Error("Failed to checkout");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to place order. Please try again later.");
    }
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFE4B5",
  },
  totalContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
  },
  radioButtonText: {
    color: "black", // Default text color
  },
  radioButtonTextSelected: {
    color: "white", // Text color when selected
  },
  radioButton: {
    marginRight: 10,
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
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  columnHeaderText: {
    fontWeight: "bold",
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    flex: 2,
    fontWeight: "bold",
  },
  itemQuantity: {
    flex: 1,
  },
  itemPrice: {
    flex: 1,
    fontWeight: "bold",
  },
  subtotal: {
    flex: 1,
    fontWeight: "bold",
  },
  total: {
    fontSize: 18,
    textAlign: "right",
    marginTop: 10,
  },
  clearButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CartScreen;
