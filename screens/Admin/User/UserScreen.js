import React, { useCallback, useState,useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { Box, Button, Input, SearchIcon, Text, AddIcon } from "native-base";
import { DataTable } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import UserItems from "./Items";
import { useNavigation } from "@react-navigation/native";
import {apiUrl} from "../../../ip"

var { width } = Dimensions.get("window");

const UserScreen = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const url = apiUrl
  const getAllUser = async () => {
    try {
      const { data } = await axios.get(`${url}/user`);
      setItems(data.data);
      setFilteredItems(data.data); // Set filtered items initially to all items
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call getAllUser initially and every 10 seconds
  useEffect(() => {
    getAllUser(); // Call initially

    const intervalId = setInterval(() => {
      getAllUser(); // Call every 10 seconds
    }, 10000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (keyword) => {
    const regex = new RegExp(keyword, "i");
    const filteredItems = items.filter((item) => regex.test(item.name));
    setFilteredItems(filteredItems);
  };
  const handleRefreshAfterDelete = async () => {
    await getAllUser(); // Refresh data after deletion
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
        <View>
          <Box style={{ with: width / 2.5 }}>
        
            <Input
              onChangeText={(value) => handleSearch(value)}
              width={"95%"}
              marginTop={30}
              marginLeft={15}
              borderRadius={90}
              borderColor={"black"}
              color={"black"}
              placeholder="Search"
              leftElement={
                <View style={{ marginHorizontal: 10, marginRight: -5 }}>
                  <SearchIcon />
                </View>
              }
            />
          </Box>
          <DataTable style={{}}>
            <DataTable.Header borderColor={"black"}>
              <DataTable.Title>    Name</DataTable.Title>
              <DataTable.Title>      Email</DataTable.Title>
              <DataTable.Title>                Action</DataTable.Title>
            </DataTable.Header>
            <View style={{ maxHeight: "100%" }}>
              <ScrollView>
                {filteredItems.map((item, i) => (
                  <UserItems
                    item={item}
                    key={i}
                    handleDelete={() => handleDelete(item._id)}
                    refreshAfterDelete={handleRefreshAfterDelete}
                  />
                ))}
              </ScrollView>
            </View>
          </DataTable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserScreen;
