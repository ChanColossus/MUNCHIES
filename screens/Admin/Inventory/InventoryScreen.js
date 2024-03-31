import React, { useCallback, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  ImageBackground,
  Image,
} from "react-native";
import { Box, Button, Input, SearchIcon, Text, AddIcon } from "native-base";
import { DataTable } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import InventoryItems from "./Items";
import { useNavigation } from "@react-navigation/native";
import {apiUrl} from "../../../ip"
var { width } = Dimensions.get("window");

const InventoryScreen = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const url = apiUrl
  const getAllInventory = async () => {
    const { data } = await axios.get(`${url}/inventory`);
    setItems(data.inventory);
    setFilteredItems(data.inventory);
  };

  useFocusEffect(
    useCallback(() => {
      getAllInventory();
    }, [])
  );

  const handleSearch = (keyword) => {
    const regex = new RegExp(keyword, "i");
    const filteredItems = items.filter((item) => regex.test(item.name));
    setFilteredItems(filteredItems);
  };
  const handleRefreshAfterDelete = async () => {
    await getAllInventory();
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
        <View>
          <Box style={{ with: width / 2.5 }}>
            <Button
              variant={"outline"}
              size={"xs"}
              marginTop={30}
              borderColor={"black"}
              onPress={() => navigation.navigate("InventoryCreate")}
              style={{
                alignSelf: "center", // Center the button horizontally
                width: "80%", // Set the width to 80%
                marginTop: 10, // Add margin top for spacing
              }}
            >
              <MaterialIcons
                name="inventory"
                size={24}
                color="black"
                style={{ alignSelf: "center", marginRight: 5 }}
              />{" "}
              {/* Adjust styles for icon */}
              <Text color={"black"}>Add New Inventory</Text>
            </Button>
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
              <DataTable.Title>     Images</DataTable.Title>
              <DataTable.Title>       Name</DataTable.Title>
             
              <DataTable.Title>       Stocks</DataTable.Title>

              <DataTable.Title>        Action</DataTable.Title>
            </DataTable.Header>
            <View style={{ maxHeight: "100%" }}>
              <ScrollView>
                {filteredItems.map((item, i) => (
                  <InventoryItems
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

export default InventoryScreen;
