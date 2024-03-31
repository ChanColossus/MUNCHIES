import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dropdown from "./Dropdown";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {apiUrl} from "../../../ip"
const BevviesUpdate = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params; // Retrieve item data from navigation params

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(String(item.price));
  const url = apiUrl
  const [description, setDescription] = useState(item.description);
  const [ratings, setRatings] = useState(String(item.ratings));
  const [images, setImages] = useState(item.images);
  const [category, setCategory] = useState(item.category);
  const [loading, setLoading] = useState(false);
  console.log(images);
  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true, // Enable multiple selection
    });

    if (!result.cancelled && result.assets.length > 0) {
      // Append newly selected images to the existing images
      setImages((prevImages) => [...prevImages, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");

      // Create form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("ratings", ratings);
      formData.append("category", category);
      images.forEach((image, index) => {
        if (image.url) {
          formData.append("images", image.url);
        }
      });

      // Append new image files
      images.forEach((image, index) => {
        if (typeof image === "object" && !image.url) {
          formData.append("images", {
            uri: image.uri,
            type: "image/jpeg", // Adjust the type if necessary
            name: `image_${index}.jpg`,
          });
        }
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      };

      const response = await axios.put(
        `${url}/bevvies/${item._id}`,
        formData,
        config
      );

      Alert.alert(
        "Bevvies Update",
        "You have updated the Bevvies successfully"
      );
      navigation.goBack(); // Go back to the previous screen after updating
    } catch (error) {
      console.error("Error updating Bevvies:", error);
      // Handle error here
    }
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
        <Text style={styles.heading}>Name</Text>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Name"
          style={styles.input}
        />
        <Text style={styles.heading}>Price</Text>
        <TextInput
          value={price}
          onChangeText={(text) => setPrice(text)}
          placeholder="Price"
          style={styles.input}
        />
        <Text style={styles.heading}>Description</Text>
        <TextInput
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Description"
          style={styles.input}
        />
        <Text style={styles.heading}>Ratings</Text>
        <TextInput
          value={ratings}
          onChangeText={(text) => setRatings(text)}
          placeholder="Ratings"
          style={styles.input}
        />
        <Text style={styles.heading}>Category</Text>
        <Dropdown
          item={item}
          onValueChange={handleCategoryChange}
          selectedValue={category}
        />
        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.buttonContainer,
            {
              backgroundColor: "black",
              marginBottom: 10,
              marginTop: 20,
              alignSelf:"center"
            },
          ]}
        >
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          {images.map((image, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View style={{ position: "relative", marginRight: 10 }}>
                {image.url ? (
                  // Render existing images fetched from URL
                  <Image
                    source={{ uri: image.url }}
                    style={{ width: 100, height: 100 }}
                  />
                ) : (
                  // Render new images uploaded as files
                  <View style={{ flexDirection: "row", margin: 7 }}>
                    <Image
                      source={{ uri: image.uri }}
                      style={{ width: 100, height: 100, margin: 5 }}
                    />
                    <TouchableOpacity onPress={() => removeImage(index)}>
                      <FontAwesome
                        name="remove"
                        size={24}
                        color="red"
                        style={{ marginLeft: 6 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                {image.url && ( // Display remove button for existing images only
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 1, // Ensure TouchableOpacity is above the Image
                    }}
                  >
                    <FontAwesome name="remove" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        {/* <Button title="Update" onPress={handleUpdate} /> */}
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 15,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent white background
  },
  buttonContainer: {
    width: "30%",
    alignSelf: "center",
    paddingVertical: 12,

    borderRadius: 25,
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    width: "40%",
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BevviesUpdate;
