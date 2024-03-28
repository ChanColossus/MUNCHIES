import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  ImageBackground,
} from "react-native";
import { Box, Text, Button } from "native-base"; // Updated import
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "react-native";

const UserMunchies = () => {
  const [munchies, setMunchies] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNextImage = (itemId) => {
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [itemId]:
        (prevIndexes[itemId] + 1) %
        munchies.find((item) => item._id === itemId).images.length,
    }));
  };

  const handlePreviousImage = (itemId) => {
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [itemId]:
        prevIndexes[itemId] === 0
          ? munchies.find((item) => item._id === itemId).images.length - 1
          : prevIndexes[itemId] - 1,
    }));
  };

  const handleSearch = (keyword) => {
    const regex = new RegExp(keyword, "i");
    const filteredItems = munchies.filter((item) => regex.test(item.category));
    setFilteredItems(filteredItems);
  };

  useEffect(() => {
    // Fetch munchies data from API
    const fetchMunchies = async () => {
      try {
        const { data } = await axios.get("http://192.168.0.130:8000/munchies");
        setMunchies(data.munchies);
        // Initialize current image indexes for each munchies item
        const initialIndexes = {};
        data.munchies.forEach((item) => {
          initialIndexes[item._id] = 0;
        });
        setCurrentImageIndexes(initialIndexes);
      } catch (error) {
        console.error("Error fetching munchies:", error);
      }
    };

    fetchMunchies();
  }, []);

  useEffect(() => {
    // Initialize filtered items with all munchies initially
    setFilteredItems(munchies);
  }, [munchies]);

  const categories = [
    "Smoked Meats",
    "Rice",
    "Sides",
    "Dessert",
    "Pastry",
    "Pizza",
    "Pasta",
    "All",
  ];

  const handleCategorySelect = (category) => {
    if (category === "All") {
      setFilteredItems(munchies); // Set all items when "All" category is selected
    } else {
      const regex = new RegExp(category, "i");
      const filteredItems = munchies.filter((item) =>
        regex.test(item.category)
      );
      setFilteredItems(filteredItems);
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
        <View
          style={{
            flexDirection: "row",
            marginLeft: 5,
            marginRight: 5,
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "black",
            justifyContent: "center",
          }}
        >
          {/* Render category buttons */}
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={{ color: "white" }}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          {/* Render munchies items */}
          {filteredItems.map((munchiesItem) => (
            <View key={munchiesItem._id} style={styles.card}>
              <ImageBackground
                source={require("../../../assets/pbg.jpg")}
                style={{ flex: 1, borderRadius: 15, overflow: "hidden" }}
              >
                <Box style={styles.box}>
                  <View style={styles.imageContainer}>
                    <TouchableOpacity
                      onPress={() => handlePreviousImage(munchiesItem._id)}
                    >
                      <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <TouchableOpacity
                        onPress={() => console.log("Image clicked")}
                      >
                        <Image
                          source={{
                            uri:
                              munchiesItem.images[
                                currentImageIndexes[munchiesItem._id]
                              ]?.url || "https://via.placeholder.com/300",
                          }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity
                      onPress={() => handleNextImage(munchiesItem._id)}
                    >
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.name}>{munchiesItem.name}</Text>
                  <Text style={styles.description}>
                    {munchiesItem.description}
                  </Text>
                  <Box style={styles.footer}>
                    <Button style={styles.button}>
                      <Text style={{ color: "white" }}>Add to Cart</Text>
                    </Button>
                  </Box>
                </Box>
              </ImageBackground>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    borderRadius: 10,
    marginTop: 20,
  },

  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  card: {
    width: "45%", // Adjust as needed
    marginVertical: 10,
  },
  box: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "black",
    padding: 10,
  },
  image: {
    width: 205, // Adjust image width as needed
    height: 150, // Adjust image height as needed
    resizeMode: "cover",
    alignSelf: "center",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 22, // Adjust font size as needed
    textAlign: "center",
  },
  description: {
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    backgroundColor: "black",
    borderRadius: 5,
  },
  selectedCategoryButton: {
    backgroundColor: "white",
  },
});

export default UserMunchies;
