import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { Fragment, useCallback, useState } from "react";
import { DataTable } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { apiUrl } from "../../../ip";

export default function MunchiesItems({ item, refreshAfterDelete }) {
  const navigation = useNavigation();
  const url = apiUrl;

  const handleEdit = () => {
    navigation.navigate("UserUpdate", { item }); // Pass the item data to MunchiesUpdate screen
  };

  const handleDelete = async (itemId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.delete(`${url}/userdel/${item._id}`, config);
      Alert.alert("User Deletion", "You have deleted the User successfully");
      refreshAfterDelete();
      return { success: true };
    } catch (error) {
      console.error("Error deleting item:", error);
      console.log(item._id);
      return { success: false };
    }
  };

  const handleRoleUpdate = async () => {
    try {
      const newRole = item.role === "admin" ? "user" : "admin";
      console.log(newRole)
      const requestBody = {
        role: newRole
      };
      const { data } = await axios.put(`${url}/userupdate/${item._id}`,requestBody);
      Alert.alert("Role Update", `Role updated successfully to ${newRole}`);
      // Refresh the data after role update if needed
      return { success: true };
    } catch (error) {
      console.error("Error updating role:", error);
      return { success: false };
    }
  };

  return (
    <>
      <DataTable.Row style={{ paddingVertical: 5, paddingHorizontal: 5, marginLeft: 15 }}>
      <DataTable.Cell style={styles.nameCell}>
          <Text style={styles.emailText}>{item.name}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={styles.emailCell}>
          <Text style={styles.emailText}>{item.email}</Text>
        </DataTable.Cell>
        <DataTable.Cell style={{ justifyContent:"flex-end",marginRight:10}}>
      
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRoleUpdate}>
            <MaterialCommunityIcons name={item.role === "admin" ? "account" : "account-check"} size={24} color="green" />
          </TouchableOpacity>
        </DataTable.Cell>
      </DataTable.Row>
    </>
  );
}
const styles = StyleSheet.create({
  emailCell: {
    width: 300, // Set the width of the cell
    paddingLeft:20 // Allow content to be scrolled horizontally if it overflows
  },
  emailText: {
    fontSize: 12, // Adjust font size if needed
  },
});
