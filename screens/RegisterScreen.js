import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {apiUrl} from "../ip"
import Google from "./Google"


const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const url = apiUrl
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    //send a post request to the backend API
    axios
      .post(`${url}/register`, user)
      .then((response) => {
        console.log(response);
        setName("");
        setPassword("");
        setEmail("");
        Alert.alert(
          "Registration Successful",
          "You have registered successfully"
        );
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          "An error occurred during registration"
        );
        console.log("Registration Failed", error);
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFE4B5", alignItems: "center" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ alignItems: "center", marginTop: 70 }}>
        <View
          style={{
            width: 220,
            height: 220,
            borderRadius: 110,
            borderWidth: 2,
            borderColor: "black",
            overflow: "hidden",
          }}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            source={require("../assets/logo.png")}
          />
        </View>
      </View>

     
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 30,
              color: "#041E42",
            }}
          >
            Register to your account
          </Text>
        </View>


          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "white",
              paddingVertical: 0,
              borderRadius: 5,
              marginTop: 30,
              borderWidth: 2,
              borderColor: "black",
              paddingHorizontal: 8,
            }}
          >
            <FontAwesome
              style={{ marginLeft: 8 }}
              name="user"
              size={24}
              color="gray"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: name ? 16 : 16,
              }}
              placeholder="Enter your Name"
            />
          </View>
       

        
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "white",
              paddingVertical: 0,
              borderRadius: 5,
              marginTop: 30,
              borderWidth: 2,
              borderColor: "black",
              paddingHorizontal: 8,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Enter your Email"
            />
          </View>
    

       
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "white",
              paddingVertical: 0,
              borderRadius: 5,
              marginTop: 30,
              borderWidth: 2,
              borderColor: "black",
              paddingHorizontal: 8,
            }}
          >
            <Entypo
              style={{ marginLeft: 8 }}
              name="lock"
              size={24}
              color="gray"
            />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Enter your Password"
            />
          </View>
        

        <View style={{ marginTop: 30 }} />

        <Pressable
          onPress={handleRegister}
          style={{
            width: 200,
            backgroundColor: "#0F0F0F",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 8,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Register
          </Text>
        </Pressable>
            {/* <Google/> */}
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 5 }}>
          <Text
            style={{
              marginTop: 15,
              textAlign: "center",
              color: "gray",
              fontSize: 16,
            }}
          >
            Already have an account? Sign In
          </Text>
        </Pressable>
     
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
