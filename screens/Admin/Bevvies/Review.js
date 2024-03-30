import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, ImageBackground, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo vector icons library
import axios from 'axios'; // You may need to import axios if you're using it for API requests.
import { apiUrl } from "../../../ip"
import { ScrollView } from 'native-base';

const BevviesReviewsScreen = ({ route }) => {
  const { bevviesId, bevviesName } = route.params; // Get the munchies id and name passed from the previous screen.
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // State to hold the average rating
  const url = apiUrl;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${url}/bevviesreview/${bevviesId}`);
        setReviews(response.data.breview);

        // Compute average rating
        const totalRatings = response.data.breview.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalRatings / response.data.breview.length;
        setAverageRating(avgRating.toFixed(1)); // Round to 1 decimal place
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    fetchReviews();
  }, [bevviesId]);

  // Function to render star icons based on the rating value
  const renderStars = (rating) => {
    const starCount = Math.floor(rating); // Calculate the number of filled stars
    const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
    return (
      <View style={styles.starContainer}>
        {[...Array(starCount)].map((_, index) => (
          <Ionicons key={index} name="star" size={24} color="#FFD700" />
        ))}
        {hasHalfStar && (
          <Ionicons key="half-star" name="star-half" size={24} color="#FFD700" />
        )}
        {[...Array(5 - starCount - (hasHalfStar ? 1 : 0))].map((_, index) => (
          <Ionicons key={index} name="star-outline" size={24} color="#FFD700" />
        ))}
      </View>
    );
  };

  // Function to render stars for the average rating
  const renderAverageStars = () => {
    return renderStars(averageRating);
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
        <View style={styles.container}>
          <Text style={styles.title}>Reviews for {bevviesName} {renderAverageStars()}</Text>
          {reviews.length === 0 ? (
            <Text>No reviews available for this munchies item.</Text>
          ) : (
            <FlatList
              data={reviews}
              keyExtractor={(item, index) => item._id} // Assuming _id is a unique identifier for each review
              renderItem={({ item }) => (
                <View style={styles.reviewContainer}>
                  <View style={styles.reviewContent}>
                    <Text>{item.user.name}</Text>
                    <Text>{item.comment}</Text>
                    <View>{renderStars(item.rating)}</View>
                  </View>
                  {/* Assuming images is an array, and we want to display the first image */}
                  {item.Bevvies.images.length > 0 && (
                    <Image
                      source={{ uri: item.Bevvies.images[0].url }}
                      style={styles.image}
                    />
                  )}
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  averageRating: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Spread items horizontally
    alignItems: 'center', // Align items vertically
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'BLACK',
  },
  reviewContent: {
    flex: 1, // Take remaining space in the row
  },
  image: {
    width: 50, // Adjust the width of the image as needed
    height: 50, // Adjust the height of the image as needed
    resizeMode: 'cover', // Preserve aspect ratio
    borderRadius: 25, // Half of the width or height to make it circular
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default BevviesReviewsScreen;
