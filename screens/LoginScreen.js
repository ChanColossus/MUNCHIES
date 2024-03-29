import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {apiUrl} from "../ip"

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
const url = apiUrl

  useEffect(() => {
    console.log("url:",url)
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          navigation.replace("Main");
        }
      } catch (err) {
        console.log("error message", err);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post(`${url}/login`, user)
      .then((response) => {
        const token = response.data.token;
        const name = response.data.name;
        const role = response.data.role;
        console.log(response.data);
        const userId = response.data.id;
        AsyncStorage.setItem("authToken", token);
        AsyncStorage.setItem("name", name);
        AsyncStorage.setItem("userId", userId);
        AsyncStorage.setItem("role", role);
        if (role === "admin") {
          navigation.replace("AdminMain");
        } else {
          navigation.replace("Main");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 403) {
            Alert.alert("Login Error", "Account not verified");
          } else if (error.response.status === 401) {
            Alert.alert("Login Error", "Invalid Credentials");
          }
        } else {
          Alert.alert("Login Error", "Failed to log in");
          console.log("Error:", error.message);
        }
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFE4B5", alignItems: "center" }}
    >
      <View style={{ alignItems: "center", marginTop: 100 }}>
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

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 60,
              color: "#041E42",
            }}
          >
            Login to your account
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "white",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
              borderWidth: 1,
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
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "white",
              paddingVertical: 5,
              borderRadius: 10,
              marginTop: 30,
              borderWidth: 1,
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
                fontSize: 16,
              }}
              placeholder="Enter your Password"
            />
          </View>
        </View>

        {/* <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text>Keep me logged in</Text>
                    <Text style={{ color: "#007FFF", fontWeight: "500" }}>Forgot Password</Text>
                </View> */}

        <View style={{ marginTop: 50 }} />

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#0F0F0F",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
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
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 5 }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "gray",
              fontSize: 16,
            }}
          >
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
