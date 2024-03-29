import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { Fragment, useCallback, useState } from "react";
import { DataTable } from "react-native-paper";
import { Box, Button, CloseIcon, Image } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
export default function MunchiesItems({ item, refreshAfterDelete }) {
  const navigation = useNavigation();

  const [showAction, setShowAction] = useState(false);

  const toggleAction = () => {
    setShowAction(!showAction);
  };

  useFocusEffect(
    useCallback(() => {
      setShowAction(false);
    }, [])
  );
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
        `http://192.168.1.12:8000/munchies/${itemId}`,
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
  return (
    <>
      <DataTable.Row
        style={{ paddingVertical: 5 }}
        onLongPress={!showAction ? toggleAction : undefined}
        onPress={!showAction ? () => console.log("View") : undefined}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            opacity: showAction ? 0.3 : 1,
          }}
        >
          <DataTable.Cell>
            <Box>
              <Image
                alt={item?.images[0]?.name || "image"}
                source={{
                  uri:
                    item?.images[0]?.url || "https://via.placeholder.com/300",
                }}
                width={50}
                height={50}
              />
            </Box>
          </DataTable.Cell>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell>{item.price}</DataTable.Cell>
          <DataTable.Cell>{item.description}</DataTable.Cell>
          <DataTable.Cell>{item.ratings}</DataTable.Cell>
          {/* Remove this cell as it's not necessary to display all images */}
          {/* <DataTable.Cell>{item.images}</DataTable.Cell> */}
          <DataTable.Cell>{item.category}</DataTable.Cell>
          <DataTable.Cell>
            <TouchableOpacity onPress={handleEdit}>
              <MaterialIcons name="edit" size={18} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <MaterialIcons name="delete" size={18} color="red" />
            </TouchableOpacity>
          </DataTable.Cell>
        </View>

        {showAction && (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              position: "absolute",
              zIndex: 2,
              width: "100%",
              height: "100%",
              alignItems: "center",
              opacity: 1,
            }}
          >
            {/* <Button size={'xs'} p={2} onPress={() => handleEdit(item._id)}>
                            <MaterialCommunityIcons name={'file-edit'} size={18} />
                        </Button>
                        <Button onPress={() => deleteCategory(item._id)} colorScheme={'danger'} size={'xs'} p={2}>
                            <MaterialCommunityIcons name={'delete'} size={18} />
                        </Button> */}
            <Button
              ml={"auto"}
              size={"xs"}
              p={2}
              colorScheme={"danger"}
              onPress={toggleAction}
            >
              <MaterialCommunityIcons name={"close-circle"} size={18} />
            </Button>
          </Box>
        )}
      </DataTable.Row>
    </>
  );
}
