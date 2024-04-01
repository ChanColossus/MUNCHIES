import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TextInput,
    Pressable,
    Alert,
    ScrollView,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { Entypo } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import axios from "axios";
  import { apiUrl } from "../ip";
  
  const ResetScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const navigation = useNavigation();
    const url = apiUrl;
    const [isSent, setIsSent] = useState(false);
    useEffect(() => {
      console.log("url:", url);
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
  
    const handleSendEmail = async () => {
        try {
          // Send a request to your backend to initiate the forgot password process
          const response = await axios.post(`${url}/forgot-password`, { email });
          if (response.status === 200) {
            Alert.alert('Email sent', 'An email with instructions to reset your password has been sent to your email address.');
            setIsSent(true); 
          } else {
            Alert.alert('Error', 'Failed to send email. Please try again later.');
          }
        } catch (error) {
          console.error('Error sending email:', error);
          Alert.alert('Error', 'Failed to send email. Please try again later.');
        }
      };
      const handleResetPassword = async () => {
        try {
            const user = {
                token: token,
                password: password,
              };
          // Send a request to your backend to initiate the forgot password process
          const response = await axios.put(`${url}/reset-password`, user);
          if (response.status === 200) {
            Alert.alert('Reset Password', 'Password is changed. Please log in!');
            setIsSent(true); 
            navigation.replace("Login");
          } else {
            Alert.alert('Error', 'Failed to change password. Please try again later.');
          }
        } catch (error) {
          console.error('Error sending email:', error);
          Alert.alert('Error', 'Failed to change password. Please try again later.');
        }
      };
     
       
    
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFE4B5" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              alignItems: "center",
              marginTop: 100,
            }}
          >
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
                marginTop: 40,
                color: "#041E42",
              }}
            >
              Reset your password
            </Text>
          </View>
  
          
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
                width: 300,
                alignSelf:"center"
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
                editable={!isSent}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 250,
                  fontSize: email ? 16 : 16,
                  
                }}
                placeholder="Enter your Email"
              />
            </View>
        
            <View style={{ marginTop: 20 }} />
            {!isSent && (
  <Pressable
    onPress={handleSendEmail}
    style={{
      width: 250,
      backgroundColor: "#0F0F0F",
      borderRadius: 6,
      marginLeft: "auto",
      marginRight: "auto",
      padding: 7,
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
      Reset Password
    </Text>
  </Pressable>
           )}
         {isSent && (
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
              width: 300,
              alignSelf:"center"
            }}
          >
            <TextInput
              value={token}
              onChangeText={(text) => setToken(text)}
              secureTextEntry={false}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 250,
                fontSize: 16,
              }}
              placeholder="Enter the token"
            />
            <Entypo
              style={{ marginLeft: 8 }}
              name="lock"
              size={24}
              color="gray"
            />
       
           
  
          </View>
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
              width: 300,
              alignSelf:"center"
            }}
          >
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 250,
                fontSize: 16,
              }}
              placeholder="Enter new password"
            />
            <Entypo
              style={{ marginLeft: 8 }}
              name="lock"
              size={24}
              color="gray"
            />
       
           
  
          </View>
          <Pressable
    onPress={handleResetPassword}
    style={{
      width: 250,
      backgroundColor: "#0F0F0F",
      borderRadius: 6,
      marginLeft: "auto",
      marginRight: "auto",
      padding: 7,
      marginTop:30
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
      Change Password
    </Text>
  </Pressable>
          </View>
          
)}
         
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default ResetScreen;
  
  const styles = StyleSheet.create({});
  