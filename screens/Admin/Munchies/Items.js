import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { Fragment, useCallback, useState } from "react";
import { DataTable } from "react-native-paper";
import { Box, Button, CloseIcon, Image, ScrollView } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import {apiUrl} from "../../../ip"

export default function MunchiesItems({ item, refreshAfterDelete }) {
  const navigation = useNavigation();

  const [showAction, setShowAction] = useState(false);
  const url = apiUrl
  const toggleAction = () => {
    setShowAction(!showAction);
  };

  useFocusEffect(
    useCallback(() => {
      setShowAction(false);
    }, [])
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === item.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? item.images.length - 1 : prevIndex - 1
    );
  };

  const handleEdit = () => {
    navigation.navigate("MunchiesUpdate", { item }); // Pass the item data to MunchiesUpdate screen
  };
  const handleDelete = async (itemId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: Bearer ${getToken()},
        },
      };
      const { data } = await axios.delete(
        `${url}/munchies/${itemId}`,
        config
      );
      Alert.alert(
        "Munchies Deletion",
        "You have deleted the Munchies successfully"
      );
      refreshAfterDelete();

      return { success: true };
    } catch (error) {
      console.error("Error deleting item:", error);
      console.log(item._id);
      return { success: false };
    }
  };
  const cellStyle = { fontSize: 10 };
  return (
    <>
      <DataTable.Row style={{ paddingVertical: 5, paddingHorizontal:5,marginLeft:20 }}>
        <Box style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handlePreviousImage}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => console.log("Image clicked")}>
              <Image
                source={{
                  uri:
                    item.images[currentImageIndex]?.url ||
                    "https://via.placeholder.com/300",
                }}
                width={30}
                height={30}
                alt={item.image || "Image Alt Text"}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity onPress={handleNextImage}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </Box>
        <DataTable.Cell style={{marginLeft:10,marginRight:20}}>{item.name}</DataTable.Cell>




     
        {/* Remove this cell as it's not necessary to display all images */}
        {/* <DataTable.Cell>{item.images}</DataTable.Cell> */}
        <DataTable.Cell>{item.category}</DataTable.Cell>
        <DataTable.Cell>
          <TouchableOpacity onPress={handleEdit}>
            <MaterialIcons name="edit" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </DataTable.Cell>
        {/* </View> */}

       
      </DataTable.Row>
    </>
  );
}
