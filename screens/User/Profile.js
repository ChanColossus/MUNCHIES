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
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Table, Row } from 'react-native-table-component';
import { apiUrl } from '../../ip';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
const Profile = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userReviews, setUserReviews] = useState([]);
  const [userMunchiesReviews, setUserMunchiesReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [editedReview, setEditedReview] = useState({ rating: '', comment: '' });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [translateX] = useState(new Animated.Value(0)); // State for edited review
  const ordersPerPage = 5;
  const url = apiUrl;

  useFocusEffect(
    useCallback(() => {
      const getProfile = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          console.log(token);
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
            const sortedOrders = ordersResponse.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUserOrders(sortedOrders);
            const reviewsResponse = await axios.get(`${url}/review/${response.data.user._id}`, config);
            setUserReviews(reviewsResponse.data.reviews);
            console.log('REVIEWTO!!!!', userReviews);
            const reviewsMunchiesResponse = await axios.get(`${url}/munchiesreview/${response.data.user._id}`, config);
            setUserMunchiesReviews(reviewsMunchiesResponse.data.reviews);
            console.log('REVIEWTO!!!!', userMunchiesReviews);
            // Sort orders by date in descending order
          } else {
            console.log('Authentication token not found');
          }
        } catch (error) {
          console.log('Error fetching profile:', error);
        }
      };

      getProfile();
    }, [])
  );

  const handleCategoryChange = (itemValue) => {
    setSelectedCategory(itemValue);
    // Here you can filter userReviews based on the selected category if needed
  };

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
  const handleMunchiesDeleteReview = async (reviewId) => {
    try {
      // Send a delete request to your backend server
      const response = await axios.delete(`${url}/munchiesdel/${reviewId}`);
  
      // Check if the delete request was successful
      if (response.status === 200) {
        console.log(`Review with ID ${reviewId} deleted successfully.`);
        Alert.alert("Review", "You have successfully deleted the review");
  
        // Remove the deleted review from the state array
        setUserMunchiesReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
        
        // You can also update your UI or perform any additional actions upon successful deletion
      } else {
        console.error('Failed to delete the review.');
        // Handle error scenarios if needed
      }
    } catch (error) {
      console.error('Error deleting review:', error.message);
      // Handle error scenarios if needed
    }
  };
  const handleBevviesDeleteReview = async (reviewId) => {
    try {
      // Send a delete request to your backend server
      const response = await axios.delete(`${url}/bevviesdel/${reviewId}`);

      // Check if the delete request was successful
      if (response.status === 200) {
        console.log(`Review with ID ${reviewId} deleted successfully.`);
        Alert.alert("Review", "You have successfully deleted the review");
        setUserMunchiesReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
        navigation.replace("Main");
        // You can also update your UI or perform any additional actions upon successful deletion
      } else {
        console.error('Failed to delete the review.');
        // Handle error scenarios if needed
      }
    } catch (error) {
      console.error('Error deleting review:', error.message);
      // Handle error scenarios if needed
    }
  };

  const handleEditReview = (review) => {
    // Set the edited review state and open the modal
    setEditedReview(review);
    setModalVisible(true);
  };
  const renderStars = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={rating >= star ? 'star' : 'star-outline'}
            size={32}
            color="black"
            onPress={() => handleRatingSelect(star)}
          />
        ))}
      </View>
    );
  };
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    closeDrawer();
  };

  const handleSaveEditedReview = async () => {
    try {
      // Validate edited review data
      if (!editedReview.rating || !editedReview.comment) {
        Alert.alert('Error', 'Please provide both rating and comment.');
        return;
      }
  
      // Determine which API endpoint to use based on the type of review
      let endpoint = '';
      if ( selectedCategory === 'Munchies') {
        endpoint = `${url}/munchiesEd/${editedReview._id}`;
        Alert.alert('Review', 'Sucessfully edited review!');
      } else if (selectedCategory === 'Bevvies') {
        endpoint = `${url}/bevviesEd/${editedReview._id}`;
        Alert.alert('Review', 'Sucessfully edited review!');
      } else {
        // Handle invalid type
        Alert.alert('Error', 'Invalid review type.');
        return;
      }
  
      // Send updated review data to the server
      const response = await axios.put(endpoint, {
        rating: parseFloat(editedReview.rating), // Convert rating to number
        comment: editedReview.comment,
      });
  
      if (response.status === 200) {
        Alert.alert('Success', 'Review updated successfully.');
        // Close the modal
        setModalVisible(false);
        // You can also update your UI or perform any additional actions upon successful update
      } else {
        Alert.alert('Error', 'Failed to update review.');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      Alert.alert('Error', 'Failed to update review. Please try again.');
    }
  };
  
  const handleRatingSelect = (value) => {
    setEditedReview({...editedReview, rating: value}); // Update the rating value in editedReview state
  };
  
  const handleReviewNavigation = () => {
    navigation.navigate('Review');
  };
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const closeDrawer = () => {
    // Assuming you have a state variable to track the drawer state, 
    // set it to false to close the drawer.
    setIsDrawerOpen(false);
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
  return (
    <SafeAreaView
      style={{
        alignSelf: 'stretch',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        flex: 1,
        backgroundColor: '#FFE4B5',
      }}
    >
      <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
      <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start", // Align items to the right
            }}
          >
            <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
      <Entypo name="menu" size={24} color="white" />
    </TouchableOpacity> 
            </View>
        <ImageBackground source={require('../../assets/bg.png')} style={styles.backgroundImage}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoImage} source={require('../../assets/logo.png')} />
          </View>
        </ImageBackground>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatarImage} source={require('../../assets/defaults.jpg')} />
          </View>
          <Text style={styles.title}>{userProfile ? userProfile.name : ''}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{userProfile ? userProfile.email : ''}</Text>
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
                  item.products.map((product) => `${product.name} (${product.quantity})`).join(', '),
                  formattedDate(item.createdAt),
                  item.totalPrice,
                  item.status ? 'Done' : 'Pending',
                ]}
                style={[styles.row, index % 2 && { backgroundColor: '#FFE4B5' }]}
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
            <Button title="Create Review" color="#000" onPress={handleReviewNavigation} />
          </View>
        </View>
        <View style={styles.recentReviewsContainer}>
          <Text style={styles.recentReviewsHeader}>Recent Reviews</Text>
          {/* Picker for selecting category */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              style={styles.picker}
              onValueChange={(value) => handleCategoryChange(value)}
            >
              {selectedCategory ? null : <Picker.Item label="Select Category" value="" />}
              <Picker.Item label="Bevvies" value="Bevvies" />
              <Picker.Item label="Munchies" value="Munchies" />
            </Picker>
          </View>
          {/* Display reviews based on the selected category */}
          {userReviews.map((review, index) => (
            selectedCategory === 'Bevvies' && (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewProductName}>{review.Bevvies && review.Bevvies.name}</Text>
                  <Text style={styles.reviewDate}>{review.rating}</Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
                <View style={[styles.reviewActions, { marginTop: 10 }]}>
                  <Pressable style={styles.actionButton} onPress={() => handleEditReview(review)}>
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={() => handleBevviesDeleteReview(review._id)}>
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )
          ))}
          {userMunchiesReviews.map((Mreview, index) => (
            selectedCategory === 'Munchies' && (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewProductName}>{Mreview.Munchies && Mreview.Munchies.name}</Text>
                  <Text style={styles.reviewDate}>{Mreview.rating}</Text>
                  <Text style={styles.reviewComment}>{Mreview.comment}</Text>
                </View>
                <View style={[styles.reviewActions, { marginTop: 10 }]}>
                  <Pressable style={styles.actionButton} onPress={() => handleEditReview(Mreview)}>
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={() => handleMunchiesDeleteReview(Mreview._id)}>
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )
          ))}
        </View>
      </ScrollView>
      {/* Modal for editing review */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Review</Text>
      {renderStars(editedReview.rating)}
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={editedReview.comment}
        onChangeText={(text) => setEditedReview({ ...editedReview, comment: text })}
        placeholder="Comment"
        multiline
      />
      <View style={styles.modalButtons}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={handleSaveEditedReview}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
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
      top: 50,
      left: 0,
      flexDirection: "row",
      alignItems: "center",
    }}
    onPress={toggleDrawer}
  >
    <Text style={{ color: "white", fontSize: 16 }}>Close Drawer</Text>
    <AntDesign name="close" size={24} color="white" style={{ marginLeft: 80 }} />
  </Pressable>
  
  </View>
  <View>
    
  </View>
  <ImageBackground
            source={require("../../assets/bg.png")}
            style={{ flex: 1, position: 'absolute',
            top: 85,
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

export default Profile;

const styles = StyleSheet.create({
  safeAreaView: {
    alignSelf: "stretch",
    paddingTop: Platform.OS === "android" ? 40 : 0,
    flex: 1,
    backgroundColor: "#FFE4B5",
    marginTop: 20 // Added margin top
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40, // Adjust the height to control how much of the drawer is cut
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
  recentReviewsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'black',
  },
  saveButton: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    color: 'white', // This color will be applied to both buttons
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recentReviewsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf:"center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    
  },
  pickerContainer: {
   
    borderWidth: 2,
    borderRadius: 10,
    width:"60%",
    alignSelf:"center",
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10, // Add some space between the buttons and the review details
  },
  actionButton: {
    backgroundColor: 'black', // Background color for the action buttons
    paddingHorizontal: 10, // Add some horizontal padding to the buttons
    paddingVertical: 5, // Add some vertical padding to the buttons
    borderRadius: 5, // Add border radius to the buttons
  },
  actionButtonText: {
    color: 'white', // Text color for the action button text
  },
  picker: {
    height: 50,
    width: '90%',
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
  starContainer: {
    flexDirection: 'row',
    marginTop: 5,
},
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' }
});
