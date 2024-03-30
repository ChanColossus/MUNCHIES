import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, SafeAreaView, Platform, ScrollView, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import Drop from './TypeDropdown';
import BevDrop from './BevDrop';
import MunDrop from './MunDrop';
import { apiUrl } from "../ip";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const ReviewScreen = () => {
  const [reviewType, setReviewType] = useState('');
  const [user, setUser] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [Bevvies, setBevvies] = useState('');
  const [Munchies, setMunchies] = useState('');
  const url = apiUrl;
  const navigation = useNavigation();

  const handleReviewTypeChange = (value) => {
    setReviewType(value);
  };

  useEffect(() => {
    AsyncStorage.getItem('userId')
      .then((value) => {
        if (value !== null) {
          setUser(value);
        }
      })
      .catch(error => {
        console.error('Error fetching userId from AsyncStorage:', error);
      });
  }, []);

  const handleMunDropSelect = (value) => {
    setMunchies(value);
  };
  const handleBevDropSelect = (value) => {
    setBevvies(value);
  };

  const handleRatingSelect = (value) => {
    setRating(value); // Set the rating value based on the number of stars selected
  };

  const handleSubmitBevvies = async () => {
    console.log("Data:", user, comment, rating, Bevvies);
    try {
      const response = await axios.post(`${url}/review/new`, {
        user,
        comment,
        rating,
        Bevvies,
      });
      console.log('Bevvies review submitted successfully:', response.data);
      // Reset fields after successful submission
      setUser('');
      setComment('');
      setRating('');
      setBevvies('');
      Alert.alert("Review", "You have successfully created a review");
      navigation.navigate("Profile");
    } catch (error) {
      console.error('Error submitting bevvies review:', error.message);
    }
  };
  const handleSubmitMunchies = async () => {
    console.log("Data:", user, comment, rating, Munchies);
    try {
      const response = await axios.post(`${url}/munchiesreview/new`, {
        user,
        comment,
        rating,
        Munchies,
      });
      console.log('Munchies review submitted successfully:', response.data);
      // Reset fields after successful submission
      setUser('');
      setComment('');
      setRating('');
      setMunchies('');
      Alert.alert("Review", "You have successfully created a review");
      navigation.navigate("Profile");
    } catch (error) {
      console.error('Error submitting munchies review:', error.message);
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
        <View >
          <Text style={styles.label}>Select Review Type:</Text>
          <Drop onValueChange={handleReviewTypeChange} />
          {reviewType === 'Munchies' && (
            <View style={styles.reviewContainer}>
              <Text style={styles.label}>Select Munchies:</Text>
              <MunDrop onValueChange={handleMunDropSelect} />
              <Text style={styles.label}>Give your review</Text>
              <TextInput
                style={[styles.input, styles.commentInput]} // Apply specific styles for the comment input
                value={comment}
                onChangeText={setComment}
                placeholder="Enter comment"
                multiline
              />
              <Text style={styles.label}>Set Ratings</Text>
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
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmitMunchies}
              >
                <Text style={styles.buttonText}>Submit Munchies Review</Text>
              </TouchableOpacity>
            </View>
          )}
          {reviewType === 'Bevvies' && (
            <View style={styles.reviewContainer}>
              <Text style={styles.label}>Select Bevvies:</Text>
              <BevDrop onValueChange={handleBevDropSelect} />
              <Text style={styles.label}>Give your review</Text>
              <TextInput
                style={[styles.input, styles.commentInput]} // Apply specific styles for the comment input
                value={comment}
                onChangeText={setComment}
                placeholder="Enter comment"
                multiline
              />
              <Text style={styles.label}>Set Ratings</Text>
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
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmitBevvies}
              >
                <Text style={styles.buttonText}>Submit Bevvies Review</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 0,
    padding: 6,
    marginBottom: 20,
    width: '90%',
    alignSelf: "center"
  },
  commentInput: {
    // Specific styles for the comment input
    height: 100, // Set the height of the comment input
    textAlignVertical: 'top',
    alignSelf: "center",
    color: "black" // Align text to the top
  },
});

export default ReviewScreen;
