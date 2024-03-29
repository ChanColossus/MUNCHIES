import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Button, 
  Image, 
  StyleSheet, 
  Pressable, 
  SafeAreaView, 
  Platform, 
  ImageBackground,
} from 'react-native';
import { Container } from "native-base"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Table, Row } from 'react-native-table-component'; // Import Table and Row
import { apiUrl } from "../../ip"

const Profile = () => {
  const navigation = useNavigation()
  const [userProfile, setUserProfile] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const url = apiUrl;

  useFocusEffect(
    useCallback(() => {
      const getProfile = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken");
          console.log(token)
          if (token) {
            const config = {
              headers: {
                Authorization: `${token}`,
              },
            };

            const response = await axios.get(`${url}/profile`, config);
            console.log(response.data.user);
            setUserProfile(response.data.user);
            // Fetch orders
            const ordersResponse = await axios.get(`${url}/orders/${response.data.user._id}`, config);
            console.log(ordersResponse.data.orders);
            
            // Sort orders by date in descending order
            const sortedOrders = ordersResponse.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUserOrders(sortedOrders);
          } else {
            console.log("Authentication token not found");
          }
        } catch (error) {
          console.log("Error fetching profile:", error);
        }
      };

      getProfile();
    }, [])
  );

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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = userOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const recentReviews = [
    {
      productName: "Iced Kape",
      date: "2024-03-27",
      comment: "Great product! Really satisfied with my purchase.",
      imageUrl: "https://res.cloudinary.com/dhndcs09a/image/upload/v1711629299/bevvies/wasqlctnwujtzw1yv6u0.jpg"
    },
    {
      productName: "Cocktail",
      date: "2024-03-25",
      comment: "Excellent quality. Highly recommended!",
      imageUrl: "https://res.cloudinary.com/dhndcs09a/image/upload/v1711629302/bevvies/ykepq8fhdf5k08qjxbmr.jpg"
    }
  ];
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ImageBackground source={require("../../assets/bg.png")} style={styles.backgroundImage}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logoImage}
              source={require("../../assets/logo.png")}
            />
          </View>
        </ImageBackground>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatarImage}
              source={require("../../assets/defaults.jpg")}
            />
          </View>
          <Text style={styles.title}>
            {userProfile ? userProfile.name : ""}
          </Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Email: {userProfile ? userProfile.email : ""}
            </Text>
          </View>
        </View>
        <Text style={styles.orderHistoryText}>Order History</Text> 
        <View style={styles.orderTableContainer}>
          <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
            <Row data={['Product', 'Date', 'Total Price', 'Status']} style={styles.head} textStyle={styles.text} />
            {currentOrders.map((item, index) => (
              <Row
                key={index}
                data={[
                  item.products.map(product => `${product.name} (${product.quantity})`).join(', '),
                  formattedDate(item.createdAt), 
                  item.totalPrice, 
                  item.status ? 'Done' : 'Pending'
                ]}
                style={[styles.row, index%2 && {backgroundColor: '#FFE4B5'}]}
                textStyle={styles.text}
              />
            ))}
          </Table>
          <View style={styles.paginationContainer}>
          <View style={styles.paginationButton}>
            <Button title="Back" color="#000" disabled={currentPage === 1} onPress={prevPage} />
          </View>
          <View style={styles.paginationButton}>
            <Button title="Next" color="#000" disabled={indexOfLastOrder >= userOrders.length} onPress={nextPage} />
          </View>
        </View>
        </View>
        <View style={styles.createReviewButtonContainer}>
        <View style={styles.paginationButton}>
          <Button title="Create Review" color="#000" onPress={"navigateToReviewScreen"} />
          </View>
        </View>
        <View style={styles.recentReviewsContainer}>
          <Text style={styles.recentReviewsHeader}>Recent Reviews</Text>
          {recentReviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewProductName}>{review.productName}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
              
              
             
    <Image source={{ uri: review.imageUrl }} style={styles.reviewImage} />
  
            </View>
            
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeAreaView: {
    alignSelf: "stretch",
    paddingTop: Platform.OS === "android" ? 40 : 0,
    flex: 1,
    backgroundColor: "#FFE4B5",
    marginTop: 20 // Added margin top
  },
  recentReviewsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  recentReviewsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf:"center"
  },
  reviewItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
    justifyContent: 'space-between',
  },
  reviewProductName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewComment: {
    marginTop: 5,
    fontSize: 14,
  },
  reviewDetailsContainer: {
    flex: 1, // Take up remaining space
    padding: 10,
  },

  reviewImageContainer: {
    width: 100, // Adjust as needed
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewImage: {
    width: 80, // Adjust width as needed
    height: 80, // Adjust height as needed
    resizeMode: 'cover', // Ensure the image covers its container
    borderRadius: 5,
  },
  scrollViewContent: {
    paddingHorizontal: 0
  },
  createReviewButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  orderHistoryText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  
  paginationButton: {
    width: '45%',
  },
  backgroundImage: {
    flex: 1
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  logoImage: {
    width: 100,
    height: 100
  },
  profileContainer: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15, // Added border radius
    borderWidth: 1,
    borderColor: "#000000",
    padding: 20,
    marginTop: 20 // Added margin top
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it circular
    borderWidth: 2, // Border width
    borderColor: '#000', // Border color
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center"
  },
  infoContainer: {
    marginBottom: 20,
    alignItems: "center"
  },
  infoText: {
    fontSize: 18,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center"
  },
  orderTableContainer: {
    flex: 1,
    padding: 16,
    paddingTop:0,
    backgroundColor: '#FFE4B5',
  },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' }
});
