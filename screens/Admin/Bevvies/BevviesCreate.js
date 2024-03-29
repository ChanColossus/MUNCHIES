import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaViewBase,
  ImageBackground,
} from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dropdown from "./DropdownCreate";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Button } from "native-base";
import {apiUrl} from "../../../ip"
import { FontAwesome } from "@expo/vector-icons";

const BevviesCreate = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ratings, setRatings] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false); // State for loader
  const url = apiUrl
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleCategoryChange = (value) => {
    setCategory(value);
  };
  const addBevvies = async () => {
    setLoading(true); // Set loading to true when submitting data

    const token = await AsyncStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("ratings", ratings);
    formData.append("category", category);

    images.forEach((image, index) => {
      formData.append("images", {
        uri: image,
        type: "image/jpeg", // Adjust the type if necessary
        name: `image_${index}.jpg`,
      });
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        // "Authorization": token, // Include authorization token if needed
      },
    };
    console.log(formData);
    axios
      .post(`${url}/bevvies/new`, formData, config)
      .then((res) => {
        setLoading(false); // Set loading to false when data submission is successful
        Alert.alert("Bevvies", "You have added the Bevvies successfully");
        setName("");
        setPrice("");
        setDescription("");
        setRatings("");
        setImages([]);
        setCategory("");
        navigation.dispatch(CommonActions.navigate("Bevvies"));
      })
      .catch((error) => {
        setLoading(false); // Set loading to false if there's an error
        console.log(error.response);
      });
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
        <Text style={styles.heading}>Name</Text>
        <TextInput
          value={name}
          style={styles.input}
          onChangeText={(text) => setName(text)}
          placeholder="Name"
        />

        <Text style={styles.heading}>Price</Text>
        <TextInput
          value={price}
          style={styles.input}
          onChangeText={(text) => setPrice(text)}
          placeholder="Price"
        />

        <Text style={styles.heading}>Description</Text>
        <TextInput
          value={description}
          style={styles.input}
          onChangeText={(text) => setDescription(text)}
          placeholder="Description"
        />

        <Text style={styles.heading}>Ratings</Text>
        <TextInput
          value={ratings}
          style={styles.input}
          onChangeText={(text) => setRatings(text)}
          placeholder="Ratings"
          keyboardType="numeric" // Set keyboardType to numeric
        />

        <View style={styles.inputContainer}>
          <Text style={styles.heading}>Category</Text>
          <Dropdown onValueChange={handleCategoryChange} />
        </View>

        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.buttonContainer,
            {
              backgroundColor: "black",
              marginBottom: 10,
              marginTop: 20,
              marginLeft: 380,
            },
          ]}
        >
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 10,
            alignSelf: "center",
          }}
        >
          {images.map((image, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",

                marginTop: 20,
              }}
            >
              <Image
                source={{ uri: image }}
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
          ))}
        </View>

        {/* <View style={{ alignItems: "center", marginTop: 150 }}>
          <Button onPress={addMunchies}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
          </Button>
        </View> */}

        <TouchableOpacity onPress={addBevvies} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="black" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BevviesCreate;

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
    marginTop: 115,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
