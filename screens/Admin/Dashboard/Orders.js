import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, Platform, TouchableOpacity,Image,ImageBackground,Alert } from 'react-native';
import { apiUrl } from "../../../ip";
import axios from "axios";
const PendingOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const url = apiUrl;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${url}/orders`);
        const data = await response.json();
        const pendingOrders = data.data.filter(order => !order.status && order.confirmed);
        setOrders(pendingOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    const fetchOrdersInterval = setInterval(() => {
      fetchOrders();
    }, 3000);
  
    // Fetch initial orders
    fetchOrders();
  
    // Clean up interval
    return () => clearInterval(fetchOrdersInterval);
  }, []);

  const updateOrderStatus = async (orderId) => {
    
    try {
      const response = await axios.put(`${apiUrl}/order/${orderId}`, { status: true }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to update order status');
      }
  
      console.log(`Order status updated successfully for order ID: ${orderId}`);
      // Fetch orders again to refresh data
      Alert.alert("Orders", "Order status updated!");
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      // Handle errors or display an error message to the user
    }
  };
  
  const removeOrder = async (orderId) => {
    try {
      const response = await axios.delete(`${apiUrl}/orderdel/${orderId}`);
  
      if (response.status !== 200) {
        throw new Error('Failed to delete order');
      }
  
      console.log(`Order with ID ${orderId} deleted successfully`);
      // Fetch orders again to refresh data
      Alert.alert("Orders", "Order cancelled!");
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      // Handle errors or display an error message to the users
    }
  };
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <View style={styles.orderDetails}>
        <Text style={styles.boldText}>Order ID: <Text>{item._id}</Text></Text>
        <Text style={styles.boldText}>Ordered By: <Text>{item.user.name}</Text></Text>
        <Text style={styles.boldText}>Status: <Text>{item.status ? "Completed" : "Pending"}</Text></Text>
        <Text style={[styles.boldText, styles.productsTitle]}>Products:</Text>
        <FlatList
          data={item.products}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Text>{item.name} ({item.quantity})</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text style={styles.boldText}>Total Price:</Text>
        <Text style={styles.productItem}>₱{item.totalPrice}</Text>
        <Text style={styles.boldText}>Payment Method:</Text>
        <Text style={styles.productItem}>{item.paymentMethod}</Text>
        <TouchableOpacity style={styles.updateButton} onPress={() => updateOrderStatus(item._id)}>
          <Text style={styles.updateButtonText}>Update Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeOrder(item._id)}>
          <Text style={styles.removeButtonText}>Remove Order</Text>
        </TouchableOpacity>
      </View>
      {/* <Image source={require('../../../assets/logo.png')} style={styles.image} /> */}
    </View>
  );
  

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
        <View style={styles.container}>
          <Text style={styles.title}>Pending Orders</Text>
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={item => item._id.toString()}
            style={styles.orderList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFE4B5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderList: {
    flex: 1,
  },
  orderItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  productsTitle: {
    marginTop: 10,
    fontSize: 12,
  },
  productItem: {
    marginLeft: 20,
    fontSize:12
  },
  updateButton: {
    backgroundColor: 'green',
    padding: 3,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 3,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 5,
  },
  orderDetails: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 25, // To make it circular, adjust radius as needed
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PendingOrdersScreen;
