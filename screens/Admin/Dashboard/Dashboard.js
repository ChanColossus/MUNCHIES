import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable,StyleSheet,
  Animated,SafeAreaView,ScrollView,Platform,ImageBackground,Image,TouchableOpacity,FlatList} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { apiUrl } from "../../../ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LineChart, PieChart } from 'react-native-chart-kit';

import {
  StackedBarChart,
  ChartType,
} from "@tanmaya_pradhan/react-native-charts";

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
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/inventory`);
        setInventoryData(response.data.inventory);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };
    const fetchOrdersData = async () => {
      try {
        const response = await fetch(`${url}/orders`);
        const data = await response.json();
        setOrdersData(data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/user`);
        const users = response.data.data;
        setUserData(users);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
  
    const fetchDataInterval = setInterval(() => {
      fetchData();
      fetchOrdersData();
      fetchUserData();
    }, 10000);
  
    // Fetch initial data
    fetchData();
    fetchOrdersData();
    fetchUserData();
  
    // Clean up interval
    return () => clearInterval(fetchDataInterval);
  }, []);
  useEffect(() => {
    // Group users by month and count the number of users in each group
    const usersByMonth = userData.reduce((acc, user) => {
      const createdDate = new Date(user.createdAt);
      const month = createdDate.getMonth() + 1; // Months are zero-based (0 = January)
      const year = createdDate.getFullYear();
      const key = `${month}-${year}`;

      acc[key] = (acc[key] || 0) + 1;

      return acc;
    }, {});

    // Prepare data for pie chart
    const pieChartData = Object.keys(usersByMonth).map(key => {
      const [month, year] = key.split('-');
      const monthName = new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long' });
      return {
        name: monthName, // Change 'month' to 'name'
        count: usersByMonth[key],
        color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Generate random color
      };
    });
    
    setPieChartData(pieChartData);
  }, [userData]);

  const calculateOrdersByMonth = () => {
    const currentYear = new Date().getFullYear();
    const ordersByMonth = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthName = new Date(currentYear, month - 1, 1).toLocaleString('default', { month: 'long' });
      const count = ordersData.filter(order => new Date(order.createdAt).getMonth() === index).length;
      return { month: monthName, count: count };
    });
    return ordersByMonth;
  };

  const ordersByMonth = calculateOrdersByMonth();

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
  const handleItemClick = (item) => {
    setSelectedItem(item.month);
    console.log(selectedItem) // Set the selected month when clicked
  };

  const clearSelectedItem = () => {
    setSelectedItem(null); // Clear the selected item
  };


  return (
    <SafeAreaView
    style={{
      alignSelf: "stretch",
      paddingTop: 0,
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
      {/* <Text>Admin Dashboard</Text> */}

      <View style={styles.container}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 15 }}>
          Inventory
        </Text>
        <StackedBarChart
          containerHeight={300}
          backgroundColor="gray"
          axisFontColor="white"
          yAxisSubstring=""
          xAxisSubstring=""
          showGridY={true}
          axisWidth={2}
          axisColor="white"
      barchart_tooltip_color="white"
      barchart_tooltip_axis_color="white"
          showGrid={false}
          axisFontSize={5}
          chartType={ChartType.BAR}
          y2Axis={false}
          chartData={inventoryData.map((item) => ({
            month: item.name,
            barValues: [item.stocks],
          }))}
          toolTipContainerStyle={{ backgroundColor: 'black' }}
          toolTipTextStyle={{color:'white'}}
          showTooltipPopup={true} // Enable tooltip
          onPressLineItem={(item) => handleItemClick(item)}
          scrollEnable={true}
        />
      
      {/* </View> */}

      {/* <View style={styles.container}> */}
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 10 }}>
          Orders
        </Text>
        <ScrollView horizontal>
      <View>
        <LineChart
          data={{
            labels: ordersByMonth.map(month => `${month.month}=${month.count}`),
            datasets: [
              {
                data: ordersByMonth.map(month => month.count),
              },
            ],
          }}
          width={ordersByMonth.length * 90} 
          height={300}
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: 'black',
            backgroundGradientTo: 'black',
            decimalPlaces: 0,
            // color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            color: (opacity = 1) => "green",
            labelColor: (opacity = 1) => "white",
            propsForDots: {
              r: "4",
              strokeWidth: "1",
              stroke: "white"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    </ScrollView>
      </View>
      </View>
      
      <ScrollView>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 10 }}>
          User Accounts
        </Text>
      <PieChart
  data={pieChartData}
  width={350}
  height={220}
  chartConfig={{
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }}
  accessor="count" // Update to "count"
  backgroundColor="transparent"
  paddingLeft="15"
  absolute
  accessorTooltip={(value, index) => pieChartData[index].name} // Access the 'name' property
/>

<View style={styles.tableContainer}>
  <View style={styles.header}>
    <Text style={styles.headerTextt}>Month</Text>
    <Text style={styles.headerText}>Users</Text>
  </View>
  <FlatList
    data={pieChartData}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.count}</Text>
      </View>
    )}
  />
</View>
</View>
    </ScrollView>
      

    </ScrollView>
    <Animated.View
  style={[
    drawerStyles,
    {
      transform: [{ translateX }], 
      display: isDrawerOpen ? "flex" : "none", 
      backgroundColor: "#4c4436",
      
    },
  ]}
>
<View style={styles.overlay}>
  {/* Close Drawer Button */}
  <Pressable
    style={{
      position: "absolute",
      top: 10,
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
            top: 44,
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
    height:0, // Adjust the height to control how much of the drawer is cut
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
  },container: {
    flex: 1,
    backgroundColor: "#FFE4B5",
    alignItems: "center",
    justifyContent: "center",
  
    // marginTop: 60,
  },
  tableContainer: {
    flex: 1,
    width:300,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Change justifyContent to space-between

    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
},
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight:40
  },
  headerTextt: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft:37
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});