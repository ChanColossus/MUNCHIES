import React, { useState } from 'react';
import { View, Button, Text,Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { useNavigation,useIsFocused } from "@react-navigation/native";
import { apiUrl } from "../ip";
function OAuth() {
  const [user, setUser] = useState(null);
  const url = apiUrl;
  const navigation = useNavigation();
  const signInWithGoogle = async () => {
    try {
      // Sign in with Google
      const { idToken } = await auth().signInWithCredential(googleCredential);

      // Get user's name and email from Google sign-in
      const { name, email } = auth().currentUser;
      const userdetails = {
        name: name,
        email: email,
        password: '12345678',
        verified: true,
      };
      // Send name and email to your backend for registration
      const response = await axios.post(
        `${url}/register`,userdetails
      
      );
      const role = response.data.role;
  
      
      // Handle response from your backend
      console.log(response.data);

      // Update user state
      setUser(auth().currentUser);
      Alert.alert(
        "Registration Successful",
        "You have registered successfully"
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <View>
      <Button onPress={signInWithGoogle} title="Register with Google" />
      
    </View>
  );
}

export default OAuth;
